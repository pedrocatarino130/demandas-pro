/**
 * TASK-019: Checkbox Animado iOS-Style
 * 
 * Descrição: Checkbox circular com animação de check
 * Estimativa: P (4h)
 * Dependências: TASK-018 (Cards Estilo iOS 17)
 * 
 * Critérios de Aceitação:
 * - Círculo → checkmark animado
 * - Bounce effect ao marcar
 * - Cores baseadas em prioridade
 * - Haptic feedback (se suportado)
 * - Accessibility: label apropriado
 */

/**
 * Cria um checkbox estilo iOS
 * @param {Object} config - Configuração do checkbox
 * @param {string} config.id - ID único
 * @param {string} config.label - Label do checkbox
 * @param {boolean} config.checked - Estado inicial
 * @param {string} config.priority - Prioridade para cor
 * @param {Function} config.onChange - Callback ao mudar estado
 */
export function createIOSCheckbox(config) {
    const { id, label, checked = false, priority = 'medium', onChange } = config;
    
    const checkboxId = id || `ios-checkbox-${Date.now()}-${Math.random()}`;
    
    const container = document.createElement('div');
    container.className = 'ios-checkbox-container';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked;
    checkbox.className = 'ios-checkbox-input';
    checkbox.setAttribute('aria-label', label || 'Checkbox');
    
    const labelEl = document.createElement('label');
    labelEl.htmlFor = checkboxId;
    labelEl.className = `ios-checkbox-label priority-${priority}`;
    
    // SVG do checkmark
    labelEl.innerHTML = `
        <svg class="ios-checkbox-circle" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg class="ios-checkmark" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2.5" 
                  stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    if (label) {
        const labelText = document.createElement('span');
        labelText.className = 'ios-checkbox-text';
        labelText.textContent = label;
        container.appendChild(labelText);
    }
    
    container.appendChild(checkbox);
    container.appendChild(labelEl);
    
    // Event listener
    checkbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        animateCheckbox(labelEl, isChecked, priority);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        if (onChange) {
            onChange(isChecked);
        }
    });
    
    // Aplicar estado inicial
    if (checked) {
        labelEl.classList.add('checked');
    }
    
    return container;
}

/**
 * Anima o checkbox ao mudar de estado
 * @param {HTMLElement} labelEl - Elemento label do checkbox
 * @param {boolean} isChecked - Novo estado
 * @param {string} priority - Prioridade para cor
 */
function animateCheckbox(labelEl, isChecked, priority) {
    if (isChecked) {
        labelEl.classList.add('checked');
        
        // Bounce animation
        labelEl.style.transform = 'scale(1.2)';
        setTimeout(() => {
            labelEl.style.transform = 'scale(1)';
        }, 150);
    } else {
        labelEl.classList.remove('checked');
    }
}

/**
 * Aplica estilos iOS aos checkboxes
 */
export function applyIOSCheckboxStyles() {
    // Verificar se já foi aplicado
    if (document.getElementById('ios-checkbox-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'ios-checkbox-styles';
    style.textContent = `
        .ios-checkbox-container {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
        }
        
        .ios-checkbox-input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .ios-checkbox-label {
            position: relative;
            width: 24px;
            height: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ios-checkbox-circle {
            position: absolute;
            width: 100%;
            height: 100%;
            color: #d1d5db;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ios-checkmark {
            position: absolute;
            width: 16px;
            height: 16px;
            color: white;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ios-checkbox-label.checked .ios-checkbox-circle {
            color: var(--accent, #007AFF);
            fill: var(--accent, #007AFF);
        }
        
        .ios-checkbox-label.checked .ios-checkmark {
            opacity: 1;
            transform: scale(1);
            animation: checkmarkBounce 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Cores por prioridade */
        .ios-checkbox-label.priority-urgent.checked .ios-checkbox-circle {
            color: #dc2626;
            fill: #dc2626;
        }
        
        .ios-checkbox-label.priority-high.checked .ios-checkbox-circle {
            color: #f59e0b;
            fill: #f59e0b;
        }
        
        .ios-checkbox-label.priority-medium.checked .ios-checkbox-circle {
            color: #64748b;
            fill: #64748b;
        }
        
        .ios-checkbox-label.priority-low.checked .ios-checkbox-circle {
            color: #94a3b8;
            fill: #94a3b8;
        }
        
        .ios-checkbox-text {
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 15px;
            color: var(--text-primary, #0f172a);
            user-select: none;
        }
        
        @keyframes checkmarkBounce {
            0% {
                transform: scale(0);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
        
        /* Hover effect */
        .ios-checkbox-label:hover .ios-checkbox-circle {
            transform: scale(1.1);
        }
        
        .ios-checkbox-label:active {
            transform: scale(0.95);
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Transforma checkboxes existentes em estilo iOS
 * @param {string} selector - Seletor CSS dos checkboxes a transformar
 */
export function transformExistingCheckboxes(selector = 'input[type="checkbox"].task-checkbox') {
    const checkboxes = document.querySelectorAll(selector);
    
    checkboxes.forEach((checkbox) => {
        if (checkbox.classList.contains('ios-checkbox-input')) {
            return; // Já é um iOS checkbox
        }
        
        // Criar wrapper iOS
        const container = document.createElement('div');
        container.className = 'ios-checkbox-container';
        
        const labelEl = document.createElement('label');
        labelEl.htmlFor = checkbox.id || `ios-checkbox-${Date.now()}-${Math.random()}`;
        labelEl.className = `ios-checkbox-label priority-${checkbox.dataset.priority || 'medium'}`;
        
        if (checkbox.checked) {
            labelEl.classList.add('checked');
        }
        
        // SVG do checkmark
        labelEl.innerHTML = `
            <svg class="ios-checkbox-circle" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg class="ios-checkmark" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2.5" 
                      stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        // Substituir checkbox original
        checkbox.classList.add('ios-checkbox-input');
        checkbox.style.position = 'absolute';
        checkbox.style.opacity = '0';
        checkbox.style.width = '0';
        checkbox.style.height = '0';
        
        container.appendChild(checkbox);
        container.appendChild(labelEl);
        
        // Substituir no DOM
        if (checkbox.parentNode) {
            checkbox.parentNode.insertBefore(container, checkbox);
            checkbox.parentNode.removeChild(checkbox);
            container.appendChild(checkbox);
        }
        
        // Event listener
        checkbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            if (isChecked) {
                labelEl.classList.add('checked');
                labelEl.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    labelEl.style.transform = 'scale(1)';
                }, 150);
            } else {
                labelEl.classList.remove('checked');
            }
        });
    });
    
    applyIOSCheckboxStyles();
}

