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
