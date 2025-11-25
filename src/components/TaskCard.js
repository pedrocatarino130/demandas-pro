/**
 * Componente TaskCard
 * Card de tarefa para exibição no dashboard
 */

import { formatTime, formatDate, getDaysOverdue, toDate } from '../utils/dateUtils.js';
import { applyIOSStyles } from './ios-cards.js';
import { createIOSCheckbox, applyIOSCheckboxStyles } from './ios-checkbox.js';

export class TaskCard {
  constructor(task, options = {}) {
    this.task = task;
    this.options = {
      showCheckbox: true,
      showModule: true,
      showPriority: true,
      showDuration: true,
      isCurrent: false,
      isOverdue: false,
      isCompleted: false,
      isPostponed: false,
      showActions: false, // Botões de editar/excluir
      ...options,
    };
  }

  render() {
    const card = document.createElement('div');
    card.className = 'task-card ios-card';
    
    // Aplicar estilos iOS
    applyIOSStyles();
    
    // Mapear prioridade para formato iOS
    const priorityMap = {
      'urgente': 'urgent',
      'alta': 'high',
      'media': 'medium',
      'média': 'medium',
      'baixa': 'low'
    };
    const iosPriority = priorityMap[(this.task.prioridade || 'media').toLowerCase()] || 'medium';
    card.setAttribute('data-priority', iosPriority);
    
    if (this.options.isCurrent) {
      card.classList.add('task-card-current');
    }
    if (this.options.isOverdue) {
      card.classList.add('task-card-overdue');
    }
    if (this.options.isCompleted) {
      card.classList.add('task-card-completed');
    }
    if (this.options.isPostponed) {
      card.classList.add('task-card-postponed');
    }

    const taskTime = toDate(this.task.time);
    const timeStr = taskTime ? formatTime(taskTime) : '';
    const dateStr = taskTime ? formatDate(taskTime, 'dd/MM') : '';

    card.innerHTML = '';
    
    // Adicionar checkbox se necessário
    if (this.options.showCheckbox) {
      const checkboxWrapper = this.renderCheckbox();
      card.appendChild(checkboxWrapper);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-card-content';
    contentDiv.innerHTML = `
        <div class="task-card-header">
          <div class="task-card-time">
            ${timeStr ? `<span class="task-card-time-value">${timeStr}</span>` : ''}
            ${dateStr ? `<span class="task-card-time-date">${dateStr}</span>` : ''}
          </div>
          ${this.options.showPriority ? this.renderPriority() : ''}
        </div>
        <h3 class="task-card-title">${this.escapeHtml(this.task.titulo || this.task.nome || 'Sem título')}</h3>
        ${this.task.descricao ? `<p class="task-card-description">${this.escapeHtml(this.task.descricao)}</p>` : ''}
        <div class="task-card-footer">
          ${this.options.showModule ? this.renderModule() : ''}
          ${this.options.showDuration && this.task.duracao ? this.renderDuration() : ''}
          ${this.task.recurrence && this.task.recurrence.enabled ? this.renderRecurrenceBadge() : ''}
          ${this.options.isPostponed ? this.renderPostponedBadge() : ''}
          ${this.options.isOverdue ? this.renderOverdueBadge() : ''}
          ${this.options.showActions ? this.renderActions() : ''}
        </div>
      `;
    
    card.appendChild(contentDiv);

    return card;
  }

  renderCheckbox() {
    // Aplicar estilos iOS uma vez
    applyIOSCheckboxStyles();
    
    // Mapear prioridade
    const priorityMap = {
      'urgente': 'urgent',
      'alta': 'high',
      'media': 'medium',
      'média': 'medium',
      'baixa': 'low'
    };
    const priority = priorityMap[(this.task.prioridade || 'media').toLowerCase()] || 'medium';
    
    // Criar checkbox iOS
    const checkboxEl = createIOSCheckbox({
      id: `task-checkbox-${this.task.id || this.task.contador}`,
      label: 'Concluir tarefa',
      checked: this.task.completed || false,
      priority: priority,
      onChange: (checked) => {
        // O evento será tratado pelo listener no Home.js
        const event = new Event('change', { bubbles: true });
        const input = checkboxEl.querySelector('input');
        if (input) {
          input.dispatchEvent(event);
        }
      }
    });
    
    // Adicionar data-task-id ao input
    const input = checkboxEl.querySelector('input');
    if (input) {
      input.className = 'task-checkbox ios-checkbox-input';
      input.setAttribute('data-task-id', this.task.id || this.task.contador);
    }
    
    const wrapper = document.createElement('div');
    wrapper.className = 'task-card-checkbox';
    wrapper.appendChild(checkboxEl);
    
    return wrapper;
  }

  renderPriority() {
    const priority = (this.task.prioridade || 'media').toLowerCase();
    const priorityLabels = {
      urgente: 'Urgente',
      alta: 'Alta',
      media: 'Média',
      baixa: 'Baixa',
    };
    const priorityColors = {
      urgente: 'danger',
      alta: 'warning',
      media: 'secondary',
      baixa: 'muted',
    };

    return `
      <span class="task-card-priority badge badge-${priorityColors[priority] || 'secondary'}">
        ${priorityLabels[priority] || priority}
      </span>
    `;
  }

  renderModule() {
    const module = this.task.modulo || this.task.area || 'Geral';
    return `<span class="task-card-module">${this.escapeHtml(module)}</span>`;
  }

  renderDuration() {
    return `<span class="task-card-duration">⏱ ${this.task.duracao}</span>`;
  }

  renderRecurrenceBadge() {
    const recurrence = this.task.recurrence || {};
    const typeLabels = {
      daily: 'Diária',
      weekly: 'Semanal',
      monthly: 'Mensal',
      custom: `A cada ${recurrence.interval || 1} dia${(recurrence.interval || 1) > 1 ? 's' : ''}`
    };
    const label = typeLabels[recurrence.type] || 'Recorrente';
    return `
      <span class="task-card-recurrence-badge badge badge-info" title="Tarefa recorrente: ${label}">
        🔄 ${label}
      </span>
    `;
  }

  renderPostponedBadge() {
    const taskTime = toDate(this.task.time);
    if (!taskTime) return '';
    
    const now = new Date();
    const hoursDiff = Math.round((taskTime - now) / (1000 * 60 * 60));
    const daysDiff = Math.floor(hoursDiff / 24);
    
    let label = '';
    if (daysDiff > 0) {
      label = `Adiada ${daysDiff} dia${daysDiff > 1 ? 's' : ''}`;
    } else if (hoursDiff > 2) {
      label = `Adiada ${hoursDiff}h`;
    } else {
      label = 'Adiada';
    }
    
    return `
      <span class="task-card-postponed-badge badge badge-warning" title="Tarefa adiada para ${formatDate(taskTime, 'dd/MM/yyyy')} às ${formatTime(taskTime)}">
        ⏰ ${label}
      </span>
    `;
  }

  renderOverdueBadge() {
    const taskDate = toDate(this.task.time || this.task.deadline);
    const days = getDaysOverdue(taskDate);
    return `
      <span class="task-card-overdue-badge badge badge-danger">
        ${days} ${days === 1 ? 'dia' : 'dias'} atrasado
      </span>
    `;
  }

  renderActions() {
    const taskId = this.task.id || this.task.contador;
    return `
      <div class="task-card-actions">
        <button class="btn-icon-small" data-action="edit" data-task-id="${taskId}" title="Editar">✏️</button>
        <button class="btn-icon-small" data-action="delete" data-task-id="${taskId}" title="Excluir">🗑️</button>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

