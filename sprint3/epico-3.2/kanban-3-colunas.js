/**
 * TASK-020: Refatorar Kanban para 3 Colunas
 * 
 * Descrição: Simplificar board removendo colunas não usadas
 * Estimativa: M (6h)
 * Dependências: TASK-003 (Sistema de Estado Global)
 * 
 * Critérios de Aceitação:
 * - Migrar dados: Revisão → Fazendo, Bloqueado → tag
 * - 3 colunas: A Fazer | Fazendo | Feito
 * - Cards minimalistas
 * - Filtros por responsável
 * - Arquivar cards > 30 dias em Feito
 */

/**
 * Configuração das colunas do Kanban simplificado
 */
export const KANBAN_COLUMNS = {
    TODO: {
        id: 'todo',
        title: 'A Fazer',
        color: '#3b82f6'
    },
    DOING: {
        id: 'doing',
        title: 'Fazendo',
        color: '#f59e0b'
    },
    DONE: {
        id: 'done',
        title: 'Feito',
        color: '#10b981'
    }
};

/**
 * Mapeamento de status antigos para novos
 */
export const STATUS_MIGRATION = {
    'Revisão': 'doing',
    'Bloqueado': 'todo', // Será marcado com tag #bloqueado
    'A Fazer': 'todo',
    'Fazendo': 'doing',
    'Feito': 'done',
    'Concluído': 'done'
};

/**
 * Cria um board Kanban com 3 colunas
 * @param {Object} config - Configuração do board
 * @param {HTMLElement} config.container - Container onde criar o board
 * @param {Array} config.tasks - Lista de tarefas
 * @param {Function} config.onTaskMove - Callback ao mover tarefa
 * @param {Function} config.onTaskClick - Callback ao clicar na tarefa
 */
export function createKanban3Columns(config) {
    const { container, tasks = [], onTaskMove, onTaskClick } = config;
    
    // Limpar container
    container.innerHTML = '';
    container.className = 'kanban-3columns';
    
    // Criar estrutura
    container.innerHTML = `
        <div class="kanban-header">
            <h2>📋 Projetos</h2>
            <div class="kanban-filters">
                <select id="filterResponsavel" class="kanban-filter">
                    <option value="">Todos os responsáveis</option>
                </select>
                <button class="btn-icon" id="btnArquivar" title="Arquivar concluídos > 30 dias">🗄️ Arquivar</button>
            </div>
        </div>
        <div class="kanban-columns">
            <div class="kanban-column" data-column="${KANBAN_COLUMNS.TODO.id}">
                <div class="kanban-column-header">
                    <h3>${KANBAN_COLUMNS.TODO.title}</h3>
                    <span class="kanban-count" id="count-todo">0</span>
                </div>
                <div class="kanban-column-body" id="column-todo"></div>
            </div>
            <div class="kanban-column" data-column="${KANBAN_COLUMNS.DOING.id}">
                <div class="kanban-column-header">
                    <h3>${KANBAN_COLUMNS.DOING.title}</h3>
                    <span class="kanban-count" id="count-doing">0</span>
                </div>
                <div class="kanban-column-body" id="column-doing"></div>
            </div>
            <div class="kanban-column" data-column="${KANBAN_COLUMNS.DONE.id}">
                <div class="kanban-column-header">
                    <h3>${KANBAN_COLUMNS.DONE.title}</h3>
                    <span class="kanban-count" id="count-done">0</span>
                </div>
                <div class="kanban-column-body" id="column-done"></div>
            </div>
        </div>
    `;
    
    // Renderizar tarefas
    renderTasks(tasks, container);
    
    // Setup drag and drop
    setupDragAndDrop(container, onTaskMove);
    
    // Setup filtros
    setupFilters(container, tasks);
    
    // Setup arquivar
    setupArquivar(container, tasks);
    
    // Event listeners
    if (onTaskClick) {
        container.querySelectorAll('.kanban-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.kanban-card-actions')) {
                    onTaskClick(card.dataset.taskId);
                }
            });
        });
    }
    
    applyKanbanStyles();
}

/**
 * Renderiza tarefas no board
 * @param {Array} tasks - Lista de tarefas
 * @param {HTMLElement} container - Container do board
 */
function renderTasks(tasks, container) {
    // Limpar colunas
    Object.values(KANBAN_COLUMNS).forEach(column => {
        const columnBody = container.querySelector(`#column-${column.id}`);
        if (columnBody) columnBody.innerHTML = '';
    });
    
    // Agrupar por coluna
    const tasksByColumn = {
        todo: [],
        doing: [],
        done: []
    };
    
    tasks.forEach(task => {
        const column = task.status || 'todo';
        if (tasksByColumn[column]) {
            tasksByColumn[column].push(task);
        }
    });
    
    // Renderizar em cada coluna
    Object.entries(tasksByColumn).forEach(([columnId, columnTasks]) => {
        const columnBody = container.querySelector(`#column-${columnId}`);
        const countEl = container.querySelector(`#count-${columnId}`);
        
        if (columnBody) {
            columnTasks.forEach(task => {
                const card = createTaskCard(task);
                columnBody.appendChild(card);
            });
        }
        
        if (countEl) {
            countEl.textContent = columnTasks.length;
        }
    });
}

/**
 * Cria um card de tarefa minimalista
 * @param {Object} task - Dados da tarefa
 */
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.dataset.taskId = task.id;
    card.dataset.column = task.status || 'todo';
    
    const tags = task.tags || [];
    const bloqueado = tags.includes('bloqueado');
    
    card.innerHTML = `
        <div class="kanban-card-header">
            <h4 class="kanban-card-title">${task.titulo || 'Sem título'}</h4>
            ${bloqueado ? '<span class="kanban-tag tag-bloqueado">🚫 Bloqueado</span>' : ''}
        </div>
        ${task.responsavel ? `<div class="kanban-card-responsavel">👤 ${task.responsavel}</div>` : ''}
        ${task.prioridade ? `<div class="kanban-card-prioridade priority-${task.prioridade}">${task.prioridade}</div>` : ''}
        <div class="kanban-card-actions">
            <button class="btn-icon" onclick="editTask('${task.id}')" title="Editar">✏️</button>
        </div>
    `;
    
    return card;
}

/**
 * Configura drag and drop
 */
function setupDragAndDrop(container, onTaskMove) {
    const cards = container.querySelectorAll('.kanban-card');
    const columns = container.querySelectorAll('.kanban-column-body');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', card.dataset.taskId);
            card.classList.add('dragging');
        });
        
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    });
    
    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            const newColumn = column.closest('.kanban-column').dataset.column;
            
            if (onTaskMove) {
                onTaskMove(taskId, newColumn);
            }
        });
    });
}

/**
 * Configura filtros
 */
function setupFilters(container, tasks) {
    const filterSelect = container.querySelector('#filterResponsavel');
    const responsaveis = [...new Set(tasks.map(t => t.responsavel).filter(Boolean))];
    
    responsaveis.forEach(resp => {
        const option = document.createElement('option');
        option.value = resp;
        option.textContent = resp;
        filterSelect.appendChild(option);
    });
    
    filterSelect.addEventListener('change', (e) => {
        const responsavel = e.target.value;
        // Implementar filtro
        // TODO: Filtrar tarefas por responsável
    });
}

/**
 * Configura função de arquivar
 */
function setupArquivar(container, tasks) {
    const btnArquivar = container.querySelector('#btnArquivar');
    
    btnArquivar.addEventListener('click', () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const tasksToArchive = tasks.filter(task => {
            if (task.status !== 'done') return false;
            const completedDate = new Date(task.dataConclusao || task.updatedAt);
            return completedDate < thirtyDaysAgo;
        });
        
        if (tasksToArchive.length > 0) {
            const confirmed = confirm(`Arquivar ${tasksToArchive.length} tarefas concluídas há mais de 30 dias?`);
            if (confirmed) {
                // TODO: Implementar arquivamento
                console.log('Arquivando:', tasksToArchive);
            }
        } else {
            alert('Nenhuma tarefa para arquivar.');
        }
    });
}

/**
 * Migra dados do formato antigo para o novo
 * @param {Array} oldTasks - Tarefas no formato antigo
 */
export function migrateKanbanData(oldTasks) {
    return oldTasks.map(task => {
        const newTask = { ...task };
        
        // Migrar status
        if (STATUS_MIGRATION[task.status]) {
            newTask.status = STATUS_MIGRATION[task.status];
        }
        
        // Se estava bloqueado, adicionar tag
        if (task.status === 'Bloqueado' && !newTask.tags) {
            newTask.tags = ['bloqueado'];
        }
        
        return newTask;
    });
}

/**
 * Aplica estilos do Kanban
 */
function applyKanbanStyles() {
    const style = document.createElement('style');
    style.id = 'kanban-3columns-styles';
    
    if (document.getElementById('kanban-3columns-styles')) {
        return; // Já aplicado
    }
    
    style.textContent = `
        .kanban-3columns {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .kanban-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid var(--border, #e2e8f0);
        }
        
        .kanban-filters {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        .kanban-columns {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 20px;
            flex: 1;
            overflow-x: auto;
        }
        
        .kanban-column {
            background: var(--surface-hover, #f8fafc);
            border-radius: 12px;
            padding: 16px;
            min-width: 300px;
            display: flex;
            flex-direction: column;
        }
        
        .kanban-column-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid var(--border, #e2e8f0);
        }
        
        .kanban-column-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .kanban-count {
            background: var(--text-muted, #94a3b8);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .kanban-column-body {
            flex: 1;
            min-height: 200px;
        }
        
        .kanban-column-body.drag-over {
            background: rgba(59, 130, 246, 0.1);
            border: 2px dashed var(--accent, #3b82f6);
        }
        
        .kanban-card {
            background: white;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
            cursor: move;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            position: relative;
        }
        
        .kanban-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .kanban-card.dragging {
            opacity: 0.5;
        }
        
        .kanban-card-title {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
        }
        
        .kanban-card-responsavel {
            font-size: 12px;
            color: var(--text-secondary, #64748b);
            margin-bottom: 8px;
        }
        
        .kanban-tag {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            margin-top: 8px;
        }
        
        .tag-bloqueado {
            background: #fee2e2;
            color: #dc2626;
        }
        
        @media (max-width: 768px) {
            .kanban-columns {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
}

