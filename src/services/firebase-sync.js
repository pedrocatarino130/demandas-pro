/**
 * Gerenciamento de Sincronização Online/Offline
 * Fila de operações pendentes e sincronização automática
 */

import { firebaseCache } from './firebase-cache.js';

const SYNC_QUEUE_KEY = 'firebase-sync-queue';
const MAX_RETRIES = 3;

/**
 * Classe para gerenciar sincronização
 */
class FirebaseSync {
    constructor() {
        this.queue = [];
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        this.listeners = [];

        // Escutar eventos de conexão
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        // Carregar fila existente
        this.loadQueue();
    }

    /**
     * Carrega a fila de sincronização do cache
     */
    async loadQueue() {
        const savedQueue = await firebaseCache.get(SYNC_QUEUE_KEY);
        if (savedQueue && Array.isArray(savedQueue)) {
            this.queue = savedQueue;
        }
    }

    /**
     * Salva a fila de sincronização no cache
     */
    async saveQueue() {
        await firebaseCache.set(SYNC_QUEUE_KEY, this.queue);
    }

    /**
     * Adiciona operação à fila
     * @param {Object} operation - Operação pendente
     */
    async addToQueue(operation) {
        this.queue.push({
            ...operation,
            timestamp: Date.now(),
            retries: 0,
        });
        await this.saveQueue();
        this.notifyListeners();

        // Tentar sincronizar se estiver online
        if (this.isOnline) {
            this.sync();
        }
    }

    /**
     * Processa a fila de sincronização
     */
    async sync() {
        if (this.syncInProgress || !this.isOnline || this.queue.length === 0) {
            return;
        }

        this.syncInProgress = true;
        this.notifyListeners();

        const operations = [...this.queue];
        const successful = [];
        const failed = [];

        for (const operation of operations) {
            try {
                // Executar operação
                await operation.execute();
                successful.push(operation);
            } catch (error) {
                console.error('Erro ao sincronizar operação:', error);
                operation.retries++;

                if (operation.retries < MAX_RETRIES) {
                    failed.push(operation);
                } else {
                    console.warn('Operação falhou após máximo de tentativas:', operation);
                }
            }
        }

        // Atualizar fila removendo operações bem-sucedidas
        this.queue = failed;
        await this.saveQueue();

        this.syncInProgress = false;
        this.notifyListeners();

        if (successful.length > 0) {
            console.log(`✅ ${successful.length} operação(ões) sincronizada(s)`);
        }

        if (failed.length > 0) {
            console.warn(`⚠️ ${failed.length} operação(ões) falharam e serão tentadas novamente`);
        }
    }

    /**
     * Manipula quando a conexão volta
     */
    async handleOnline() {
        console.log('🌐 Conexão restabelecida');
        this.isOnline = true;
        this.notifyListeners();

        // Sincronizar pendências
        if (this.queue.length > 0) {
            await this.sync();
        }
    }

    /**
     * Manipula quando a conexão cai
     */
    handleOffline() {
        console.log('📴 Conexão perdida');
        this.isOnline = false;
        this.notifyListeners();
    }

    /**
     * Verifica status online
     */
    getOnlineStatus() {
        return this.isOnline;
    }

    /**
     * Verifica se há operações pendentes
     */
    hasPendingOperations() {
        return this.queue.length > 0;
    }

    /**
     * Obtém número de operações pendentes
     */
    getPendingCount() {
        return this.queue.length;
    }

    /**
     * Inscreve listener para mudanças de status
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Notifica todos os listeners
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback({
                    isOnline: this.isOnline,
                    hasPending: this.hasPendingOperations(),
                    pendingCount: this.getPendingCount(),
                    syncing: this.syncInProgress,
                });
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
}

// Exportar instância singleton
export const firebaseSync = new FirebaseSync();
export default firebaseSync;

