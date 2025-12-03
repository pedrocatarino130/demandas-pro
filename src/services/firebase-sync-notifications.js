/**
 * Integração Firebase Sync com Notificações Toast
 * Mostra notificações quando sincronização acontece
 */

import { firebaseSync } from './firebase-sync.js';
import { toast } from '../components/Toast.js';

class FirebaseSyncNotifications {
    constructor() {
        this.lastSyncedCount = 0;
        this.notificationDebounce = null;
        this.DEBOUNCE_DELAY = 2000; // 2 segundos para agrupar notificações
        this.isSubscribed = false;
        this.lastLargeQueueAlert = 0;
        this.lastSuccessToastAt = 0;
        this.successToastCooldown = 15000; // evita spam de sucesso
        this.minItemsForSuccessToast = 3;
        this.wasOfflineNotified = false;
    }

    /**
     * Inicia as notificações de sincronização
     */
    start() {
        if (this.isSubscribed) return;

        // Inscrever-se nas mudanças de status do firebaseSync
        firebaseSync.subscribe((status) => {
            this._handleSyncStatus(status);
        });

        this.isSubscribed = true;
        console.log('✅ Notificações de sincronização ativadas');
    }

    /**
     * Para as notificações de sincronização
     */
    stop() {
        // As notificações são automáticas via subscribe, não há stop necessário
        // mas podemos limpar debounce
        if (this.notificationDebounce) {
            clearTimeout(this.notificationDebounce);
            this.notificationDebounce = null;
        }
        this.isSubscribed = false;
    }

    /**
     * Manipula mudanças de status de sincronização
     * @param {Object} status - Status atual da sincronização
     */
    _handleSyncStatus(status) {
        // Mostrar notificação quando sincronização completa
        if (status.synced && status.synced > 0) {
            this._notifySyncComplete(status.synced);
        }

        if (status.pendingCount && status.pendingCount >= 50) {
            this._notifyLargeQueue(status.pendingCount);
        }

        // Mostrar notificação quando ficar offline
        if (!status.isOnline && status.hasPending && status.pendingCount > 0 && !this.wasOfflineNotified) {
            this._notifyOffline(status.pendingCount);
            this.wasOfflineNotified = true;
        }

        if (status.isOnline) {
            this.wasOfflineNotified = false;
        }
    }

    /**
     * Notifica sincronização completa com debounce
     * @param {number} count - Número de itens sincronizados
     */
    _notifySyncComplete(count) {
        const now = Date.now();
        const shouldSkipSmallSync =
            count < this.minItemsForSuccessToast &&
            now - this.lastSuccessToastAt < this.successToastCooldown;

        if (shouldSkipSmallSync) {
            this.lastSyncedCount = count;
            return;
        }

        if (this.notificationDebounce) {
            clearTimeout(this.notificationDebounce);
        }

        this.notificationDebounce = setTimeout(() => {
            const message = count === 1 
                ? 'Alteração sincronizada'
                : `${count} itens sincronizados`;
            
            toast.success(message, {
                duration: 2500
            });

            this.lastSyncedCount = count;
            this.lastSuccessToastAt = now;
        }, this.DEBOUNCE_DELAY);
    }

    /**
     * Notifica quando ficou offline com operações pendentes
     * @param {number} count - Número de operações pendentes
     */
    _notifyOffline(count) {
        const message = count === 1
            ? '1 operação será sincronizada quando voltar online'
            : `${count} operações serão sincronizadas quando voltar online`;
        
        toast.info(message, {
            duration: 3000
        });
    }

    _notifyLargeQueue(count) {
        const now = Date.now();
        if (now - this.lastLargeQueueAlert < 10000) return;
        this.lastLargeQueueAlert = now;

        const message = count === 1
            ? 'Fila alta: 1 operação pendente. Processando em lotes.'
            : `Fila alta: ${count} operações pendentes. Processando em lotes.`;

        if (typeof toast.warning === 'function') {
            toast.warning(message, { duration: 2500 });
        } else {
            toast.info(message, { duration: 2500 });
        }
    }
}

// Exportar instância singleton
export const firebaseSyncNotifications = new FirebaseSyncNotifications();
export default firebaseSyncNotifications;

