/**
 * Modal de Edição de Tarefa
 * Componente para editar tarefas do kanban de projetos
 */

import { NeonButton } from './NeonButton.js';

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
        
        // Se usar redesign, configurar botões após um pequeno delay
        setTimeout(() => {
            if (this.modal.classList.contains('task-edit-modal-redesign')) {
                this.setupRedesignButtons();
            }
        }, 100);
    }

    render() {
        // Detectar se deve usar redesign (verificar se home view redesign existe)
        const useRedesign = !!document.querySelector('.home-view-redesign');
        const modalClass = useRedesign ? 'task-edit-modal-redesign' : 'task-edit-modal';
        
        if (useRedesign) {
            this.modal.className = modalClass;
        }
        
        if (useRedesign) {
            this.renderRedesign();
        } else {
            this.renderClassic();
        }
    }
    
    renderRedesign() {
        this.modal.innerHTML = `
            <div class="task-edit-modal-redesign-overlay"></div>
            <div class="task-edit-modal-redesign-container">
                <div class="task-edit-modal-redesign-border"></div>
                <div class="task-edit-modal-redesign-inner"></div>
                <div class="task-edit-modal-redesign-content">
                    <div class="task-edit-modal-redesign-header">
                        <h2 id="task-edit-modal-title" class="task-edit-modal-redesign-title">Editar Tarefa</h2>
                        <button class="task-edit-modal-redesign-close" aria-label="Fechar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="task-edit-modal-redesign-body">
                        <div class="task-edit-modal-redesign-form-group">
                            <label for="task-edit-titulo" class="task-edit-modal-redesign-label">Título *</label>
                            <input 
                                type="text" 
                                id="task-edit-titulo" 
                                class="task-edit-modal-redesign-input" 
                                required 
                                placeholder="Ex: Refatorar Homepage"
                            />
                        </div>
                        <div class="task-edit-modal-redesign-form-group">
                            <label for="task-edit-descricao" class="task-edit-modal-redesign-label">Descrição</label>
                            <textarea 
                                id="task-edit-descricao" 
                                class="task-edit-modal-redesign-input task-edit-modal-redesign-textarea" 
                                rows="3" 
                                placeholder="Detalhes da tarefa..."
                            ></textarea>
                        </div>
                        <div class="task-edit-modal-redesign-row">
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-prioridade" class="task-edit-modal-redesign-label">Prioridade</label>
                                <select id="task-edit-prioridade" class="task-edit-modal-redesign-input">
                                    <option value="baixa">Baixa</option>
                                    <option value="media" selected>Média</option>
                                    <option value="alta">Alta</option>
                                    <option value="urgente">Urgente</option>
                                </select>
                            </div>
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-responsavel" class="task-edit-modal-redesign-label">Responsável</label>
                                <input 
                                    type="text" 
                                    id="task-edit-responsavel" 
                                    class="task-edit-modal-redesign-input" 
                                    placeholder="Nome"
                                />
                            </div>
                        </div>
                        <div class="task-edit-modal-redesign-form-group">
                            <label for="task-edit-tags" class="task-edit-modal-redesign-label">Tags (separadas por vírgula)</label>
                            <input 
                                type="text" 
                                id="task-edit-tags" 
                                class="task-edit-modal-redesign-input" 
                                placeholder="frontend, urgente, bug"
                            />
                        </div>
                        <div class="task-edit-modal-redesign-row" id="task-edit-time-row" style="display: none;">
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-time" class="task-edit-modal-redesign-label">Hora</label>
                                <input 
                                    type="time" 
                                    id="task-edit-time" 
                                    class="task-edit-modal-redesign-input"
                                />
                            </div>
                        </div>
                        <div class="task-edit-modal-redesign-row">
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-date" class="task-edit-modal-redesign-label">Data</label>
                                <input 
                                    type="date" 
                                    id="task-edit-date" 
                                    class="task-edit-modal-redesign-input"
                                />
                            </div>
                            <div class="task-edit-modal-redesign-form-group">
                                <label for="task-edit-status" class="task-edit-modal-redesign-label">Status</label>
                                <select id="task-edit-status" class="task-edit-modal-redesign-input">
                                    <option value="todo">A Fazer</option>
                                    <option value="doing">Fazendo</option>
                                    <option value="done">Feito</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="task-edit-modal-redesign-footer">
                        <button class="task-edit-modal-redesign-cancel" id="task-edit-cancel">Cancelar</button>
                        <div class="task-edit-modal-redesign-save-container" id="task-edit-save-container"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Renderizar NeonButton via DOM
        setTimeout(() => {
            this.setupRedesignButtons();
        }, 0);
    }
    
    renderClassic() {
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
    
    setupRedesignButtons() {
        const saveContainer = this.modal.querySelector('#task-edit-save-container');
        if (!saveContainer || saveContainer.hasChildNodes()) return;
        
        const saveButton = new NeonButton({
            text: 'Salvar',
            variant: 'primary',
            icon: '💾',
            type: 'button',
            onClick: () => this.handleSave()
        });
        
        saveContainer.appendChild(saveButton.render());
    }

    setupEventListeners() {
        // Verificar qual estilo está sendo usado
        const useRedesign = this.modal.classList.contains('task-edit-modal-redesign');
        
        const overlay = this.modal.querySelector(useRedesign ? '.task-edit-modal-redesign-overlay' : '.task-edit-modal-overlay');
        const closeBtn = this.modal.querySelector(useRedesign ? '.task-edit-modal-redesign-close' : '.task-edit-modal-close');
        const cancelBtn = this.modal.querySelector('#task-edit-cancel');

        const close = () => this.close();

        if (overlay) overlay.addEventListener('click', close);
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (cancelBtn) cancelBtn.addEventListener('click', close);

        // Botão save no redesign é tratado no setupRedesignButtons
        if (!useRedesign) {
            const saveBtn = this.modal.querySelector('#task-edit-save');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.handleSave());
            }
        }

        // Fechar com ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape' && this.modal.style.display !== 'none') {
                close();
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Adicionar listeners para focus nos inputs (estilo neon)
        if (useRedesign) {
            const inputs = this.modal.querySelectorAll('.task-edit-modal-redesign-input');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.classList.add('focused');
                });
                input.addEventListener('blur', () => {
                    input.classList.remove('focused');
                });
            });
        }
    }

    open(task, onSave) {
        if (!task) return;

        this.currentTask = task;
        this.onSave = onSave;
        
        // Detectar se deve usar redesign e re-renderizar se necessário
        const useRedesign = !!document.querySelector('.home-view-redesign');
        const shouldUseRedesign = useRedesign && !this.modal.classList.contains('task-edit-modal-redesign');
        
        if (shouldUseRedesign || (!useRedesign && this.modal.classList.contains('task-edit-modal-redesign'))) {
            // Precisa re-renderizar com o estilo correto
            this.render();
            this.setupEventListeners();
        }

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

        // Preencher data - sempre mostrar no redesign
        const defaultDate = new Date(Date.now() + 60 * 60 * 1000);
        if (dateInput) {
            if (task.time) {
                const taskDate = new Date(task.time);
                dateInput.value = taskDate.toISOString().split('T')[0];
            } else {
                dateInput.value = defaultDate.toISOString().split('T')[0];
            }
        }
        
        // Preencher hora se existir (campo opcional)
        if (task.time) {
            const taskDate = new Date(task.time);
            if (timeInput) {
                const hours = String(taskDate.getHours()).padStart(2, '0');
                const minutes = String(taskDate.getMinutes()).padStart(2, '0');
                timeInput.value = `${hours}:${minutes}`;
            }
            if (timeRow) {
                timeRow.style.display = 'flex';
            }
        } else {
            // Ocultar campo de hora se não houver time
            if (timeRow) {
                timeRow.style.display = 'none';
            }
        }

        // Mostrar modal
        this.modal.style.display = 'flex';
        
        // Configurar botão save se usar redesign
        if (useRedesign) {
            setTimeout(() => {
                this.setupRedesignButtons();
            }, 50);
        }
        
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

