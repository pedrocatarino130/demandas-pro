/**
 * Gerenciamento de Sincronização - STUB LOCAL
 * Não faz sincronização remota, apenas retorna status offline.
 */

class FirebaseSync {
    constructor() {
        this.queue = [];
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        this.listeners = [];
    }

    /**
     * Retorna status online/offline baseado no navegador
     */
    getOnlineStatus() {
        return this.isOnline;
    }

    /**
     * Stub methods - não fazem nada além de manter compatibilidade
     */
    async loadQueue() {
        return;
    }

    async saveQueue() {
        return;
    }

    async addToQueue(operation) {
        // Não adiciona à fila - operações são apenas locais
        return;
    }

    async sync() {
        // Não sincroniza - não há backend
        return;
    }

    async handleOnline() {
        this.isOnline = true;
        this.notifyListeners();
    }

    handleOffline() {
        this.isOnline = false;
        this.notifyListeners();
    }

    hasPendingOperations() {
        return false;
    }

    getPendingCount() {
        return 0;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback({
                    isOnline: this.isOnline,
                    hasPending: false,
                    pendingCount: 0,
                    syncing: false,
                });
            } catch (error) {
                console.error('Erro ao notificar listener:', error);
            }
        });
    }

    async clearQueue() {
        this.queue = [];
        this.notifyListeners();
    }
}

// Exportar instância singleton
export const firebaseSync = new FirebaseSync();
export default firebaseSync;
