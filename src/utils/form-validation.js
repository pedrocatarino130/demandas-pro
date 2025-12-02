/**
 * Helper de validação simples e reutilizável para formulários
 */

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isEmpty(value) {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    return false;
}

/**
 * Valida campos com base em regras declarativas
 * @param {Object} fields - valores dos campos
 * @param {Object} rules - regras por campo
 * @returns {{isValid: boolean, errors: Object}}
 */
export function validateForm(fields, rules) {
    const errors = {};

    Object.entries(rules || {}).forEach(([field, rule]) => {
        const value = fields[field];
        const required = Boolean(rule?.required);

        if (required && isEmpty(value)) {
            errors[field] = rule.message || 'Campo obrigatório';
            return;
        }

        if (rule?.pattern && !isEmpty(value) && !rule.pattern.test(String(value))) {
            errors[field] = rule.message || 'Valor inválido';
            return;
        }

        if (typeof rule?.validator === 'function') {
            const result = rule.validator(value, fields);
            if (result !== true) {
                errors[field] = typeof result === 'string' ? result : rule.message || 'Valor inválido';
            }
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Combina data + hora em um objeto Date
 */
export function combineDateAndTime(dateStr, timeStr) {
    if (!dateStr) return null;
    const base = new Date(dateStr);
    if (Number.isNaN(base.getTime())) return null;

    if (timeStr) {
        const [hours, minutes] = timeStr.split(':').map((v) => Number(v));
        base.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0);
    }

    return base;
}

/**
 * Verifica se data está muito no passado
 * @param {Date} date - data/hora alvo
 * @param {number} maxDaysPast - limite de dias no passado
 */
export function isTooFarInPast(date, maxDaysPast = 30) {
    if (!date || !(date instanceof Date)) return false;
    const threshold = Date.now() - maxDaysPast * ONE_DAY_MS;
    return date.getTime() < threshold;
}

/**
 * Retorna primeira mensagem de erro disponível
 */
export function getFirstError(errors = {}) {
    const values = Object.values(errors);
    return values.length ? values[0] : null;
}
