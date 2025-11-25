/**
 * Sistema de Toast/Notificações
 * Toast para feedback de ações (ex: desfazer)
 */

export class Toast {
  constructor() {
    this.toasts = [];
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.id = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, options = {}) {
    const {
      type = 'info',
      duration = 5000,
      action = null,
      actionLabel = 'Desfazer',
    } = options;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-message">${this.escapeHtml(message)}</span>
      ${action ? `<button class="toast-action" data-action-id="${this.toasts.length}">${this.escapeHtml(actionLabel)}</button>` : ''}
      <button class="toast-close" aria-label="Fechar">×</button>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    // Action handler
    if (action) {
      const actionBtn = toast.querySelector('.toast-action');
      actionBtn.addEventListener('click', () => {
        action();
        this.hide(toast);
      });
    }

    // Close handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.hide(toast);
    });

    // Auto hide
    if (duration > 0) {
      setTimeout(() => {
        this.hide(toast);
      }, duration);
    }

    this.toasts.push({ element: toast, action });
    return toast;
  }

  hide(toast) {
    if (!toast) return;

    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts = this.toasts.filter((t) => t.element !== toast);
    }, 300);
  }

  success(message, options = {}) {
    return this.show(message, { ...options, type: 'success' });
  }

  error(message, options = {}) {
    return this.show(message, { ...options, type: 'error' });
  }

  info(message, options = {}) {
    return this.show(message, { ...options, type: 'info' });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Singleton
export const toast = new Toast();

