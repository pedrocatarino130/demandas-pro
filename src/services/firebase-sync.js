/**
 * Gerenciamento de Sincronização Firebase
 * Gerencia fila de sincronização offline/online e status de conexão
 */

import { firebaseService } from './firebase-service.js';
import { firebaseCache } from './firebase-cache.js';

const SYNC_QUEUE_KEY = 'firebase-sync-queue';
const SYNC_STATUS_KEY = 'firebase-sync-status';
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 segundos (base)
const MAX_RETRY_DELAY = 60000; // 60 segundos
const MAX_BATCH_SIZE = 50;
const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_COOLDOWN = 60000; // 1 minuto
const LARGE_QUEUE_WARNING = 50;
const QUEUE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 dias

class FirebaseSync {
    constructor() {
        this.queue = [];
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        this.listeners = [];
        this.retryTimeout = null;
        this.consecutiveFailures = 0;
        this.circuitOpenUntil = null;
        this.lastSyncAt = null;
        this.lastError = null;
        this.lastQueueWarningAt = 0;
        this.currentBatchSize = 0;
        
        // Inicializar
        this._init();
    }

    /**
     * Inicialização assíncrona
     */
    async _init() {
        await firebaseCache.init();
        await Promise.all([
            this.loadQueue(),
            this._restoreStatus()
        ]);

        // Garantir que o Firebase Service inicialize (evita status falso de offline)
        try {
            if (firebaseService.ensureReady) {
                await firebaseService.ensureReady();
            }
        } catch (error) {
            console.warn('Sync: Firebase ainda não disponível, operando em modo offline', error?.message);
        }

        // Notificar status inicial após tentativa de init do service
        this.notifyListeners();
        this._setupOnlineOfflineListeners();
    }

    /**
     * Configura listeners para eventos online/offline
     */
    _setupOnlineOfflineListeners() {
        window.addEventListener('online', () => {
            console.log('🌐 Conexão restaurada');
            this.handleOnline();
        });

        window.addEventListener('offline', () => {
            console.log('📴 Conexão perdida');
            this.handleOffline();
        });
    }

    /**
     * Restaura status persistido de sincronização (último sync, circuit breaker)
     */
    async _restoreStatus() {
        try {
            const status = await firebaseCache.get(SYNC_STATUS_KEY);
            if (status?.lastSyncAt) {
                this.lastSyncAt = status.lastSyncAt;
            }
            if (status?.circuitOpenUntil) {
                this.circuitOpenUntil = status.circuitOpenUntil;
            }
            if (status?.consecutiveFailures) {
                this.consecutiveFailures = status.consecutiveFailures;
            }
        } catch (error) {
            console.warn('Não foi possível restaurar status de sincronização:', error);
        }
    }

    /**
     * Persiste status atual para uso futuro (ex: UI)
     */
    async _persistStatus() {
        try {
            await firebaseCache.setWithOptions(
                SYNC_STATUS_KEY,
                {
                    lastSyncAt: this.lastSyncAt,
                    circuitOpenUntil: this.circuitOpenUntil,
                    consecutiveFailures: this.consecutiveFailures,
                    lastError: this.lastError ? this.lastError.message || String(this.lastError) : null
                },
                { ttlMs: QUEUE_TTL_MS }
            );
        } catch (error) {
            console.warn('Não foi possível persistir status de sincronização:', error);
        }
    }

    _isCircuitOpen() {
        return Boolean(this.circuitOpenUntil && Date.now() < this.circuitOpenUntil);
    }

    _calculateBackoff() {
        const highestRetries = this.queue.reduce((max, item) => Math.max(max, item.retries || 0), 0);
        const jitter = Math.random() * 250;
        const delay = RETRY_DELAY * Math.pow(2, highestRetries || 0) + jitter;
        return Math.min(MAX_RETRY_DELAY, Math.max(RETRY_DELAY, delay));
    }

    _warnLargeQueue() {
        if (this.queue.length < LARGE_QUEUE_WARNING) return;

        const now = Date.now();
        if (now - this.lastQueueWarningAt < 10000) return; // evita spam a cada chamada

        this.lastQueueWarningAt = now;
        console.warn(`⚠️ Fila de sincronização grande: ${this.queue.length} itens`);
        this.notifyListeners({ queueWarning: true, pendingCount: this.queue.length });
    }

    /**
     * Retorna status online/offline
     * @returns {boolean}
     */
    getOnlineStatus() {
        const serviceAvailable = typeof firebaseService.isAvailable === 'function' ? firebaseService.isAvailable() : true;
        return this.isOnline && serviceAvailable;
    }

    /**
     * Carrega fila de sincronização do IndexedDB
     */
    async loadQueue() {
        try {
            const savedQueue = await firebaseCache.get(SYNC_QUEUE_KEY);
            if (savedQueue && Array.isArray(savedQueue)) {
                this.queue = savedQueue;
                console.log(`📦 Fila carregada: ${this.queue.length} operações pendentes`);
                this._warnLargeQueue();
            }
        } catch (error) {
            console.error('Erro ao carregar fila de sincronização:', error);
            this.queue = [];
        }
    }

    /**
     * Salva fila de sincronização no IndexedDB
     */
    async saveQueue() {
        try {
            await firebaseCache.setWithOptions(
                SYNC_QUEUE_KEY,
                this.queue,
                { compress: true, ttlMs: QUEUE_TTL_MS }
            );
        } catch (error) {
            console.error('Erro ao salvar fila de sincronização:', error);
        }
    }

    /**
     * Adiciona operação à fila de sincronização
     * @param {Object} operation - Operação a adicionar
     */
    async addToQueue(operation) {
        const queueItem = this._sanitizeOperation(operation);
        if (!queueItem || !this._isValidOperation(queueItem)) {
            console.warn('Operação inválida, ignorada:', operation);
            return;
        }

        this.queue.push(queueItem);
        this._warnLargeQueue();
        await this.saveQueue();
        
        // Tentar sincronizar imediatamente se online
        if (this.getOnlineStatus() && !this.syncInProgress) {
            this.sync().catch(error => {
                console.error('Erro ao sincronizar após adicionar à fila:', error);
            });
        }

        this.notifyListeners();
    }

    /**
     * Processa fila de sincronização
     */
    async sync(options = {}) {
        const maxBatchSize = options.maxBatchSize || MAX_BATCH_SIZE;

        if (!firebaseService.isAvailable() || !this.getOnlineStatus()) {
            if (!firebaseService.isAvailable()) {
                console.warn('⚠️ Sync pausado: serviço Firebase indisponível');
            }
            if (!this.getOnlineStatus()) {
                console.log('📴 Sync aguardando conexão...');
            }
            return;
        }

        if (this._isCircuitOpen() && !options.force) {
            const cooldown = Math.max(0, this.circuitOpenUntil - Date.now());
            console.warn(`⛔ Circuit breaker ativo. Novo retry em ~${Math.ceil(cooldown / 1000)}s`);
            this._scheduleRetry(cooldown || this._calculateBackoff());
            return;
        }

        if (this.syncInProgress) {
            console.log('⏳ Sincronização já em progresso...');
            return;
        }

        if (this.queue.length === 0) {
            console.log('✅ Fila vazia - nada para sincronizar');
            this.notifyListeners();
            return;
        }

        this.syncInProgress = true;
        this.notifyListeners();

        const opsCount = Math.min(this.queue.length, maxBatchSize);
        console.log(`🔄 Sincronizando lote: ${opsCount}/${this.queue.length} operações`);
        this.currentBatchSize = opsCount;

        const operationsToSync = [...this.queue.slice(0, maxBatchSize)];
        const invalidOps = operationsToSync.filter(op => !this._isValidOperation(op));
        const validOperations = operationsToSync.filter(op => this._isValidOperation(op));
        let invalidRemoved = 0;

        if (invalidOps.length > 0) {
            this.queue = this.queue.filter(item => this._isValidOperation(item));
            invalidRemoved = invalidOps.length;
            await this.saveQueue();
            console.warn(`⚠️ Removendo ${invalidRemoved} operações inválidas da fila (sem docId/collection)`);
        }
        let successful = [];
        let failed = [];
        let batchError = null;

        if (validOperations.length > 0) {
            try {
                const result = await this._processBatch(validOperations);
                successful = result.successful;
                failed = result.failed;
                batchError = result.error || null;
            } catch (error) {
                batchError = error;
                failed = validOperations.map(item => item.id);
            }
        }

        if (successful.length > 0 || invalidRemoved > 0) {
            this.queue = this.queue.filter(item => !successful.includes(item.id));
            this.lastSyncAt = new Date().toISOString();
            if (invalidRemoved > 0) {
                console.log(`✅ Operações inválidas purgadas: ${invalidRemoved}`);
            }
        }

        if (failed.length > 0) {
            this.queue = this.queue.map(item => {
                if (failed.includes(item.id)) {
                    const nextRetries = (item.retries || 0) + 1;
                    const status = nextRetries >= MAX_RETRIES ? 'FAILED' : 'RETRYING';
                    return { ...item, retries: nextRetries, status };
                }
                return item;
            }).filter(item => item.status !== 'FAILED');
        }

        if (failed.length > 0 && successful.length === 0) {
            this.consecutiveFailures += 1;
        } else {
            this.consecutiveFailures = 0;
        }

        if (batchError) {
            this.lastError = batchError;
            if (this.consecutiveFailures >= CIRCUIT_BREAKER_THRESHOLD) {
                this.circuitOpenUntil = Date.now() + CIRCUIT_BREAKER_COOLDOWN;
                console.warn('⛔ Circuit breaker ativado. Pausando sincronização temporariamente.');
            }
        } else {
            this.lastError = null;
            this.circuitOpenUntil = null;
        }

        await this.saveQueue();
        await this._persistStatus();

        this.syncInProgress = false;
        this._warnLargeQueue();
        this.currentBatchSize = 0;

        if (successful.length > 0) {
            console.log(`✅ Lote sincronizado: ${successful.length} operações`);
            this.notifyListeners({
                synced: successful.length,
                lastSyncAt: this.lastSyncAt,
                batchTotal: this.currentBatchSize
            });
        }

        if (failed.length > 0) {
            console.warn(`⚠️ ${failed.length} operações falharam (tentativa ${this.consecutiveFailures})`);
            this.notifyListeners({
                failed: failed.length,
                batchTotal: this.currentBatchSize
            });
        }

        // Se ainda há operações pendentes, agendar próximo lote com backoff exponencial
        if (this.queue.length > 0) {
            console.log(`⏳ Restam ${this.queue.length} operações.`);
            const delay = this._calculateBackoff();
            this._scheduleRetry(delay);
        } else {
            console.log('🎉 Todas as operações foram sincronizadas');
        }
    }

    /**
     * Processa lote de operações usando batch write com fallback individual
     * @param {Array} items
     * @returns {Promise<{successful: string[], failed: string[], error?: Error}>}
     */
    async _processBatch(items) {
        const operations = items.map(item => ({
            type: item.type === 'DELETE' ? 'DELETE' : 'SET',
            collection: item.collection,
            docId: item.docId,
            data: item.data,
            merge: true
        }));

        try {
            await firebaseService.batchWrite(operations);
            return {
                successful: items.map(item => item.id),
                failed: []
            };
        } catch (batchError) {
            console.warn('Batch write falhou, tentando operações individuais:', batchError);
            const successful = [];
            const failed = [];

            for (const item of items) {
                try {
                    await this._executeOperation(item);
                    successful.push(item.id);
                } catch (error) {
                    failed.push(item.id);
                }
            }

            return { successful, failed, error: batchError };
        }
    }

    /**
     * Executa uma operação individual
     * @param {Object} item - Item da fila
     */
    async _executeOperation(item) {
        switch (item.type) {
            case 'CREATE':
            case 'UPDATE':
                await firebaseService.setDocument(
                    item.collection,
                    item.docId,
                    item.data,
                    item.type === 'UPDATE'
                );
                break;

            case 'DELETE':
                await firebaseService.deleteDocument(item.collection, item.docId);
                break;

            default:
                throw new Error(`Tipo de operação desconhecido: ${item.type}`);
        }
    }

    /**
     * Agenda retry para operações pendentes
     */
    _scheduleRetry(delay = null) {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }

        const nextDelay = delay ?? this._calculateBackoff();
        const safeDelay = Math.min(MAX_RETRY_DELAY, Math.max(RETRY_DELAY, nextDelay));

        this.retryTimeout = setTimeout(() => {
            if (this.queue.length === 0) {
                return;
            }

            if (this._isCircuitOpen()) {
                this._scheduleRetry(this.circuitOpenUntil - Date.now());
                return;
            }

            if (this.getOnlineStatus()) {
                this.sync().catch(error => {
                    console.error('Erro no retry de sincronização:', error);
                });
            } else {
                console.log('⏳ Aguardando voltar online para continuar sincronização');
            }
        }, Math.max(0, safeDelay));
    }

    /**
     * Manipula evento online
     */
    async handleOnline() {
        this.isOnline = true;
        if (this.circuitOpenUntil && Date.now() > this.circuitOpenUntil) {
            this.circuitOpenUntil = null;
            this.consecutiveFailures = 0;
        }
        this.notifyListeners();

        // Tentar sincronizar se há operações pendentes
        if (this.queue.length > 0 && !this.syncInProgress) {
            console.log('🔄 Tentando sincronizar operações pendentes...');
            await this.sync();
        }
    }

    /**
     * Manipula evento offline
     */
    handleOffline() {
        this.isOnline = false;
        this.notifyListeners();

        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }
    }

    /**
     * Verifica se há operações pendentes
     * @returns {boolean}
     */
    hasPendingOperations() {
        return this.queue.length > 0;
    }

    /**
     * Retorna número de operações pendentes
     * @returns {number}
     */
    getPendingCount() {
        return this.queue.length;
    }

    /**
     * Inscreve-se em mudanças de status
     * @param {Function} callback - Função callback(status)
     * @returns {Function} Função para cancelar inscrição
     */
    subscribe(callback) {
        this.listeners.push(callback);
        
        // Notificar imediatamente com status atual
        callback(this._getStatus());

        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Retorna status atual de sincronização
     * @returns {Object}
     */
    _getStatus() {
        return {
            isOnline: this.getOnlineStatus(),
            hasPending: this.hasPendingOperations(),
            pendingCount: this.getPendingCount(),
            syncing: this.syncInProgress,
            currentBatchSize: this.currentBatchSize,
            queueWarning: this.queue.length >= LARGE_QUEUE_WARNING,
            lastSyncAt: this.lastSyncAt,
            circuitOpen: this._isCircuitOpen(),
            circuitOpenUntil: this.circuitOpenUntil,
            consecutiveFailures: this.consecutiveFailures,
            lastError: this.lastError ? this.lastError.message || String(this.lastError) : null
        };
    }

    _isValidOperation(item) {
        if (!item || !item.type || !item.collection || typeof item.collection !== 'string') {
            return false;
        }
        if (item.docId === undefined || item.docId === null || item.docId === '') {
            return false;
        }
        if (item.type === 'DELETE') {
            return true;
        }
        // Para CREATE/UPDATE/SET, data é obrigatório
        return item.data !== undefined && item.data !== null;
    }

    _normalizeDocId(docId) {
        if (docId === undefined || docId === null) return null;
        if (typeof docId === 'string') return docId.trim() || null;
        if (typeof docId === 'number' || typeof docId === 'bigint') return String(docId);
        if (typeof docId === 'object' && typeof docId.toString === 'function') {
            const converted = docId.toString().trim();
            return converted.length > 0 ? converted : null;
        }
        return null;
    }

    _sanitizeData(data) {
        if (data === null || data === undefined) return data;
        if (Array.isArray(data)) {
            return data.map((item) => this._sanitizeData(item));
        }
        if (typeof data === 'object') {
            const cleaned = {};
            Object.entries(data).forEach(([key, value]) => {
                if (value === undefined) {
                    return;
                }
                cleaned[key] = this._sanitizeData(value);
            });
            return cleaned;
        }
        return data;
    }

    _sanitizeOperation(operation) {
        const docId = this._normalizeDocId(operation.docId);
        if (!docId) {
            return null;
        }

        const type = operation.type;
        const data = type === 'DELETE' ? null : this._sanitizeData(operation.data);

        return {
            id: this._generateId(),
            type,
            collection: operation.collection,
            docId,
            data,
            timestamp: new Date().toISOString(),
            retries: 0,
            status: 'PENDING'
        };
    }

    /**
     * Notifica todos os listeners sobre mudanças
     * @param {Object} extraData - Dados extras para incluir na notificação
     */
    notifyListeners(extraData = {}) {
        const status = {
            ...this._getStatus(),
            ...extraData
        };

        this.listeners.forEach(callback => {
            try {
                callback(status);
            } catch (error) {
                console.error('Erro ao notificar listener:', error);
            }
        });
    }

    /**
     * Limpa a fila de sincronização
     */
    async clearQueue() {
        this.queue = [];
        await this.saveQueue();
        this.notifyListeners();
    }

    /**
     * Gera ID único para itens da fila
     * @returns {string}
     */
    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Exportar instância singleton
export const firebaseSync = new FirebaseSync();
export default firebaseSync;
