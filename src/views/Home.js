/**
 * View Home - Dashboard Principal
 * Timeline "AGORA" e seções do dashboard
 * 
 * @module HomeView
 */

import {
    store
} from '../store.js';
import {
    getUpcomingTasks,
    getOverdueTasks,
    getTasksCompletedToday,
    getTotalTasksToday,
    getCompletedTasks,
    getPostponedTasks
} from '../utils/taskFilters.js';
import {
    TaskCard
} from '../components/TaskCard.js';
import {
    formatTime,
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
    taskEditModal
} from '../components/TaskEditModal.js';
import {
    confirmAction
} from '../components/ConfirmModal.js';
import {
    debounce,
    throttle,
    memoize,
    validateStoreData,
    escapeHtml,
    compareTaskArrays
} from '../utils/homeHelpers.js';

// Constantes
const UPDATE_INTERVAL = 60000; // 1 minuto em milissegundos
const COLLAPSE_THRESHOLD = 5; // Número de tarefas antes de colapsar
const ANIMATION_DELAY = 100; // Delay para animações em milissegundos
const DEFAULT_TASK_DELAY_HOURS = 1; // Horas padrão para nova tarefa
const UPCOMING_TASKS_HOURS = 2; // Horas para buscar tarefas próximas
const DEBOUNCE_DELAY = 300; // Delay para debounce em ms
const THROTTLE_DELAY = 1000; // Delay para throttle em ms

/**
 * Classe principal da view Home
 * Gerencia o dashboard com timeline, tarefas atrasadas e métricas
 */
class HomeView {
    /**
     * Construtor da classe HomeView
     */
    constructor() {
        this.updateInterval = null;
        this.unsubscribe = null;
        this.eventListeners = [];
        this.swipeGestureCleanups = [];
        this.isLoading = false;
        this.lastRenderData = null;
        this.currentFilter = {
            search: '',
            priority: 'all',
            module: 'all',
            sortBy: 'time' // time, priority, module, createdAt
        };
        this.swipeGestureMap = new Map(); // Mapa para reutilizar gestures

        // Memoizar funções de filtro
        this.memoizedGetUpcomingTasks = memoize((tasks, hours) => {
            return getUpcomingTasks(tasks, hours);
        });
        this.memoizedGetOverdueTasks = memoize((tasks) => {
            return getOverdueTasks(tasks);
        });
    }

    // ============================================================================
    // MÉTODOS PÚBLICOS PRINCIPAIS
    // ============================================================================

    /**
     * Renderiza o HTML principal da view
     * @returns {string} HTML da view
     */
    render() {
        try {
            // Mostrar loading state se necessário
            if (this.isLoading && !this.lastRenderData) {
                return this.renderLoadingState();
            }

            const state = store.getState();

            // Validar dados do store
            if (!validateStoreData(state.tarefasHome, 'array')) {
                console.warn('Dados inválidos do store, usando array vazio');
                return this.renderErrorState('Erro ao carregar dados');
            }

            const homeTasks = state.tarefasHome || [];

            // Aplicar filtros
            const filteredTasks = this.applyFilters(homeTasks);
            const upcomingTasks = this.memoizedGetUpcomingTasks(
                this.filterUpcomingTasks(filteredTasks),
                UPCOMING_TASKS_HOURS
            );
            const overdueTasks = this.memoizedGetOverdueTasks(
                this.filterOverdueTasks(filteredTasks)
            );
            const completedTasks = getCompletedTasks(filteredTasks);
            const postponedTasks = getPostponedTasks(filteredTasks);
            const completedToday = getTasksCompletedToday(homeTasks);
            const totalToday = getTotalTasksToday(homeTasks);

            // Aplicar ordenação
            const sortedUpcomingTasks = this.sortTasks(upcomingTasks, this.currentFilter.sortBy);

            // Identificar tarefa atual (próxima a acontecer)
            const now = new Date();
            const currentTask = sortedUpcomingTasks.find((task) => {
                const taskTime = toDate(task.time);
                return taskTime && taskTime <= now;
            });

            // Salvar dados para renderização incremental
            const renderData = {
                upcomingTasks: sortedUpcomingTasks,
                overdueTasks,
                completedTasks,
                postponedTasks,
                completedToday: completedToday.length,
                totalToday,
                streak: state.streak || 0,
                currentTask
            };
            this.lastRenderData = renderData;

            return `
                <div class="home-view" role="main" aria-label="Dashboard principal">
                    ${this.renderFiltersSection()}
                    ${this.renderUpcomingSection(sortedUpcomingTasks, currentTask)}
                    ${this.renderOverdueSection(overdueTasks)}
                    ${this.renderMetricsSection(completedToday.length, totalToday, state.streak || 0)}
                    ${this.renderCompletedSection(completedTasks)}
                    ${this.renderPostponedSection(postponedTasks)}
                </div>
            `;
        } catch (error) {
            return this.handleRenderError(error);
        }
    }

    /**
     * Inicializa a view e configura listeners
     */
    mount() {
        try {
            this.isLoading = true;

            // Atualizar a cada 1 minuto com throttle
            this.updateInterval = setInterval(() => {
                this.throttledUpdate();
            }, UPDATE_INTERVAL);

            // Escutar mudanças no store com debounce
            this.unsubscribe = store.subscribe(() => {
                this.debouncedUpdate();
            });

            // Configurar event listeners
            this.setupEventListeners();

            this.isLoading = false;
        } catch (error) {
            this.handleError('Erro ao montar HomeView', error);
        }
    }

    /**
     * Atualiza a visualização com renderização incremental
     */
    update() {
        try {
            const container = document.getElementById('app');
            if (!container) {
                return;
            }

            const state = store.getState();
            if (!validateStoreData(state.tarefasHome, 'array')) {
                return;
            }

            const homeTasks = state.tarefasHome || [];
            const filteredTasks = this.applyFilters(homeTasks);
            const upcomingTasks = this.memoizedGetUpcomingTasks(
                this.filterUpcomingTasks(filteredTasks),
                UPCOMING_TASKS_HOURS
            );
            const overdueTasks = this.memoizedGetOverdueTasks(
                this.filterOverdueTasks(filteredTasks)
            );
            const completedTasks = getCompletedTasks(filteredTasks);
            const postponedTasks = getPostponedTasks(filteredTasks);
            const completedToday = getTasksCompletedToday(homeTasks);
            const totalToday = getTotalTasksToday(homeTasks);
            const sortedUpcomingTasks = this.sortTasks(upcomingTasks, this.currentFilter.sortBy);

            const now = new Date();
            const currentTask = sortedUpcomingTasks.find((task) => {
                const taskTime = toDate(task.time);
                return taskTime && taskTime <= now;
            });

            const newRenderData = {
                upcomingTasks: sortedUpcomingTasks,
                overdueTasks,
                completedTasks,
                postponedTasks,
                completedToday: completedToday.length,
                totalToday,
                streak: state.streak || 0,
                currentTask
            };

            // Renderização incremental
            if (this.lastRenderData) {
                this.updateIncremental(newRenderData);
            } else {
                container.innerHTML = this.render();
                this.setupEventListeners();
            }

            this.lastRenderData = newRenderData;
        } catch (error) {
            this.handleError('Erro ao atualizar view', error);
        }
    }

    /**
     * Atualização incremental do DOM
     * @param {Object} newData - Novos dados de renderização
     * @private
     */
    updateIncremental(newData) {
        const oldData = this.lastRenderData;
        if (!oldData) {
            document.getElementById('app').innerHTML = this.render();
            this.setupEventListeners();
            return;
        }

        // Atualizar timeline incrementalmente
        const timelineChanges = compareTaskArrays(oldData.upcomingTasks, newData.upcomingTasks);
        if (timelineChanges.changed) {
            this.updateTimelineSection(newData.upcomingTasks, newData.currentTask);
        }

        // Atualizar seção de atrasadas
        const overdueChanges = compareTaskArrays(oldData.overdueTasks, newData.overdueTasks);
        if (overdueChanges.changed) {
            this.updateOverdueSection(newData.overdueTasks);
        }

        // Atualizar métricas
        if (oldData.completedToday !== newData.completedToday ||
            oldData.totalToday !== newData.totalToday ||
            oldData.streak !== newData.streak) {
            this.updateMetricsSection(newData.completedToday, newData.totalToday, newData.streak);
        }

        // Atualizar seção de concluídas
        const completedChanges = compareTaskArrays(oldData.completedTasks || [], newData.completedTasks || []);
        if (completedChanges.changed) {
            this.updateCompletedSection(newData.completedTasks || []);
        }

        // Atualizar seção de adiadas
        const postponedChanges = compareTaskArrays(oldData.postponedTasks || [], newData.postponedTasks || []);
        if (postponedChanges.changed) {
            this.updatePostponedSection(newData.postponedTasks || []);
        }
    }

    /**
     * Atualiza apenas a seção de timeline
     * @param {Array} tasks - Lista de tarefas
     * @param {Object} currentTask - Tarefa atual
     * @private
     */
    updateTimelineSection(tasks, currentTask) {
        const timelineContainer = document.getElementById('home-timeline');
        if (!timelineContainer) return;

        if (tasks.length > 0) {
            timelineContainer.innerHTML = this.renderTimeline(tasks, currentTask);
        } else {
            timelineContainer.innerHTML = this.renderEmptyState('Nenhuma tarefa nas próximas 2 horas', true);
        }
        this.setupSwipeGestures();
    }

    /**
     * Atualiza apenas a seção de atrasadas
     * @param {Array} tasks - Lista de tarefas atrasadas
     * @private
     */
    updateOverdueSection(tasks) {
        const section = document.getElementById('home-section-overdue');
        if (!section) {
            // Seção não existe, renderizar tudo
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = this.render();
                this.setupEventListeners();
            }
            return;
        }

        if (tasks.length === 0) {
            section.remove();
            return;
        }

        const shouldCollapse = tasks.length > COLLAPSE_THRESHOLD;
        const displayTasks = shouldCollapse ? tasks.slice(0, COLLAPSE_THRESHOLD) : tasks;
        const list = document.getElementById('home-overdue-list');

        if (list) {
            const overdueItems = displayTasks
                .filter(task => task != null)
                .map(task => {
                    const taskCard = new TaskCard(task, {
                        showCheckbox: true,
                        showModule: true,
                        showPriority: true,
                        showDuration: false,
                        isCurrent: false,
                        isOverdue: true,
                        showActions: true,
                    });
                    const taskId = this.getTaskId(task);
                    return `<div class="overdue-item" data-task-id="${taskId}" role="listitem">${taskCard.render().outerHTML}</div>`;
                })
                .join('');

            list.innerHTML = overdueItems;

            // Atualizar badge
            const badge = section.querySelector('.home-section-badge');
            if (badge) {
                badge.textContent = tasks.length;
            }

            // Atualizar botão "Ver todas"
            const existingBtn = document.getElementById('btn-show-all-overdue');
            if (shouldCollapse && !existingBtn) {
                const showAllButton = document.createElement('button');
                showAllButton.className = 'btn btn-secondary mt-md';
                showAllButton.id = 'btn-show-all-overdue';
                showAllButton.textContent = `Ver todas (${tasks.length})`;
                showAllButton.setAttribute('aria-label', `Ver todas as ${tasks.length} tarefas atrasadas`);
                showAllButton.addEventListener('click', () => this.showAllOverdue());
                this.registerEventListener('click', () => this.showAllOverdue(), showAllButton);
                section.appendChild(showAllButton);
            } else if (!shouldCollapse && existingBtn) {
                existingBtn.remove();
            }
        }

        this.setupSwipeGestures();
    }

    /**
     * Atualiza apenas a seção de métricas
     * @param {number} completed - Tarefas concluídas
     * @param {number} total - Total de tarefas
     * @param {number} streak - Dias de streak
     * @private
     */
    updateMetricsSection(completed, total, streak) {
        const section = document.getElementById('home-section-metrics');
        if (!section) return;

        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        const completedValue = section.querySelector('.home-metrics-item:first-child .home-metrics-value');
        if (completedValue) {
            completedValue.textContent = `${completed}/${total}`;
        }

        const streakValue = section.querySelector('.home-metrics-item:last-child .home-metrics-value');
        if (streakValue) {
            streakValue.textContent = `🔥 ${streak} dias`;
        }

        const progressBar = section.querySelector('.home-metrics-progress-bar');
        const progressText = section.querySelector('.home-metrics-progress-text');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
            progressBar.setAttribute('aria-label', `${percentage}% das tarefas concluídas`);
        }
        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
    }

    /**
     * Atualiza apenas a seção de tarefas concluídas
     * @param {Array} tasks - Lista de tarefas concluídas
     * @private
     */
    updateCompletedSection(tasks) {
        const section = document.getElementById('home-section-completed');
        if (!section) {
            // Seção não existe, renderizar tudo
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = this.render();
                this.setupEventListeners();
            }
            return;
        }

        if (tasks.length === 0) {
            section.remove();
            return;
        }

        const shouldCollapse = tasks.length > COLLAPSE_THRESHOLD;
        const displayTasks = shouldCollapse ? tasks.slice(0, COLLAPSE_THRESHOLD) : tasks;
        const list = document.getElementById('home-completed-list');

        if (list) {
            const completedItems = displayTasks
                .filter(task => task != null)
                .map(task => {
                    const taskCard = new TaskCard(task, {
                        showCheckbox: true,
                        showModule: true,
                        showPriority: true,
                        showDuration: false,
                        isCurrent: false,
                        isOverdue: false,
                        showActions: true,
                        isCompleted: true,
                    });
                    const taskId = this.getTaskId(task);
                    return `<div class="completed-item" data-task-id="${taskId}" role="listitem" tabindex="0" aria-label="Tarefa concluída: ${escapeHtml(task.titulo || task.nome || 'Sem título')}">${taskCard.render().outerHTML}</div>`;
                })
                .join('');

            list.innerHTML = completedItems;

            // Atualizar badge
            const badge = section.querySelector('.home-section-badge');
            if (badge) {
                badge.textContent = tasks.length;
            }

            // Atualizar botão "Ver todas"
            const existingBtn = document.getElementById('btn-show-all-completed');
            if (shouldCollapse && !existingBtn) {
                const showAllButton = document.createElement('button');
                showAllButton.className = 'btn btn-secondary mt-md';
                showAllButton.id = 'btn-show-all-completed';
                showAllButton.textContent = `Ver todas (${tasks.length})`;
                showAllButton.setAttribute('aria-label', `Ver todas as ${tasks.length} tarefas concluídas`);
                showAllButton.addEventListener('click', () => this.showAllCompleted());
                this.registerEventListener('click', () => this.showAllCompleted(), showAllButton);
                section.appendChild(showAllButton);
            } else if (!shouldCollapse && existingBtn) {
                existingBtn.remove();
            }
        }

        this.setupSwipeGestures();
    }

    /**
     * Atualiza apenas a seção de tarefas adiadas
     * @param {Array} tasks - Lista de tarefas adiadas
     * @private
     */
    updatePostponedSection(tasks) {
        const section = document.getElementById('home-section-postponed');
        if (!section) {
            // Seção não existe, renderizar tudo
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = this.render();
                this.setupEventListeners();
            }
            return;
        }

        if (tasks.length === 0) {
            section.remove();
            return;
        }

        const shouldCollapse = tasks.length > COLLAPSE_THRESHOLD;
        const displayTasks = shouldCollapse ? tasks.slice(0, COLLAPSE_THRESHOLD) : tasks;
        const list = document.getElementById('home-postponed-list');

        if (list) {
            const postponedItems = displayTasks
                .filter(task => task != null)
                .map(task => {
                    const taskCard = new TaskCard(task, {
                        showCheckbox: true,
                        showModule: true,
                        showPriority: true,
                        showDuration: true,
                        isCurrent: false,
                        isOverdue: false,
                        showActions: true,
                    });
                    const taskId = this.getTaskId(task);
                    return `<div class="postponed-item" data-task-id="${taskId}" role="listitem" tabindex="0" aria-label="Tarefa adiada: ${escapeHtml(task.titulo || task.nome || 'Sem título')}">${taskCard.render().outerHTML}</div>`;
                })
                .join('');

            list.innerHTML = postponedItems;

            // Atualizar badge
            const badge = section.querySelector('.home-section-badge');
            if (badge) {
                badge.textContent = tasks.length;
            }

            // Atualizar botão "Ver todas"
            const existingBtn = document.getElementById('btn-show-all-postponed');
            if (shouldCollapse && !existingBtn) {
                const showAllButton = document.createElement('button');
                showAllButton.className = 'btn btn-secondary mt-md';
                showAllButton.id = 'btn-show-all-postponed';
                showAllButton.textContent = `Ver todas (${tasks.length})`;
                showAllButton.setAttribute('aria-label', `Ver todas as ${tasks.length} tarefas adiadas`);
                showAllButton.addEventListener('click', () => this.showAllPostponed());
                this.registerEventListener('click', () => this.showAllPostponed(), showAllButton);
                section.appendChild(showAllButton);
            } else if (!shouldCollapse && existingBtn) {
                existingBtn.remove();
            }
        }

        this.setupSwipeGestures();
    }

    /**
     * Limpa recursos e remove listeners
     */
    destroy() {
        try {
            // Limpar interval
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }

            // Limpar subscription
            if (this.unsubscribe) {
                this.unsubscribe();
                this.unsubscribe = null;
            }

            // Limpar event listeners
            this.cleanupEventListeners();

            // Limpar swipe gestures
            this.cleanupSwipeGestures();

            // Limpar memoização
            this.lastRenderData = null;
            this.swipeGestureMap.clear();
        } catch (error) {
            this.handleError('Erro ao destruir HomeView', error);
        }
    }

    // ============================================================================
    // MÉTODOS DE RENDERIZAÇÃO
    // ============================================================================

    /**
     * Renderiza estado de loading
     * @returns {string} HTML do loading
     * @private
     */
    renderLoadingState() {
        return `
            <div class="home-view" role="main" aria-label="Carregando dashboard">
                <div class="home-loading" role="status" aria-live="polite" aria-label="Carregando">
                    <div class="home-skeleton">
                        <div class="home-skeleton-header"></div>
                        <div class="home-skeleton-item"></div>
                        <div class="home-skeleton-item"></div>
                        <div class="home-skeleton-item"></div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza estado de erro
     * @param {string} message - Mensagem de erro
     * @returns {string} HTML do erro
     * @private
     */
    renderErrorState(message) {
        return `
            <div class="home-view" role="main">
                <div class="home-error-state" role="alert">
                    <p class="home-error-message">${escapeHtml(message)}</p>
                    <button class="btn btn-primary" id="btn-retry-home" aria-label="Tentar novamente">
                        Tentar novamente
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza seção de filtros e busca
     * @returns {string} HTML dos filtros
     * @private
     */
    renderFiltersSection() {
        return `
            <section class="home-filters" role="search" aria-label="Filtros e busca de tarefas">
                <div class="home-filters-row">
                    <div class="home-search-wrapper">
                        <input 
                            type="search" 
                            id="home-search-input" 
                            class="home-search-input" 
                            placeholder="Buscar tarefas..."
                            aria-label="Buscar tarefas"
                            value="${escapeHtml(this.currentFilter.search)}"
                        />
                        <span class="home-search-icon" aria-hidden="true">🔍</span>
                    </div>
                    <div class="home-filters-group">
                        <label for="home-filter-priority" class="home-filter-label">Prioridade:</label>
                        <select 
                            id="home-filter-priority" 
                            class="home-filter-select"
                            aria-label="Filtrar por prioridade"
                        >
                            <option value="all" ${this.currentFilter.priority === 'all' ? 'selected' : ''}>Todas</option>
                            <option value="urgente" ${this.currentFilter.priority === 'urgente' ? 'selected' : ''}>Urgente</option>
                            <option value="alta" ${this.currentFilter.priority === 'alta' ? 'selected' : ''}>Alta</option>
                            <option value="media" ${this.currentFilter.priority === 'media' ? 'selected' : ''}>Média</option>
                            <option value="baixa" ${this.currentFilter.priority === 'baixa' ? 'selected' : ''}>Baixa</option>
                        </select>
                    </div>
                    <div class="home-filters-group">
                        <label for="home-filter-sort" class="home-filter-label">Ordenar:</label>
                        <select 
                            id="home-filter-sort" 
                            class="home-filter-select"
                            aria-label="Ordenar tarefas"
                        >
                            <option value="time" ${this.currentFilter.sortBy === 'time' ? 'selected' : ''}>Por horário</option>
                            <option value="priority" ${this.currentFilter.sortBy === 'priority' ? 'selected' : ''}>Por prioridade</option>
                            <option value="module" ${this.currentFilter.sortBy === 'module' ? 'selected' : ''}>Por módulo</option>
                            <option value="createdAt" ${this.currentFilter.sortBy === 'createdAt' ? 'selected' : ''}>Por data de criação</option>
                        </select>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Renderiza a seção de tarefas próximas
     * @param {Array} upcomingTasks - Lista de tarefas próximas
     * @param {Object} currentTask - Tarefa atual em execução
     * @returns {string} HTML da seção
     * @private
     */
    renderUpcomingSection(upcomingTasks, currentTask) {
        return `
            <section class="home-section home-section-now" aria-labelledby="upcoming-tasks-title">
                <div class="home-section-header">
                    <h2 id="upcoming-tasks-title" class="home-section-title">⏰ Próximas 2 horas</h2>
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <span class="home-section-badge" aria-label="${upcomingTasks.length} tarefas nas próximas 2 horas">${upcomingTasks.length}</span>
                        <button 
                            class="btn btn-primary btn-icon" 
                            id="btn-add-task-home" 
                            title="Adicionar tarefa"
                            aria-label="Adicionar nova tarefa"
                        >
                            <span aria-hidden="true">➕</span>
                            <span class="btn-text">Nova Tarefa</span>
                        </button>
                    </div>
                </div>
                <div class="home-timeline" id="home-timeline" role="list" aria-label="Lista de tarefas próximas">
                    ${upcomingTasks.length > 0 
                        ? this.renderTimeline(upcomingTasks, currentTask) 
                        : this.renderEmptyState('Nenhuma tarefa nas próximas 2 horas', true)
                    }
                </div>
            </section>
        `;
    }

    /**
     * Renderiza a timeline de tarefas
     * @param {Array} tasks - Lista de tarefas
     * @param {Object} currentTask - Tarefa atual
     * @returns {string} HTML da timeline
     * @private
     */
    renderTimeline(tasks, currentTask) {
        if (!Array.isArray(tasks)) {
            return this.renderEmptyState('Erro ao carregar tarefas');
        }

        const timelineItems = tasks
            .filter(task => task != null)
            .map(task => {
                const taskCard = new TaskCard(task, {
                    showCheckbox: true,
                    showModule: true,
                    showPriority: true,
                    showDuration: true,
                    isCurrent: currentTask && this.getTaskId(currentTask) === this.getTaskId(task),
                    isOverdue: false,
                    showActions: true,
                });
                const taskId = this.getTaskId(task);
                return `<div class="timeline-item" data-task-id="${taskId}" role="listitem" tabindex="0" aria-label="Tarefa: ${escapeHtml(task.titulo || task.nome || 'Sem título')}">${taskCard.render().outerHTML}</div>`;
            })
            .join('');

        return `<div class="timeline-list">${timelineItems}</div>`;
    }

    /**
     * Renderiza a seção de tarefas atrasadas
     * @param {Array} overdueTasks - Lista de tarefas atrasadas
     * @returns {string} HTML da seção
     * @private
     */
    renderOverdueSection(overdueTasks) {
        if (!Array.isArray(overdueTasks) || overdueTasks.length === 0) {
            return '';
        }

        const shouldCollapse = overdueTasks.length > COLLAPSE_THRESHOLD;
        const displayTasks = shouldCollapse ?
            overdueTasks.slice(0, COLLAPSE_THRESHOLD) :
            overdueTasks;

        const overdueItems = displayTasks
            .filter(task => task != null)
            .map(task => {
                const taskCard = new TaskCard(task, {
                    showCheckbox: true,
                    showModule: true,
                    showPriority: true,
                    showDuration: false,
                    isCurrent: false,
                    isOverdue: true,
                    showActions: true,
                });
                const taskId = this.getTaskId(task);
                return `<div class="overdue-item" data-task-id="${taskId}" role="listitem" tabindex="0" aria-label="Tarefa atrasada: ${escapeHtml(task.titulo || task.nome || 'Sem título')}">${taskCard.render().outerHTML}</div>`;
            })
            .join('');

        const showAllButton = shouldCollapse ?
            `<button class="btn btn-secondary mt-md" id="btn-show-all-overdue" aria-label="Ver todas as ${overdueTasks.length} tarefas atrasadas">Ver todas (${overdueTasks.length})</button>` :
            '';

        return `
            <section class="home-section home-section-overdue" id="home-section-overdue" aria-labelledby="overdue-tasks-title">
                <div class="home-section-header">
                    <h2 id="overdue-tasks-title" class="home-section-title">⚠️ Atrasadas</h2>
                    <span class="home-section-badge badge badge-danger" aria-label="${overdueTasks.length} tarefas atrasadas">${overdueTasks.length}</span>
                </div>
                <div class="home-overdue-list" id="home-overdue-list" role="list" aria-label="Lista de tarefas atrasadas">
                    ${overdueItems}
                </div>
                ${showAllButton}
            </section>
        `;
    }

    /**
     * Renderiza a seção de métricas do dashboard
     * @param {number} completed - Número de tarefas concluídas
     * @param {number} total - Total de tarefas do dia
     * @param {number} streak - Dias de streak
     * @returns {string} HTML das métricas
     * @private
     */
    renderMetricsSection(completed, total, streak) {
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return `
            <section class="home-section home-section-metrics" id="home-section-metrics" aria-labelledby="metrics-title">
                <h2 id="metrics-title" class="sr-only">Métricas do dia</h2>
                <div class="home-metrics" role="region" aria-label="Estatísticas do dia">
                    <div class="home-metrics-item">
                        <div class="home-metrics-label">Concluídas hoje</div>
                        <div class="home-metrics-value" aria-label="${completed} de ${total} tarefas concluídas">${completed}/${total}</div>
                    </div>
                    <div class="home-metrics-item">
                        <div class="home-metrics-label">Streak</div>
                        <div class="home-metrics-value" aria-label="${streak} dias consecutivos">🔥 ${streak} dias</div>
                    </div>
                    <div class="home-metrics-progress" role="progressbar" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso: ${percentage}% das tarefas concluídas">
                        <div class="home-metrics-progress-bar" style="width: ${percentage}%"></div>
                        <span class="home-metrics-progress-text">${percentage}%</span>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * Renderiza a seção de tarefas concluídas
     * @param {Array} completedTasks - Lista de tarefas concluídas
     * @returns {string} HTML da seção
     * @private
     */
    renderCompletedSection(completedTasks) {
        if (!Array.isArray(completedTasks) || completedTasks.length === 0) {
            return '';
        }

        const shouldCollapse = completedTasks.length > COLLAPSE_THRESHOLD;
        const displayTasks = shouldCollapse ?
            completedTasks.slice(0, COLLAPSE_THRESHOLD) :
            completedTasks;

        const completedItems = displayTasks
            .filter(task => task != null)
            .map(task => {
                const taskCard = new TaskCard(task, {
                    showCheckbox: true,
                    showModule: true,
                    showPriority: true,
                    showDuration: false,
                    isCurrent: false,
                    isOverdue: false,
                    showActions: true,
                    isCompleted: true,
                });
                const taskId = this.getTaskId(task);
                return `<div class="completed-item" data-task-id="${taskId}" role="listitem" tabindex="0" aria-label="Tarefa concluída: ${escapeHtml(task.titulo || task.nome || 'Sem título')}">${taskCard.render().outerHTML}</div>`;
            })
            .join('');

        const showAllButton = shouldCollapse ?
            `<button class="btn btn-secondary mt-md" id="btn-show-all-completed" aria-label="Ver todas as ${completedTasks.length} tarefas concluídas">Ver todas (${completedTasks.length})</button>` :
            '';

        return `
            <section class="home-section home-section-completed" id="home-section-completed" aria-labelledby="completed-tasks-title">
                <div class="home-section-header">
                    <h2 id="completed-tasks-title" class="home-section-title">✅ Concluídas</h2>
                    <span class="home-section-badge badge badge-success" aria-label="${completedTasks.length} tarefas concluídas">${completedTasks.length}</span>
                </div>
                <div class="home-completed-list" id="home-completed-list" role="list" aria-label="Lista de tarefas concluídas">
                    ${completedItems}
                </div>
                ${showAllButton}
            </section>
        `;
    }

    /**
     * Renderiza a seção de tarefas adiadas
     * @param {Array} postponedTasks - Lista de tarefas adiadas
     * @returns {string} HTML da seção
     * @private
     */
    renderPostponedSection(postponedTasks) {
        if (!Array.isArray(postponedTasks) || postponedTasks.length === 0) {
            return '';
        }

        const shouldCollapse = postponedTasks.length > COLLAPSE_THRESHOLD;
        const displayTasks = shouldCollapse ?
            postponedTasks.slice(0, COLLAPSE_THRESHOLD) :
            postponedTasks;

        const postponedItems = displayTasks
            .filter(task => task != null)
            .map(task => {
                const taskCard = new TaskCard(task, {
                    showCheckbox: true,
                    showModule: true,
                    showPriority: true,
                    showDuration: true,
                    isCurrent: false,
                    isOverdue: false,
                    showActions: true,
                });
                const taskId = this.getTaskId(task);
                return `<div class="postponed-item" data-task-id="${taskId}" role="listitem" tabindex="0" aria-label="Tarefa adiada: ${escapeHtml(task.titulo || task.nome || 'Sem título')}">${taskCard.render().outerHTML}</div>`;
            })
            .join('');

        const showAllButton = shouldCollapse ?
            `<button class="btn btn-secondary mt-md" id="btn-show-all-postponed" aria-label="Ver todas as ${postponedTasks.length} tarefas adiadas">Ver todas (${postponedTasks.length})</button>` :
            '';

        return `
            <section class="home-section home-section-postponed" id="home-section-postponed" aria-labelledby="postponed-tasks-title">
                <div class="home-section-header">
                    <h2 id="postponed-tasks-title" class="home-section-title">📅 Adiadas</h2>
                    <span class="home-section-badge badge badge-info" aria-label="${postponedTasks.length} tarefas adiadas">${postponedTasks.length}</span>
                </div>
                <div class="home-postponed-list" id="home-postponed-list" role="list" aria-label="Lista de tarefas adiadas">
                    ${postponedItems}
                </div>
                ${showAllButton}
            </section>
        `;
    }

    /**
     * Renderiza estado vazio melhorado
     * @param {string} message - Mensagem a exibir
     * @param {boolean} showCTA - Mostrar call-to-action
     * @returns {string} HTML do estado vazio
     * @private
     */
    renderEmptyState(message, showCTA = false) {
        const ctaButton = showCTA ? `
            <button class="btn btn-primary mt-md" id="btn-add-task-empty" aria-label="Adicionar nova tarefa">
                ➕ Adicionar Tarefa
            </button>
        ` : '';

        return `
            <div class="home-empty-state" role="status" aria-live="polite">
                <div class="home-empty-state-icon" aria-hidden="true">📋</div>
                <p class="home-empty-state-text">${escapeHtml(message)}</p>
                ${ctaButton}
            </div>
        `;
    }

    // ============================================================================
    // FILTROS E ORDENAÇÃO
    // ============================================================================

    /**
     * Aplica filtros às tarefas
     * @param {Array} tasks - Lista de tarefas
     * @returns {Array} Tarefas filtradas
     * @private
     */
    applyFilters(tasks) {
        if (!Array.isArray(tasks)) return [];

        let filtered = [...tasks];

        // Filtro de busca
        if (this.currentFilter.search) {
            const searchLower = this.currentFilter.search.toLowerCase();
            filtered = filtered.filter(task => {
                const title = (task.titulo || task.nome || '').toLowerCase();
                const desc = (task.descricao || '').toLowerCase();
                const module = (task.modulo || task.area || '').toLowerCase();
                return title.includes(searchLower) || desc.includes(searchLower) || module.includes(searchLower);
            });
        }

        // Filtro de prioridade
        if (this.currentFilter.priority !== 'all') {
            filtered = filtered.filter(task => {
                const priority = (task.prioridade || 'media').toLowerCase();
                return priority === this.currentFilter.priority.toLowerCase();
            });
        }

        return filtered;
    }

    /**
     * Filtra apenas tarefas próximas
     * @param {Array} tasks - Lista de tarefas
     * @returns {Array} Tarefas próximas
     * @private
     */
    filterUpcomingTasks(tasks) {
        return tasks.filter(task => {
            if (task.completed) return false;
            const taskTime = toDate(task.time);
            if (!taskTime) return false;
            const now = new Date();
            const limit = new Date(now.getTime() + UPCOMING_TASKS_HOURS * 60 * 60 * 1000);
            return taskTime >= now && taskTime <= limit;
        });
    }

    /**
     * Filtra apenas tarefas atrasadas
     * @param {Array} tasks - Lista de tarefas
     * @returns {Array} Tarefas atrasadas
     * @private
     */
    filterOverdueTasks(tasks) {
        return tasks.filter(task => {
            if (task.completed) return false;
            const taskDate = toDate(task.time || task.deadline);
            if (!taskDate) return false;
            return taskDate < new Date();
        });
    }

    /**
     * Ordena tarefas
     * @param {Array} tasks - Lista de tarefas
     * @param {string} sortBy - Critério de ordenação
     * @returns {Array} Tarefas ordenadas
     * @private
     */
    sortTasks(tasks, sortBy) {
        if (!Array.isArray(tasks)) return [];

        const sorted = [...tasks];

        switch (sortBy) {
            case 'priority':
                const priorityOrder = {
                    urgente: 4,
                    alta: 3,
                    media: 2,
                    baixa: 1
                };
                return sorted.sort((a, b) => {
                    const priorityA = priorityOrder[(a.prioridade || 'media').toLowerCase()] || 0;
                    const priorityB = priorityOrder[(b.prioridade || 'media').toLowerCase()] || 0;
                    return priorityB - priorityA;
                });

            case 'module':
                return sorted.sort((a, b) => {
                    const moduleA = (a.modulo || a.area || '').toLowerCase();
                    const moduleB = (b.modulo || b.area || '').toLowerCase();
                    return moduleA.localeCompare(moduleB);
                });

            case 'createdAt':
                return sorted.sort((a, b) => {
                    const dateA = toDate(a.createdAt) || new Date(0);
                    const dateB = toDate(b.createdAt) || new Date(0);
                    return dateB - dateA;
                });

            case 'time':
            default:
                return sorted.sort((a, b) => {
                    const timeA = toDate(a.time) || new Date(0);
                    const timeB = toDate(b.time) || new Date(0);
                    return timeA - timeB;
                });
        }
    }

    // ============================================================================
    // MÉTODOS DE EVENT HANDLERS
    // ============================================================================

    /**
     * Configura todos os event listeners
     * @private
     */
    setupEventListeners() {
        // Limpar listeners anteriores
        this.cleanupEventListeners();

        // Criar versões com debounce/throttle
        this.debouncedUpdate = debounce(() => this.update(), DEBOUNCE_DELAY);
        this.throttledUpdate = throttle(() => this.update(), THROTTLE_DELAY);

        // Event delegation para checkboxes de conclusão
        const checkboxHandler = (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                const taskId = e.target.getAttribute('data-task-id');
                if (taskId) {
                    this.handleTaskComplete(taskId, e.target.checked);
                }
            }
        };
        document.addEventListener('change', checkboxHandler);
        this.registerEventListener('change', checkboxHandler, document);

        // Busca
        const searchInput = document.getElementById('home-search-input');
        if (searchInput) {
            const searchHandler = debounce((e) => {
                this.currentFilter.search = e.target.value;
                this.update();
            }, 300);
            searchInput.addEventListener('input', searchHandler);
            this.registerEventListener('input', searchHandler, searchInput);
        }

        // Filtro de prioridade
        const priorityFilter = document.getElementById('home-filter-priority');
        if (priorityFilter) {
            const priorityHandler = (e) => {
                this.currentFilter.priority = e.target.value;
                this.update();
            };
            priorityFilter.addEventListener('change', priorityHandler);
            this.registerEventListener('change', priorityHandler, priorityFilter);
        }

        // Ordenação
        const sortFilter = document.getElementById('home-filter-sort');
        if (sortFilter) {
            const sortHandler = (e) => {
                this.currentFilter.sortBy = e.target.value;
                this.update();
            };
            sortFilter.addEventListener('change', sortHandler);
            this.registerEventListener('change', sortHandler, sortFilter);
        }

        // Botão "Ver todas" tarefas atrasadas
        const btnShowAll = document.getElementById('btn-show-all-overdue');
        if (btnShowAll) {
            const showAllHandler = () => this.showAllOverdue();
            btnShowAll.addEventListener('click', showAllHandler);
            this.registerEventListener('click', showAllHandler, btnShowAll);
        }

        // Botão "Ver todas" tarefas concluídas
        const btnShowAllCompleted = document.getElementById('btn-show-all-completed');
        if (btnShowAllCompleted) {
            const showAllCompletedHandler = () => this.showAllCompleted();
            btnShowAllCompleted.addEventListener('click', showAllCompletedHandler);
            this.registerEventListener('click', showAllCompletedHandler, btnShowAllCompleted);
        }

        // Botão "Ver todas" tarefas adiadas
        const btnShowAllPostponed = document.getElementById('btn-show-all-postponed');
        if (btnShowAllPostponed) {
            const showAllPostponedHandler = () => this.showAllPostponed();
            btnShowAllPostponed.addEventListener('click', showAllPostponedHandler);
            this.registerEventListener('click', showAllPostponedHandler, btnShowAllPostponed);
        }

        // Botão adicionar nova tarefa
        const btnAddTask = document.getElementById('btn-add-task-home');
        if (btnAddTask) {
            const addTaskHandler = () => this.handleTaskAdd();
            btnAddTask.addEventListener('click', addTaskHandler);
            this.registerEventListener('click', addTaskHandler, btnAddTask);
        }

        // Botão adicionar tarefa no empty state
        const btnAddTaskEmpty = document.getElementById('btn-add-task-empty');
        if (btnAddTaskEmpty) {
            const addTaskEmptyHandler = () => this.handleTaskAdd();
            btnAddTaskEmpty.addEventListener('click', addTaskEmptyHandler);
            this.registerEventListener('click', addTaskEmptyHandler, btnAddTaskEmpty);
        }

        // Botão retry em caso de erro
        const btnRetry = document.getElementById('btn-retry-home');
        if (btnRetry) {
            const retryHandler = () => {
                this.isLoading = false;
                this.lastRenderData = null;
                this.update();
            };
            btnRetry.addEventListener('click', retryHandler);
            this.registerEventListener('click', retryHandler, btnRetry);
        }

        // Event delegation para botões de ação (editar/excluir)
        const actionHandler = (e) => {
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
        document.addEventListener('click', actionHandler);
        this.registerEventListener('click', actionHandler, document);

        // Navegação por teclado
        this.setupKeyboardNavigation();

        // Aplicar swipe gestures nos cards
        this.setupSwipeGestures();
    }

    /**
     * Configura navegação por teclado
     * @private
     */
    setupKeyboardNavigation() {
        const keyboardHandler = (e) => {
            // Navegação em listas com setas
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const focused = document.activeElement;
                if (focused && (focused.classList.contains('timeline-item') || focused.classList.contains('overdue-item'))) {
                    e.preventDefault();
                    const items = Array.from(document.querySelectorAll('.timeline-item, .overdue-item'));
                    const currentIndex = items.indexOf(focused);
                    if (currentIndex === -1) return;

                    const nextIndex = e.key === 'ArrowDown' ?
                        Math.min(currentIndex + 1, items.length - 1) :
                        Math.max(currentIndex - 1, 0);

                    items[nextIndex].focus();
                }
            }

            // Enter para interagir com item focado
            if (e.key === 'Enter') {
                const focused = document.activeElement;
                if (focused && (focused.classList.contains('timeline-item') || focused.classList.contains('overdue-item'))) {
                    const checkbox = focused.querySelector('.task-checkbox');
                    if (checkbox) {
                        checkbox.click();
                    }
                }
            }

            // Esc para fechar modais (se houver)
            if (e.key === 'Escape') {
                // Lógica de fechar modais pode ser adicionada aqui
            }
        };

        document.addEventListener('keydown', keyboardHandler);
        this.registerEventListener('keydown', keyboardHandler, document);
    }

    /**
     * Registra um event listener para cleanup posterior
     * @param {string} type - Tipo do evento
     * @param {Function} handler - Handler do evento
     * @param {EventTarget} target - Elemento alvo
     * @private
     */
    registerEventListener(type, handler, target) {
        this.eventListeners.push({
            type,
            handler,
            target
        });
    }

    /**
     * Limpa todos os event listeners registrados
     * @private
     */
    cleanupEventListeners() {
        this.eventListeners.forEach(({
            type,
            handler,
            target
        }) => {
            if (target && typeof target.removeEventListener === 'function') {
                target.removeEventListener(type, handler);
            }
        });
        this.eventListeners = [];
    }

    // ============================================================================
    // SWIPE GESTURES
    // ============================================================================

    /**
     * Configura swipe gestures nos cards de tarefas
     * @private
     */
    setupSwipeGestures() {
        // Limpar gestures anteriores apenas dos elementos removidos
        const currentCards = new Set();

        // Seletores para cards de tarefas
        const selectors = [
            '.timeline-item .task-card',
            '.overdue-item .task-card',
            '.completed-item .task-card',
            '.postponed-item .task-card'
        ];

        selectors.forEach(selector => {
            const items = document.querySelectorAll(selector);
            items.forEach(card => {
                const taskId = card.querySelector('.task-checkbox').getAttribute('data-task-id');
                if (taskId) {
                    currentCards.add(taskId);

                    // Só configurar se ainda não existe
                    if (!this.swipeGestureMap.has(taskId)) {
                        const cleanup = this.setupSwipeGestureForCard(card, taskId);
                        if (cleanup) {
                            this.swipeGestureMap.set(taskId, cleanup);
                        }
                    }
                }
            });
        });

        // Limpar gestures de cards que não existem mais
        this.swipeGestureMap.forEach((cleanup, taskId) => {
            if (!currentCards.has(taskId)) {
                if (typeof cleanup === 'function') {
                    try {
                        cleanup();
                    } catch (error) {
                        console.error('Erro ao limpar swipe gesture:', error);
                    }
                }
                this.swipeGestureMap.delete(taskId);
            }
        });
    }

    /**
     * Configura swipe gesture para um card específico
     * @param {HTMLElement} card - Elemento do card
     * @param {string} taskId - ID da tarefa
     * @returns {Function|null} Função de cleanup ou null
     * @private
     */
    setupSwipeGestureForCard(card, taskId) {
        if (!taskId || !card) {
            return null;
        }

        try {
            setupSwipeGestures(card, {
                onSwipeLeft: createCompleteTaskHandler(taskId, (id) => {
                    this.handleTaskComplete(id, true);
                }),
                onSwipeRight: createPostponeTaskHandler(taskId, (id, days) => {
                    this.handlePostponeTask(id, days);
                })
            });

            // Retornar função de cleanup se disponível
            return () => {
                // Cleanup será feito pelo módulo swipe-gestures se necessário
            };
        } catch (error) {
            this.handleError('Erro ao configurar swipe gesture', error);
            return null;
        }
    }

    /**
     * Limpa todos os swipe gestures
     * @private
     */
    cleanupSwipeGestures() {
        this.swipeGestureMap.forEach((cleanup, taskId) => {
            if (typeof cleanup === 'function') {
                try {
                    cleanup();
                } catch (error) {
                    this.handleError('Erro ao limpar swipe gesture', error);
                }
            }
        });
        this.swipeGestureMap.clear();
        this.swipeGestureCleanups.forEach(cleanup => {
            if (typeof cleanup === 'function') {
                try {
                    cleanup();
                } catch (error) {
                    this.handleError('Erro ao limpar swipe gesture', error);
                }
            }
        });
        this.swipeGestureCleanups = [];
    }

    // ============================================================================
    // HANDLERS DE TAREFAS
    // ============================================================================

    /**
     * Manipula a conclusão de uma tarefa
     * @param {string|number} taskId - ID da tarefa
     * @param {boolean} completed - Status de conclusão
     */
    handleTaskComplete(taskId, completed) {
        try {
            if (!taskId) {
                return;
            }

            const state = store.getState();
            if (!validateStoreData(state.tarefasHome, 'array')) {
                toast.error('Erro: dados inválidos');
                return;
            }

            const homeTasks = state.tarefasHome || [];
            const task = this.findTaskById(homeTasks, taskId);

            if (!task) {
                toast.error('Tarefa não encontrada');
                return;
            }

            const taskTitle = task.titulo || task.nome || 'Tarefa';

            // Atualizar estado (optimistic update)
            store.updateItem('tarefasHome', (t) => this.compareTaskIds(this.getTaskId(t), taskId), {
                completed,
                completedAt: completed ? new Date().toISOString() : null,
            });

            // Mostrar toast com opção de desfazer
            if (completed) {
                toast.success(`"${taskTitle}" concluída!`, {
                    duration: 5000,
                    action: () => {
                        // Desfazer
                        store.updateItem('tarefasHome', (t) => this.compareTaskIds(this.getTaskId(t), taskId), {
                            completed: false,
                            completedAt: null,
                        });
                        toast.info('Ação desfeita');
                        // Forçar atualização da view após desfazer
                        this.update();
                    },
                    actionLabel: 'Desfazer',
                });

                // Atualizar streak
                this.updateStreak();
            } else {
                // Tarefa foi desmarcada
                toast.info(`"${taskTitle}" desmarcada`);
            }

            // Forçar atualização da view após mudanças (para garantir que todas as seções sejam atualizadas)
            this.update();
        } catch (error) {
            this.handleError('Erro ao completar tarefa', error);
            toast.error('Erro ao completar tarefa');
        }
    }

    /**
     * Manipula a adição de nova tarefa
     */
    handleTaskAdd() {
        try {
            const state = store.getState();
            const newId = (state.contadorHome || 0) + 1;

            // Criar tarefa padrão com data/hora atual
            const now = new Date();
            const defaultTime = new Date(now.getTime() + DEFAULT_TASK_DELAY_HOURS * 60 * 60 * 1000);

            const newTask = {
                id: newId,
                contador: newId,
                titulo: 'Nova Tarefa',
                descricao: '',
                status: 'todo',
                prioridade: 'media',
                tags: [],
                responsavel: '',
                time: defaultTime.toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Abrir modal para editar a nova tarefa
            taskEditModal.open(newTask, (originalTask, updates) => {
                try {
                    // Adicionar tarefa ao store
                    const finalTask = {
                        ...newTask,
                        ...updates
                    };
                    store.addItem('tarefasHome', finalTask);
                    store.setState({
                        contadorHome: newId
                    });

                    toast.success('Tarefa criada com sucesso');

                    // Atualizar visualização
                    this.update();
                } catch (error) {
                    this.handleError('Erro ao criar tarefa', error);
                    toast.error('Erro ao criar tarefa');
                }
            });
        } catch (error) {
            this.handleError('Erro ao adicionar tarefa', error);
            toast.error('Erro ao adicionar tarefa');
        }
    }

    /**
     * Manipula a edição de uma tarefa
     * @param {string|number} taskId - ID da tarefa
     */
    handleTaskEdit(taskId) {
        try {
            if (!taskId) {
                toast.error('ID da tarefa inválido');
                return;
            }

            const state = store.getState();
            if (!validateStoreData(state.tarefasHome, 'array')) {
                toast.error('Erro: dados inválidos');
                return;
            }

            const homeTasks = state.tarefasHome || [];
            const task = this.findTaskById(homeTasks, taskId);

            if (!task) {
                toast.error('Tarefa não encontrada');
                return;
            }

            taskEditModal.open(task, (originalTask, updates) => {
                try {
                    store.updateItem('tarefasHome', (t) => this.compareTaskIds(this.getTaskId(t), taskId), updates);

                    toast.success('Tarefa atualizada com sucesso');

                    // Atualizar visualização
                    this.update();
                } catch (error) {
                    this.handleError('Erro ao atualizar tarefa', error);
                    toast.error('Erro ao atualizar tarefa');
                }
            });
        } catch (error) {
            this.handleError('Erro ao editar tarefa', error);
            toast.error('Erro ao editar tarefa');
        }
    }

    /**
     * Manipula a exclusão de uma tarefa
     * @param {string|number} taskId - ID da tarefa
     */
    async handleTaskDelete(taskId) {
        try {
            if (!taskId) {
                toast.error('ID da tarefa inválido');
                return;
            }

            const state = store.getState();
            if (!validateStoreData(state.tarefasHome, 'array')) {
                toast.error('Erro: dados inválidos');
                return;
            }

            const homeTasks = state.tarefasHome || [];
            const task = this.findTaskById(homeTasks, taskId);

            if (!task) {
                toast.error('Tarefa não encontrada');
                return;
            }

            const taskTitle = task.titulo || task.nome || 'Tarefa';
            const confirmed = await confirmAction(`Tem certeza que deseja excluir "${taskTitle}"?`);

            if (confirmed) {
                store.removeItem('tarefasHome', (t) => this.compareTaskIds(this.getTaskId(t), taskId));

                toast.success('Tarefa excluída com sucesso');
                this.update();
            }
        } catch (error) {
            this.handleError('Erro ao excluir tarefa', error);
            toast.error('Erro ao excluir tarefa');
        }
    }

    /**
     * Adia uma tarefa por N dias
     * @param {string|number} taskId - ID da tarefa
     * @param {number} days - Número de dias para adiar
     * @private
     */
    handlePostponeTask(taskId, days) {
        try {
            if (!taskId || typeof days !== 'number' || days <= 0) {
                return;
            }

            const state = store.getState();
            if (!validateStoreData(state.tarefasHome, 'array')) {
                return;
            }

            const homeTasks = state.tarefasHome || [];
            const task = this.findTaskById(homeTasks, taskId);

            if (!task || !task.time) {
                return;
            }

            const taskDate = toDate(task.time);
            if (!taskDate) {
                return;
            }

            taskDate.setDate(taskDate.getDate() + days);
            const newTime = taskDate.toISOString();

            store.updateItem('tarefasHome', (t) => this.compareTaskIds(this.getTaskId(t), taskId), {
                time: newTime
            });

            const dayText = days === 1 ? 'dia' : 'dias';
            toast.info(`Tarefa adiada ${days} ${dayText}`);
        } catch (error) {
            this.handleError('Erro ao adiar tarefa', error);
            toast.error('Erro ao adiar tarefa');
        }
    }

    /**
     * Mostra todas as tarefas atrasadas
     */
    showAllOverdue() {
        try {
            const state = store.getState();
            if (!validateStoreData(state.tarefasHome, 'array')) {
                toast.error('Erro: dados inválidos');
                return;
            }

            const homeTasks = state.tarefasHome || [];
            const overdueTasks = getOverdueTasks(homeTasks);

            const list = document.getElementById('home-overdue-list');
            if (!list) {
                return;
            }

            const allOverdueItems = overdueTasks
                .filter(task => task != null)
                .map(task => {
                    const taskCard = new TaskCard(task, {
                        showCheckbox: true,
                        showModule: true,
                        showPriority: true,
                        showDuration: false,
                        isCurrent: false,
                        isOverdue: true,
                        showActions: true,
                    });
                    const taskId = this.getTaskId(task);
                    return `<div class="overdue-item" data-task-id="${taskId}" role="listitem" tabindex="0" aria-label="Tarefa atrasada: ${escapeHtml(task.titulo || task.nome || 'Sem título')}">${taskCard.render().outerHTML}</div>`;
                })
                .join('');

            list.innerHTML = allOverdueItems;

            // Remover botão "Ver todas"
            const btn = document.getElementById('btn-show-all-overdue');
            if (btn) {
                btn.remove();
            }

            // Reconfigurar swipe gestures após atualizar DOM
            this.setupSwipeGestures();
        } catch (error) {
            this.handleError('Erro ao mostrar todas as tarefas atrasadas', error);
            toast.error('Erro ao carregar tarefas atrasadas');
        }
    }

    /**
     * Mostra todas as tarefas concluídas
     */
    showAllCompleted() {
        try {
            const state = store.getState();
            if (!validateStoreData(state.tarefasHome, 'array')) {
                toast.error('Erro: dados inválidos');
                return;
            }

            const homeTasks = state.tarefasHome || [];
            const filteredTasks = this.applyFilters(homeTasks);
            const completedTasks = getCompletedTasks(filteredTasks);

            const list = document.getElementById('home-completed-list');
            if (!list) {
                return;
            }

            const allCompletedItems = completedTasks
                .filter(task => task != null)
                .map(task => {
                    const taskCard = new TaskCard(task, {
                        showCheckbox: true,
                        showModule: true,
                        showPriority: true,
                        showDuration: false,
                        isCurrent: false,
                        isOverdue: false,
                        showActions: true,
                        isCompleted: true,
                    });
                    const taskId = this.getTaskId(task);
                    return `<div class="completed-item" data-task-id="${taskId}" role="listitem" tabindex="0" aria-label="Tarefa concluída: ${escapeHtml(task.titulo || task.nome || 'Sem título')}">${taskCard.render().outerHTML}</div>`;
                })
                .join('');

            list.innerHTML = allCompletedItems;

            // Remover botão "Ver todas"
            const btn = document.getElementById('btn-show-all-completed');
            if (btn) {
                btn.remove();
            }

            // Reconfigurar swipe gestures após atualizar DOM
            this.setupSwipeGestures();
        } catch (error) {
            this.handleError('Erro ao mostrar todas as tarefas concluídas', error);
            toast.error('Erro ao carregar tarefas concluídas');
        }
    }

    /**
     * Mostra todas as tarefas adiadas
     */
    showAllPostponed() {
        try {
            const state = store.getState();
            if (!validateStoreData(state.tarefasHome, 'array')) {
                toast.error('Erro: dados inválidos');
                return;
            }

            const homeTasks = state.tarefasHome || [];
            const filteredTasks = this.applyFilters(homeTasks);
            const postponedTasks = getPostponedTasks(filteredTasks);

            const list = document.getElementById('home-postponed-list');
            if (!list) {
                return;
            }

            const allPostponedItems = postponedTasks
                .filter(task => task != null)
                .map(task => {
                    const taskCard = new TaskCard(task, {
                        showCheckbox: true,
                        showModule: true,
                        showPriority: true,
                        showDuration: true,
                        isCurrent: false,
                        isOverdue: false,
                        showActions: true,
                    });
                    const taskId = this.getTaskId(task);
                    return `<div class="postponed-item" data-task-id="${taskId}" role="listitem" tabindex="0" aria-label="Tarefa adiada: ${escapeHtml(task.titulo || task.nome || 'Sem título')}">${taskCard.render().outerHTML}</div>`;
                })
                .join('');

            list.innerHTML = allPostponedItems;

            // Remover botão "Ver todas"
            const btn = document.getElementById('btn-show-all-postponed');
            if (btn) {
                btn.remove();
            }

            // Reconfigurar swipe gestures após atualizar DOM
            this.setupSwipeGestures();
        } catch (error) {
            this.handleError('Erro ao mostrar todas as tarefas adiadas', error);
            toast.error('Erro ao carregar tarefas adiadas');
        }
    }

    // ============================================================================
    // MÉTODOS AUXILIARES
    // ============================================================================

    /**
     * Encontra uma tarefa pelo ID
     * @param {Array} tasks - Lista de tarefas
     * @param {string|number} taskId - ID da tarefa
     * @returns {Object|null} Tarefa encontrada ou null
     * @private
     */
    findTaskById(tasks, taskId) {
        if (!Array.isArray(tasks) || !taskId) {
            return null;
        }
        return tasks.find((t) => this.compareTaskIds(this.getTaskId(t), taskId)) || null;
    }

    /**
     * Obtém o ID de uma tarefa (id ou contador)
     * @param {Object} task - Tarefa
     * @returns {string|number|null} ID da tarefa
     * @private
     */
    getTaskId(task) {
        if (!task) return null;
        return task.id || task.contador || null;
    }

    /**
     * Compara IDs de tarefas de forma segura
     * @param {string|number} id1 - Primeiro ID
     * @param {string|number} id2 - Segundo ID
     * @returns {boolean} True se forem iguais
     * @private
     */
    compareTaskIds(id1, id2) {
        if (id1 == null || id2 == null) return false;
        return String(id1) === String(id2);
    }

    /**
     * Atualiza o streak do usuário
     * @private
     */
    updateStreak() {
        try {
            const state = store.getState();
            const today = getTodayISO();
            const homeTasks = state.tarefasHome || [];
            const completedToday = getTasksCompletedToday(homeTasks);

            if (completedToday.length === 0) {
                return;
            }

            const lastStreakDate = state.ultimaStreakDate || null;
            const currentStreak = state.streak || 0;

            if (!lastStreakDate) {
                // Primeira vez
                store.setState({
                    streak: 1,
                    ultimaStreakDate: today,
                    diaAtual: today
                });
            } else if (lastStreakDate === today) {
                // Mesmo dia, manter streak
                return;
            } else {
                // Verificar se é dia consecutivo
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayISO = yesterday.toISOString().split('T')[0];

                if (lastStreakDate === yesterdayISO) {
                    // Dia consecutivo, incrementar streak
                    store.setState({
                        streak: currentStreak + 1,
                        ultimaStreakDate: today,
                        diaAtual: today
                    });
                } else {
                    // Quebrou streak, reiniciar
                    store.setState({
                        streak: 1,
                        ultimaStreakDate: today,
                        diaAtual: today
                    });
                }
            }

            // Animação ao completar 100%
            this.triggerCompletionAnimation(homeTasks, completedToday);
        } catch (error) {
            this.handleError('Erro ao atualizar streak', error);
        }
    }

    /**
     * Dispara animação quando todas as tarefas são completadas
     * @param {Array} homeTasks - Lista de tarefas
     * @param {Array} completedToday - Tarefas completadas hoje
     * @private
     */
    triggerCompletionAnimation(homeTasks, completedToday) {
        try {
            const totalToday = getTotalTasksToday(homeTasks);
            if (completedToday.length === totalToday && totalToday > 0) {
                setTimeout(() => {
                    const progressBar = document.querySelector('.home-metrics-progress-bar');
                    if (progressBar) {
                        progressBar.style.animation = 'progress-complete 0.5s ease';
                    }
                }, ANIMATION_DELAY);
            }
        } catch (error) {
            this.handleError('Erro ao disparar animação', error);
        }
    }

    /**
     * Trata erros de renderização
     * @param {Error} error - Erro ocorrido
     * @returns {string} HTML de erro
     * @private
     */
    handleRenderError(error) {
        this.handleError('Erro ao renderizar HomeView', error);
        return this.renderErrorState('Erro ao carregar o dashboard');
    }

    /**
     * Trata erros de forma centralizada
     * @param {string} message - Mensagem de erro
     * @param {Error} error - Erro ocorrido
     * @private
     */
    handleError(message, error) {
        console.error(message, error);
        // Aqui poderia adicionar logging estruturado ou envio para serviço de monitoramento
        if (error && error.stack) {
            console.error('Stack trace:', error.stack);
        }
    }
}

/**
 * Exporta função de renderização para o router
 * @returns {Object} Objeto com métodos render e mount
 */
export default function renderHome() {
    const view = new HomeView();

    return {
        render: () => view.render(),
        mount: () => {
            // Usar setTimeout para garantir que o DOM está pronto
            setTimeout(() => {
                view.mount();
            }, 0);
            return view;
        },
    };
}