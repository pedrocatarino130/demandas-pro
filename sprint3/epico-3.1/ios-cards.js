/**
 * TASK-018: Cards Estilo iOS 17
 * 
 * Descrição: Refatorar visual dos cards de rotina
 * Estimativa: M (6h)
 * Dependências: TASK-010 (Design System Base)
 * 
 * Critérios de Aceitação:
 * - Bordas arredondadas (radius: 16px)
 * - Sombras suaves (0 4px 20px rgba)
 * - Tipografia SF Pro ou Inter
 * - Espaçamento generoso (padding: 20px)
 * - Cores saturadas para prioridades
 */

/**
 * Cria um card estilo iOS 17
 * @param {Object} config - Configuração do card
 * @param {string} config.title - Título do card
 * @param {string} config.content - Conteúdo do card
 * @param {string} config.priority - Prioridade (urgent, high, medium, low)
 * @param {HTMLElement} config.container - Container onde inserir o card
 */
export function createIOSCard(config) {
    const { title, content, priority = 'medium', container } = config;
    
    const card = document.createElement('div');
    card.className = 'ios-card';
    card.setAttribute('data-priority', priority);
    
    card.innerHTML = `
        <div class="ios-card-header">
            <h3 class="ios-card-title">${title}</h3>
            ${priority ? `<span class="ios-card-priority priority-${priority}">${priority}</span>` : ''}
        </div>
        <div class="ios-card-content">
            ${content}
        </div>
    `;
    
    if (container) {
        container.appendChild(card);
    }
    
    return card;
}

/**
 * Aplica estilos iOS 17 aos cards existentes
 */
export function applyIOSStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ios-card {
            background: var(--surface, white);
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            padding: 20px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            margin-bottom: 16px;
        }
        
        .ios-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        
        .ios-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .ios-card-title {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary, #0f172a);
            margin: 0;
        }
        
        .ios-card-content {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
            font-size: 15px;
            line-height: 1.5;
            color: var(--text-secondary, #64748b);
        }
        
        .ios-card-priority {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .ios-card[data-priority="urgent"] .priority-urgent {
            background: #dc2626;
            color: white;
        }
        
        .ios-card[data-priority="high"] .priority-high {
            background: #f59e0b;
            color: white;
        }
        
        .ios-card[data-priority="medium"] .priority-medium {
            background: #64748b;
            color: white;
        }
        
        .ios-card[data-priority="low"] .priority-low {
            background: #94a3b8;
            color: white;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Transforma cards existentes em estilo iOS
 * @param {string} selector - Seletor CSS dos cards a transformar
 */
export function transformExistingCards(selector = '.task-card, .card') {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
        card.classList.add('ios-card');
        // Aplicar classes iOS aos elementos internos
    });
    
    applyIOSStyles();
}

