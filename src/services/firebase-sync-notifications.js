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

        // Mostrar notificação quando ficar online e houver pendências
        if (status.isOnline && status.hasPending && status.pendingCount > 0) {
            if (!status.syncing) {
                // Aguardar um pouco antes de notificar (pode estar sincronizando em breve)
                setTimeout(() => {
                    const currentStatus = {
                        isOnline: firebaseSync.getOnlineStatus(),
                        hasPending: firebaseSync.hasPendingOperations(),
                        pendingCount: firebaseSync.getPendingCount(),
                        syncing: false
                    };
                    
                    if (currentStatus.hasPending && !currentStatus.syncing) {
                        this._notifyPendingSync(currentStatus.pendingCount);
                    }
                }, 1000);
            }
        }

        // Mostrar notificação quando ficar offline
        if (!status.isOnline && status.hasPending) {
            this._notifyOffline(status.pendingCount);
        }
    }

    /**
     * Notifica sincronização completa com debounce
     * @param {number} count - Número de itens sincronizados
     */
    _notifySyncComplete(count) {
        if (this.notificationDebounce) {
            clearTimeout(this.notificationDebounce);
        }

        this.notificationDebounce = setTimeout(() => {
            const message = count === 1 
                ? 'Dado sincronizado com sucesso!' 
                : `${count} dados sincronizados com sucesso!`;
            
            toast.success(message, {
                duration: 3000
            });

            this.lastSyncedCount = count;
        }, this.DEBOUNCE_DELAY);
    }

    /**
     * Notifica sobre operações pendentes quando online
     * @param {number} count - Número de operações pendentes
     */
    _notifyPendingSync(count) {
        const message = count === 1
            ? '1 operação pendente será sincronizada...'
            : `${count} operações pendentes serão sincronizadas...`;
        
        toast.info(message, {
            duration: 2000
        });
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
}

// Exportar instância singleton
export const firebaseSyncNotifications = new FirebaseSyncNotifications();
export default firebaseSyncNotifications;

