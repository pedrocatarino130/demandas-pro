/**
 * Utilitários para a view Home
 * Funções auxiliares para performance, validação e lógica de negócio
 */

/**
 * Debounce - adia a execução de uma função
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle - limita a execução de uma função
 * @param {Function} func - Função a ser executada
 * @param {number} limit - Intervalo mínimo em ms
 * @returns {Function} Função com throttle
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Memoização simples baseada em argumentos
 * @param {Function} fn - Função a ser memoizada
 * @returns {Function} Função memoizada
 */
export function memoize(fn) {
    const cache = new Map();
    return function memoizedFunction(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

/**
 * Valida dados do store
 * @param {*} data - Dados a validar
 * @param {string} type - Tipo esperado ('array', 'object', 'number')
 * @returns {boolean} True se válido
 */
export function validateStoreData(data, type = 'array') {
    if (type === 'array') {
        return Array.isArray(data);
    }
    if (type === 'object') {
        return data !== null && typeof data === 'object' && !Array.isArray(data);
    }
    if (type === 'number') {
        return typeof data === 'number' && !isNaN(data);
    }
    return data != null;
}

/**
 * Sanitiza string para prevenir XSS
 * @param {string} str - String a sanitizar
 * @returns {string} String sanitizada
 */
export function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Compara dois arrays de tarefas para detectar mudanças
 * @param {Array} oldTasks - Array antigo
 * @param {Array} newTasks - Array novo
 * @returns {Object} Objeto com informações sobre mudanças
 */
export function compareTaskArrays(oldTasks, newTasks) {
    if (!Array.isArray(oldTasks) || !Array.isArray(newTasks)) {
        return { changed: true, added: [], removed: [], modified: [] };
    }

    const oldIds = new Set(oldTasks.map(t => String(t?.id || t?.contador || '')));
    const newIds = new Set(newTasks.map(t => String(t?.id || t?.contador || '')));

    const added = newTasks.filter(t => {
        const id = String(t?.id || t?.contador || '');
        return !oldIds.has(id);
    });

    const removed = oldTasks.filter(t => {
        const id = String(t?.id || t?.contador || '');
        return !newIds.has(id);
    });

    const modified = newTasks.filter(newTask => {
        const id = String(newTask?.id || newTask?.contador || '');
        if (!oldIds.has(id)) return false;
        const oldTask = oldTasks.find(t => String(t?.id || t?.contador || '') === id);
        return oldTask && JSON.stringify(oldTask) !== JSON.stringify(newTask);
    });

    return {
        changed: added.length > 0 || removed.length > 0 || modified.length > 0,
        added,
        removed,
        modified
    };
}

/**
 * Gera um hash simples de um objeto
 * @param {*} obj - Objeto a hashear
 * @returns {string} Hash do objeto
 */
export function hashObject(obj) {
    return JSON.stringify(obj);
}

