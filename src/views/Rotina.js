/**
 * View Rotina
 * Gerencia tarefas de rotina com visual iOS
 */

import {
    store
} from '../store.js';
import {
    TaskCard
} from '../components/TaskCard.js';
import {
    getOverdueTasks,
    getPostponedTasks
} from '../utils/taskFilters.js';
import {
    formatTime,
    formatDate,
    toDate,
    getTodayISO
} from '../utils/dateUtils.js';
import {
    toast
} from '../components/Toast.js';
import {
    setupSwipeGestures,
    createCompleteTaskHandler,
    createPostponeTaskHandler
} from '../utils/swipe-gestures.js';
import {
    confirmAction
} from '../components/ConfirmModal.js';

class RotinaView {
    constructor() {
        this.unsubscribe = null;
        this.currentFilter = 'all'; // 'all', 'today', 'overdue', 'completed', 'postponed'
        this.searchQuery = '';
        this.sortBy = 'time'; // 'time', 'priority', 'title'
        this.sortOrder = 'asc'; // 'asc', 'desc'
        this.priorityFilter = 'all'; // 'all', 'urgente', 'alta', 'media', 'baixa'
        
        // Event listeners handlers (para cleanup)
        this.eventHandlers = {
            filterClick: null,
            checkboxChange: null,
            actionClick: null,
            searchInput: null,
            sortChange: null,
            priorityFilterChange: null
        };
    }

    render() {
        const state = store.getState();
        const tarefas = state.tarefasRotina || [];

        // Filtrar tarefas baseado no filtro atual
        let filteredTasks = this.filterTasks(tarefas);
        
        // Aplicar busca
        if (this.searchQuery) {
            filteredTasks = this.searchTasks(filteredTasks);
        }
        
        // Aplicar filtro de prioridade
        if (this.priorityFilter !== 'all') {
            filteredTasks = filteredTasks.filter(t => 
                (t.prioridade || 'media').toLowerCase() === this.priorityFilter.toLowerCase()
            );
        }
        
        // Ordenar tarefas
        filteredTasks = this.sortTasks(filteredTasks);

        // Separar tarefas por categoria
        let pendingTasks = filteredTasks.filter(t => !t.completed);
        const completedTasks = filteredTasks.filter(t => t.completed);
        
        // Separar tarefas adiadas (apenas se não estiver no filtro específico)
        let postponedTasks = [];
        if (this.currentFilter === 'postponed') {
            // Se estiver no filtro de adiadas, mostrar apenas essas
            postponedTasks = filteredTasks;
            pendingTasks = [];
        } else {
            // Caso contrário, separar as adiadas das pendentes normais
            postponedTasks = getPostponedTasks(pendingTasks);
            // Remover tarefas adiadas das pendentes para não duplicar
            const postponedIds = new Set(postponedTasks.map(t => t.id || t.contador));
            pendingTasks = pendingTasks.filter(t => !postponedIds.has(t.id || t.contador));
        }

        const total = filteredTasks.length;
        const done = completedTasks.length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        return `
      <div class="home-view home-view-redesign rotina-view-redesign">
        <div class="home-top-cards">
          <section class="home-welcome-card">
            <h2 class="home-welcome-title">Fluxo de Rotina</h2>
            <p class="home-welcome-message">
              Mantenha o foco nas tarefas do dia e conclua com estilo.
            </p>
            <div class="home-cta">
              <button class="btn btn-primary" id="btnAddRotina" title="Adicionar nova tarefa de rotina">Nova Tarefa</button>
            </div>
          </section>

          <section class="home-productivity-card">
            <div class="home-productivity-value">${pct}%</div>
            <div class="home-productivity-label">Progresso</div>
            <div class="home-productivity-bar">
              <div class="home-productivity-bar-fill" style="width: ${pct}%"></div>
            </div>
          </section>
        </div>

        <div class="home-section-header">
          <h1 class="home-section-title">Minha Rotina</h1>
          <div class="home-search">
            <div class="rotina-search">
              <input 
                type="text" 
                id="rotina-search-input" 
                class="rotina-search-input" 
                placeholder="Buscar tarefas..."
                value="${this.escapeHtml(this.searchQuery)}"
              />
            </div>
          </div>
        </div>

        <div class="rotina-search-sort">
          <div class="rotina-sort-controls">
            <select id="rotina-sort-by" class="rotina-sort-select">
              <option value="time" ${this.sortBy === 'time' ? 'selected' : ''}>Data/Hora</option>
              <option value="priority" ${this.sortBy === 'priority' ? 'selected' : ''}>Prioridade</option>
              <option value="title" ${this.sortBy === 'title' ? 'selected' : ''}>Título</option>
            </select>
            <button 
              id="rotina-sort-order" 
              class="rotina-sort-btn" 
              title="Alternar ordem"
              data-order="${this.sortOrder}"
            >
              ${this.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        <div class="rotina-filters">
          <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">Todas</button>
          <button class="filter-btn ${this.currentFilter === 'today' ? 'active' : ''}" data-filter="today">Hoje</button>
          <button class="filter-btn ${this.currentFilter === 'overdue' ? 'active' : ''}" data-filter="overdue">Atrasadas</button>
          <button class="filter-btn ${this.currentFilter === 'completed' ? 'active' : ''}" data-filter="completed">Concluídas</button>
          <button class="filter-btn ${this.currentFilter === 'postponed' ? 'active' : ''}" data-filter="postponed">⏰ Adiadas</button>
          <select id="rotina-priority-filter" class="filter-select">
            <option value="all" ${this.priorityFilter === 'all' ? 'selected' : ''}>Todas Prioridades</option>
            <option value="urgente" ${this.priorityFilter === 'urgente' ? 'selected' : ''}>Urgente</option>
            <option value="alta" ${this.priorityFilter === 'alta' ? 'selected' : ''}>Alta</option>
            <option value="media" ${this.priorityFilter === 'media' ? 'selected' : ''}>Média</option>
            <option value="baixa" ${this.priorityFilter === 'baixa' ? 'selected' : ''}>Baixa</option>
          </select>
        </div>

        ${postponedTasks.length > 0 ? this.renderTasksSection('⏰ Adiadas', postponedTasks, false, true) : ''}
        ${pendingTasks.length > 0 ? this.renderTasksSection('Pendentes', pendingTasks, false) : ''}
        ${completedTasks.length > 0 ? this.renderTasksSection('Concluídas', completedTasks, true) : ''}
        
        ${filteredTasks.length === 0 ? this.renderEmptyState() : ''}
      </div>
    `;

    }

    filterTasks(tasks) {
        switch (this.currentFilter) {
            case 'today':
                return this.getTodayTasks(tasks);
            case 'overdue':
                return getOverdueTasks(tasks);
            case 'completed':
                return tasks.filter(t => t.completed);
            case 'postponed':
                return getPostponedTasks(tasks);
            default:
                return tasks;
        }
    }

    searchTasks(tasks) {
        if (!this.searchQuery) return tasks;
        const query = this.searchQuery.toLowerCase();
        return tasks.filter(task => {
            const title = (task.titulo || task.nome || '').toLowerCase();
            const description = (task.descricao || '').toLowerCase();
            return title.includes(query) || description.includes(query);
        });
    }

    sortTasks(tasks) {
        const sorted = [...tasks];
        const order = this.sortOrder === 'asc' ? 1 : -1;

        sorted.sort((a, b) => {
            switch (this.sortBy) {
                case 'time':
                    const timeA = toDate(a.time);
                    const timeB = toDate(b.time);
                    if (!timeA && !timeB) return 0;
                    if (!timeA) return 1;
                    if (!timeB) return -1;
                    return (timeA - timeB) * order;

                case 'priority':
                    const priorityOrder = { urgente: 4, alta: 3, media: 2, baixa: 1 };
                    const priorityA = priorityOrder[(a.prioridade || 'media').toLowerCase()] || 0;
                    const priorityB = priorityOrder[(b.prioridade || 'media').toLowerCase()] || 0;
                    return (priorityB - priorityA) * order;

                case 'title':
                    const titleA = (a.titulo || a.nome || '').toLowerCase();
                    const titleB = (b.titulo || b.nome || '').toLowerCase();
                    return titleA.localeCompare(titleB) * order;

                default:
                    return 0;
            }
        });

        return sorted;
    }

    getTodayTasks(tasks) {
        const today = getTodayISO();
        return tasks.filter(task => {
            if (!task.time) return false;
            const taskDate = toDate(task.time);
            if (!taskDate) return false;
            const taskDateISO = taskDate.toISOString().split('T')[0];
            return taskDateISO === today;
        });
    }

    renderTasksSection(title, tasks, isCompleted, isPostponed = false) {
        const overdueTasks = getOverdueTasks(tasks);

        return `
      <section class="rotina-section ${isPostponed ? 'rotina-section-postponed' : ''}">
        <div class="rotina-section-header">
          <h2 class="rotina-section-title">${title}</h2>
          <span class="rotina-section-count">${tasks.length}</span>
          ${isPostponed ?  
            `<span class="rotina-section-badge badge badge-info" title="Tarefas adiadas para mais de 2 horas no futuro">⏰ Adiadas</span>` : ''}
          ${overdueTasks.length > 0 && !isCompleted && !isPostponed ?  
            `<span class="rotina-section-badge badge badge-danger">${overdueTasks.length} atrasadas</span>` : ''}
        </div>
        <div class="rotina-tasks-list ${isCompleted ? 'rotina-tasks-completed' : ''} ${isPostponed ? 'rotina-tasks-postponed' : ''}">
          ${tasks.map(task => {
            const taskCard = new TaskCard(task, {
              showCheckbox: true,
              showModule: false,
              showPriority: true,
              showDuration: true,
              showActions: true,
              isCurrent: false,
              isOverdue: overdueTasks.some(t => (t.id || t.contador) === (task.id || task.contador)),
              isPostponed: isPostponed
            });
            const cardHtml = taskCard.render().outerHTML;
            const isRecurring = task.recurrence && task.recurrence.enabled;
            return `<div class="rotina-task-item ${isPostponed ? 'rotina-task-postponed' : ''}" data-task-id="${task.id || task.contador}" ${isRecurring ? 'data-recurring="true"' : ''}>${cardHtml}</div>`;
          }).join('')}
        </div>
      </section>
    `;
    }

    renderEmptyState() {
        const messages = {
            all: 'Nenhuma tarefa de rotina cadastrada',
            today: 'Nenhuma tarefa para hoje',
            overdue: 'Nenhuma tarefa atrasada! 🎉',
            completed: 'Nenhuma tarefa concluída ainda',
            postponed: 'Nenhuma tarefa adiada'
        };
        
        return `
      <div class="rotina-empty-state">
        <p class="rotina-empty-text">${messages[this.currentFilter] || messages.all}</p>
      </div>
    `;
    }

    mount() {
        // Escutar mudanças no store
        this.unsubscribe = store.subscribe(() => {
            this.update();
        });

        // Event listeners
        this.setupEventListeners();
        
        // Aplicar swipe gestures
        this.setupSwipeGestures();
    }

    setupEventListeners() {
        // Limpar listeners anteriores se existirem
        this.cleanupEventListeners();

        // Filtros - usar event delegation
        this.eventHandlers.filterClick = (e) => {
            const filterBtn = e.target.closest('.filter-btn');
            if (filterBtn) {
                const filter = filterBtn.getAttribute('data-filter');
                this.currentFilter = filter;
                this.update();
            }
        };
        document.addEventListener('click', this.eventHandlers.filterClick);

        // Botão adicionar tarefa
        const btnAdd = document.getElementById('btnAddRotina');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                this.handleTaskAdd();
            });
        }

        // Busca
        const searchInput = document.getElementById('rotina-search-input');
        if (searchInput) {
            this.eventHandlers.searchInput = () => {
                this.searchQuery = searchInput.value;
                this.update();
            };
            searchInput.addEventListener('input', this.eventHandlers.searchInput);
        }

        // Ordenação
        const sortBy = document.getElementById('rotina-sort-by');
        if (sortBy) {
            this.eventHandlers.sortChange = () => {
                this.sortBy = sortBy.value;
                this.update();
            };
            sortBy.addEventListener('change', this.eventHandlers.sortChange);
        }

        const sortOrder = document.getElementById('rotina-sort-order');
        if (sortOrder) {
            sortOrder.addEventListener('click', () => {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                this.update();
            });
        }

        // Filtro de prioridade
        const priorityFilter = document.getElementById('rotina-priority-filter');
        if (priorityFilter) {
            this.eventHandlers.priorityFilterChange = () => {
                this.priorityFilter = priorityFilter.value;
                this.update();
            };
            priorityFilter.addEventListener('change', this.eventHandlers.priorityFilterChange);
        }

        // Checkboxes de conclusão - usar event delegation
        this.eventHandlers.checkboxChange = (e) => {
            if (e.target.classList.contains('task-checkbox') || e.target.classList.contains('ios-checkbox-input')) {
                const taskId = e.target.getAttribute('data-task-id');
                if (taskId) {
                    this.handleTaskComplete(taskId, e.target.checked);
                }
            }
        };
        document.addEventListener('change', this.eventHandlers.checkboxChange);

        // Botões de ação nos cards (editar/excluir) - usar event delegation
        this.eventHandlers.actionClick = (e) => {
            const actionBtn = e.target.closest('[data-action]');
            if (!actionBtn) return;

            const action = actionBtn.getAttribute('data-action');
            const taskId = actionBtn.getAttribute('data-task-id');

            if (action === 'edit' && taskId) {
                this.handleTaskEdit(taskId);
            } else if (action === 'delete' && taskId) {
                this.handleTaskDelete(taskId);
            }
        };
        document.addEventListener('click', this.eventHandlers.actionClick);
    }

    cleanupEventListeners() {
        // Remover listeners anteriores
        if (this.eventHandlers.filterClick) {
            document.removeEventListener('click', this.eventHandlers.filterClick);
        }
        if (this.eventHandlers.checkboxChange) {
            document.removeEventListener('change', this.eventHandlers.checkboxChange);
        }
        if (this.eventHandlers.actionClick) {
            document.removeEventListener('click', this.eventHandlers.actionClick);
        }
        if (this.eventHandlers.searchInput) {
            const searchInput = document.getElementById('rotina-search-input');
            if (searchInput) {
                searchInput.removeEventListener('input', this.eventHandlers.searchInput);
            }
        }
        if (this.eventHandlers.sortChange) {
            const sortBy = document.getElementById('rotina-sort-by');
            if (sortBy) {
                sortBy.removeEventListener('change', this.eventHandlers.sortChange);
            }
        }
        if (this.eventHandlers.priorityFilterChange) {
            const priorityFilter = document.getElementById('rotina-priority-filter');
            if (priorityFilter) {
                priorityFilter.removeEventListener('change', this.eventHandlers.priorityFilterChange);
            }
        }
    }

    setupSwipeGestures() {
        // Aplicar swipe gestures nos cards
        setTimeout(() => {
            const taskItems = document.querySelectorAll('.rotina-task-item .task-card');
            taskItems.forEach((card) => {
                const taskId = card.closest('.rotina-task-item').getAttribute('data-task-id');
                if (taskId) {
                    setupSwipeGestures(card, {
                        onSwipeLeft: createCompleteTaskHandler(taskId, (id) => {
                            this.handleTaskComplete(id, true);
                        }),
                        onSwipeRight: createPostponeTaskHandler(taskId, (id, days) => {
                            this.handlePostpone(id, days);
                        })
                    });
                }
            });
        }, 100);
    }

    handleTaskComplete(taskId, completed) {
        const state = store.getState();
        const task = state.tarefasRotina.find(t => (t.id || t.contador) == taskId);
        
        if (!task) return;

        const taskTitle = task.titulo || task.nome || 'Tarefa';

        // Atualizar estado
        store.updateItem('tarefasRotina', (t) => (t.id || t.contador) == taskId, {
            completed,
            completedAt: completed ? new Date().toISOString() : null,
        });

        // Se for tarefa recorrente e foi completada, criar próxima ocorrência
        if (completed && task.recurrence) {
            this.handleRecurringTask(task);
        }

        // Mostrar toast com opção de desfazer
        if (completed) {
            toast.success(`"${taskTitle}" concluída!`, {
                duration: 5000,
                action: () => {
                    // Desfazer
                    store.updateItem('tarefasRotina', (t) => (t.id || t.contador) == taskId, {
                        completed: false,
                        completedAt: null,
                    });
                    toast.info('Ação desfeita');
                },
                actionLabel: 'Desfazer',
            });
        }
    }

    handleRecurringTask(task) {
        if (!task.recurrence || !task.recurrence.enabled) return;

        const state = store.getState();
        const newId = (state.contadorRotina || 0) + 1;
        const currentTime = task.time ? toDate(task.time) : new Date();
        let nextTime = new Date(currentTime);

        switch (task.recurrence.type) {
            case 'daily':
                nextTime.setDate(nextTime.getDate() + 1);
                break;
            case 'weekly':
                nextTime.setDate(nextTime.getDate() + 7);
                break;
            case 'monthly':
                nextTime.setMonth(nextTime.getMonth() + 1);
                break;
            case 'custom':
                nextTime.setDate(nextTime.getDate() + (task.recurrence.interval || 1));
                break;
            default:
                return;
        }

        const nextTask = {
            ...task,
            id: newId,
            contador: newId,
            time: nextTime.toISOString(),
            completed: false,
            completedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Remover campos que não devem ser copiados
        delete nextTask.completedAt;

        store.addItem('tarefasRotina', nextTask);
        store.setState({ contadorRotina: newId });
    }

    handlePostpone(taskId, days) {
        const state = store.getState();
        const task = state.tarefasRotina.find(t => (t.id || t.contador) == taskId);
        
        if (task && task.time) {
            const taskDate = toDate(task.time);
            if (taskDate) {
                taskDate.setDate(taskDate.getDate() + days);
                const newTime = taskDate.toISOString();
                store.updateItem('tarefasRotina', (t) => (t.id || t.contador) == taskId, {
                    time: newTime
                });
                toast.info(`Tarefa adiada ${days} dia${days > 1 ? 's' : ''}`);
            }
        }
    }

    handleTaskAdd() {
        const state = store.getState();
        const newId = (state.contadorRotina || 0) + 1;
        
        // Criar nova tarefa com valores padrão
        const now = new Date();
        const defaultTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
        
        const newTask = {
            id: newId,
            contador: newId,
            titulo: 'Nova Tarefa de Rotina',
            descricao: '',
            time: defaultTime.toISOString(),
            prioridade: 'media',
            duracao: null,
            completed: false,
            modulo: 'rotina',
            recurrence: {
                enabled: false,
                type: 'daily',
                interval: 1
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Abrir modal para editar a nova tarefa
        this.openTaskModal(newTask, (taskData) => {
            const finalTask = {
                ...newTask,
                ...taskData
            };
            store.addItem('tarefasRotina', finalTask);
            store.setState({ contadorRotina: newId });
            
            toast.success('Tarefa de rotina criada com sucesso');
            this.update();
        });
    }

    handleTaskEdit(taskId) {
        const state = store.getState();
        const task = state.tarefasRotina.find(t => (t.id || t.contador) == taskId);

        if (!task) {
            toast.error('Tarefa não encontrada');
            return;
        }

        this.openTaskModal(task, (taskData) => {
            store.updateItem('tarefasRotina', (t) => (t.id || t.contador) == taskId, {
                ...taskData,
                updatedAt: new Date().toISOString()
            });
            toast.success('Tarefa atualizada com sucesso');
            this.update();
        });
    }

    async handleTaskDelete(taskId) {
        const state = store.getState();
        const task = state.tarefasRotina.find(t => (t.id || t.contador) == taskId);

        if (!task) {
            toast.error('Tarefa não encontrada');
            return;
        }

        const taskTitle = task.titulo || task.nome || 'Tarefa';
        const confirmed = await confirmAction(`Tem certeza que deseja excluir "${taskTitle}"`);
        
        if (confirmed) {
            store.removeItem('tarefasRotina', (t) => (t.id || t.contador) == taskId);
            toast.success('Tarefa excluída com sucesso');
            this.update();
        }
    }

    openTaskModal(task, onSave) {
        // Criar modal
        const modal = document.createElement('div');
        modal.className = 'rotina-task-modal';

        const taskTime = task.time ? toDate(task.time) : new Date();
        const dateValue = taskTime ? taskTime.toISOString().split('T')[0] : '';
        const hourValue = taskTime ? String(taskTime.getHours()).padStart(2, '0') : '';
        const minuteValue = taskTime ? String(taskTime.getMinutes()).padStart(2, '0') : '';
        
        const recurrence = task.recurrence || { enabled: false, type: 'daily', interval: 1 };

        modal.innerHTML = `
      <div class="rotina-task-modal-content">
        <h2 class="rotina-task-modal-title">${task.id ? 'Editar' : 'Nova'} Tarefa de Rotina</h2>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Título *</label>
          <input type="text" id="rotina-titulo" class="rotina-task-form-input" value="${this.escapeHtml(task.titulo || task.nome || '')}" required>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Descrição</label>
          <textarea id="rotina-descricao" rows="4" class="rotina-task-form-textarea">${this.escapeHtml(task.descricao || '')}</textarea>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Data</label>
          <input type="date" id="rotina-date" class="rotina-task-form-input" value="${dateValue}">
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Hora</label>
          <div class="rotina-task-time-group">
            <input type="number" id="rotina-hour" class="rotina-task-form-input rotina-task-time-input" value="${hourValue}" min="0" max="23" placeholder="HH">
            <span class="rotina-task-time-separator">:</span>
            <input type="number" id="rotina-minute" class="rotina-task-form-input rotina-task-time-input" value="${minuteValue}" min="0" max="59" placeholder="MM">
          </div>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Prioridade</label>
          <select id="rotina-prioridade" class="rotina-task-form-select">
            <option value="baixa" ${task.prioridade === 'baixa' ? 'selected' : ''}>Baixa</option>
            <option value="media" ${task.prioridade === 'media' || !task.prioridade ? 'selected' : ''}>Média</option>
            <option value="alta" ${task.prioridade === 'alta' ? 'selected' : ''}>Alta</option>
            <option value="urgente" ${task.prioridade === 'urgente' ? 'selected' : ''}>Urgente</option>
          </select>
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">Duração (minutos)</label>
          <input type="number" id="rotina-duracao" class="rotina-task-form-input" value="${task.duracao || ''}" min="0" placeholder="Ex: 30">
        </div>
        <div class="rotina-task-form-group">
          <label class="rotina-task-form-label">
            <input type="checkbox" id="rotina-recurrence-enabled" ${recurrence.enabled ? 'checked' : ''}>
            Repetir tarefa
          </label>
        </div>
        <div id="rotina-recurrence-options" style="display: ${recurrence.enabled ? 'block' : 'none'};">
          <div class="rotina-task-form-group">
            <label class="rotina-task-form-label">Tipo de repetição</label>
            <select id="rotina-recurrence-type" class="rotina-task-form-select">
              <option value="daily" ${recurrence.type === 'daily' ? 'selected' : ''}>Diária</option>
              <option value="weekly" ${recurrence.type === 'weekly' ? 'selected' : ''}>Semanal</option>
              <option value="monthly" ${recurrence.type === 'monthly' ? 'selected' : ''}>Mensal</option>
              <option value="custom" ${recurrence.type === 'custom' ? 'selected' : ''}>Personalizada</option>
            </select>
          </div>
          <div class="rotina-task-form-group" id="rotina-recurrence-interval-group" style="display: ${recurrence.type === 'custom' ? 'block' : 'none'};">
            <label class="rotina-task-form-label">Intervalo (dias)</label>
            <input type="number" id="rotina-recurrence-interval" class="rotina-task-form-input" value="${recurrence.interval || 1}" min="1" placeholder="Ex: 3">
          </div>
        </div>
        <div class="rotina-task-modal-footer">
          <button id="rotina-cancel" class="rotina-task-btn rotina-task-btn-cancel">Cancelar</button>
          <button id="rotina-save" class="rotina-task-btn rotina-task-btn-save">Salvar</button>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Toggle de repetição
        const recurrenceEnabled = modal.querySelector('#rotina-recurrence-enabled');
        const recurrenceOptions = modal.querySelector('#rotina-recurrence-options');
        const recurrenceType = modal.querySelector('#rotina-recurrence-type');
        const intervalGroup = modal.querySelector('#rotina-recurrence-interval-group');

        if (recurrenceEnabled) {
            recurrenceEnabled.addEventListener('change', () => {
                if (recurrenceOptions) {
                    recurrenceOptions.style.display = recurrenceEnabled.checked ? 'block' : 'none';
                }
            });
        }

        if (recurrenceType) {
            recurrenceType.addEventListener('change', () => {
                if (intervalGroup) {
                    intervalGroup.style.display = recurrenceType.value === 'custom' ? 'block' : 'none';
                }
            });
        }

        const close = () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        };

        modal.querySelector('#rotina-cancel').addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });

        // Fechar com ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        modal.querySelector('#rotina-save').addEventListener('click', () => {
            const titulo = modal.querySelector('#rotina-titulo').value.trim();
            if (!titulo) {
                toast.error('O título é obrigatório');
                return;
            }

            const date = modal.querySelector('#rotina-date').value;
            const hour = parseInt(modal.querySelector('#rotina-hour').value) || 0;
            const minute = parseInt(modal.querySelector('#rotina-minute').value) || 0;

            let time = null;
            if (date) {
                const dateObj = new Date(date);
                dateObj.setHours(hour, minute, 0, 0);
                time = dateObj.toISOString();
            }

            const recurrenceEnabled = modal.querySelector('#rotina-recurrence-enabled').checked;
            const recurrenceType = modal.querySelector('#rotina-recurrence-type').value;
            const recurrenceInterval = parseInt(modal.querySelector('#rotina-recurrence-interval').value) || 1;

            const taskData = {
                titulo: titulo,
                descricao: modal.querySelector('#rotina-descricao').value.trim(),
                time: time,
                prioridade: modal.querySelector('#rotina-prioridade').value,
                duracao: modal.querySelector('#rotina-duracao').value ? parseInt(modal.querySelector('#rotina-duracao').value) : null,
                modulo: 'rotina',
                recurrence: {
                    enabled: recurrenceEnabled,
                    type: recurrenceType,
                    interval: recurrenceType === 'custom' ? recurrenceInterval : 1
                }
            };

            onSave(taskData);
            close();
        });

        // Focar no título
        setTimeout(() => modal.querySelector('#rotina-titulo').focus(), 100);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    update() {
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = this.render();
            this.setupEventListeners();
            this.setupSwipeGestures();
        }
    }

    destroy() {
        this.cleanupEventListeners();
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

// Exportar função de renderização para o router
export default function renderRotina() {
    const view = new RotinaView();
    
    return {
        render: () => view.render(),
        mount: () => {
            setTimeout(() => {
                view.mount();
            }, 0);
            return view;
        },
    };
}

