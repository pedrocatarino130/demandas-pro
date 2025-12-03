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
import { toast } from '../components/Toast.js';

class ProjetosView {
  constructor() {
    this.unsubscribe = null;
    this.searchQuery = '';
    this.filterStatus = 'all'; // all | todo | doing | done
    this.priorityFilter = 'all'; // all | urgente | alta | media | baixa
    this.orderBy = 'execution'; // fixo, prioriza execução
    this.userOrder = [];
    this.orderModal = null;
  }

  render() {
    return `
      <div class="home-view home-view-redesign projetos-view-redesign" id="projetos-view">
        <div class="home-section-header">
          <h1 class="home-section-title">Projetos</h1>
          <div class="home-search" id="projetos-search"></div>
        </div>
        <div class="home-filters" id="projetos-filters"></div>

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
    this.loadPreferences();
    this.renderSearch();
    this.renderFilters();
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

  renderFilters() {
    const container = document.getElementById('projetos-filters');
    if (!container) return;
    container.innerHTML = `
      <div class="projetos-filters-panel">
        <div class="projetos-filters-header">
          <div class="projetos-filters-title">
            <span class="projetos-filters-icon">🎯</span>
            <div>
              <p class="projetos-filters-eyebrow">Board de projetos</p>
              <h3>Filtros rápidos</h3>
            </div>
          </div>
          <div class="projetos-filters-badges">
            <span class="projetos-filters-badge">A fazer</span>
            <span class="projetos-filters-badge badge-doing">Fazendo</span>
            <span class="projetos-filters-badge badge-done">Concluídos</span>
          </div>
        </div>
        <div class="projetos-filters-grid">
          <div class="projetos-filter-group">
            <label class="projetos-filter-label" for="projetos-status-filter">Status</label>
            <div class="projetos-select-wrapper">
              <select id="projetos-status-filter" class="projetos-filter-select">
                <option value="all" ${this.filterStatus === 'all' ? 'selected' : ''}>Todos status</option>
                <option value="todo" ${this.filterStatus === 'todo' ? 'selected' : ''}>A fazer</option>
                <option value="doing" ${this.filterStatus === 'doing' ? 'selected' : ''}>Fazendo</option>
                <option value="done" ${this.filterStatus === 'done' ? 'selected' : ''}>Concluídos</option>
              </select>
              <span class="projetos-select-caret">⌄</span>
            </div>
          </div>
          <div class="projetos-filter-group">
            <label class="projetos-filter-label" for="projetos-priority-filter">Prioridade</label>
            <div class="projetos-select-wrapper">
              <select id="projetos-priority-filter" class="projetos-filter-select">
                <option value="all" ${this.priorityFilter === 'all' ? 'selected' : ''}>Todas</option>
                <option value="urgente" ${this.priorityFilter === 'urgente' ? 'selected' : ''}>Urgente</option>
                <option value="alta" ${this.priorityFilter === 'alta' ? 'selected' : ''}>Alta</option>
                <option value="media" ${this.priorityFilter === 'media' ? 'selected' : ''}>Média</option>
                <option value="baixa" ${this.priorityFilter === 'baixa' ? 'selected' : ''}>Baixa</option>
              </select>
              <span class="projetos-select-caret">⌄</span>
            </div>
          </div>
          <div class="projetos-filter-group projetos-order-group">
            <label class="projetos-filter-label">Ordem de execução</label>
            <button class="projetos-order-button" id="projetos-order-button" type="button">
              <span class="projetos-order-icon">⇅</span>
              <span>Definir ordem</span>
            </button>
            <p class="projetos-order-hint">Prioridade + prazo, com prioridade manual</p>
          </div>
        </div>
      </div>
    `;

    const statusSelect = container.querySelector('#projetos-status-filter');
    const prioritySelect = container.querySelector('#projetos-priority-filter');
    const orderButton = container.querySelector('#projetos-order-button');

    if (statusSelect) {
      statusSelect.addEventListener('change', () => {
        this.filterStatus = statusSelect.value;
        this.renderKanban();
        this.savePreferences();
      });
    }

    if (prioritySelect) {
      prioritySelect.addEventListener('change', () => {
        this.priorityFilter = prioritySelect.value;
        this.renderKanban();
        this.savePreferences();
      });
    }

    if (orderButton) {
      orderButton.addEventListener('click', () => this.openOrderModal());
    }
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
    // Garantir que tarefas seja sempre um array
    const tarefas = Array.isArray(state.tarefas) ? state.tarefas : [];
    const tasks = this.filterTasks(tarefas);
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
          onInjectToHome: (t) => this.handleInjectToHome(t),
          isCompleted: this.isDone(task),
        });
        body.appendChild(card.render());
      });
    });
  }

  filterTasks(tasks) {
    // Garantir que tasks seja sempre um array
    if (!Array.isArray(tasks)) {
      console.warn('filterTasks recebeu um valor que não é array:', tasks);
      return [];
    }
    
    let filtered = tasks.filter((t) => t && !t.arquivado);

    // Filtrar por status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter((task) => {
        const status = (task.status || 'todo').toLowerCase();
        return status === this.filterStatus;
      });
    }

    // Filtrar por prioridade
    if (this.priorityFilter !== 'all') {
      filtered = filtered.filter((task) => {
        const priority = (task.prioridade || 'media').toLowerCase();
        return priority === this.priorityFilter;
      });
    }

    if (!this.searchQuery) return filtered;
    const q = this.searchQuery.toLowerCase();
    return filtered.filter((task) => {
      if (!task) return false;
      const title = (task.titulo || task.nome || '').toLowerCase();
      const desc = (task.descricao || '').toLowerCase();
      const resp = (task.responsavel || '').toLowerCase();
      const tags = Array.isArray(task.tags) ? task.tags.join(' ').toLowerCase() : '';
      return title.includes(q) || desc.includes(q) || resp.includes(q) || tags.includes(q);
    });
  }

  groupByStatus(tasks) {
    // Garantir que tasks seja sempre um array
    if (!Array.isArray(tasks)) {
      console.warn('groupByStatus recebeu um valor que não é array:', tasks);
      tasks = [];
    }

    const columns = [
      { id: 'todo', title: 'A Fazer', color: '#03a9f4' },
      { id: 'doing', title: 'Fazendo', color: '#cf30aa' },
      { id: 'done', title: 'Feito', color: '#00ff88' },
    ];

    const map = new Map(columns.map((c) => [c.id, []]));

    tasks.forEach((task) => {
      if (!task) return; // Ignorar tarefas inválidas
      const status = (task.status || 'todo').toLowerCase();
      if (map.has(status)) {
        map.get(status).push(task);
      } else {
        map.get('todo').push(task);
      }
    });

    return columns.map((col) => ({
      ...col,
      tasks: this.sortColumnTasks(map.get(col.id) || []),
    }));
  }

  sortColumnTasks(tasks) {
    const priorityOrder = { urgente: 4, alta: 3, media: 2, baixa: 1 };
    return [...tasks].sort((a, b) => {
      const idA = this.getTaskId(a);
      const idB = this.getTaskId(b);
      const idxA = this.userOrder.findIndex((id) => String(id) === String(idA));
      const idxB = this.userOrder.findIndex((id) => String(id) === String(idB));

      if (idxA !== -1 || idxB !== -1) {
        if (idxA !== -1 && idxB !== -1 && idxA !== idxB) {
          return idxA - idxB;
        }
        if (idxA !== -1 && idxB === -1) return -1;
        if (idxB !== -1 && idxA === -1) return 1;
      }

      if (this.orderBy === 'execution' || this.orderBy === 'priority') {
        const pA = priorityOrder[(a?.prioridade || 'media').toLowerCase()] || 0;
        const pB = priorityOrder[(b?.prioridade || 'media').toLowerCase()] || 0;
        if (pA !== pB) return pB - pA;
        if (this.orderBy === 'execution') {
          // dentro da mesma prioridade, os prazos mais próximos primeiro
          const tA = a?.time ? new Date(a.time) : null;
          const tB = b?.time ? new Date(b.time) : null;
          if (tA && tB && tA.getTime() !== tB.getTime()) {
            return tA - tB;
          }
          if (tA && !tB) return -1;
          if (!tA && tB) return 1;
        }
      }

      if (this.orderBy === 'date') {
        const tA = a?.time ? new Date(a.time) : null;
        const tB = b?.time ? new Date(b.time) : null;
        if (tA && tB && tA.getTime() !== tB.getTime()) {
          return tA - tB;
        }
        if (tA && !tB) return -1;
        if (!tA && tB) return 1;
      }

      // fallback for title or tie-break
      const titleA = (a?.titulo || a?.nome || '').toString().toLowerCase();
      const titleB = (b?.titulo || b?.nome || '').toString().toLowerCase();
      return titleA.localeCompare(titleB, 'pt-BR');
    });
  }

  loadPreferences() {
    try {
      const saved = localStorage.getItem('projetos-filters');
      if (!saved) return;
      const prefs = JSON.parse(saved);
      this.filterStatus = prefs.filterStatus || this.filterStatus;
      this.priorityFilter = prefs.priorityFilter || this.priorityFilter;
      this.orderBy = prefs.orderBy || this.orderBy;
      this.userOrder = Array.isArray(prefs.userOrder) ? prefs.userOrder : [];
    } catch (err) {
      console.warn('Não foi possível carregar preferências de filtros de projetos', err);
    }
  }

  savePreferences() {
    try {
      localStorage.setItem('projetos-filters', JSON.stringify({
        filterStatus: this.filterStatus,
        priorityFilter: this.priorityFilter,
        orderBy: this.orderBy,
        userOrder: this.userOrder,
      }));
    } catch (err) {
      // ignore
    }
  }

  openOrderModal() {
    const state = store.getState();
    const tasks = Array.isArray(state.tarefas) ? state.tarefas : [];
    const items = this.getOrderedList(tasks);

    if (!this.orderModal) {
      this.orderModal = document.createElement('div');
      this.orderModal.className = 'projetos-order-modal';
      document.body.appendChild(this.orderModal);
    }

    this.orderModal.innerHTML = `
      <div class="projetos-order-overlay"></div>
      <div class="projetos-order-dialog">
        <div class="projetos-order-header">
          <div>
            <p class="projetos-order-eyebrow">Execução personalizada</p>
            <h3>Ordenar projetos</h3>
          </div>
          <button class="projetos-order-close" aria-label="Fechar">✕</button>
        </div>
        <p class="projetos-order-subtitle">Arraste ou use os botões para ranquear. Dentro da mesma prioridade, o prazo mais próximo vem primeiro.</p>
        <div class="projetos-order-list" id="projetos-order-list">
          ${items.map((item) => `
            <div class="projetos-order-item" data-id="${item.id}">
              <span class="projetos-order-handle">⋮⋮</span>
              <span class="projetos-order-name">${this.escapeHtml(item.titulo)}</span>
              <div class="projetos-order-actions">
                <button class="projetos-order-move" data-dir="up" aria-label="Mover para cima">↑</button>
                <button class="projetos-order-move" data-dir="down" aria-label="Mover para baixo">↓</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="projetos-order-footer">
          <button class="projetos-order-cancel">Cancelar</button>
          <button class="projetos-order-save">Salvar ordem</button>
        </div>
      </div>
    `;

    const closeBtn = this.orderModal.querySelector('.projetos-order-close');
    const overlay = this.orderModal.querySelector('.projetos-order-overlay');
    const listEl = this.orderModal.querySelector('#projetos-order-list');
    const moveButtons = this.orderModal.querySelectorAll('.projetos-order-move');
    const saveBtn = this.orderModal.querySelector('.projetos-order-save');
    const cancelBtn = this.orderModal.querySelector('.projetos-order-cancel');

    const moveItem = (itemEl, dir) => {
      if (!listEl || !itemEl) return;
      if (dir === 'up' && itemEl.previousElementSibling) {
        listEl.insertBefore(itemEl, itemEl.previousElementSibling);
      }
      if (dir === 'down' && itemEl.nextElementSibling) {
        listEl.insertBefore(itemEl.nextElementSibling, itemEl);
      }
    };

    moveButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.projetos-order-item');
        const dir = e.target.getAttribute('data-dir');
        moveItem(item, dir);
      });
    });

    const close = () => {
      this.orderModal.style.display = 'none';
    };

    const save = () => {
      if (!listEl) return;
      const newOrder = Array.from(listEl.children).map((el) => el.getAttribute('data-id')).filter(Boolean);
      this.userOrder = newOrder;
      this.savePreferences();
      this.renderKanban();
      close();
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
    if (cancelBtn) cancelBtn.addEventListener('click', close);
    if (saveBtn) saveBtn.addEventListener('click', save);

    this.orderModal.style.display = 'flex';
  }

  getOrderedList(tasks) {
    const items = (tasks || []).filter(Boolean).map((t) => ({
      id: this.getTaskId(t),
      titulo: t.titulo || t.nome || 'Sem título',
    })).filter((t) => t.id);

    const uniqueMap = new Map();
    items.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    const uniqueItems = Array.from(uniqueMap.values());
    const ordered = [];
    this.userOrder.forEach((id) => {
      const found = uniqueItems.find((item) => String(item.id) === String(id));
      if (found) {
        ordered.push(found);
      }
    });

    uniqueItems.forEach((item) => {
      if (!ordered.find((o) => String(o.id) === String(item.id))) {
        ordered.push(item);
      }
    });

    return ordered;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  updateProgress(tasks) {
    // Garantir que tasks seja sempre um array
    if (!Array.isArray(tasks)) {
      tasks = [];
    }
    
    const total = tasks.length;
    const done = tasks.filter((t) => t && this.isDone(t)).length;
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

  handleInjectToHome(task) {
    if (!task) {
      toast.error('Tarefa não encontrada');
      return;
    }

    try {
      const state = store.getState();
      const newId = (state.contadorHome || 0) + 1;

      // Converter tarefa de projeto para tarefa do Home
      const homeTask = {
        id: newId,
        contador: newId,
        titulo: task.titulo || task.nome || 'Nova Tarefa',
        descricao: task.descricao || '',
        prioridade: task.prioridade || 'media',
        responsavel: task.responsavel || '',
        tags: Array.isArray(task.tags) ? [...task.tags] : [],
        status: 'todo',
        completed: false,
        time: task.time || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Adicionar ao Home
      store.addItem('tarefasHome', homeTask);
      store.setState({ contadorHome: newId });

      // Feedback visual
      toast.success(`"${homeTask.titulo}" adicionada ao Home!`, {
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao injetar tarefa no Home:', error);
      toast.error('Erro ao adicionar tarefa ao Home');
    }
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
    return tasks.some((t) => t && this.compareIds(this.getTaskId(t), taskId));
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
