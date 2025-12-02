/**
 * ComplexSearch Component
 * Componente de busca com efeitos neon e bordas animadas
 */

export class ComplexSearch {
  constructor(options = {}) {
    this.value = options.value || '';
    this.placeholder = options.placeholder || 'Buscar tarefas...';
    this.onChange = options.onChange || (() => {});
    this.id = options.id || 'complex-search';
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'complex-search-wrapper';
    wrapper.id = this.id;

    // Glow effect layer
    const glowDiv = document.createElement('div');
    glowDiv.className = 'complex-search-glow';
    const glowGradient = document.createElement('div');
    glowGradient.className = 'complex-search-glow-gradient';
    glowDiv.appendChild(glowGradient);

    // Outer border animation
    const borderOuter = document.createElement('div');
    borderOuter.className = 'complex-search-border-outer';
    const borderOuterGradient = document.createElement('div');
    borderOuterGradient.className = 'complex-search-border-outer-gradient';
    const borderOuterBg = document.createElement('div');
    borderOuterBg.className = 'complex-search-border-inner-bg';
    borderOuter.appendChild(borderOuterGradient);
    borderOuter.appendChild(borderOuterBg);

    // Inner border animation
    const borderInner = document.createElement('div');
    borderInner.className = 'complex-search-border-inner';
    const borderInnerGradient = document.createElement('div');
    borderInnerGradient.className = 'complex-search-border-inner-gradient';
    const borderInnerBg = document.createElement('div');
    borderInnerBg.className = 'complex-search-input-bg';
    borderInner.appendChild(borderInnerGradient);
    borderInner.appendChild(borderInnerBg);

    // Input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'complex-search-input-container';

    // Search icon (usando SVG inline)
    const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    searchIcon.setAttribute('class', 'complex-search-icon');
    searchIcon.setAttribute('width', '20');
    searchIcon.setAttribute('height', '20');
    searchIcon.setAttribute('viewBox', '0 0 24 24');
    searchIcon.setAttribute('fill', 'none');
    searchIcon.setAttribute('stroke', 'currentColor');
    searchIcon.setAttribute('stroke-width', '2');
    const searchPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    searchPath.setAttribute('d', 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z');
    searchIcon.appendChild(searchPath);

    // Input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'complex-search-input';
    input.placeholder = this.placeholder;
    input.value = this.value;
    input.setAttribute('aria-label', 'Buscar tarefas');

    // Filter button
    const filterBtn = document.createElement('div');
    filterBtn.className = 'complex-search-filter-btn';
    filterBtn.setAttribute('role', 'button');
    filterBtn.setAttribute('tabindex', '0');
    filterBtn.setAttribute('aria-label', 'Filtros');

    const filterBorder = document.createElement('div');
    filterBorder.className = 'complex-search-filter-btn-border';
    const filterBorderGradient = document.createElement('div');
    filterBorderGradient.className = 'complex-search-filter-btn-border-gradient';
    filterBorder.appendChild(filterBorderGradient);

    const filterIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    filterIcon.setAttribute('class', 'complex-search-filter-icon');
    filterIcon.setAttribute('width', '20');
    filterIcon.setAttribute('height', '20');
    filterIcon.setAttribute('viewBox', '0 0 24 24');
    filterIcon.setAttribute('fill', 'none');
    filterIcon.setAttribute('stroke', 'currentColor');
    filterIcon.setAttribute('stroke-width', '2');
    const filterPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    filterPath.setAttribute('d', 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z');
    filterIcon.appendChild(filterPath);

    filterBtn.appendChild(filterBorder);
    filterBtn.appendChild(filterIcon);

    // Decorative element
    const decorative = document.createElement('div');
    decorative.className = 'complex-search-decorative';

    // Assemble structure
    inputContainer.appendChild(searchIcon);
    inputContainer.appendChild(input);
    inputContainer.appendChild(filterBtn);

    wrapper.appendChild(glowDiv);
    wrapper.appendChild(borderOuter);
    wrapper.appendChild(borderInner);
    wrapper.appendChild(inputContainer);
    wrapper.appendChild(decorative);

    // Event listeners
    input.addEventListener('input', (e) => {
      this.value = e.target.value;
      this.onChange(this.value);
    });

    input.addEventListener('focus', () => {
      wrapper.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      wrapper.classList.remove('focused');
    });

    // Filter button click handler
    filterBtn.addEventListener('click', () => {
      const event = new CustomEvent('filterclick', { bubbles: true });
      wrapper.dispatchEvent(event);
    });

    filterBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        filterBtn.click();
      }
    });

    // Store reference to input for external access
    this._input = input;
    this._wrapper = wrapper;

    return wrapper;
  }

  getValue() {
    return this._input ? this._input.value : this.value;
  }

  setValue(value) {
    this.value = value;
    if (this._input) {
      this._input.value = value;
    }
  }

  focus() {
    if (this._input) {
      this._input.focus();
    }
  }

  blur() {
    if (this._input) {
      this._input.blur();
    }
  }
}

