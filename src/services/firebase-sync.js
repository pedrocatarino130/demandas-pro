/**
 * Gerenciamento de Sincronização Firebase
 * Gerencia fila de sincronização offline/online e status de conexão
 */

import { firebaseService } from './firebase-service.js';
import { firebaseCache } from './firebase-cache.js';

const SYNC_QUEUE_KEY = 'firebase-sync-queue';
const SYNC_STATUS_KEY = 'firebase-sync-status';
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 segundos

class FirebaseSync {
    constructor() {
        this.queue = [];
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        this.listeners = [];
        this.retryTimeout = null;
        
        // Inicializar
        this._init();
    }

    /**
     * Inicialização assíncrona
     */
    async _init() {
        await firebaseCache.init();
        await this.loadQueue();
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
     * Retorna status online/offline
     * @returns {boolean}
     */
    getOnlineStatus() {
        return this.isOnline && firebaseService.isAvailable();
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
            await firebaseCache.set(SYNC_QUEUE_KEY, this.queue);
        } catch (error) {
            console.error('Erro ao salvar fila de sincronização:', error);
        }
    }

    /**
     * Adiciona operação à fila de sincronização
     * @param {Object} operation - Operação a adicionar
     */
    async addToQueue(operation) {
        const queueItem = {
            id: this._generateId(),
            type: operation.type, // 'CREATE', 'UPDATE', 'DELETE'
            collection: operation.collection,
            docId: operation.docId,
            data: operation.data,
            timestamp: new Date().toISOString(),
            retries: 0,
            status: 'PENDING'
        };

        this.queue.push(queueItem);
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
    async sync() {
        if (!firebaseService.isAvailable() || !this.getOnlineStatus()) {
            return;
        }

        if (this.syncInProgress) {
            console.log('⏳ Sincronização já em progresso...');
            return;
        }

        if (this.queue.length === 0) {
            return;
        }

        this.syncInProgress = true;
        this.notifyListeners();

        console.log(`🔄 Iniciando sincronização: ${this.queue.length} operações`);

        const operationsToSync = [...this.queue];
        const successful = [];
        const failed = [];

        for (const item of operationsToSync) {
            try {
                await this._executeOperation(item);
                successful.push(item.id);
            } catch (error) {
                console.error(`Erro ao sincronizar operação ${item.id}:`, error);
                
                item.retries++;
                if (item.retries >= MAX_RETRIES) {
                    item.status = 'FAILED';
                    failed.push(item.id);
                } else {
                    item.status = 'RETRYING';
                }
            }
        }

        // Remover operações bem-sucedidas da fila
        this.queue = this.queue.filter(item => !successful.includes(item.id));
        
        // Remover operações que falharam após máximo de tentativas
        const beforeFailedCount = this.queue.length;
        this.queue = this.queue.filter(item => item.status !== 'FAILED');
        const removedFailedCount = beforeFailedCount - this.queue.length;

        await this.saveQueue();
        this.syncInProgress = false;

        // Notificar resultado
        const syncedCount = successful.length;
        if (syncedCount > 0) {
            console.log(`✅ Sincronização concluída: ${syncedCount} operações`);
            this.notifyListeners({ synced: syncedCount });
        }

        if (removedFailedCount > 0) {
            console.warn(`⚠️ ${removedFailedCount} operações falharam após ${MAX_RETRIES} tentativas`);
        }

        // Se ainda há operações pendentes, agendar retry
        if (this.queue.length > 0) {
            this._scheduleRetry();
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
    _scheduleRetry() {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }

        this.retryTimeout = setTimeout(() => {
            if (this.getOnlineStatus() && this.queue.length > 0) {
                this.sync().catch(error => {
                    console.error('Erro no retry de sincronização:', error);
                });
            }
        }, RETRY_DELAY);
    }

    /**
     * Manipula evento online
     */
    async handleOnline() {
        this.isOnline = true;
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
            syncing: this.syncInProgress
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
