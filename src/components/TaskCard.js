/**
 * Componente TaskCard
 * Card de tarefa para exibição no dashboard - Cyberpunk Design
 */

import {
    formatTime,
    formatDate,
    getDaysOverdue,
    toDate
} from '../utils/dateUtils.js';
import { createNeonCheckbox } from './NeonCheckbox.js';

export class TaskCard {
    constructor(task, options = {}) {
        this.task = task;
        this.options = {
            showCheckbox: true,
            showPriority: true,
            showActions: true, // Botões de editar/excluir no hover
            isCurrent: false,
            isOverdue: false,
            isCompleted: false,
            isPostponed: false,
            onToggleStatus: null,
            onEdit: null,
            onDelete: null,
            onInjectToHome: null, // Callback para injetar tarefa no Home
            ...options,
        };
    }

    render() {
        const card = document.createElement('div');
        card.className = 'task-card';

        // Status classes
        if (this.options.isCurrent) {
            card.classList.add('task-card-current');
        }
        if (this.options.isOverdue) {
            card.classList.add('task-card-overdue');
        }
        if (this.options.isCompleted || this.task.completed) {
            card.classList.add('task-card-completed', 'done');
        }
        if (this.options.isPostponed) {
            card.classList.add('task-card-postponed');
        }

        const isDone = this.options.isCompleted || this.task.completed;

        // Top Graphic Area
        const topArea = this.renderTopArea(isDone);
        card.appendChild(topArea);

        // Content Area
        const contentArea = this.renderContentArea(isDone);
        card.appendChild(contentArea);

        return card;
    }

    renderTopArea(isDone) {
        const topArea = document.createElement('div');
        topArea.className = `task-card-top ${isDone ? 'done' : ''}`;

        // Priority Badge (Top Right)
        if (this.options.showPriority) {
            const priorityBadge = this.renderPriorityBadge();
            topArea.appendChild(priorityBadge);
        }

        // Icon
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'task-card-icon-wrapper';
        
        if (isDone) {
            iconWrapper.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 13l4 4L19 7"></path>
                </svg>
            `;
        } else {
            iconWrapper.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
            `;
        }
        
        topArea.appendChild(iconWrapper);

        return topArea;
    }

    renderPriorityBadge() {
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'task-card-priority-badge';

        const priority = (this.task.prioridade || 'media').toLowerCase();
        const priorityMap = {
            'urgente': 'high',
            'alta': 'high',
            'media': 'medium',
            'média': 'medium',
            'baixa': 'low'
        };
        const priorityClass = priorityMap[priority] || 'medium';

        const priorityLabels = {
            'urgente': 'Alta',
            'alta': 'Alta',
            'media': 'Média',
            'média': 'Média',
            'baixa': 'Baixa'
        };
        const label = priorityLabels[priority] || 'Média';

        const badge = document.createElement('span');
        badge.className = `priority-badge ${priorityClass}`;
        badge.textContent = label;

        badgeContainer.appendChild(badge);
        return badgeContainer;
    }

    renderContentArea(isDone) {
        const contentArea = document.createElement('div');
        contentArea.className = 'task-card-content';

        // Header with Title and Checkbox
        const header = document.createElement('div');
        header.className = 'task-card-header';

        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'task-card-title-wrapper';

        const title = document.createElement('h3');
        title.className = 'task-card-title';
        title.textContent = this.escapeHtml(this.task.titulo || this.task.nome || 'Sem título');

        const description = document.createElement('p');
        description.className = 'task-card-description';
        description.textContent = this.escapeHtml(this.task.descricao || 'Sem descrição');

        titleWrapper.appendChild(title);
        titleWrapper.appendChild(description);

        // Checkbox
        if (this.options.showCheckbox) {
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'task-card-checkbox-wrapper';

            const checkbox = createNeonCheckbox({
                checked: isDone,
                onChange: (checked) => {
                    if (this.options.onToggleStatus) {
                        this.options.onToggleStatus(this.task.id || this.task.contador, checked);
                    }
                }
            });

            checkboxWrapper.appendChild(checkbox);
            header.appendChild(titleWrapper);
            header.appendChild(checkboxWrapper);
        } else {
            header.appendChild(titleWrapper);
        }

        contentArea.appendChild(header);

        // Tags
        const tagsContainer = this.renderTags();
        contentArea.appendChild(tagsContainer);

        // Meta Info
        const metaInfo = this.renderMetaInfo();
        contentArea.appendChild(metaInfo);

        return contentArea;
    }

    renderTags() {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'task-card-tags';

        const tags = this.task.tags || [];
        
        if (tags.length > 0) {
            tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'task-card-tag';
                tagElement.textContent = `#${tag.trim()}`;
                tagsContainer.appendChild(tagElement);
            });
        } else {
            const emptyTag = document.createElement('span');
            emptyTag.className = 'task-card-tags-empty';
            emptyTag.textContent = 'Sem tags';
            tagsContainer.appendChild(emptyTag);
        }

        return tagsContainer;
    }

    renderMetaInfo() {
        const metaInfo = document.createElement('div');
        metaInfo.className = 'task-card-meta';

        const metaLeft = document.createElement('div');
        metaLeft.className = 'task-card-meta-left';

        const taskTime = toDate(this.task.time);
        if (taskTime) {
            const dateItem = document.createElement('div');
            dateItem.className = 'task-card-meta-item';
            dateItem.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${formatDate(taskTime, 'dd/MM/yyyy')}</span>
            `;
            metaLeft.appendChild(dateItem);
        }

        if (this.task.responsavel) {
            const assigneeItem = document.createElement('div');
            assigneeItem.className = 'task-card-meta-item';
            assigneeItem.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="task-card-meta-assignee">${this.escapeHtml(this.task.responsavel)}</span>
            `;
            metaLeft.appendChild(assigneeItem);
        }

        metaInfo.appendChild(metaLeft);

        // Actions (Edit/Delete) - Only visible on hover
        if (this.options.showActions) {
            const actions = document.createElement('div');
            actions.className = 'task-card-actions';

            const taskId = this.task.id || this.task.contador;

            // Botão de Editar - sempre criar quando showActions for true
            const editBtn = document.createElement('button');
            editBtn.className = 'task-card-action-button edit';
            editBtn.setAttribute('data-action', 'edit');
            editBtn.setAttribute('data-task-id', taskId);
            editBtn.setAttribute('title', 'Editar');
            editBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            `;
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.options.onEdit) {
                    this.options.onEdit(this.task);
                }
            });
            actions.appendChild(editBtn);

            // Botão de Excluir - sempre criar quando showActions for true
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'task-card-action-button delete';
            deleteBtn.setAttribute('data-action', 'delete');
            deleteBtn.setAttribute('data-task-id', taskId);
            deleteBtn.setAttribute('title', 'Excluir');
            deleteBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.options.onDelete) {
                    this.options.onDelete(this.task.id || this.task.contador);
                }
            });
            actions.appendChild(deleteBtn);

            // Botão de Adicionar ao Home - apenas se callback for fornecido
            // Usa event delegation (não adiciona listener direto pois HTML é serializado)
            if (this.options.onInjectToHome) {
                const injectBtn = document.createElement('button');
                injectBtn.className = 'task-card-action-button inject';
                injectBtn.setAttribute('data-action', 'inject-to-home');
                injectBtn.setAttribute('data-task-id', taskId);
                injectBtn.setAttribute('title', 'Adicionar ao Home');
                injectBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                `;
                actions.appendChild(injectBtn);
            }

            metaInfo.appendChild(actions);
        }

        return metaInfo;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
