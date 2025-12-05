/**
 * Utilitários para manipulação de datas
 * Implementação usando apenas APIs nativas do JavaScript
 */

/**
 * Adiciona horas a uma data
 */
export function addHoursToDate(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}

/**
 * Verifica se uma data está no futuro
 */
export function isFuture(date) {
    return date > new Date();
}

/**
 * Verifica se uma data está no passado
 */
export function isPast(date) {
    return date < new Date();
}

/**
 * Formata data para exibição
 */
export function formatDate(date, formatStr = 'dd/MM/yyyy') {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? toDate(date) : date;
    if (!dateObj) return '';

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return formatStr
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', year);
}

/**
 * Formata hora para exibição
 */
export function formatTime(date, formatStr = 'HH:mm') {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? toDate(date) : date;
    if (!dateObj) return '';

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return formatStr
        .replace('HH', hours)
        .replace('mm', minutes);
}

/**
 * Formata data e hora
 */
export function formatDateTime(date, dateFormat = 'dd/MM/yyyy', timeFormat = 'HH:mm') {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? toDate(date) : date;
    if (!dateObj) return '';
    return `${formatDate(dateObj, dateFormat)} às ${formatTime(dateObj, timeFormat)}`;
}

/**
 * Calcula dias de atraso
 */
export function getDaysOverdue(date) {
    if (!date) return 0;
    const dateObj = typeof date === 'string' ? toDate(date) : date;
    if (!dateObj) return 0;

    const now = new Date();
    if (dateObj > now) return 0;

    const diffTime = now - dateObj;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Verifica se é hoje
 */
export function isToday(date) {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? toDate(date) : date;
    if (!dateObj) return false;

    const today = new Date();
    return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
    );
}

/**
 * Retorna data de hoje no formato ISO (YYYY-MM-DD)
 */
export function getTodayISO() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Formata duração em milissegundos para HH:MM:SS
 * @param {number} ms - Duração em milissegundos
 * @returns {string} Duração formatada
 */
export function formatDuration(ms) {
    if (!Number.isFinite(ms)) return '00:00:00';

    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
}

/**
 * Cria objeto Date a partir de string ISO ou Date
 */
export function toDate(date) {
    if (!date) return null;
    if (date instanceof Date) return date;
    if (typeof date === 'string') {
        // Se for apenas data (YYYY-MM-DD), adicionar hora
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return new Date(date + 'T00:00:00');
        }
        // Tentar parseISO manualmente
        try {
            return new Date(date);
        } catch (e) {
            return null;
        }
    }
    return null;
}

/**
 * Retorna o início do mês (dia 1, 00:00:00)
 */
export function startOfMonth(date) {
    const d = toDate(date) || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Retorna o fim do mês (último dia, 23:59:59)
 */
export function endOfMonth(date) {
    const d = toDate(date) || new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Retorna o número de dias no mês
 */
export function getDaysInMonth(date) {
    const d = toDate(date) || new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

/**
 * Adiciona meses a uma data
 */
export function addMonths(date, months) {
    const d = toDate(date) || new Date();
    const result = new Date(d);
    result.setMonth(result.getMonth() + months);
    return result;
}

/**
 * Subtrai meses de uma data
 */
export function subMonths(date, months) {
    return addMonths(date, -months);
}

/**
 * Retorna o nome do mês em português
 */
export function getMonthName(date) {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const d = toDate(date) || new Date();
    return months[d.getMonth()];
}

/**
 * Retorna o nome abreviado do dia da semana
 */
export function getDayNameShort(date) {
    const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    const d = toDate(date) || new Date();
    return days[d.getDay()];
}

/**
 * Verifica se duas datas são do mesmo dia
 */
export function isSameDay(date1, date2) {
    if (!date1 || !date2) return false;
    const d1 = toDate(date1);
    const d2 = toDate(date2);
    if (!d1 || !d2) return false;

    return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    );
}

/**
 * Formata data para formato ISO sem hora (YYYY-MM-DD)
 */
export function formatDateISO(date) {
    const d = toDate(date) || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Gera array de dias do mês
 */
export function getDaysArrayForMonth(date) {
    const d = toDate(date) || new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const daysInMonth = getDaysInMonth(d);

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
    }

    return days;
}