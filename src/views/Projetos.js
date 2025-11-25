/**
 * View Projetos
 * Gerencia projetos com Kanban 3 colunas
 */

import {
    store
} from '../store.js';
import {
    createKanban3Columns,
    migrateKanbanData,
    KANBAN_COLUMNS
} from '../utils/kanban-3-colunas.js';
import {
    toast
} from '../components/Toast.js';
import {
    taskEditModal
} from '../components/TaskEditModal.js';
import {
    confirmAction
} from '../components/ConfirmModal.js';

class ProjetosView {
    constructor() {
        this.unsubscribe = null;
        this.kanbanInstance = null;
    }

    render() {
        return `
      <div class="projetos-view">
        <div id="projetos-kanban-container"></div>
      </div>
    `;
    }

    mount() {
        const container = document.getElementById('projetos-kanban-container');
        if (!container) return;

        // Escutar mudanças no store
        this.unsubscribe = store.subscribe(() => {
            this.update();
        });

        // Carregar tarefas e renderizar
        this.update();
    }

    update() {
        const state = store.getState();
        let tasks = state.tarefas || [];

        // Migrar dados se necessário
        tasks = migrateKanbanData(tasks);

        // Filtrar tarefas arquivadas
        tasks = tasks.filter(t => !t.arquivado);

        // Arquivar tarefas > 30 dias em "Feito" automaticamente ao renderizar
        this.archiveOldTasks(tasks);

        // Renderizar kanban
        const container = document.getElementById('projetos-kanban-container');
        if (container) {
            createKanban3Columns({
                container,
                tasks,
                onTaskMove: (taskId, newColumn) => {
                    this.handleTaskMove(taskId, newColumn);
                },
                onTaskClick: (taskId) => {
                    this.handleTaskEdit(taskId);
                }
            });

            // Configurar arquivamento após renderizar
            this.setupArquivar(container, tasks);
            
            // Configurar botão de adicionar
            this.setupAddButton(container);
            
            // Configurar botões de ação nos cards
            this.setupCardActions(container);
        }
    }

    handleTaskMove(taskId, newColumn) {
        const state = store.getState();
        const task = state.tarefas.find(t => (t.id || t.contador) == taskId);

        if (!task) return;

        // Atualizar status
        store.updateItem('tarefas', (t) => (t.id || t.contador) == taskId, {
            status: newColumn,
            updatedAt: new Date().toISOString(),
            dataConclusao: newColumn === 'done' ? new Date().toISOString() : task.dataConclusao
        });

        toast.success(`Tarefa movida para "${KANBAN_COLUMNS[newColumn.toUpperCase()]?.title || newColumn}"`);
    }

    handleTaskEdit(taskId) {
        const state = store.getState();
        const task = state.tarefas.find(t => (t.id || t.contador) == taskId);

        if (!task) {
            toast.error('Tarefa não encontrada');
            return;
        }

        taskEditModal.open(task, (originalTask, updates) => {
            // Atualizar tarefa no store
            store.updateItem('tarefas', (t) => (t.id || t.contador) == (originalTask.id || originalTask.contador), updates);
            
            toast.success('Tarefa atualizada com sucesso');
            
            // Atualizar visualização
            this.update();
        });
    }

    handleTaskAdd() {
        const state = store.getState();
        const newId = (state.contador || 0) + 1;
        
        const newTask = {
            id: newId,
            contador: newId,
            titulo: 'Nova Tarefa',
            descricao: '',
            status: 'todo',
            prioridade: 'media',
            tags: [],
            responsavel: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Abrir modal para editar a nova tarefa
        taskEditModal.open(newTask, (originalTask, updates) => {
            // Adicionar tarefa ao store
            const finalTask = {
                ...newTask,
                ...updates
            };
            store.addItem('tarefas', finalTask);
            store.setState({ contador: newId });
            
            toast.success('Tarefa criada com sucesso');
            
            // Atualizar visualização
            this.update();
        });
    }

    async handleTaskDelete(taskId) {
        const state = store.getState();
        const task = state.tarefas.find(t => (t.id || t.contador) == taskId);

        if (!task) {
            toast.error('Tarefa não encontrada');
            return;
        }

        const taskTitle = task.titulo || task.nome || 'Tarefa';
        const confirmed = await confirmAction(`Tem certeza que deseja excluir "${taskTitle}"?`);
        
        if (confirmed) {
            store.removeItem('tarefas', (t) => (t.id || t.contador) == taskId);
            toast.success('Tarefa excluída com sucesso');
            this.update();
        }
    }

    setupAddButton(container) {
        const btnAdd = container.querySelector('#btnAddTask');
        if (btnAdd) {
            // Remover listeners anteriores
            const newBtn = btnAdd.cloneNode(true);
            btnAdd.parentNode.replaceChild(newBtn, btnAdd);
            
            newBtn.addEventListener('click', () => {
                this.handleTaskAdd();
            });
        }
    }

    setupCardActions(container) {
        // Event delegation para botões de ação nos cards
        container.addEventListener('click', (e) => {
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


    setupArquivar(container, tasks) {
        const btnArquivar = container.querySelector('#btnArquivar');
        if (!btnArquivar) return;

        // Remover listeners anteriores
        const newBtn = btnArquivar.cloneNode(true);
        btnArquivar.parentNode.replaceChild(newBtn, btnArquivar);

        newBtn.addEventListener('click', () => {
            this.archiveOldTasks(tasks, true);
        });
    }

    archiveOldTasks(tasks, showConfirmation = false) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const tasksToArchive = tasks.filter(task => {
            if (task.status !== 'done') return false;
            const completedDate = task.dataConclusao || task.updatedAt || task.createdAt;
            if (!completedDate) return false;

            const date = new Date(completedDate);
            return date < thirtyDaysAgo;
        });

        if (tasksToArchive.length === 0) {
            if (showConfirmation) {
                toast.info('Nenhuma tarefa para arquivar');
            }
            return;
        }

        const performArchive = () => {
            tasksToArchive.forEach(task => {
                store.updateItem('tarefas', (t) => (t.id || t.contador) == (task.id || task.contador), {
                    arquivado: true,
                    arquivadoEm: new Date().toISOString()
                });
            });

            toast.success(`${tasksToArchive.length} tarefa(s) arquivada(s)`);
            this.update();
        };

        if (showConfirmation) {
            confirmAction(`Arquivar ${tasksToArchive.length} tarefas concluídas há mais de 30 dias?`).then((confirmed) => {
                if (confirmed) {
                    performArchive();
                }
            });
        } else {
            // Arquivo silencioso na renderização inicial
            performArchive();
        }
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

/**
 * Função de renderização para o router
 */
function renderProjetos() {
    const view = new ProjetosView();

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

export default renderProjetos;