/**
 * Criação View - Home do Módulo de Criação
 * Gerenciamento de Tarefas de Criação com Kanban
 */

import {
    store
} from '../store.js';
import {
    TaskCard
} from '../components/TaskCard.js';
import {
    createNeonButton
} from '../components/NeonButton.js';
import {
    creationModal
} from '../components/CreationModal.js';
import {
    confirmAction
} from '../components/ConfirmModal.js';

import {
    Status,
    CreationContext,
    Priority
} from '../types.js';

class CriacaoView {
    constructor() {
        this.unsubscribe = null;
        this.taskContextFilter = 'ALL';
        this.taskPriorityFilter = 'ALL';
    }

    render() {
        return `
            <div class="criacao-view">
                <div class="criacao-header">
                    <div class="criacao-header-title-group">
                        <h2 class="criacao-title">Tarefas <span class="criacao-title-badge">(Modo Criação)</span></h2>
                        <p class="criacao-subtitle">Execução e controle diário</p>
                    </div>
                    <div class="criacao-header-actions" id="criacao-header-actions"></div>
                </div>

                <div class="criacao-toolbar" id="criacao-toolbar"></div>

                <div class="criacao-kanban" id="criacao-kanban"></div>
            </div>
        `;
    }

    mount() {
        this.renderHeaderActions();
        this.renderToolbar();
        this.renderKanban();

        this.unsubscribe = store.subscribe(() => {
            this.renderToolbar(); // Re-render toolbar para atualizar contador do botão
            this.renderKanban();
        });

        return this;
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    renderHeaderActions() {
        const container = document.getElementById('criacao-header-actions');
        if (!container) return;

        container.innerHTML = '';

        // Botão de Novo Modelo
        const newModelBtn = createNeonButton({
            text: 'Novo Modelo',
            variant: 'secondary',
            className: 'btn-dashed',
            onClick: () => this.handleNewTaskTemplate()
        });
        // Adicionar ícone ao botão
        const modelIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        modelIcon.setAttribute('width', '16');
        modelIcon.setAttribute('height', '16');
        modelIcon.setAttribute('viewBox', '0 0 24 24');
        modelIcon.setAttribute('fill', 'none');
        modelIcon.setAttribute('stroke', 'currentColor');
        modelIcon.setAttribute('stroke-width', '2');
        modelIcon.setAttribute('stroke-linecap', 'round');
        modelIcon.setAttribute('stroke-linejoin', 'round');
        const modelPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        modelPath.setAttribute('d', 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z');
        const modelPolyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        modelPolyline.setAttribute('points', '14 2 14 8 20 8');
        modelIcon.appendChild(modelPath);
        modelIcon.appendChild(modelPolyline);
        const modelContent = newModelBtn.querySelector('.neon-button-content');
        if (modelContent) {
            modelContent.insertBefore(modelIcon, modelContent.firstChild);
        }
        container.appendChild(newModelBtn);

        // Botão de Importar de IA
        const importBtn = createNeonButton({
            text: 'Importar de IA',
            variant: 'secondary',
            onClick: () => this.handleImportAI()
        });
        // Adicionar ícone Sparkles
        const importIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        importIcon.setAttribute('width', '16');
        importIcon.setAttribute('height', '16');
        importIcon.setAttribute('viewBox', '0 0 24 24');
        importIcon.setAttribute('fill', 'none');
        importIcon.setAttribute('stroke', 'currentColor');
        importIcon.setAttribute('stroke-width', '2');
        importIcon.setAttribute('stroke-linecap', 'round');
        importIcon.setAttribute('stroke-linejoin', 'round');
        const sparkPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        sparkPath1.setAttribute('d', 'M12 3v18m9-9H3m15.5-6.5L6.5 17.5m11-11L6.5 6.5');
        importIcon.appendChild(sparkPath1);
        const importContent = importBtn.querySelector('.neon-button-content');
        if (importContent) {
            importContent.insertBefore(importIcon, importContent.firstChild);
        }
        container.appendChild(importBtn);

        // Botão de Nova Tarefa
        const newTaskBtn = createNeonButton({
            text: 'Nova Tarefa',
            onClick: () => this.handleNewTask()
        });
        // Adicionar ícone Plus
        const taskIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        taskIcon.setAttribute('width', '16');
        taskIcon.setAttribute('height', '16');
        taskIcon.setAttribute('viewBox', '0 0 24 24');
        taskIcon.setAttribute('fill', 'none');
        taskIcon.setAttribute('stroke', 'currentColor');
        taskIcon.setAttribute('stroke-width', '2');
        taskIcon.setAttribute('stroke-linecap', 'round');
        taskIcon.setAttribute('stroke-linejoin', 'round');
        const taskLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        taskLine1.setAttribute('x1', '12');
        taskLine1.setAttribute('y1', '5');
        taskLine1.setAttribute('x2', '12');
        taskLine1.setAttribute('y2', '19');
        const taskLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        taskLine2.setAttribute('x1', '5');
        taskLine2.setAttribute('y1', '12');
        taskLine2.setAttribute('x2', '19');
        taskLine2.setAttribute('y2', '12');
        taskIcon.appendChild(taskLine1);
        taskIcon.appendChild(taskLine2);
        const taskContent = newTaskBtn.querySelector('.neon-button-content');
        if (taskContent) {
            taskContent.insertBefore(taskIcon, taskContent.firstChild);
        }
        container.appendChild(newTaskBtn);
    }

    renderToolbar() {
        const container = document.getElementById('criacao-toolbar');
        if (!container) return;

        const tasks = store.state.creationTasks || [];
        const inboxCount = tasks.filter(t => t.status === Status.INBOX).length;

        container.innerHTML = `
            <div class="criacao-toolbar-filters">
                <div class="criacao-toolbar-label-wrapper">
                    <svg class="criacao-toolbar-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    <span class="criacao-toolbar-label">Filtros:</span>
                </div>
                
                <select class="criacao-filter-select" id="criacao-context-filter">
                    <option value="ALL">Todos Contextos</option>
                    ${Object.values(CreationContext).map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>

                <select class="criacao-filter-select" id="criacao-priority-filter">
                    <option value="ALL">Todas Prioridades</option>
                    ${Object.values(Priority).map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>

                <div class="criacao-toolbar-spacer"></div>

                ${inboxCount > 0 ? `
                    <button class="criacao-toolbar-clear-btn" id="clear-inbox-btn" title="Limpar Inbox">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span>Limpar Inbox (${inboxCount})</span>
                    </button>
                ` : ''}
            </div>
        `;

        // Event listeners para filtros
        const contextFilter = document.getElementById('criacao-context-filter');
        const priorityFilter = document.getElementById('criacao-priority-filter');
        const clearBtn = document.getElementById('clear-inbox-btn');

        if (contextFilter) {
            contextFilter.value = this.taskContextFilter;
            contextFilter.addEventListener('change', (e) => {
                this.taskContextFilter = e.target.value;
                this.renderKanban();
            });
        }

        if (priorityFilter) {
            priorityFilter.value = this.taskPriorityFilter;
            priorityFilter.addEventListener('change', (e) => {
                this.taskPriorityFilter = e.target.value;
                this.renderKanban();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.handleClearInbox());
        }
    }

    renderKanban() {
        const container = document.getElementById('criacao-kanban');
        if (!container) return;

        const tasks = store.state.creationTasks || [];
        const columns = [Status.INBOX, Status.TODO, Status.IN_PROGRESS, Status.DONE];

        // Filtrar tarefas
        const filteredTasks = tasks.filter(t => {
            const contextMatch = this.taskContextFilter === 'ALL' || t.context === this.taskContextFilter;
            const priorityMatch = this.taskPriorityFilter === 'ALL' || t.priority === this.taskPriorityFilter;
            return contextMatch && priorityMatch;
        });

        container.innerHTML = '';

        columns.forEach(status => {
            const column = document.createElement('div');
            column.className = 'criacao-kanban-column';

            // Aplicar classes de cor por status
            if (status === Status.INBOX) column.classList.add('column-inbox');
            if (status === Status.TODO) column.classList.add('column-todo');
            if (status === Status.IN_PROGRESS) column.classList.add('column-in-progress');
            if (status === Status.DONE) column.classList.add('column-done');

            const statusTasks = filteredTasks.filter(t => t.status === status);

            // Header da coluna
            const header = document.createElement('div');
            header.className = 'criacao-kanban-column-header';
            header.innerHTML = `
                <span class="criacao-kanban-column-title">${status}</span>
                <span class="criacao-kanban-column-count">${statusTasks.length}</span>
            `;
            column.appendChild(header);

            // Body da coluna
            const body = document.createElement('div');
            body.className = 'criacao-kanban-column-body';

            if (statusTasks.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'criacao-kanban-empty';
                empty.textContent = 'Vazio';
                body.appendChild(empty);
            } else {
                statusTasks.forEach(task => {
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'criacao-kanban-card-wrapper';

                    // Adaptar task para TaskCard (mantém o id original)
                    const adaptedTask = {
                        ...task,
                        id: task.id, // Garantir que o id está presente
                        titulo: task.title,
                        descricao: task.description,
                        prioridade: task.priority,
                        time: task.dueDate,
                        tags: task.tags || [],
                        completed: task.status === Status.DONE
                    };

                    console.log('🎴 Criando TaskCard para:', adaptedTask.id, adaptedTask.titulo);

                    const taskCard = new TaskCard(adaptedTask, {
                        showCheckbox: true,
                        showPriority: true,
                        showActions: true,
                        isCompleted: task.status === Status.DONE,
                        onToggleStatus: (id) => {
                            console.log('🔘 TaskCard onToggleStatus callback chamado:', id);
                            this.handleToggleStatus(id);
                        },
                        onEdit: (taskToEdit) => {
                            console.log('✏️ TaskCard onEdit callback chamado:', taskToEdit);
                            this.handleEditTask(task);
                        },
                        onDelete: (id) => {
                            console.log('🗑️ TaskCard onDelete callback chamado:', id);
                            this.handleDeleteTask(id);
                        }
                    });

                    const cardElement = taskCard.render();
                    cardWrapper.appendChild(cardElement);
                    body.appendChild(cardWrapper);
                });
            }

            column.appendChild(body);
            container.appendChild(column);
        });
    }

    handleNewTask() {
        console.log('➕ Abrindo modal para nova tarefa');

        const defaultTask = {
            title: '',
            description: '',
            priority: Priority.MEDIUM,
            status: Status.INBOX,
            context: CreationContext.DEV,
            dueDate: new Date().toISOString().split('T')[0],
            checklist: [],
            tags: [],
            attachments: [],
            visibleOnGeneralHome: false
        };

        creationModal.show('creation-task', null, (taskData) => {
            console.log('💾 Salvando nova tarefa:', taskData);
            store.addCreationTask(taskData);
        });
    }

    handleEditTask(task) {
        console.log('✏️ Editando tarefa:', task);

        creationModal.show('creation-task', task, (taskData) => {
            console.log('💾 Salvando alterações:', taskData);
            store.updateCreationTask(task.id, taskData);
        });
    }

    async handleDeleteTask(id) {
        console.log('🗑️ Deletando tarefa:', id);
        const confirmed = await confirmAction('Tem certeza que deseja excluir esta tarefa?', {
            confirmLabel: 'Excluir',
            cancelLabel: 'Cancelar'
        });

        if (confirmed) {
            console.log('✅ Confirmado delete de:', id);
            store.deleteCreationTask(id);
        } else {
            console.log('❌ Delete cancelado');
        }
    }

    handleToggleStatus(id) {
        console.log('🔄 Toggle status da tarefa:', id);
        const tasks = store.state.creationTasks || [];
        const task = tasks.find(t => t.id === id);
        if (!task) {
            console.warn('⚠️ Tarefa não encontrada:', id);
            return;
        }

        const newStatus = task.status === Status.DONE ? Status.TODO : Status.DONE;
        store.updateCreationTask(id, {
            status: newStatus
        });
    }

    async handleClearInbox() {
        const tasks = store.state.creationTasks || [];
        const inboxTasks = tasks.filter(t => t.status === Status.INBOX);

        if (inboxTasks.length === 0) return;

        const confirmed = await confirmAction(
            `Tem certeza que deseja excluir todas as ${inboxTasks.length} tarefas do Inbox?`, {
                confirmLabel: 'Limpar Tudo',
                cancelLabel: 'Cancelar'
            }
        );

        if (confirmed) {
            console.log(`🗑️ Limpando ${inboxTasks.length} tarefas do Inbox`);
            inboxTasks.forEach(task => {
                store.deleteCreationTask(task.id);
            });
        } else {
            console.log('❌ Limpeza do Inbox cancelada');
        }
    }

    handleNewTaskTemplate() {
        console.log('📄 Abrindo modal para novo modelo de tarefa');

        const taskTemplates = store.state.taskTemplates || [];

        creationModal.show('task-template', null, (templateData) => {
            console.log('💾 Salvando novo modelo:', templateData);
            store.addTaskTemplate(templateData);
        }, {
            taskTemplates: taskTemplates
        });
    }

    handleImportAI() {
        console.log('✨ Abrindo modal de importação de IA');

        const taskTemplates = store.state.taskTemplates || [];

        creationModal.show('ai-task-import', null, (tasks) => {
            console.log(`📥 Importando ${tasks.length} tarefas via IA`);
            store.batchAddCreationTasks(tasks);
        }, {
            taskTemplates: taskTemplates
        });
    }
}

// Exportar como função factory para compatibilidade com o router
export default function renderCriacao() {
    return new CriacaoView();
}