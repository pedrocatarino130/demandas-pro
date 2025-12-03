/**
 * Home View - Cyberpunk Redesign
 * Estrutura inspirada no protótipo React em `re-desing/`
 */

import {
    store
} from '../store.js';
import {
    TaskCard
} from '../components/TaskCard.js';
import {
    ComplexSearch
} from '../components/ComplexSearch.js';
import {
    createNeonButton
} from '../components/NeonButton.js';
import {
    taskEditModal
} from '../components/TaskEditModal.js';
import {
    confirmAction
} from '../components/ConfirmModal.js';
import {
    getCompletedTasks
} from '../utils/taskFilters.js';
import {
    formatDuration
} from '../utils/dateUtils.js';
import {
    router
} from '../router.js';

class HomeView {
    constructor() {
        this.activeTab = 'urgent';
        this.searchQuery = '';
        this.unsubscribe = null;
        this.timerInterval = null;
    }

    render() {
        return `
      <div class="home-view home-view-redesign" id="home-view-redesign">
        <div class="home-top-cards">
          <section class="home-welcome-card">
            <h2 class="home-welcome-title">Bem vindo de volta, Pedro!</h2>
            <p class="home-welcome-message">
              Você tem <strong id="home-urgent-count">0 tarefas urgentes</strong> hoje. Mantenha o foco!
            </p>
            <div id="home-cta"></div>
          </section>

          <section class="home-productivity-card">
            <div class="home-productivity-value" id="home-productivity-value">0%</div>
            <div class="home-productivity-label">Produtividade</div>
            <div class="home-productivity-bar">
              <div class="home-productivity-bar-fill" id="home-productivity-bar-fill" style="width: 0%"></div>
            </div>
          </section>
        </div>

        <div class="home-section-header">
          <div class="home-dashboard-tabs" id="home-dashboard-tabs"></div>
          <div class="home-search" id="home-search"></div>
        </div>

        <div class="home-tasks-grid" id="home-tasks-grid"></div>
      </div>
    `;
    }

    mount() {
        this.renderSearch();
        this.renderCTA();
        this.renderData();
        this.startTimerLoop();

        this.unsubscribe = store.subscribe(() => this.renderData());
        return this;
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    renderSearch() {
        const searchContainer = document.getElementById('home-search');
        if (!searchContainer) return;
        searchContainer.innerHTML = '';

        const search = new ComplexSearch({
            value: this.searchQuery,
            onChange: (val) => {
                this.searchQuery = val;
                this.renderData();
            },
        });

        searchContainer.appendChild(search.render());
    }

    renderCTA() {
        const cta = document.getElementById('home-cta');
        if (!cta) return;
        cta.innerHTML = '';

        const button = createNeonButton({
            text: 'Nova Tarefa',
            variant: 'primary',
            onClick: () => this.createTask(),
            className: 'home-cta-button',
        });

        cta.appendChild(button);
    }

    renderData() {
        const state = store.getState();
        const tasks = Array.isArray(state.tarefasHome) ? [...state.tarefasHome] : [];
        const filtered = this.applySearch(tasks);
        const categories = this.buildCategories(filtered);

        this.renderTabs(categories);
        this.updateTopCards(categories, filtered);
        this.renderGrid(this.getActiveTasks(categories));
    }

    renderTabs(categories) {
        const tabsContainer = document.getElementById('home-dashboard-tabs');
        if (!tabsContainer) return;

        const tabs = [{
                id: 'urgent',
                label: 'Urgentes',
                className: 'urgent',
                count: categories.urgent.length
            },
            {
                id: 'future',
                label: 'Futuras',
                className: 'future',
                count: categories.future.length
            },
            {
                id: 'completed',
                label: 'Concluídas',
                className: 'completed',
                count: categories.completed.length
            },
        ];

        tabsContainer.innerHTML = tabs
            .map(
                (tab) => `
          <button 
            class="home-dashboard-tab ${tab.className} ${this.activeTab === tab.id ? 'active' : ''}" 
            data-tab="${tab.id}"
            aria-pressed="${this.activeTab === tab.id}"
          >
            <span class="home-dashboard-tab-icon">●</span>
            ${tab.label} (${tab.count})
          </button>
        `
            )
            .join('');

        tabsContainer.querySelectorAll('[data-tab]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                if (tab) {
                    this.activeTab = tab;
                    this.renderTabs(categories);
                    this.renderGrid(this.getActiveTasks(categories));
                }
            });
        });
    }

    renderGrid(tasks) {
        const grid = document.getElementById('home-tasks-grid');
        if (!grid) return;
        grid.innerHTML = '';

        if (!tasks || tasks.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'home-empty-state';
            empty.innerHTML = `
        <div class="home-empty-state-icon">📂</div>
        <p class="home-empty-state-message">Nenhuma tarefa nesta categoria.</p>
      `;
            grid.appendChild(empty);
            return;
        }

        tasks.forEach((task) => {
            const card = new TaskCard(task, {
                showCheckbox: true,
                showPriority: true,
                showActions: true,
                showTimerControls: true,
                onToggleStatus: (id, checked) => this.handleToggleStatus(id, checked),
                onEdit: (t) => this.handleEdit(t),
                onDelete: (id) => this.handleDelete(id),
                onStartTimer: (id) => this.handleStartTimer(id),
                onStopTimer: (id) => this.handleStopTimer(id),
                onDuplicate: (t) => this.handleDuplicate(t),
            });
            grid.appendChild(card.render());
        });
    }

    startTimerLoop() {
        if (this.timerInterval) return;
        this.timerInterval = setInterval(() => this.updateTimersDisplay(), 1000);
    }

    updateTimersDisplay() {
        const grid = document.getElementById('home-tasks-grid');
        if (!grid) return;

        const state = store.getState();
        const tasks = Array.isArray(state.tarefasHome) ? state.tarefasHome : [];
        const running = tasks.filter((task) => task && task.timerStartedAt);

        if (running.length === 0) return;

        running.forEach((task) => {
            const id = this.getTaskId(task);
            const timerEl = grid.querySelector(`[data-task-timer-id="${id}"]`);
            if (timerEl) {
                timerEl.textContent = formatDuration(this.calculateElapsedMs(task));
            }
        });
    }

    calculateElapsedMs(task) {
        if (!task) return 0;
        const base = Number(task.timerElapsedMs) || 0;
        const startedAt = task.timerStartedAt ? new Date(task.timerStartedAt).getTime() : null;
        if (startedAt && !Number.isNaN(startedAt)) {
            return base + Math.max(0, Date.now() - startedAt);
        }
        return base;
    }

    findTaskById(taskId) {
        const state = store.getState();
        const tasks = Array.isArray(state.tarefasHome) ? state.tarefasHome : [];
        return tasks.find((t) => this.compareIds(this.getTaskId(t), taskId));
    }

    updateTopCards(categories, tasks) {
        const urgentCountEl = document.getElementById('home-urgent-count');
        if (urgentCountEl) {
            urgentCountEl.textContent = `${categories.urgent.length} tarefas urgentes`;
        }

        const total = tasks.length;
        const done = categories.completed.length;
        const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

        const valueEl = document.getElementById('home-productivity-value');
        if (valueEl) {
            valueEl.textContent = `${percentage}%`;
        }

        const bar = document.getElementById('home-productivity-bar-fill');
        if (bar) {
            bar.style.width = `${percentage}%`;
        }
    }

    applySearch(tasks) {
        if (!this.searchQuery) return tasks;
        const query = this.searchQuery.toLowerCase();

        return tasks.filter((task) => {
            const title = (task.titulo || task.nome || '').toLowerCase();
            const description = (task.descricao || '').toLowerCase();
            const responsavel = (task.responsavel || '').toLowerCase();
            const tags = Array.isArray(task.tags) ? task.tags.join(' ').toLowerCase() : '';
            return (
                title.includes(query) ||
                description.includes(query) ||
                responsavel.includes(query) ||
                tags.includes(query)
            );
        });
    }

    buildCategories(tasks) {
        const delayedIds = new Set();
        const urgent = tasks.filter(
            (task) => !task.completed && this.isHighPriority(task) && !delayedIds.has(this.getTaskId(task))
        );
        const urgentIds = new Set(urgent.map((t) => this.getTaskId(t)));

        const completed = getCompletedTasks(tasks);
        const future = tasks.filter(
            (task) => !task.completed && !delayedIds.has(this.getTaskId(task)) && !urgentIds.has(this.getTaskId(task))
        );

        return {
            urgent,
            future,
            completed,
        };
    }

    getActiveTasks(categories) {
        switch (this.activeTab) {
            case 'future':
                return categories.future;
            case 'completed':
                return categories.completed;
            case 'urgent':
            default:
                return categories.urgent;
        }
    }

    async handleDelete(taskId) {
        const confirmed = await confirmAction('Deseja excluir esta tarefa?');
        if (!confirmed) return;
        store.removeItem('tarefasHome', (t) => this.compareIds(this.getTaskId(t), taskId));
        this.ensureStayOnHome();
    }

    handleEdit(task) {
        if (!task) return;
        taskEditModal.open(task, (currentTask, updates) => this.saveTask(currentTask, updates));
    }

    handleToggleStatus(taskId, checked) {
        const task = this.findTaskById(taskId);
        const elapsedMs = this.calculateElapsedMs(task);
        store.updateItem('tarefasHome', (t) => this.compareIds(this.getTaskId(t), taskId), {
            completed: checked,
            status: checked ? 'done' : 'todo',
            completedAt: checked ? new Date().toISOString() : null,
            timerStartedAt: null,
            timerElapsedMs: elapsedMs,
        });
    }

    handleStartTimer(taskId) {
        const task = this.findTaskById(taskId);
        if (!task) return;

        const isAlreadyRunning =
            (task.status || '').toLowerCase() === 'doing' && Boolean(task.timerStartedAt);
        if (isAlreadyRunning) return;

        const now = new Date().toISOString();
        const elapsed = Number(task.timerElapsedMs) || 0;

        store.updateItem('tarefasHome', (t) => this.compareIds(this.getTaskId(t), taskId), {
            status: 'doing',
            completed: false,
            completedAt: null,
            timerStartedAt: now,
            timerElapsedMs: elapsed,
        });
    }

    async handleStopTimer(taskId) {
        const task = this.findTaskById(taskId);
        if (!task) return;

        const elapsedMs = this.calculateElapsedMs(task);
        const concluded = await confirmAction('Você concluiu esta tarefa?');
        const completed = concluded === true;

        let nextElapsed = elapsedMs;
        if (!completed) {
            const resetTimer = await confirmAction('Deseja zerar o cronômetro? (Cancelar = pausar)');
            nextElapsed = resetTimer ? 0 : elapsedMs;
        }

        store.updateItem('tarefasHome', (t) => this.compareIds(this.getTaskId(t), taskId), {
            status: completed ? 'done' : 'todo',
            completed,
            completedAt: completed ? new Date().toISOString() : null,
            timerStartedAt: null,
            timerElapsedMs: nextElapsed,
        });
    }

    handleDuplicate(task) {
        if (!task) return;
        const state = store.getState();
        const newId = (state.contadorHome || 0) + 1;
        const title = task.titulo || task.nome || 'Nova Tarefa';

        const duplicatedTask = {
            ...task,
            id: newId,
            contador: newId,
            titulo: `${title} (cópia)`,
            completed: false,
            completedAt: null,
            status: 'todo',
            timerElapsedMs: 0,
            timerStartedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Garantir que tags e arrays sejam copiados
        if (Array.isArray(task.tags)) {
            duplicatedTask.tags = [...task.tags];
        }

        taskEditModal.open(duplicatedTask, (currentTask, updates) => this.saveTask(currentTask, updates));
    }

    createTask() {
        const state = store.getState();
        const newId = (state.contadorHome || 0) + 1;
        const defaultDate = new Date();
        defaultDate.setHours(defaultDate.getHours() + 1);

        const task = {
            id: newId,
            contador: newId,
            titulo: 'Nova Tarefa',
            descricao: '',
            prioridade: 'media',
            responsavel: '',
            tags: [],
            status: 'todo',
            completed: false,
            timerElapsedMs: 0,
            timerStartedAt: null,
            time: defaultDate.toISOString(),
        };

        taskEditModal.open(task, (currentTask, updates) => this.saveTask(currentTask, updates));
    }

    saveTask(task, updates) {
        const taskId = this.getTaskId(task);
        const updated = {
            ...task,
            ...updates
        };
        const exists = this.taskExists(taskId);

        if (exists) {
            store.updateItem('tarefasHome', (t) => this.compareIds(this.getTaskId(t), taskId), updated);
        } else {
            store.addItem('tarefasHome', updated);
            const currentCounter = store.getState().contadorHome || 0;
            const numericId = Number(taskId);
            const nextCounter = Number.isFinite(numericId) ? Math.max(currentCounter, numericId) : currentCounter + 1;
            store.setState({
                contadorHome: nextCounter
            });
        }
        this.ensureStayOnHome();
    }

    taskExists(taskId) {
        const state = store.getState();
        const tasks = Array.isArray(state.tarefasHome) ? state.tarefasHome : [];
        return tasks.some((t) => this.compareIds(this.getTaskId(t), taskId));
    }

    ensureStayOnHome() {
        if (!router || typeof router.getCurrentPath !== 'function') return;
        const current = router.getCurrentPath();
        if (current && current !== '/') {
            router.navigate('/', false);
        }
    }

    isHighPriority(task) {
        const priority = (task.prioridade || '').toString().toLowerCase();
        return priority === 'alta' || priority === 'urgente' || priority === 'high' || priority === 'urgent';
    }

    getTaskId(task) {
        if (!task) return null;
        return task.id || task.contador || null;
    }

    compareIds(id1, id2) {
        if (id1 == null || id2 == null) return false;
        return String(id1) === String(id2);
    }
}

export default function renderHome() {
    const view = new HomeView();
    return {
        render: () => view.render(),
        mount: () => view.mount(),
    };
}