/**
 * View Projetos - Cyberpunk Kanban
 * Redesenho inspirado no protótipo React (re-desing/)
 */

import { store } from '../store.js';
import { TaskCard } from '../components/TaskCard.js';
import { ComplexSearch } from '../components/ComplexSearch.js';
import { createNeonButton } from '../components/NeonButton.js';
import { taskEditModal } from '../components/TaskEditModal.js';
import { confirmAction } from '../components/ConfirmModal.js';

class ProjetosView {
  constructor() {
    this.unsubscribe = null;
    this.searchQuery = '';
  }

  render() {
    return `
      <div class="home-view home-view-redesign projetos-view-redesign" id="projetos-view">
        <div class="home-section-header">
          <h1 class="home-section-title">Projetos</h1>
          <div class="home-search" id="projetos-search"></div>
        </div>

        <div class="home-top-cards">
          <section class="home-welcome-card">
            <h2 class="home-welcome-title">Board de Projetos</h2>
            <p class="home-welcome-message">
              Organize seu fluxo em colunas e mantenha o ritmo.
            </p>
            <div id="projetos-cta"></div>
          </section>

          <section class="home-productivity-card">
            <div class="home-productivity-value" id="projetos-progress-value">0%</div>
            <div class="home-productivity-label">Progresso</div>
            <div class="home-productivity-bar">
              <div class="home-productivity-bar-fill" id="projetos-progress-bar" style="width: 0%"></div>
            </div>
          </section>
        </div>

        <div class="kanban-cyberpunk" id="projetos-kanban"></div>
      </div>
    `;
  }

  mount() {
    this.renderSearch();
    this.renderCTA();
    this.renderKanban();

    this.unsubscribe = store.subscribe(() => this.renderKanban());
    return this;
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  renderSearch() {
    const container = document.getElementById('projetos-search');
    if (!container) return;
    container.innerHTML = '';

    const search = new ComplexSearch({
      value: this.searchQuery,
      onChange: (val) => {
        this.searchQuery = val;
        this.renderKanban();
      },
    });

    container.appendChild(search.render());
  }

  renderCTA() {
    const cta = document.getElementById('projetos-cta');
    if (!cta) return;
    cta.innerHTML = '';

    const button = createNeonButton({
      text: 'Nova Tarefa',
      variant: 'primary',
      onClick: () => this.createTask(),
    });

    cta.appendChild(button);
  }

  renderKanban() {
    const container = document.getElementById('projetos-kanban');
    if (!container) return;

    const state = store.getState();
    const tasks = this.filterTasks(state.tarefas || []);
    const columns = this.groupByStatus(tasks);

    this.updateProgress(tasks);

    container.innerHTML = `
      <div class="kanban-cyberpunk-grid">
        ${columns
          .map(
            (col) => `
              <div class="kanban-cyberpunk-column">
                <div class="kanban-cyberpunk-column-header">
                  <div class="kanban-cyberpunk-column-title">
                    <span class="kanban-cyberpunk-dot" style="background:${col.color}"></span>
                    <h3>${col.title}</h3>
                  </div>
                  <span class="kanban-cyberpunk-count">${col.tasks.length}</span>
                </div>
                <div class="kanban-cyberpunk-column-body" id="col-${col.id}"></div>
              </div>
            `
          )
          .join('')}
      </div>
    `;

    // Render cards per column
    columns.forEach((col) => {
      const body = container.querySelector(`#col-${col.id}`);
      if (!body) return;

      if (col.tasks.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'home-empty-state';
        empty.innerHTML = `
          <div class="home-empty-state-icon">📂</div>
          <p class="home-empty-state-message">Nenhuma tarefa aqui.</p>
        `;
        body.appendChild(empty);
        return;
      }

      col.tasks.forEach((task) => {
        const card = new TaskCard(task, {
          showCheckbox: true,
          showPriority: true,
          showActions: true,
          onToggleStatus: (id, checked) => this.handleToggleStatus(id, checked),
          onEdit: (t) => this.handleEdit(t),
          onDelete: (id) => this.handleDelete(id),
          isCompleted: this.isDone(task),
        });
        body.appendChild(card.render());
      });
    });
  }

  filterTasks(tasks) {
    const filtered = tasks.filter((t) => !t.arquivado);
    if (!this.searchQuery) return filtered;
    const q = this.searchQuery.toLowerCase();
    return filtered.filter((task) => {
      const title = (task.titulo || task.nome || '').toLowerCase();
      const desc = (task.descricao || '').toLowerCase();
      const resp = (task.responsavel || '').toLowerCase();
      const tags = Array.isArray(task.tags) ? task.tags.join(' ').toLowerCase() : '';
      return title.includes(q) || desc.includes(q) || resp.includes(q) || tags.includes(q);
    });
  }

  groupByStatus(tasks) {
    const columns = [
      { id: 'todo', title: 'A Fazer', color: '#03a9f4' },
      { id: 'doing', title: 'Fazendo', color: '#cf30aa' },
      { id: 'done', title: 'Feito', color: '#00ff88' },
    ];

    const map = new Map(columns.map((c) => [c.id, []]));

    tasks.forEach((task) => {
      const status = (task.status || 'todo').toLowerCase();
      if (map.has(status)) {
        map.get(status).push(task);
      } else {
        map.get('todo').push(task);
      }
    });

    return columns.map((col) => ({
      ...col,
      tasks: map.get(col.id) || [],
    }));
  }

  updateProgress(tasks) {
    const total = tasks.length;
    const done = tasks.filter((t) => this.isDone(t)).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const valueEl = document.getElementById('projetos-progress-value');
    const barEl = document.getElementById('projetos-progress-bar');

    if (valueEl) valueEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;
  }

  isDone(task) {
    const status = (task.status || '').toLowerCase();
    return status === 'done' || task.completed === true;
  }

  async handleDelete(taskId) {
    const confirmed = await confirmAction('Deseja excluir esta tarefa?');
    if (!confirmed) return;
    store.removeItem('tarefas', (t) => this.compareIds(this.getTaskId(t), taskId));
  }

  handleEdit(task) {
    if (!task) return;
    taskEditModal.open(task, (currentTask, updates) => this.saveTask(currentTask, updates));
  }

  handleToggleStatus(taskId, checked) {
    store.updateItem('tarefas', (t) => this.compareIds(this.getTaskId(t), taskId), {
      completed: checked,
      status: checked ? 'done' : 'todo',
      completedAt: checked ? new Date().toISOString() : null,
    });
  }

  createTask() {
    const state = store.getState();
    const newId = (state.contador || 0) + 1;
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
      time: defaultDate.toISOString(),
    };

    taskEditModal.open(task, (currentTask, updates) => this.saveTask(currentTask, updates));
  }

  saveTask(task, updates) {
    const taskId = this.getTaskId(task);
    const updated = { ...task, ...updates };
    const exists = this.taskExists(taskId);

    if (exists) {
      store.updateItem('tarefas', (t) => this.compareIds(this.getTaskId(t), taskId), updated);
    } else {
      store.addItem('tarefas', updated);
      const currentCounter = store.getState().contador || 0;
      const numericId = Number(taskId);
      const nextCounter = Number.isFinite(numericId) ? Math.max(currentCounter, numericId) : currentCounter + 1;
      store.setState({ contador: nextCounter });
    }
  }

  taskExists(taskId) {
    const state = store.getState();
    const tasks = Array.isArray(state.tarefas) ? state.tarefas : [];
    return tasks.some((t) => this.compareIds(this.getTaskId(t), taskId));
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

export default function renderProjetos() {
  const view = new ProjetosView();
  return {
    render: () => view.render(),
    mount: () => view.mount(),
    destroy: () => view.destroy(),
  };
}
