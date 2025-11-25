/**
 * Modal de Edição de Tarefa
 * Componente para editar tarefas do kanban de projetos
 */

export class TaskEditModal {
    constructor() {
        this.modal = null;
        this.currentTask = null;
        this.onSave = null;
        this.init();
    }

    init() {
        // Criar modal se não existir
        if (document.getElementById('task-edit-modal')) {
            this.modal = document.getElementById('task-edit-modal');
        } else {
            this.modal = document.createElement('div');
            this.modal.id = 'task-edit-modal';
            this.modal.className = 'task-edit-modal';
            this.modal.style.display = 'none';
            document.body.appendChild(this.modal);
        }

        this.render();
        this.setupEventListeners();
    }

    render() {
        this.modal.innerHTML = `
            <div class="task-edit-modal-overlay"></div>
            <div class="task-edit-modal-content">
                <div class="task-edit-modal-header">
                    <h2 id="task-edit-modal-title">Editar Tarefa</h2>
                    <button class="task-edit-modal-close" aria-label="Fechar">✕</button>
                </div>
                <div class="task-edit-modal-body">
                    <div class="form-group">
                        <label for="task-edit-titulo">Título *</label>
                        <input 
                            type="text" 
                            id="task-edit-titulo" 
                            class="input" 
                            required 
                            placeholder="Título da tarefa"
                        />
                    </div>
                    <div class="form-group">
                        <label for="task-edit-descricao">Descrição</label>
                        <textarea 
                            id="task-edit-descricao" 
                            class="input" 
                            rows="4" 
                            placeholder="Descrição da tarefa"
                        ></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="task-edit-prioridade">Prioridade</label>
                            <select id="task-edit-prioridade" class="input">
                                <option value="baixa">Baixa</option>
                                <option value="media" selected>Média</option>
                                <option value="alta">Alta</option>
                                <option value="urgente">Urgente</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="task-edit-responsavel">Responsável</label>
                            <input 
                                type="text" 
                                id="task-edit-responsavel" 
                                class="input" 
                                placeholder="Nome do responsável"
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="task-edit-tags">Tags (separadas por vírgula)</label>
                        <input 
                            type="text" 
                            id="task-edit-tags" 
                            class="input" 
                            placeholder="ex: importante, frontend, bloqueado"
                        />
                    </div>
                    <div class="form-group">
                        <label for="task-edit-status">Status</label>
                        <select id="task-edit-status" class="input">
                            <option value="todo">A Fazer</option>
                            <option value="doing">Fazendo</option>
                            <option value="done">Feito</option>
                        </select>
                    </div>
                    <div class="form-row" id="task-edit-time-row" style="display: none;">
                        <div class="form-group">
                            <label for="task-edit-date">Data</label>
                            <input 
                                type="date" 
                                id="task-edit-date" 
                                class="input"
                            />
                        </div>
                        <div class="form-group">
                            <label for="task-edit-time">Hora</label>
                            <input 
                                type="time" 
                                id="task-edit-time" 
                                class="input"
                            />
                        </div>
                    </div>
                </div>
                <div class="task-edit-modal-footer">
                    <button class="btn btn-secondary" id="task-edit-cancel">Cancelar</button>
                    <button class="btn btn-primary" id="task-edit-save">Salvar</button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const overlay = this.modal.querySelector('.task-edit-modal-overlay');
        const closeBtn = this.modal.querySelector('.task-edit-modal-close');
        const cancelBtn = this.modal.querySelector('#task-edit-cancel');
        const saveBtn = this.modal.querySelector('#task-edit-save');

        const close = () => this.close();

        if (overlay) overlay.addEventListener('click', close);
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (cancelBtn) cancelBtn.addEventListener('click', close);

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.handleSave());
        }

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display !== 'none') {
                close();
            }
        });
    }

    open(task, onSave) {
        if (!task) return;

        this.currentTask = task;
        this.onSave = onSave;

        // Atualizar título do modal
        const titleEl = this.modal.querySelector('#task-edit-modal-title');
        if (titleEl) {
            // Verificar se é uma nova tarefa (sem id ou com título padrão)
            const isNew = !task.id || task.titulo === 'Nova Tarefa';
            titleEl.textContent = isNew ? 'Criar Tarefa' : 'Editar Tarefa';
        }

        // Preencher campos
        const tituloInput = this.modal.querySelector('#task-edit-titulo');
        const descricaoInput = this.modal.querySelector('#task-edit-descricao');
        const prioridadeSelect = this.modal.querySelector('#task-edit-prioridade');
        const responsavelInput = this.modal.querySelector('#task-edit-responsavel');
        const tagsInput = this.modal.querySelector('#task-edit-tags');
        const statusSelect = this.modal.querySelector('#task-edit-status');
        const dateInput = this.modal.querySelector('#task-edit-date');
        const timeInput = this.modal.querySelector('#task-edit-time');
        const timeRow = this.modal.querySelector('#task-edit-time-row');

        if (tituloInput) tituloInput.value = task.titulo || task.nome || '';
        if (descricaoInput) descricaoInput.value = task.descricao || '';
        if (prioridadeSelect) {
            const prioridade = (task.prioridade || 'media').toLowerCase();
            prioridadeSelect.value = prioridade;
        }
        if (responsavelInput) responsavelInput.value = task.responsavel || '';
        if (tagsInput) {
            const tags = task.tags || [];
            tagsInput.value = tags.join(', ');
        }
        if (statusSelect) {
            statusSelect.value = task.status || 'todo';
        }

        // Preencher data/hora se existir
        if (task.time) {
            const taskDate = new Date(task.time);
            if (dateInput) {
                dateInput.value = taskDate.toISOString().split('T')[0];
            }
            if (timeInput) {
                const hours = String(taskDate.getHours()).padStart(2, '0');
                const minutes = String(taskDate.getMinutes()).padStart(2, '0');
                timeInput.value = `${hours}:${minutes}`;
            }
            if (timeRow) {
                timeRow.style.display = 'flex';
            }
        } else if (task.time !== undefined) {
            // Se time foi definido mas é null/undefined, mostrar campos
            if (timeRow) {
                timeRow.style.display = 'flex';
            }
            // Preencher com data/hora padrão (1 hora a partir de agora)
            const defaultTime = new Date(Date.now() + 60 * 60 * 1000);
            if (dateInput) {
                dateInput.value = defaultTime.toISOString().split('T')[0];
            }
            if (timeInput) {
                const hours = String(defaultTime.getHours()).padStart(2, '0');
                const minutes = String(defaultTime.getMinutes()).padStart(2, '0');
                timeInput.value = `${hours}:${minutes}`;
            }
        } else {
            // Ocultar campos de data/hora se não for tarefa com horário
            if (timeRow) {
                timeRow.style.display = 'none';
            }
        }

        // Mostrar modal
        this.modal.style.display = 'flex';
        
        // Focar no título
        if (tituloInput) {
            setTimeout(() => tituloInput.focus(), 100);
        }
    }

    close() {
        this.modal.style.display = 'none';
        this.currentTask = null;
        this.onSave = null;
    }

    handleSave() {
        const tituloInput = this.modal.querySelector('#task-edit-titulo');
        const descricaoInput = this.modal.querySelector('#task-edit-descricao');
        const prioridadeSelect = this.modal.querySelector('#task-edit-prioridade');
        const responsavelInput = this.modal.querySelector('#task-edit-responsavel');
        const tagsInput = this.modal.querySelector('#task-edit-tags');
        const statusSelect = this.modal.querySelector('#task-edit-status');
        const dateInput = this.modal.querySelector('#task-edit-date');
        const timeInput = this.modal.querySelector('#task-edit-time');
        const timeRow = this.modal.querySelector('#task-edit-time-row');

        const titulo = tituloInput?.value.trim();
        if (!titulo) {
            alert('O título é obrigatório');
            tituloInput?.focus();
            return;
        }

        const updates = {
            titulo: titulo,
            descricao: descricaoInput?.value.trim() || '',
            prioridade: prioridadeSelect?.value || 'media',
            responsavel: responsavelInput?.value.trim() || '',
            tags: tagsInput?.value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0),
            status: statusSelect?.value || 'todo',
            updatedAt: new Date().toISOString()
        };

        // Processar data/hora se os campos estiverem visíveis
        if (timeRow && timeRow.style.display !== 'none') {
            if (dateInput?.value && timeInput?.value) {
                const dateStr = dateInput.value;
                const timeStr = timeInput.value;
                const dateTime = new Date(`${dateStr}T${timeStr}`);
                updates.time = dateTime.toISOString();
            } else if (this.currentTask.time !== undefined) {
                // Se tinha time mas foi removido, definir como null
                updates.time = null;
            }
        } else if (this.currentTask.time !== undefined) {
            // Se tinha time mas os campos não estão visíveis, manter o time original
            updates.time = this.currentTask.time;
        }

        // Se mudou para "done" e não tinha dataConclusao, adicionar
        if (updates.status === 'done' && !this.currentTask.dataConclusao) {
            updates.dataConclusao = new Date().toISOString();
        }
        // Se mudou de "done" para outro status, remover dataConclusao
        if (updates.status !== 'done' && this.currentTask.status === 'done') {
            updates.dataConclusao = null;
        }

        if (this.onSave) {
            this.onSave(this.currentTask, updates);
        }

        this.close();
    }
}

// Singleton
export const taskEditModal = new TaskEditModal();

