/**
 * Componente Checkbox Animado
 * Checkbox iOS-style com animações
 */

import { createIOSCheckbox, applyIOSCheckboxStyles } from './ios-checkbox.js';

export class Checkbox {
  constructor(options = {}) {
    this.options = {
      size: 24,
      color: 'primary',
      animated: true,
      useIOS: true, // Usar estilo iOS por padrão
      ...options,
    };
    
    // Aplicar estilos iOS uma vez
    if (this.options.useIOS) {
      applyIOSCheckboxStyles();
    }
  }

  render(checked = false, taskId = null, priority = 'medium') {
    // Se usar iOS, criar checkbox iOS
    if (this.options.useIOS) {
      const iosCheckbox = createIOSCheckbox({
        id: taskId ? `checkbox-${taskId}` : undefined,
        label: '',
        checked: checked,
        priority: priority,
        onChange: (isChecked) => {
          if (this.options.onChange) {
            this.options.onChange(isChecked, taskId);
          }
        }
      });
      
      // Adicionar data-task-id se fornecido
      if (taskId) {
        const input = iosCheckbox.querySelector('input');
        if (input) {
          input.setAttribute('data-task-id', taskId);
        }
      }
      
      return iosCheckbox;
    }
    
    // Fallback para checkbox tradicional
    const checkbox = document.createElement('label');
    checkbox.className = `checkbox-container checkbox-${this.options.color}`;
    checkbox.setAttribute('data-task-id', taskId || '');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'checkbox-input';
    input.checked = checked;
    if (taskId) {
      input.setAttribute('data-task-id', taskId);
    }

    const checkmark = document.createElement('span');
    checkmark.className = 'checkbox-checkmark';

    checkbox.appendChild(input);
    checkbox.appendChild(checkmark);

    if (this.options.animated) {
      input.addEventListener('change', (e) => {
        this.handleChange(e.target, checkbox);
      });
    }

    return checkbox;
  }

  handleChange(input, container) {
    if (input.checked) {
      container.classList.add('checkbox-checked');
      this.triggerConfetti(container);
    } else {
      container.classList.remove('checkbox-checked');
    }
  }

  triggerConfetti(container) {
    // Confetti simples com CSS (sem biblioteca externa)
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    container.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 1000);
  }
}

