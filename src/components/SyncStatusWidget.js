/**
 * Widget fixo para indicar status de sincronização Firebase
 * Ajuda o usuário a entender quando o backend está lento/ocupado
 */

import { firebaseSync } from '../services/firebase-sync.js';

export class SyncStatusWidget {
    constructor() {
        this.container = null;
        this.status = {
            isOnline: navigator.onLine,
            hasPending: false,
            pendingCount: 0,
            syncing: false,
        };
        this.unsubscribe = null;
        this.lastSyncedAt = null;
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
                <div class="sync-status-header">
                    <span class="sync-status-dot"></span>
                    <div class="sync-status-titles">
                        <strong class="sync-status-title">Sincronização</strong>
                        <span class="sync-status-subtitle">Monitorando backend</span>
                    </div>
                    <span class="sync-status-count badge badge-warning">0</span>
                </div>
                <div class="sync-status-message">Sincronizado</div>
                <div class="sync-status-footer">
                    <span class="sync-status-meta">Última atualização: --</span>
                    <button class="sync-status-action btn btn-outline">Sincronizar agora</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);

        this.elements = {
            dot: this.container.querySelector('.sync-status-dot'),
            subtitle: this.container.querySelector('.sync-status-subtitle'),
            count: this.container.querySelector('.sync-status-count'),
            message: this.container.querySelector('.sync-status-message'),
            meta: this.container.querySelector('.sync-status-meta'),
            action: this.container.querySelector('.sync-status-action'),
        };

        this.elements.action.addEventListener('click', () => this.handleManualSync());

        this.unsubscribe = firebaseSync.subscribe((status) => {
            if (status.synced && status.synced > 0) {
                this.lastSyncedAt = new Date();
            }
            this.status = status;
            this.updateUI();
        });

        // Atualiza estado inicial
        this.updateUI();
    }

    updateUI() {
        if (!this.container) return;

        const { isOnline, pendingCount, syncing } = this.status;
        const showWidget = !isOnline || pendingCount > 0 || syncing || this.manualSyncInFlight;
        this.container.classList.toggle('hidden', !showWidget);

        // Atualizar dot e subtítulo
        this.elements.dot.classList.toggle('offline', !isOnline);
        this.elements.dot.classList.toggle('syncing', syncing || this.manualSyncInFlight);
        this.elements.subtitle.textContent = this.getSubtitleText();

        // Contador de pendências
        this.elements.count.textContent = pendingCount.toString();
        this.elements.count.classList.toggle('visible', pendingCount > 0);

        // Mensagem principal
        this.elements.message.textContent = this.getStatusMessage();

        // Última atualização
        if (this.lastSyncedAt) {
            this.elements.meta.textContent = `Última atualização: ${this.formatTime(this.lastSyncedAt)}`;
        } else if (!isOnline) {
            this.elements.meta.textContent = 'Sem conexão';
        } else {
            this.elements.meta.textContent = 'Aguardando primeira sincronização...';
        }

        // Botão de ação
        const actionDisabled = !isOnline || pendingCount === 0 || syncing || this.manualSyncInFlight;
        this.elements.action.disabled = actionDisabled;
        this.elements.action.textContent = this.manualSyncInFlight ? 'Sincronizando...' : 'Sincronizar agora';
    }

    getSubtitleText() {
        if (!this.status.isOnline) {
            return 'Modo offline';
        }
        if (this.status.syncing || this.manualSyncInFlight) {
            return 'Sincronizando dados';
        }
        if (this.status.pendingCount > 0) {
            return 'Pendências detectadas';
        }
        return 'Tudo em dia';
    }

    getStatusMessage() {
        const { isOnline, pendingCount, syncing } = this.status;

        if (!isOnline) {
            return pendingCount > 0
                ? `${pendingCount} pendências aguardando conexão`
                : 'Sem conexão. Continuaremos tentando em segundo plano.';
        }

        if (this.manualSyncInFlight) {
            return 'Forçando sincronização...';
        }

        if (syncing) {
            return pendingCount > 0
                ? `Sincronizando ${pendingCount} pendências...`
                : 'Sincronizando dados...';
        }

        if (pendingCount > 0) {
            return `${pendingCount} alterações serão sincronizadas assim que possível.`;
        }

        return 'Sincronização concluída. Tudo pronto!';
    }

    async handleManualSync() {
        if (!this.status.isOnline || this.manualSyncInFlight) {
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

