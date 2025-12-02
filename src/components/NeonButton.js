/**
 * NeonButton Component
 * Botão com estilo neon e efeitos glow
 */

export class NeonButton {
  constructor(options = {}) {
    this.text = options.text || 'Button';
    this.variant = options.variant || 'primary'; // 'primary', 'secondary', 'danger'
    this.onClick = options.onClick || (() => {});
    this.icon = options.icon || null;
    this.className = options.className || '';
    this.id = options.id || null;
    this.disabled = options.disabled || false;
    this.type = options.type || 'button';
  }

  render() {
    const button = document.createElement('button');
    button.type = this.type;
    button.className = `neon-button neon-button-${this.variant} ${this.className}`.trim();
    
    if (this.id) {
      button.id = this.id;
    }

    if (this.disabled) {
      button.disabled = true;
      button.classList.add('disabled');
      button.style.opacity = '0.5';
      button.style.cursor = 'not-allowed';
    }

    // Glow effect (only for primary variant)
    if (this.variant === 'primary') {
      const glow = document.createElement('div');
      glow.className = 'neon-button-glow';
      button.appendChild(glow);
    }

    // Button content
    const content = document.createElement('span');
    content.className = 'neon-button-content';

    // Icon
    if (this.icon) {
      const iconElement = typeof this.icon === 'string' 
        ? this.createIconFromString(this.icon)
        : this.icon;
      content.appendChild(iconElement);
    }

    // Text
    const textNode = document.createTextNode(this.text);
    content.appendChild(textNode);

    button.appendChild(content);

    // Event listener
    if (!this.disabled) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.onClick(e);
      });
    }

    // Store reference
    this._element = button;

    return button;
  }

  createIconFromString(iconString) {
    // Se for um emoji ou texto simples
    const span = document.createElement('span');
    span.textContent = iconString;
    span.setAttribute('aria-hidden', 'true');
    return span;
  }

  setDisabled(disabled) {
    this.disabled = disabled;
    if (this._element) {
      this._element.disabled = disabled;
      if (disabled) {
        this._element.style.opacity = '0.5';
        this._element.style.cursor = 'not-allowed';
      } else {
        this._element.style.opacity = '1';
        this._element.style.cursor = 'pointer';
      }
    }
  }

  setText(text) {
    this.text = text;
    if (this._element) {
      const content = this._element.querySelector('.neon-button-content');
      if (content) {
        // Remove text nodes, keep icon if exists
        const icon = content.querySelector('[aria-hidden="true"]');
        content.textContent = '';
        if (icon) {
          content.appendChild(icon);
        }
        content.appendChild(document.createTextNode(text));
      }
    }
  }
}

/**
 * Helper function to create a simple neon button
 * @param {Object} options - Button options
 * @returns {HTMLElement} Button element
 */
export function createNeonButton(options) {
  const button = new NeonButton(options);
  return button.render();
}

