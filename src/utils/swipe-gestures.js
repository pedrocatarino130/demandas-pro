/**
 * TASK-022: Swipe Gestures Mobile
 * 
 * Descrição: Implementar gestos touch para ações rápidas
 * Estimativa: M (8h)
 * Dependências: Nenhuma
 * 
 * Critérios de Aceitação:
 * - Swipe left: concluir tarefa
 * - Swipe right: adiar 1 dia
 * - Visual feedback durante swipe
 * - Threshold mínimo (evitar acidentes)
 * - Fallback para desktop (hover buttons)
 */

/**
 * Configuração dos gestos
 */
const SWIPE_CONFIG = {
    THRESHOLD: 50, // Mínimo de pixels para considerar swipe
    RESTRAINT: 100, // Máximo de movimento vertical permitido
    ALLOWED_TIME: 500, // Tempo máximo para completar swipe (ms)
    ANIMATION_DURATION: 300, // Duração da animação de feedback
};

/**
 * Cria um detector de swipe em um elemento
 * @param {HTMLElement} element - Elemento onde aplicar os gestos
 * @param {Object} config - Configuração de callbacks
 * @param {Function} config.onSwipeLeft - Callback ao fazer swipe left (concluir)
 * @param {Function} config.onSwipeRight - Callback ao fazer swipe right (adiar)
 */
export function setupSwipeGestures(element, config = {}) {
    const { onSwipeLeft, onSwipeRight } = config;
    
    // Evitar aplicar múltiplas vezes
    if (element.classList.contains('swipe-enabled')) {
        return;
    }
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isDragging = false;
    let currentX = 0;
    
    // Criar indicadores visuais
    const leftAction = createActionIndicator('check', 'Concluir');
    const rightAction = createActionIndicator('clock', 'Adiar 1 dia');
    element.appendChild(leftAction);
    element.appendChild(rightAction);
    
    // Estilo do elemento para permitir swipe
    element.classList.add('swipe-enabled');
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.style.transition = `transform ${SWIPE_CONFIG.ANIMATION_DURATION}ms ease-out`;
    
    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Mouse events para desktop (drag simulation)
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseEnd);
    element.addEventListener('mouseleave', handleMouseEnd);
    
    function handleTouchStart(e) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        isDragging = true;
        element.style.transition = 'none';
    }
    
    function handleMouseDown(e) {
        if (e.button !== 0) return; // Apenas botão esquerdo
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        touchStartTime = Date.now();
        isDragging = true;
        element.style.transition = 'none';
        e.preventDefault();
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        // Verificar se é movimento horizontal predominante
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault(); // Prevenir scroll
            updateSwipeFeedback(deltaX);
        }
    }
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - touchStartX;
        const deltaY = e.clientY - touchStartY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            updateSwipeFeedback(deltaX);
        }
    }
    
    function handleTouchEnd(e) {
        if (!isDragging) return;
        
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const deltaTime = Date.now() - touchStartTime;
        
        processSwipe(deltaX, deltaY, deltaTime);
        resetSwipe();
    }
    
    function handleMouseEnd(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - touchStartX;
        const deltaY = e.clientY - touchStartY;
        const deltaTime = Date.now() - touchStartTime;
        
        processSwipe(deltaX, deltaY, deltaTime);
        resetSwipe();
    }
    
    function updateSwipeFeedback(deltaX) {
        currentX = deltaX;
        
        // Limitar movimento
        const maxDelta = window.innerWidth * 0.3; // 30% da tela
        const clampedX = Math.max(-maxDelta, Math.min(maxDelta, deltaX));
        
        element.style.transform = `translateX(${clampedX}px)`;
        
        // Mostrar indicadores
        if (clampedX > SWIPE_CONFIG.THRESHOLD) {
            // Swipe right (adiar)
            rightAction.classList.add('active');
            leftAction.classList.remove('active');
            element.style.backgroundColor = 'rgba(245, 158, 11, 0.1)'; // Amber
        } else if (clampedX < -SWIPE_CONFIG.THRESHOLD) {
            // Swipe left (concluir)
            leftAction.classList.add('active');
            rightAction.classList.remove('active');
            element.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'; // Green
        } else {
            // Dentro do threshold
            leftAction.classList.remove('active');
            rightAction.classList.remove('active');
            element.style.backgroundColor = '';
        }
    }
    
    function processSwipe(deltaX, deltaY, deltaTime) {
        // Verificar se é um swipe válido
        if (deltaTime > SWIPE_CONFIG.ALLOWED_TIME) {
            return; // Muito lento
        }
        
        if (Math.abs(deltaY) > SWIPE_CONFIG.RESTRAINT) {
            return; // Muito movimento vertical (provavelmente scroll)
        }
        
        if (Math.abs(deltaX) < SWIPE_CONFIG.THRESHOLD) {
            return; // Movimento insuficiente
        }
        
        // Executar ação
        if (deltaX < -SWIPE_CONFIG.THRESHOLD && onSwipeLeft) {
            // Swipe left = concluir
            onSwipeLeft(element);
        } else if (deltaX > SWIPE_CONFIG.THRESHOLD && onSwipeRight) {
            // Swipe right = adiar
            onSwipeRight(element);
        }
    }
    
    function resetSwipe() {
        isDragging = false;
        currentX = 0;
        element.style.transition = `transform ${SWIPE_CONFIG.ANIMATION_DURATION}ms ease-out`;
        element.style.transform = '';
        element.style.backgroundColor = '';
        leftAction.classList.remove('active');
        rightAction.classList.remove('active');
    }
    
    // Adicionar estilos
    applySwipeStyles();
}

/**
 * Cria indicador visual de ação (check ou clock)
 */
function createActionIndicator(type, label) {
    const indicator = document.createElement('div');
    indicator.className = `swipe-action swipe-action-${type === 'check' ? 'left' : 'right'}`;
    
    const icon = type === 'check' ? '✓' : '⏰';
    indicator.innerHTML = `
        <span class="swipe-icon">${icon}</span>
        <span class="swipe-label">${label}</span>
    `;
    
    return indicator;
}

/**
 * Aplica estilos para swipe gestures
 */
function applySwipeStyles() {
    const styleId = 'swipe-gestures-styles';
    if (document.getElementById(styleId)) {
        return; // Já aplicado
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .swipe-enabled {
            cursor: grab;
            user-select: none;
        }
        
        .swipe-enabled:active {
            cursor: grabbing;
        }
        
        .swipe-action {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            z-index: 1;
        }
        
        .swipe-action-left {
            left: 20px;
            color: #10b981;
        }
        
        .swipe-action-right {
            right: 20px;
            color: #f59e0b;
        }
        
        .swipe-action.active {
            opacity: 1;
        }
        
        .swipe-icon {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 4px;
        }
        
        .swipe-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        /* Desktop fallback: botões hover */
        @media (hover: hover) and (pointer: fine) {
            .swipe-enabled:hover .swipe-action {
                opacity: 0.3;
            }
            
            .swipe-enabled:hover .swipe-action:hover {
                opacity: 1;
                cursor: pointer;
                pointer-events: all;
            }
        }
        
        /* Touch devices: área maior */
        @media (hover: none) and (pointer: coarse) {
            .swipe-enabled {
                touch-action: pan-y;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Aplica swipe gestures a múltiplos elementos
 * @param {string} selector - Seletor CSS dos elementos
 * @param {Object} config - Configuração de callbacks
 */
export function setupSwipeGesturesMultiple(selector, config = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        setupSwipeGestures(element, config);
    });
}

/**
 * Função auxiliar para concluir tarefa (swipe left)
 */
export function createCompleteTaskHandler(taskId, onComplete) {
    return (element) => {
        // Animação de conclusão
        element.style.transform = 'translateX(-100%)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (onComplete) {
                onComplete(taskId);
            }
        }, SWIPE_CONFIG.ANIMATION_DURATION);
    };
}

/**
 * Função auxiliar para adiar tarefa (swipe right)
 */
export function createPostponeTaskHandler(taskId, onPostpone) {
    return (element) => {
        // Animação de adiar
        element.style.transform = 'translateX(100%)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (onPostpone) {
                onPostpone(taskId, 1); // Adiar 1 dia
            }
            
            // Resetar visualmente
            element.style.transform = '';
            element.style.opacity = '1';
        }, SWIPE_CONFIG.ANIMATION_DURATION * 2);
    };
}

