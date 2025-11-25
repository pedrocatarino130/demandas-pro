/**
 * EstudosView - View principal do módulo de Estudos
 * 
 * Integra todos os componentes da Sprint 2:
 * - QuickAddInput para criação rápida
 * - KanbanEstudos para visualização
 * - Modal de estudo com PomodoroTimer e NotasRapidas
 * - RevisaoEspacada para revisões
 */

class EstudosView {
    constructor(container, store) {
        this.container = container;
        this.store = store;

        // Componentes
        this.quickAdd = null;
        this.kanban = null;
        this.modal = null;
        this.pomodoro = null;
        this.notas = null;
        this.revisaoEspacada = null;

        // Estado
        this.currentTopico = null;

        this._init();
    }

    /**
     * Inicializa a view
     */
    async _init() {
        // Carregar componentes
        await this._loadComponents();

        // Inicializar RevisaoEspacada
        this.revisaoEspacada = new RevisaoEspacada();
        this.store.setRevisaoEspacada(this.revisaoEspacada);

        // Criar estrutura
        this._createStructure();

        // Inicializar componentes
        this._initQuickAdd();
        this._initKanban();
        this._setupEventListeners();

        // Subscribir a mudanças no store
        this.store.subscribe(() => {
            this._updateView();
        });

        // Renderizar inicial
        this._updateView();
    }

    /**
     * Carrega componentes dinamicamente
     */
    async _loadComponents() {
        // Os componentes devem estar carregados globalmente
        // Se estiver usando módulos ES6, fazer imports aqui
    }

    /**
     * Cria estrutura HTML da view
     */
    _createStructure() {
        this.container.innerHTML = `
            <div class="estudos-view">
                <div class="estudos-header">
                    <h1>📚 Estudos</h1>
                    <div class="estudos-header-controls">
                        <button class="btn btn-primary" id="btnAddTopico" title="Adicionar novo tópico">➕ Novo Tópico</button>
                    </div>
                    <div id="quickAddContainer"></div>
                </div>
                <div id="kanbanContainer" class="estudos-kanban"></div>
            </div>
            
            <!-- Modal de Estudo -->
            <div id="estudoModal" class="estudo-modal" style="display: none;">
                <div class="estudo-modal-overlay"></div>
                <div class="estudo-modal-content">
                    <div class="estudo-modal-header">
                        <h2 id="modalTopicoTitulo">Tópico</h2>
                        <button class="estudo-modal-close" id="modalClose">✕</button>
                    </div>
                    <div class="estudo-modal-body">
                        <div id="pomodoroContainer"></div>
                        <div id="notasContainer"></div>
                    </div>
                    <div class="estudo-modal-footer">
                        <button class="btn btn-primary" id="salvarSessaoBtn">💾 Salvar Sessão</button>
                        <button class="btn btn-secondary" id="fecharModalBtn">Fechar</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Inicializa Quick Add
     */
    _initQuickAdd() {
        const container = this.container.querySelector('#quickAddContainer');

        const areas = this.store.getAreas();
        const tags = this.store.getAllTags();

        this.quickAdd = new QuickAddInput({
            container: container,
            parser: new QuickAddParser(),
            areas: areas,
            tags: tags,
            onSubmit: (parsed) => this._handleQuickAdd(parsed)
        });
    }

    /**
     * Handler do Quick Add
     */
    _handleQuickAdd(parsed) {
        // Verificar/criar área
        let areaId = null;
        if (parsed.area) {
            const existingArea = this.store.getAreas().find(
                a => a.nome.toLowerCase() === parsed.area.toLowerCase()
            );

            if (existingArea) {
                areaId = existingArea.id;
            } else {
                // Criar nova área
                const novaArea = this.store.addArea({
                    nome: parsed.area,
                    cor: '#3b82f6',
                    icone: '📚'
                });
                areaId = novaArea.id;
            }
        }

        // Criar tópico
        const topico = this.store.addTopico({
            titulo: parsed.titulo,
            areaId: areaId,
            prioridade: parsed.prioridade,
            tags: parsed.tags,
            tempoEstimado: parsed.tempoEstimado
        });

        // Atualizar Quick Add com novas áreas/tags
        this.quickAdd.updateData(this.store.getAreas(), this.store.getAllTags());

        // Feedback visual
        this._showToast(`✅ Tópico "${topico.titulo}" criado!`);
    }

    /**
     * Inicializa Kanban
     */
    _initKanban() {
        const container = this.container.querySelector('#kanbanContainer');

        this.kanban = new KanbanEstudos({
            container: container,
            topicos: this.store.getTopicos(),
            areas: this.store.getAreas(),
            onStatusChange: (topicoId, novoStatus) => this._handleStatusChange(topicoId, novoStatus),
            onCardClick: (topico) => this._openModal(topico)
        });
    }

    /**
     * Handler de mudança de status (drag & drop)
     */
    _handleStatusChange(topicoId, novoStatus) {
        const topico = this.store.updateTopico(topicoId, {
            status: novoStatus
        });

        if (topico && novoStatus === 'Concluído' && !topico.concluidoEm) {
            // Se concluiu, agendar revisão
            this.revisaoEspacada.agendarRevisaoInicial(topico);
            this.store.updateTopico(topicoId, {
                concluidoEm: new Date().toISOString(),
                proximaRevisao: topico.proximaRevisao
            });
        }

        this._showToast(`✅ Status atualizado para "${novoStatus}"`);
    }

    /**
     * Abre modal de estudo
     */
    _openModal(topico) {
        this.currentTopico = topico;
        const modal = this.container.querySelector('#estudoModal');
        const titulo = modal.querySelector('#modalTopicoTitulo');

        titulo.textContent = topico.titulo;
        modal.style.display = 'flex';

        // Inicializar Pomodoro
        this._initPomodoro(topico);

        // Inicializar Notas
        this._initNotas(topico);

        // Eventos do modal
        modal.querySelector('#modalClose').addEventListener('click', () => this._closeModal());
        modal.querySelector('#fecharModalBtn').addEventListener('click', () => this._closeModal());
        modal.querySelector('#salvarSessaoBtn').addEventListener('click', () => this._salvarSessao());

        // Fechar ao clicar no overlay
        modal.querySelector('.estudo-modal-overlay').addEventListener('click', () => this._closeModal());
    }

    /**
     * Fecha modal
     */
    _closeModal() {
        const modal = this.container.querySelector('#estudoModal');
        modal.style.display = 'none';

        // Limpar componentes
        if (this.pomodoro) {
            this.pomodoro.destroy();
            this.pomodoro = null;
        }

        if (this.notas) {
            this.notas.destroy();
            this.notas = null;
        }

        this.currentTopico = null;
    }

    /**
     * Inicializa Pomodoro Timer
     */
    _initPomodoro(topico) {
        const container = this.container.querySelector('#pomodoroContainer');
        container.innerHTML = '';

        this.pomodoro = new PomodoroTimer({
            duration: 25 * 60,
            onComplete: (mode, count) => {
                if (mode === 'work') {
                    this._showToast(`🎉 Pomodoro ${count} concluído!`);
                }
            },
            onAutoSave: (progress) => {
                // Auto-save do progresso
                console.log('Auto-save pomodoro', progress);
            }
        });

        container.appendChild(this.pomodoro.getElement());
    }

    /**
     * Inicializa Notas Rápidas
     */
    _initNotas(topico) {
        const container = this.container.querySelector('#notasContainer');
        container.innerHTML = '';

        this.notas = new NotasRapidas({
            container: container,
            topicoId: topico.id,
            onSave: (data) => {
                console.log('Notas salvas', data);
            }
        });
    }

    /**
     * Salva sessão de estudo
     */
    _salvarSessao() {
        if (!this.currentTopico) return;

        const pomodoroElapsed = this.pomodoro ?
            Math.floor((this.pomodoro.duration - this.pomodoro.timeRemaining) / 60) : 0;
        const notas = this.notas ? this.notas.getContent() : '';

        if (pomodoroElapsed === 0 && !notas) {
            this._showToast('⚠️ Nenhuma sessão para salvar');
            return;
        }

        const sessao = this.store.addSessao(this.currentTopico.id, {
            duracao: pomodoroElapsed,
            notas: notas,
            data: new Date().toISOString()
        });

        if (sessao) {
            this._showToast('✅ Sessão salva com sucesso!');
            this._closeModal();
        }
    }

    /**
     * Atualiza a view quando o estado muda
     */
    _updateView() {
        // Atualizar Kanban
        if (this.kanban) {
            this.kanban.updateTopicos(this.store.getTopicos());
            this.kanban.updateAreas(this.store.getAreas());
        }

        // Atualizar Quick Add
        if (this.quickAdd) {
            this.quickAdd.updateData(this.store.getAreas(), this.store.getAllTags());
        }
    }

    /**
     * Configura event listeners
     */
    _setupEventListeners() {
        // Botão adicionar tópico
        const btnAdd = this.container.querySelector('#btnAddTopico');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => this._handleAddTopico());
        }

        // Event delegation para botões de ação nos cards
        const kanbanContainer = this.container.querySelector('#kanbanContainer');
        if (kanbanContainer) {
            kanbanContainer.addEventListener('click', (e) => {
                const actionBtn = e.target.closest('[data-action]');
                if (!actionBtn) return;

                const action = actionBtn.getAttribute('data-action');
                const topicoId = actionBtn.getAttribute('data-topico-id');

                if (action === 'edit' && topicoId) {
                    this._handleEditTopico(topicoId);
                } else if (action === 'delete' && topicoId) {
                    this._handleDeleteTopico(topicoId);
                }
            });
        }
    }

    /**
     * Handler para adicionar novo tópico
     */
    _handleAddTopico() {
        const areas = this.store.getAreas();
        const areaId = areas.length > 0 ? areas[0].id : null;

        const newTopico = {
            titulo: 'Novo Tópico',
            descricao: '',
            areaId: areaId,
            status: 'Não iniciado',
            prioridade: 'Média',
            tags: []
        };

        this._openTopicoModal(newTopico, (topicoData) => {
            const topico = this.store.addTopico(topicoData);
            this._showToast(`✅ Tópico "${topico.titulo}" criado!`);
        });
    }

    /**
     * Handler para editar tópico
     */
    _handleEditTopico(topicoId) {
        const topico = this.store.getTopicoById(topicoId);
        if (!topico) {
            this._showToast('⚠️ Tópico não encontrado');
            return;
        }

        this._openTopicoModal(topico, (topicoData) => {
            this.store.updateTopico(topicoId, topicoData);
            this._showToast(`✅ Tópico "${topicoData.titulo}" atualizado!`);
        });
    }

    /**
     * Handler para excluir tópico
     */
    async _handleDeleteTopico(topicoId) {
        const topico = this.store.getTopicoById(topicoId);
        if (!topico) {
            this._showToast('⚠️ Tópico não encontrado');
            return;
        }

        // Importar dinamicamente para evitar dependência circular
        const { confirmAction } = await import('../components/ConfirmModal.js');
        const confirmed = await confirmAction(`Tem certeza que deseja excluir "${topico.titulo}"?`);
        
        if (confirmed) {
            this.store.removeTopico(topicoId);
            this._showToast(`✅ Tópico "${topico.titulo}" excluído!`);
        }
    }

    /**
     * Abre modal para editar/criar tópico
     */
    _openTopicoModal(topico, onSave) {
        // Criar modal simples
        const modal = document.createElement('div');
        modal.className = 'estudo-topico-modal';

        const areas = this.store.getAreas();
        const areasOptions = areas.map(a => 
            `<option value="${a.id}" ${topico.areaId === a.id ? 'selected' : ''}>${a.nome}</option>`
        ).join('');

        modal.innerHTML = `
            <div class="estudo-topico-modal-content">
                <h2 class="estudo-topico-modal-title">${topico.id ? 'Editar' : 'Novo'} Tópico</h2>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Título *</label>
                    <input type="text" id="topico-titulo" class="estudo-topico-form-input" value="${this._escapeHtml(topico.titulo || '')}" required>
                </div>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Descrição</label>
                    <textarea id="topico-descricao" rows="4" class="estudo-topico-form-textarea">${this._escapeHtml(topico.descricao || '')}</textarea>
                </div>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Área</label>
                    <select id="topico-area" class="estudo-topico-form-select">
                        <option value="">Sem área</option>
                        ${areasOptions}
                    </select>
                </div>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Prioridade</label>
                    <select id="topico-prioridade" class="estudo-topico-form-select">
                        <option value="Alta" ${topico.prioridade === 'Alta' ? 'selected' : ''}>Alta</option>
                        <option value="Média" ${topico.prioridade === 'Média' ? 'selected' : ''}>Média</option>
                        <option value="Baixa" ${topico.prioridade === 'Baixa' ? 'selected' : ''}>Baixa</option>
                    </select>
                </div>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Tags (separadas por vírgula)</label>
                    <input type="text" id="topico-tags" class="estudo-topico-form-input" value="${(topico.tags || []).join(', ')}" 
                           placeholder="ex: javascript, frontend">
                </div>
                <div class="estudo-topico-modal-footer">
                    <button id="topico-cancel" class="estudo-topico-btn estudo-topico-btn-cancel">Cancelar</button>
                    <button id="topico-save" class="estudo-topico-btn estudo-topico-btn-save">Salvar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const close = () => {
            document.body.removeChild(modal);
        };

        modal.querySelector('#topico-cancel').addEventListener('click', close);
        modal.querySelector('.estudo-topico-modal').addEventListener('click', (e) => {
            if (e.target === modal) close();
        });

        modal.querySelector('#topico-save').addEventListener('click', () => {
            const titulo = modal.querySelector('#topico-titulo').value.trim();
            if (!titulo) {
                alert('O título é obrigatório');
                return;
            }

            const topicoData = {
                titulo: titulo,
                descricao: modal.querySelector('#topico-descricao').value.trim(),
                areaId: modal.querySelector('#topico-area').value || null,
                prioridade: modal.querySelector('#topico-prioridade').value,
                tags: modal.querySelector('#topico-tags').value
                    .split(',')
                    .map(t => t.trim())
                    .filter(t => t.length > 0)
            };

            onSave(topicoData);
            close();
        });

        // Focar no título
        setTimeout(() => modal.querySelector('#topico-titulo').focus(), 100);
    }

    /**
     * Escapa HTML
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Mostra toast de feedback
     */
    _showToast(message) {
        // Criar toast simples
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--surface, #fff);
            color: var(--text-primary, #000);
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Destrói a view
     */
    destroy() {
        if (this.quickAdd) {
            this.quickAdd.destroy();
        }
        if (this.kanban) {
            // Kanban não tem destroy, mas podemos limpar
        }
        if (this.pomodoro) {
            this.pomodoro.destroy();
        }
        if (this.notas) {
            this.notas.destroy();
        }
        this.container.innerHTML = '';
    }
}

// Export ES6
export { EstudosView };
export default EstudosView;

// Export para uso global (compatibilidade)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EstudosView;
}
