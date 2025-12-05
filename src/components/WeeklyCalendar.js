/**
 * WeeklyCalendar Component
 * Exibe um cronograma mensal com navegação e seleção de dias
 */

import {
    addMonths,
    subMonths,
    getMonthName,
    getDayNameShort,
    getDaysArrayForMonth,
    isSameDay,
    isToday,
    formatDateISO
} from '../utils/dateUtils.js';

export class WeeklyCalendar {
    constructor(options = {}) {
        this.currentDate = options.initialDate || new Date();
        this.selectedDate = options.selectedDate || null;
        this.onDateSelect = options.onDateSelect || (() => {});
        this.tasksMap = options.tasksMap || {}; // { 'YYYY-MM-DD': count }
    }

    /**
     * Renderiza o componente completo
     */
    render() {
        const container = document.createElement('div');
        container.className = 'weekly-calendar';
        container.innerHTML = `
      <div class="weekly-calendar-header">
        <button class="weekly-calendar-nav-btn" data-action="prev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h3 class="weekly-calendar-month-title">${this.getMonthYearText()}</h3>
        <button class="weekly-calendar-nav-btn" data-action="next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      <div class="weekly-calendar-days-container">
        <div class="weekly-calendar-days" id="weekly-calendar-days">
          ${this.renderDays()}
        </div>
      </div>
    `;

        this.attachEventListeners(container);
        return container;
    }

    /**
     * Retorna texto do mês/ano (ex: "dezembro de 2025")
     */
    getMonthYearText() {
        const month = getMonthName(this.currentDate).toLowerCase();
        const year = this.currentDate.getFullYear();
        return `${month} de ${year}`;
    }

    /**
     * Renderiza os cards de dias do mês
     */
    renderDays() {
        const days = getDaysArrayForMonth(this.currentDate);

        return days.map((day) => {
            const dayNum = day.getDate();
            const dayName = getDayNameShort(day);
            const dateKey = formatDateISO(day);
            const isSelected = this.selectedDate ? isSameDay(day, this.selectedDate) : false;
            const isTodayDay = isToday(day);
            const taskCount = this.tasksMap[dateKey] || 0;

            const classes = [
                'weekly-calendar-day-card',
                isSelected ? 'active' : '',
                isTodayDay ? 'today' : ''
            ].filter(Boolean).join(' ');

            return `
        <div class="${classes}" data-date="${dateKey}">
          <div class="weekly-calendar-day-name">${dayName}</div>
          <div class="weekly-calendar-day-number">${dayNum}</div>
          ${taskCount > 0 ? `<div class="weekly-calendar-day-badge">${taskCount}</div>` : ''}
        </div>
      `;
        }).join('');
    }

    /**
     * Adiciona event listeners
     */
    attachEventListeners(container) {
        // Navegação de mês
        const prevBtn = container.querySelector('[data-action="prev"]');
        const nextBtn = container.querySelector('[data-action="next"]');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate = subMonths(this.currentDate, 1);
                this.updateView(container);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate = addMonths(this.currentDate, 1);
                this.updateView(container);
            });
        }

        // Seleção de dia
        const daysContainer = container.querySelector('#weekly-calendar-days');
        if (daysContainer) {
            daysContainer.addEventListener('click', (e) => {
                const dayCard = e.target.closest('.weekly-calendar-day-card');
                if (dayCard) {
                    const dateStr = dayCard.getAttribute('data-date');
                    if (dateStr) {
                        this.selectedDate = new Date(dateStr + 'T00:00:00');
                        this.updateView(container);
                        this.onDateSelect(this.selectedDate, dateStr);
                    }
                }
            });
        }
    }

    /**
     * Atualiza a view sem recriar o DOM completo
     */
    updateView(container) {
        // Atualizar título do mês
        const title = container.querySelector('.weekly-calendar-month-title');
        if (title) {
            title.textContent = this.getMonthYearText();
        }

        // Atualizar dias
        const daysContainer = container.querySelector('#weekly-calendar-days');
        if (daysContainer) {
            daysContainer.innerHTML = this.renderDays();
        }
    }

    /**
     * Atualiza o mapa de tarefas e re-renderiza
     */
    updateTasksMap(tasksMap, container) {
        this.tasksMap = tasksMap;
        if (container) {
            this.updateView(container);
        }
    }

    /**
     * Define a data selecionada programaticamente
     */
    setSelectedDate(date, container) {
        this.selectedDate = date;
        this.currentDate = date; // Ir para o mês da data selecionada
        if (container) {
            this.updateView(container);
        }
    }
}

/**
 * Factory function para criar instância
 */
export function createWeeklyCalendar(options) {
    return new WeeklyCalendar(options);
}