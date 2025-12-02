/**
 * NeonCheckbox Component
 * Checkbox com estilo cyberpunk e animações
 */

export class NeonCheckbox {
  constructor(options = {}) {
    this.checked = options.checked || false;
    this.onChange = options.onChange || (() => {});
    this.id = options.id || null;
    this.className = options.className || '';
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = `neon-checkbox-wrapper ${this.checked ? 'checked' : ''} ${this.className}`.trim();
    
    if (this.id) {
      wrapper.id = this.id;
    }

    const container = document.createElement('div');
    container.className = `neon-checkbox-container ${this.checked ? 'checked' : ''}`;

    // Animated Background
    const background = document.createElement('div');
    background.className = 'neon-checkbox-background';
    container.appendChild(background);

    // Checkmark Icon
    const icon = document.createElement('div');
    icon.className = 'neon-checkbox-icon';
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    container.appendChild(icon);

    // Glowing Dots
    const dotLeft = document.createElement('div');
    dotLeft.className = 'neon-checkbox-dot neon-checkbox-dot-left';
    wrapper.appendChild(dotLeft);

    wrapper.appendChild(container);

    const dotRight = document.createElement('div');
    dotRight.className = 'neon-checkbox-dot neon-checkbox-dot-right';
    wrapper.appendChild(dotRight);

    // Event listener
    wrapper.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    // Store reference
    this._element = wrapper;
    this._container = container;

    return wrapper;
  }

  toggle() {
    this.checked = !this.checked;
    this.update();
    this.onChange(this.checked);
  }

  setChecked(checked) {
    this.checked = checked;
    this.update();
  }

  update() {
    if (this._element && this._container) {
      if (this.checked) {
        this._element.classList.add('checked');
        this._container.classList.add('checked');
      } else {
        this._element.classList.remove('checked');
        this._container.classList.remove('checked');
      }
    }
  }

  getChecked() {
    return this.checked;
  }
}

/**
 * Helper function to create a simple neon checkbox
 * @param {Object} options - Checkbox options
 * @returns {HTMLElement} Checkbox element
 */
export function createNeonCheckbox(options) {
  const checkbox = new NeonCheckbox(options);
  return checkbox.render();
}

