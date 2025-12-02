/**
 * EstudosView - módulo de Estudos (Sprint 2)
 * Kanban + Pomodoro + Notas com visual redesign
 */

class EstudosView {
    constructor(container, store) {
        this.container = container;
        this.store = store;

        this.quickAdd = null;
        this.kanban = null;
        this.pomodoro = null;
        this.notas = null;
        this.revisaoEspacada = null;
        this.currentTopico = null;

        this._init();
    }

    async _init() {
        // Revisão espaçada
        this.revisaoEspacada = new RevisaoEspacada();
        this.store.setRevisaoEspacada(this.revisaoEspacada);

        this._createStructure();
        this._initQuickAdd();
        this._initKanban();
        this._setupEventListeners();

        this.store.subscribe(() => this._updateView());
        this._updateView();
    }

    _createStructure() {
        this.container.innerHTML = `
            <div class="estudos-view">
                <div class="estudos-hero">
                    <div class="estudos-hero-glow"></div>
                    <div class="estudos-hero-grid"></div>
                    <div class="estudos-hero-content">
                        <div class="estudos-hero-text">
                            <span class="estudos-kicker">Workspace</span>
                            <h1>📚 Estudos</h1>
                            <p class="estudos-subtitle">Kanban + Revisão + Pomodoro + Notas em um só fluxo.</p>
                            <div class="estudos-chips">
                                <span class="chip neon">Kanban</span>
                                <span class="chip pink">Pomodoro</span>
                                <span class="chip blue">Notas</span>
                            </div>
                        </div>
                        <div class="estudos-hero-actions">
                            <button class="btn btn-primary estudos-hero-btn" id="btnAddTopico" title="Adicionar novo tópico">➕ Novo Tópico</button>
                        </div>
                    </div>
                    <div id="quickAddContainer" class="estudos-quickadd-shell"></div>
                </div>
                <div id="kanbanContainer" class="estudos-kanban"></div>
            </div>

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

    _initQuickAdd() {
        const container = this.container.querySelector('#quickAddContainer');
        this.quickAdd = new QuickAddInput({
            container,
            parser: new QuickAddParser(),
            areas: this.store.getAreas(),
            tags: this.store.getAllTags(),
            onSubmit: (parsed) => this._handleQuickAdd(parsed)
        });
    }

    _handleQuickAdd(parsed) {
        // Não usamos área no momento; armazenamos areaId como null
        const topico = this.store.addTopico({
            titulo: parsed.titulo,
            areaId: null,
            prioridade: parsed.prioridade,
            tags: parsed.tags,
            tempoEstimado: parsed.tempoEstimado
        });

        this.quickAdd.updateData(this.store.getAreas(), this.store.getAllTags());
        this._showToast(`✅ Tópico "${topico.titulo}" criado!`);
    }

    _initKanban() {
        const container = this.container.querySelector('#kanbanContainer');
        this.kanban = new KanbanEstudos({
            container,
            topicos: this.store.getTopicos(),
            areas: this.store.getAreas(),
            onStatusChange: (id, status) => this._handleStatusChange(id, status),
            onCardClick: (topico) => this._openModal(topico),
            onEdit: (id) => this._handleEditTopico(id),
            onDelete: (id) => this._handleDeleteTopico(id)
        });
    }

    _handleStatusChange(topicoId, novoStatus) {
        const topico = this.store.updateTopico(topicoId, { status: novoStatus });
        if (topico && novoStatus === 'Concluído' && !topico.concluidoEm) {
            this.revisaoEspacada.agendarRevisaoInicial(topico);
            this.store.updateTopico(topicoId, {
                concluidoEm: new Date().toISOString(),
                proximaRevisao: topico.proximaRevisao
            });
        }
        this._showToast(`✅ Status atualizado para "${novoStatus}"`);
    }

    _openModal(topico) {
        this.currentTopico = topico;
        const modal = this.container.querySelector('#estudoModal');
        const titulo = modal.querySelector('#modalTopicoTitulo');
        titulo.textContent = topico.titulo;
        modal.style.display = 'flex';

        this._initPomodoro(topico);
        this._initNotas(topico);

        modal.querySelector('#modalClose')?.addEventListener('click', () => this._closeModal());
        modal.querySelector('#fecharModalBtn')?.addEventListener('click', () => this._closeModal());
        modal.querySelector('#salvarSessaoBtn')?.addEventListener('click', () => this._salvarSessao());
        modal.querySelector('.estudo-modal-overlay')?.addEventListener('click', () => this._closeModal());
    }

    _closeModal() {
        const modal = this.container.querySelector('#estudoModal');
        modal.style.display = 'none';
        if (this.pomodoro) { this.pomodoro.destroy(); this.pomodoro = null; }
        if (this.notas) { this.notas.destroy(); this.notas = null; }
        this.currentTopico = null;
    }

    _initPomodoro(topico) {
        const container = this.container.querySelector('#pomodoroContainer');
        container.innerHTML = '';
        this.pomodoro = new PomodoroTimer({
            duration: 25 * 60,
            onComplete: (mode, count) => {
                if (mode === 'work') this._showToast(`⚡ Pomodoro ${count} concluído!`);
            }
        });
        container.appendChild(this.pomodoro.getElement());
    }

    _initNotas(topico) {
        const container = this.container.querySelector('#notasContainer');
        container.innerHTML = '';
        this.notas = new NotasRapidas({
            container,
            topicoId: topico.id,
            onSave: () => {}
        });
    }

    _salvarSessao() {
        if (!this.currentTopico) return;
        const pomodoroElapsed = this.pomodoro ? Math.floor((this.pomodoro.duration - this.pomodoro.timeRemaining) / 60) : 0;
        const notas = this.notas ? this.notas.getContent() : '';
        if (pomodoroElapsed === 0 && !notas) {
            this._showToast('⚠️ Nenhuma sessão para salvar');
            return;
        }
        const sessao = this.store.addSessao(this.currentTopico.id, {
            duracao: pomodoroElapsed,
            notas,
            data: new Date().toISOString()
        });
        if (sessao) {
            this._showToast('✅ Sessão salva com sucesso!');
            this._closeModal();
        }
    }

    _updateView() {
        if (this.kanban) {
            this.kanban.updateTopicos(this.store.getTopicos());
            this.kanban.updateAreas(this.store.getAreas());
        }
        if (this.quickAdd) {
            this.quickAdd.updateData(this.store.getAreas(), this.store.getAllTags());
        }
    }

    _setupEventListeners() {
        const btnAdd = this.container.querySelector('#btnAddTopico');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => this._handleAddTopico());
        }
    }

    _handleAddTopico() {
        const newTopico = {
            titulo: 'Novo Tópico',
            descricao: '',
            areaId: null,
            status: 'Não iniciado',
            prioridade: 'Média',
            tags: []
        };
        this._openTopicoModal(newTopico, (data) => {
            const topico = this.store.addTopico(data);
            this._showToast(`✅ Tópico "${topico.titulo}" criado!`);
        });
    }

    _handleEditTopico(topicoId) {
        const topico = this.store.getTopicoById(topicoId);
        if (!topico) return this._showToast('⚠️ Tópico não encontrado');
        this._openTopicoModal(topico, (data) => {
            this.store.updateTopico(topicoId, data);
            this._showToast(`✅ Tópico "${data.titulo}" atualizado!`);
        });
    }

    async _handleDeleteTopico(topicoId) {
        const topico = this.store.getTopicoById(topicoId);
        if (!topico) return this._showToast('⚠️ Tópico não encontrado');
        const { confirmAction } = await import('../components/ConfirmModal.js');
        const ok = await confirmAction(`Excluir "${topico.titulo}"?`);
        if (ok) {
            this.store.removeTopico(topicoId);
            this._showToast(`✅ Tópico "${topico.titulo}" excluído!`);
        }
    }

    _openTopicoModal(topico, onSave) {
        const modal = document.createElement('div');
        modal.className = 'estudo-topico-modal';
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
                    <label class="estudo-topico-form-label">Prioridade</label>
                    <select id="topico-prioridade" class="estudo-topico-form-select">
                        <option value="Alta" ${topico.prioridade === 'Alta' ? 'selected' : ''}>Alta</option>
                        <option value="Média" ${topico.prioridade === 'Média' ? 'selected' : ''}>Média</option>
                        <option value="Baixa" ${topico.prioridade === 'Baixa' ? 'selected' : ''}>Baixa</option>
                    </select>
                </div>
                <div class="estudo-topico-form-group">
                    <label class="estudo-topico-form-label">Tags (separadas por vírgula)</label>
                    <input type="text" id="topico-tags" class="estudo-topico-form-input" value="${(topico.tags || []).join(', ')}" placeholder="ex: javascript, frontend">
                </div>
                <div class="estudo-topico-modal-footer">
                    <button id="topico-cancel" class="estudo-topico-btn estudo-topico-btn-cancel">Cancelar</button>
                    <button id="topico-save" class="estudo-topico-btn estudo-topico-btn-save">Salvar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const close = () => {
            if (modal.parentNode) modal.parentNode.removeChild(modal);
        };

        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
        modal.querySelector('#topico-cancel')?.addEventListener('click', close);
        modal.querySelector('#topico-save')?.addEventListener('click', () => {
            const titleInput = modal.querySelector('#topico-titulo');
            const titulo = titleInput ? titleInput.value.trim() : '';
            if (!titulo) {
                alert('O título é obrigatório');
                return;
            }
            const topicoData = {
                titulo,
                descricao: modal.querySelector('#topico-descricao')?.value.trim() || '',
                areaId: null,
                prioridade: modal.querySelector('#topico-prioridade')?.value || 'Média',
                tags: (modal.querySelector('#topico-tags')?.value || '')
                    .split(',')
                    .map(t => t.trim())
                    .filter(t => t.length > 0)
            };
            onSave(topicoData);
            close();
        });

        setTimeout(() => {
            modal.querySelector('#topico-titulo')?.focus();
        }, 100);
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    _showToast(message) {
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
            setTimeout(() => toast.parentNode && toast.parentNode.removeChild(toast), 300);
        }, 3000);
    }

    destroy() {
        if (this.quickAdd?.destroy) this.quickAdd.destroy();
        if (this.kanban?.destroy) this.kanban.destroy();
        this.container.innerHTML = '';
    }
}

export { EstudosView };
export default EstudosView;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EstudosView;
}
