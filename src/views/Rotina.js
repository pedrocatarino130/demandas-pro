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
    getOverdueTasks
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
        this.currentFilter = 'all'; // 'all', 'today', 'overdue', 'completed'
    }

    render() {
        const state = store.getState();
        const tarefas = state.tarefasRotina || [];

        // Filtrar tarefas baseado no filtro atual
        const filteredTasks = this.filterTasks(tarefas);

        // Separar tarefas pendentes e concluídas
        const pendingTasks = filteredTasks.filter(t => !t.completed);
        const completedTasks = filteredTasks.filter(t => t.completed);

        return `
      <div class="rotina-view">
        <div class="rotina-header">
          <h1 class="rotina-title">📅 Minha Rotina</h1>
          <div class="rotina-header-controls">
            <button class="btn btn-primary" id="btnAddRotina" title="Adicionar nova tarefa de rotina">➕ Nova Tarefa</button>
          </div>
          <div class="rotina-filters">
            <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" 
                    data-filter="all">Todas</button>
            <button class="filter-btn ${this.currentFilter === 'today' ? 'active' : ''}" 
                    data-filter="today">Hoje</button>
            <button class="filter-btn ${this.currentFilter === 'overdue' ? 'active' : ''}" 
                    data-filter="overdue">Atrasadas</button>
            <button class="filter-btn ${this.currentFilter === 'completed' ? 'active' : ''}" 
                    data-filter="completed">Concluídas</button>
          </div>
        </div>

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
            default:
                return tasks;
        }
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

    renderTasksSection(title, tasks, isCompleted) {
        const overdueTasks = getOverdueTasks(tasks);

        return `
      <section class="rotina-section">
        <div class="rotina-section-header">
          <h2 class="rotina-section-title">${title}</h2>
          <span class="rotina-section-count">${tasks.length}</span>
          ${overdueTasks.length > 0 && !isCompleted ? 
            `<span class="rotina-section-badge badge badge-danger">${overdueTasks.length} atrasadas</span>` : ''}
        </div>
        <div class="rotina-tasks-list ${isCompleted ? 'rotina-tasks-completed' : ''}">
          ${tasks.map(task => {
            const taskCard = new TaskCard(task, {
              showCheckbox: true,
              showModule: false,
              showPriority: true,
              showDuration: true,
              showActions: true,
              isCurrent: false,
              isOverdue: overdueTasks.some(t => (t.id || t.contador) === (task.id || task.contador))
            });
            return ` < div class = "rotina-task-item"
        data - task - id = "${task.id || task.contador}" > $ {
            taskCard.render().outerHTML
        } < /div>`;
    }).join('')
} <
/div> <
/section>
`;
  }

  renderEmptyState() {
    const messages = {
      all: 'Nenhuma tarefa de rotina cadastrada',
      today: 'Nenhuma tarefa para hoje',
      overdue: 'Nenhuma tarefa atrasada! 🎉',
      completed: 'Nenhuma tarefa concluída ainda'
    };
    
    return ` <
div class = "rotina-empty-state" >
    <
    p class = "rotina-empty-text" > $ {
        messages[this.currentFilter] || messages.all
    } < /p> <
    /div>
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
        // Filtros
        document.addEventListener('click', (e) => {
          const filterBtn = e.target.closest('.filter-btn');
          if (filterBtn) {
            const filter = filterBtn.getAttribute('data-filter');
            this.currentFilter = filter;
            this.update();
          }
        });

        // Botão adicionar tarefa
        const btnAdd = document.getElementById('btnAddRotina');
        if (btnAdd) {
          btnAdd.addEventListener('click', () => {
            this.handleTaskAdd();
          });
        }

        // Checkboxes de conclusão
        document.addEventListener('change', (e) => {
          if (e.target.classList.contains('task-checkbox') || e.target.classList.contains('ios-checkbox-input')) {
            const taskId = e.target.getAttribute('data-task-id');
            if (taskId) {
              this.handleTaskComplete(taskId, e.target.checked);
            }
          }
        });

        // Botões de ação nos cards (editar/excluir)
        document.addEventListener('click', (e) => {
          const actionBtn = e.target.closest('[data-action]');
          if (!actionBtn) return;

          const action = actionBtn.getAttribute('data-action');
          const taskId = actionBtn.getAttribute('data-task-id');

          if (action === 'edit' && taskId) {
            this.handleTaskEdit(taskId);
          } else if (action === 'delete' && taskId) {
            this.handleTaskDelete(taskId);
          }
        });
      }

  setupSwipeGestures() {
    // Aplicar swipe gestures nos cards
    setTimeout(() => {
      const taskItems = document.querySelectorAll('.rotina-task-item .task-card');
      taskItems.forEach((card) => {
        const taskId = card.querySelector('input')?.getAttribute('data-task-id');
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
    const previousState = { ...task };

    // Atualizar estado
    store.updateItem('tarefasRotina', (t) => (t.id || t.contador) == taskId, {
      completed,
      completedAt: completed ? new Date().toISOString() : null,
    });

    // Mostrar toast com opção de desfazer
    if (completed) {
      toast.success(`
"${taskTitle}"
concluída!`, {
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
        toast.info(`
Tarefa adiada $ {
    days
}
dia$ {
    days > 1 ? 's' : ''
}
`);
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
    const confirmed = await confirmAction(`
Tem certeza que deseja excluir "${taskTitle}" ? `);
    
    if (confirmed) {
      store.removeItem('tarefasRotina', (t) => (t.id || t.contador) == taskId);
      toast.success('Tarefa excluída com sucesso');
      this.update();
    }
  }

  openTaskModal(task, onSave) {
    // Criar modal simples
    const modal = document.createElement('div');
    modal.className = 'rotina-task-modal';

    const taskTime = task.time ? toDate(task.time) : new Date();
    const timeValue = taskTime ? formatTime(taskTime) : '';
    const dateValue = taskTime ? taskTime.toISOString().split('T')[0] : '';
    const hourValue = taskTime ? String(taskTime.getHours()).padStart(2, '0') : '';
    const minuteValue = taskTime ? String(taskTime.getMinutes()).padStart(2, '0') : '';

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
          <label class="rotina-task-form-label">Duração(minutos)</label>
          <input type="number" id="rotina-duracao" class="rotina-task-form-input" value="${task.duracao || ''}" min="0" placeholder="Ex: 30">
        </div>
        <div class="rotina-task-modal-footer">
          <button id="rotina-cancel" class="rotina-task-btn rotina-task-btn-cancel">Cancelar</button>
          <button id="rotina-save" class="rotina-task-btn rotina-task-btn-save">Salvar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      document.body.removeChild(modal);
    };

    modal.querySelector('#rotina-cancel').addEventListener('click', close);
    modal.querySelector('.rotina-task-modal').addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    modal.querySelector('#rotina-save').addEventListener('click', () => {
      const titulo = modal.querySelector('#rotina-titulo').value.trim();
      if (!titulo) {
        alert('O título é obrigatório');
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

      const taskData = {
        titulo: titulo,
        descricao: modal.querySelector('#rotina-descricao').value.trim(),
        time: time,
        prioridade: modal.querySelector('#rotina-prioridade').value,
        duracao: modal.querySelector('#rotina-duracao').value ? parseInt(modal.querySelector('#rotina-duracao').value) : null,
        modulo: 'rotina'
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