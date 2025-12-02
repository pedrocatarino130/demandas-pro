/**
 * Modal de Confirmação Customizado
 * Substitui o confirm() nativo do navegador por um modal mais confiável
 */

export class ConfirmModal {
    constructor() {
        this.modal = null;
        this.resolve = null;
        this.isProcessing = false;
        this.labels = {
            confirm: 'OK',
            cancel: 'Cancelar',
            loading: 'Processando...'
        };
        this.init();
    }

    init() {
        // Criar modal se não existir
        if (document.getElementById('confirm-modal')) {
            this.modal = document.getElementById('confirm-modal');
        } else {
            this.modal = document.createElement('div');
            this.modal.id = 'confirm-modal';
            this.modal.className = 'confirm-modal';
            this.modal.style.display = 'none';
            document.body.appendChild(this.modal);
        }

        this.render();
        this.setupEventListeners();
    }

    render() {
        // Só renderizar se o conteúdo não existir
        if (!this.modal.querySelector('.confirm-modal-content')) {
            this.modal.innerHTML = `
                <div class="confirm-modal-overlay"></div>
                <div class="confirm-modal-content">
                    <div class="confirm-modal-header">
                        <h3 class="confirm-modal-title">Confirmar ação</h3>
                    </div>
                    <div class="confirm-modal-body">
                        <p class="confirm-modal-message" id="confirm-message"></p>
                    </div>
                    <div class="confirm-modal-footer">
                        <button class="btn btn-secondary" id="confirm-cancel">Cancelar</button>
                        <button class="btn btn-primary" id="confirm-ok">OK</button>
                    </div>
                </div>
            `;
        }
    }

    _setLoading(isLoading) {
        this.isProcessing = isLoading;
        const confirmBtn = this.modal.querySelector('#confirm-ok');
        const cancelBtn = this.modal.querySelector('#confirm-cancel');

        if (confirmBtn) {
            confirmBtn.disabled = isLoading;
            confirmBtn.textContent = isLoading ? this.labels.loading : this.labels.confirm;
            confirmBtn.classList.toggle('loading', isLoading);
        }

        if (cancelBtn) {
            cancelBtn.disabled = isLoading;
        }
    }

    setupEventListeners() {
        // Remover listeners anteriores se existirem
        if (this._clickHandler) {
            this.modal.removeEventListener('click', this._clickHandler);
        }
        if (this._keyDownHandler) {
            document.removeEventListener('keydown', this._keyDownHandler);
        }

        const close = (result) => {
            this._setLoading(false);
            this.modal.style.display = 'none';
            if (this.resolve) {
                this.resolve(result);
                this.resolve = null;
            }
        };

        // Usar event delegation no modal
        this._clickHandler = (e) => {
            if (this.isProcessing) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            const target = e.target;

            // Clicar no overlay
            if (target.classList.contains('confirm-modal-overlay')) {
                close(false);
                return;
            }

            // Clicar no botão Cancelar
            if (target.id === 'confirm-cancel' || target.closest('#confirm-cancel')) {
                e.preventDefault();
                e.stopPropagation();
                close(false);
                return;
            }

            // Clicar no botão OK
            if (target.id === 'confirm-ok' || target.closest('#confirm-ok')) {
                e.preventDefault();
                e.stopPropagation();
                this._setLoading(true);
                setTimeout(() => close(true), 50);
                return;
            }
        };

        this.modal.addEventListener('click', this._clickHandler);

        // Fechar com ESC
        this._keyDownHandler = (e) => {
            if (e.key === 'Escape' && this.modal.style.display !== 'none') {
                if (this.isProcessing) {
                    return;
                }
                close(false);
            }
        };
        document.addEventListener('keydown', this._keyDownHandler);
    }

    /**
     * Mostra o modal de confirmação
     * @param {string} message - Mensagem a ser exibida
     * @param {Object} options - Opções do modal
     * @param {string} options.confirmLabel - Texto do botão de confirmar
     * @param {string} options.cancelLabel - Texto do botão de cancelar
     * @param {string} options.loadingLabel - Texto exibido enquanto processando
     * @returns {Promise<boolean>} - Promise que resolve com true se confirmado, false se cancelado
     */
    show(message, options = {}) {
        this.labels.confirm = options.confirmLabel || 'OK';
        this.labels.cancel = options.cancelLabel || 'Cancelar';
        this.labels.loading = options.loadingLabel || 'Processando...';
        this._setLoading(false);

        const messageEl = this.modal.querySelector('#confirm-message');
        if (messageEl) {
            messageEl.textContent = message;
        }

        const confirmBtn = this.modal.querySelector('#confirm-ok');
        const cancelBtn = this.modal.querySelector('#confirm-cancel');
        if (confirmBtn) {
            confirmBtn.textContent = this.labels.confirm;
        }
        if (cancelBtn) {
            cancelBtn.textContent = this.labels.cancel;
        }

        this.modal.style.display = 'flex';

        return new Promise((resolve) => {
            this.resolve = resolve;
        });
    }
}

// Singleton
export const confirmModal = new ConfirmModal();

/**
 * Função helper para usar como substituição do confirm()
 * @param {string} message - Mensagem de confirmação
 * @param {Object} options - Opções do modal
 * @returns {Promise<boolean>}
 */
export async function confirmAction(message, options = {}) {
    return await confirmModal.show(message, options);
}
