/**
 * Widget fixo para indicar status de sincronização Firebase
 * Ajuda o usuário a entender quando o backend está lento/ocupado
 */

import { firebaseSync } from '../services/firebase-sync.js';
import { toast } from './Toast.js';

export class SyncStatusWidget {
    constructor() {
        this.container = null;
        this.status = {
            isOnline: navigator.onLine,
            hasPending: false,
            pendingCount: 0,
            syncing: false,
            circuitOpen: false,
            lastError: null
        };
        this.unsubscribe = null;
        this.lastSyncedAt = null;
        this.lastBatchTotal = 0;
        this.lastSyncedCount = 0;
        this.lastFailedCount = 0;
        this.manualSyncInFlight = false;
        this.elements = {};
    }

    mount() {
        if (this.container) {
            return;
        }

        this.container = document.createElement('aside');
        this.container.className = 'sync-status-widget hidden';
        this.container.innerHTML = `
            <div class="sync-status-card">
                <div class="sync-status-row">
                    <div class="sync-status-main">
                        <span class="sync-status-dot"></span>
                        <div class="sync-status-texts">
                            <strong class="sync-status-title">Sincronização</strong>
                            <span class="sync-status-message">Sincronizado</span>
                        </div>
                    </div>
                    <div class="sync-status-actions">
                        <span class="sync-status-count badge badge-warning">0</span>
                        <button class="sync-status-action" type="button">
                            <span class="sync-status-action-icon">⟳</span>
                            <span class="sync-status-action-label">Sincronizar</span>
                        </button>
                    </div>
                </div>
                <div class="sync-status-meta">
                    <span class="sync-status-meta-text">Última atualização: --</span>
                    <span class="sync-status-alert"></span>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);

        this.elements = {
            dot: this.container.querySelector('.sync-status-dot'),
            count: this.container.querySelector('.sync-status-count'),
            message: this.container.querySelector('.sync-status-message'),
            meta: this.container.querySelector('.sync-status-meta-text'),
            alert: this.container.querySelector('.sync-status-alert'),
            action: this.container.querySelector('.sync-status-action'),
            actionIcon: this.container.querySelector('.sync-status-action-icon'),
            actionLabel: this.container.querySelector('.sync-status-action-label'),
        };

        this.elements.action.addEventListener('click', () => this.handleManualSync());

        this.unsubscribe = firebaseSync.subscribe((status) => {
            if (status.batchTotal) {
                this.lastBatchTotal = status.batchTotal;
            }
            if (status.synced && status.synced > 0) {
                this.lastSyncedCount = status.synced;
                this.lastSyncedAt = status.lastSyncAt ? new Date(status.lastSyncAt) : new Date();
            } else if (status.lastSyncAt) {
                this.lastSyncedAt = new Date(status.lastSyncAt);
            }
            if (status.failed) {
                this.lastFailedCount = status.failed;
            }
            this.status = status;
            this.updateUI();
        });

        // Atualiza estado inicial
        this.updateUI();
    }

    updateUI() {
        if (!this.container) return;

        const { isOnline, pendingCount, syncing, circuitOpen, lastError } = this.status;
        const showWidget = !isOnline || pendingCount > 0 || syncing || this.manualSyncInFlight || circuitOpen || lastError;
        this.container.classList.toggle('hidden', !showWidget);

        // Atualizar dot
        this.elements.dot.classList.toggle('offline', !isOnline);
        this.elements.dot.classList.toggle('syncing', syncing || this.manualSyncInFlight);
        this.elements.dot.classList.toggle('error', Boolean(circuitOpen || lastError));

        // Contador de pendências
        this.elements.count.textContent = pendingCount.toString();
        this.elements.count.classList.toggle('visible', pendingCount > 0);

        if (this.elements.alert) {
            const largeQueue = pendingCount >= 50 || this.status.queueWarning;
            let alertMessage = '';
            if (circuitOpen) {
                alertMessage = 'Pausado após falhas';
            } else if (this.status.lastError) {
                alertMessage = 'Erro recente na sincronização';
            } else if (largeQueue) {
                alertMessage = 'Fila alta, sincronizando em lotes';
            } else if (this.lastFailedCount > 0) {
                alertMessage = `${this.lastFailedCount} falhas recentes`;
            }
            this.elements.alert.textContent = alertMessage;
            this.elements.alert.classList.toggle('visible', Boolean(alertMessage));
        }

        // Mensagem principal
        this.elements.message.textContent = this.getStatusMessage();

        // Última atualização
        if (this.lastSyncedAt) {
            this.elements.meta.textContent = `Atualizado ${this.formatTime(this.lastSyncedAt)}`;
        } else if (circuitOpen) {
            this.elements.meta.textContent = 'Pausado para proteger a fila';
        } else if (!isOnline) {
            this.elements.meta.textContent = 'Sem conexão';
        } else {
            this.elements.meta.textContent = 'Primeira sync pendente';
        }

        // Botão de ação
        const actionDisabled = !isOnline || pendingCount === 0 || syncing || this.manualSyncInFlight || circuitOpen;
        this.elements.action.disabled = actionDisabled;
        const actionLabel = this.manualSyncInFlight ? 'Sincronizando' : 'Sincronizar';
        if (this.elements.actionLabel) {
            this.elements.actionLabel.textContent = actionLabel;
        } else {
            this.elements.action.textContent = actionLabel;
        }
        if (this.elements.actionIcon) {
            this.elements.actionIcon.textContent = this.manualSyncInFlight ? '…' : '⟳';
        }
    }

    getStatusMessage() {
        const { isOnline, pendingCount, syncing, circuitOpen } = this.status;

        if (circuitOpen) {
            const remaining = this.status.circuitOpenUntil ? Math.max(0, this.status.circuitOpenUntil - Date.now()) : 0;
            const seconds = Math.ceil(remaining / 1000);
            return `Pausado após falhas • retoma em ~${seconds || 5}s`;
        }

        if (this.status.lastError) {
            return 'Erro recente, tentando novamente em instantes';
        }

        if (!isOnline) {
            return pendingCount > 0
                ? `${pendingCount} pendências offline`
                : 'Sem conexão no momento';
        }

        if (this.manualSyncInFlight) {
            return 'Forçando sincronização...';
        }

        if (syncing) {
            return pendingCount > 0
                ? `Sincronizando ${pendingCount}`
                : 'Sincronizando';
        }

        if (pendingCount > 0) {
            if (pendingCount >= 50) {
                return `Fila alta: ${pendingCount} itens`;
            }
            return `${pendingCount} pendência${pendingCount > 1 ? 's' : ''} aguardando sync`;
        }

        return 'Tudo sincronizado';
    }

    async handleManualSync() {
        if (this.status.circuitOpen) {
            toast.info('Sincronização pausada após falhas recentes. Aguardando retomar...', { duration: 2500 });
            return;
        }

        if (!this.status.isOnline || this.manualSyncInFlight) {
            if (!this.status.isOnline) {
                toast.info('Sem conexão. Tentaremos assim que a rede voltar.', { duration: 2000 });
            }
            return;
        }

        this.manualSyncInFlight = true;
        this.updateUI();

        try {
            await firebaseSync.sync();
        } catch (error) {
            console.error('Erro ao forçar sincronização manual:', error);
        } finally {
            this.manualSyncInFlight = false;
            this.updateUI();
        }
    }

    formatTime(date) {
        try {
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return date.toISOString();
        }
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        if (this.container && document.body.contains(this.container)) {
            document.body.removeChild(this.container);
        }
        this.container = null;
    }
}

export default SyncStatusWidget;

