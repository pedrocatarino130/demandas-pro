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
    const {
        container,
        tasks = [],
        onTaskMove,
        onTaskClick
    } = config;

    // Limpar container
    container.innerHTML = '';
    container.className = 'kanban-3columns';

    // Criar estrutura
    container.innerHTML = `
        <div class="kanban-header">
            <h2>📋 Projetos</h2>
            <div class="kanban-header-controls">
                <button class="btn btn-primary" id="btnAddTask" title="Adicionar nova tarefa">➕ Nova Tarefa</button>
                <div class="kanban-search-wrapper">
                    <input 
                        type="text" 
                        id="kanban-search" 
                        class="kanban-search" 
                        placeholder="🔍 Buscar tarefas..."
                    />
                </div>
                <div class="kanban-filters">
                    <select id="filterResponsavel" class="kanban-filter">
                        <option value="">Todos os responsáveis</option>
                    </select>
                    <button class="btn-icon" id="btnViewToggle" title="Alternar visualização">
                        <span id="viewToggleIcon">📋</span>
                    </button>
                    <button class="btn-icon" id="btnArquivar" title="Arquivar concluídos > 30 dias">🗄️ Arquivar</button>
                </div>
            </div>
        </div>
        <div class="kanban-view-container">
            <div class="kanban-columns" id="kanban-columns-view">
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
            <div class="kanban-list-view" id="kanban-list-view" style="display: none;"></div>
        </div>
    `;

    // Estado interno para busca e visualização
    let currentSearchTerm = '';
    let currentViewMode = 'kanban'; // 'kanban' ou 'list'
    let allTasks = tasks;

    // Renderizar tarefas
    const renderAll = () => {
        const filteredTasks = filterTasks(allTasks, currentSearchTerm);
        renderTasks(filteredTasks, container, currentViewMode);
        setupCardEventListeners(container, onTaskClick);
        // Setup drag and drop sempre, mas só funciona no modo kanban
        setupDragAndDrop(container, onTaskMove);
    };

    // Setup busca
    setupSearch(container, (searchTerm) => {
        currentSearchTerm = searchTerm;
        renderAll();
    });

    // Setup toggle de visualização
    setupViewToggle(container, (newMode) => {
        currentViewMode = newMode;
        renderAll();
    });

    // Setup filtros
    setupFilters(container, allTasks, (filteredTasks) => {
        allTasks = filteredTasks;
        renderAll();
    });

    // Setup arquivar
    setupArquivar(container, tasks);

    // Renderizar inicial
    renderAll();

    // Expor função para atualizar tarefas externamente
    container.updateTasks = (newTasks) => {
        allTasks = newTasks;
        renderAll();
    };
}

/**
 * Renderiza tarefas no board ou lista
 * @param {Array} tasks - Lista de tarefas
 * @param {HTMLElement} container - Container do board
 * @param {string} viewMode - Modo de visualização: 'kanban' ou 'list'
 */
function renderTasks(tasks, container, viewMode = 'kanban') {
    if (viewMode === 'list') {
        renderListView(tasks, container);
    } else {
        renderKanbanView(tasks, container);
    }
}

/**
 * Renderiza tarefas no modo Kanban
 */
function renderKanbanView(tasks, container) {
    const columnsView = container.querySelector('#kanban-columns-view');
    const listView = container.querySelector('#kanban-list-view');

    if (columnsView) columnsView.style.display = 'grid';
    if (listView) listView.style.display = 'none';

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
 * Renderiza tarefas no modo Lista
 */
function renderListView(tasks, container) {
    const columnsView = container.querySelector('#kanban-columns-view');
    const listView = container.querySelector('#kanban-list-view');

    if (columnsView) columnsView.style.display = 'none';
    if (listView) {
        listView.style.display = 'block';
        listView.innerHTML = '';

        if (tasks.length === 0) {
            listView.innerHTML = '<div class="kanban-empty-state">Nenhuma tarefa encontrada</div>';
            return;
        }

        // Agrupar por status
        const tasksByStatus = {
            todo: tasks.filter(t => (t.status || 'todo') === 'todo'),
            doing: tasks.filter(t => (t.status || 'todo') === 'doing'),
            done: tasks.filter(t => (t.status || 'todo') === 'done')
        };

        Object.entries(KANBAN_COLUMNS).forEach(([key, column]) => {
            const statusTasks = tasksByStatus[column.id];
            if (statusTasks.length > 0) {
                const section = document.createElement('div');
                section.className = 'kanban-list-section';
                section.innerHTML = `
                    <h3 class="kanban-list-section-title">${column.title} (${statusTasks.length})</h3>
                `;

                const tasksContainer = document.createElement('div');
                tasksContainer.className = 'kanban-list-tasks';

                statusTasks.forEach(task => {
                    const card = createTaskCard(task);
                    card.classList.add('kanban-card-list');
                    tasksContainer.appendChild(card);
                });

                section.appendChild(tasksContainer);
                listView.appendChild(section);
            }
        });
    }
}

/**
 * Filtra tarefas baseado no termo de busca
 */
function filterTasks(tasks, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return tasks;
    }

    const term = searchTerm.toLowerCase().trim();
    return tasks.filter(task => {
        const titulo = (task.titulo || task.nome || '').toLowerCase();
        const descricao = (task.descricao || '').toLowerCase();
        const responsavel = (task.responsavel || '').toLowerCase();
        const tags = (task.tags || []).join(' ').toLowerCase();

        return titulo.includes(term) ||
            descricao.includes(term) ||
            responsavel.includes(term) ||
            tags.includes(term);
    });
}

/**
 * Configura busca
 */
function setupSearch(container, onSearch) {
    const searchInput = container.querySelector('#kanban-search');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (onSearch) onSearch(e.target.value);
        }, 300); // Debounce de 300ms
    });
}

/**
 * Configura toggle de visualização
 */
function setupViewToggle(container, onToggle) {
    const toggleBtn = container.querySelector('#btnViewToggle');
    const toggleIcon = container.querySelector('#viewToggleIcon');
    if (!toggleBtn) return;

    let currentMode = 'kanban';

    toggleBtn.addEventListener('click', () => {
        currentMode = currentMode === 'kanban' ? 'list' : 'kanban';
        toggleIcon.textContent = currentMode === 'kanban' ? '📋' : '📝';
        toggleBtn.title = currentMode === 'kanban' ? 'Ver como lista' : 'Ver como kanban';
        if (onToggle) onToggle(currentMode);
    });
}

/**
 * Configura event listeners dos cards
 */
function setupCardEventListeners(container, onTaskClick) {
    if (!onTaskClick) return;

    container.querySelectorAll('.kanban-card').forEach(card => {
        // Remover listeners anteriores
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);

        // Click no card (exceto botões de ação)
        newCard.addEventListener('click', (e) => {
            if (!e.target.closest('.kanban-card-actions') &&
                !e.target.closest('.btn-icon-small')) {
                onTaskClick(newCard.dataset.taskId);
            }
        });

        // Click no botão de editar
        const editBtn = newCard.querySelector('[data-action="edit"]');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onTaskClick(editBtn.dataset.taskId);
            });
        }
    });
}

/**
 * Cria um card de tarefa melhorado com mais informações
 * @param {Object} task - Dados da tarefa
 */
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.dataset.taskId = task.id || task.contador;
    card.dataset.column = task.status || 'todo';

    const tags = task.tags || [];
    const bloqueado = tags.includes('bloqueado');
    const prioridade = (task.prioridade || 'media').toLowerCase();

    // Formatação de datas
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${day}/${month}`;
        } catch {
            return '';
        }
    };

    const createdAt = formatDate(task.createdAt || task.dataCriacao);
    const completedAt = task.status === 'done' ? formatDate(task.dataConclusao || task.updatedAt) : '';

    // Descrição truncada (máx 100 caracteres)
    const descricao = task.descricao || '';
    const descricaoTruncada = descricao.length > 100 ?
        descricao.substring(0, 100) + '...' :
        descricao;

    // Renderizar tags (exceto bloqueado que já tem badge especial)
    const outrasTags = tags.filter(tag => tag !== 'bloqueado' && tag);

    // Mapeamento de prioridade para classes e labels
    const priorityMap = {
        'urgente': {
            label: 'Urgente',
            class: 'priority-urgent'
        },
        'alta': {
            label: 'Alta',
            class: 'priority-high'
        },
        'media': {
            label: 'Média',
            class: 'priority-medium'
        },
        'média': {
            label: 'Média',
            class: 'priority-medium'
        },
        'baixa': {
            label: 'Baixa',
            class: 'priority-low'
        }
    };
    const priorityInfo = priorityMap[prioridade] || priorityMap['media'];

    card.innerHTML = `
        <div class="kanban-card-header">
            <div class="kanban-card-title-wrapper">
                <h4 class="kanban-card-title">${escapeHtml(task.titulo || task.nome || 'Sem título')}</h4>
                ${bloqueado ? '<span class="kanban-tag tag-bloqueado">🚫 Bloqueado</span>' : ''}
            </div>
            <div class="kanban-card-actions">
                <button class="btn-icon-small" data-action="edit" data-task-id="${task.id || task.contador}" title="Editar">✏️</button>
                <button class="btn-icon-small" data-action="delete" data-task-id="${task.id || task.contador}" title="Excluir">🗑️</button>
            </div>
        </div>
        ${descricaoTruncada ? `<p class="kanban-card-description">${escapeHtml(descricaoTruncada)}</p>` : ''}
        <div class="kanban-card-meta">
            ${task.responsavel ? `<span class="kanban-card-meta-item kanban-card-responsavel">👤 ${escapeHtml(task.responsavel)}</span>` : ''}
            ${prioridade ? `<span class="kanban-card-prioridade ${priorityInfo.class}">${priorityInfo.label}</span>` : ''}
        </div>
        ${outrasTags.length > 0 ? `
            <div class="kanban-card-tags">
                ${outrasTags.map(tag => `<span class="kanban-tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
        ` : ''}
        <div class="kanban-card-footer">
            ${createdAt ? `<span class="kanban-card-date">📅 Criado: ${createdAt}</span>` : ''}
            ${completedAt ? `<span class="kanban-card-date kanban-card-date-completed">✅ Concluído: ${completedAt}</span>` : ''}
        </div>
    `;

    return card;
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
function setupFilters(container, allTasks, onFilterChange) {
    const filterSelect = container.querySelector('#filterResponsavel');
    if (!filterSelect) return;

    // Limpar opções existentes (exceto "Todos")
    const allOption = filterSelect.querySelector('option[value=""]');
    filterSelect.innerHTML = '';
    if (allOption) {
        filterSelect.appendChild(allOption);
    }

    const responsaveis = [...new Set(allTasks.map(t => t.responsavel).filter(Boolean))].sort();

    responsaveis.forEach(resp => {
        const option = document.createElement('option');
        option.value = resp;
        option.textContent = resp;
        filterSelect.appendChild(option);
    });

    // Remover listeners anteriores
    const newSelect = filterSelect.cloneNode(true);
    filterSelect.parentNode.replaceChild(newSelect, filterSelect);

    newSelect.addEventListener('change', (e) => {
        const responsavel = e.target.value;
        const filtered = responsavel ?
            allTasks.filter(t => t.responsavel === responsavel) :
            allTasks;
        if (onFilterChange) onFilterChange(filtered);
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
        const newTask = {
            ...task
        };

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