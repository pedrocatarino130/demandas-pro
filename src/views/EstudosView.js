/**
 * EstudosView - nova organização
 * Foco em: gestão de áreas (criar/editar/excluir), fila de prioridade e kanban.
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
        this.selectedAreaId = null;
        this.editingAreaId = null;
        this.boardScope = 'filter'; // legado
        this.statusFilter = 'all'; // all | backlog | andamento | revisao | concluido
        this.folderFilter = null; // areaId | null | 'sem-area'

        this._init();
    }

    async _init() {
        this.revisaoEspacada = new RevisaoEspacada();
        this.store.setRevisaoEspacada(this.revisaoEspacada);

        this._createStructure();
        this._setupEventBus();
        this._initQuickAdd();
        this._setupHeroActions();

        this.store.subscribe(() => this._updateView());
        this._updateView();
    }

    _createStructure() {
        this.container.innerHTML = `
            <div class="estudos-view estudos-shell">
                <header class="estudos-header-bar">
                    <div>
                        <p class="estudos-kicker">Workspace</p>
                        <h1>📚 Estudos</h1>
                        <p class="estudos-subtitle">Capture rápido, veja prioridades e arraste no quadro.</p>
                    </div>
                    <div class="estudos-header-actions">
                        <button class="btn btn-primary" id="btnAddTopico" title="Adicionar novo tópico">➕ Novo Tópico</button>
                    </div>
                </header>

                <div id="estudosTabs" class="estudos-tabs"></div>

                <section class="estudos-grid-layout">
                    <div class="estudos-column-main">
                        <div class="estudos-panel">
                            <div class="estudos-panel-header">
                                <div>
                                    <p class="estudos-panel-kicker">Entrada rápida</p>
                                    <h3 class="estudos-panel-title">Adicionar tópico</h3>
                                </div>
                                <span class="estudos-panel-note">Use @área #tags :tempo</span>
                            </div>
                            <div id="quickAddContainer" class="estudos-quickadd-shell"></div>
                        </div>

                        <div class="estudos-panel" id="estudosSpotlight"></div>

                        <div class="estudos-panel">
                            <div class="estudos-panel-header">
                                <div>
                                    <p class="estudos-panel-kicker">Itens</p>
                                    <h3 class="estudos-panel-title">Galeria de cards</h3>
                                </div>
                                <span class="estudos-panel-note">Edite status e pasta direto no card.</span>
                            </div>
                            <div id="estudosCardGrid" class="estudos-card-grid"></div>
                        </div>
                    </div>

                    <div class="estudos-column-side">
                        <div class="estudos-panel">
                            <div class="estudos-panel-header">
                                <div>
                                    <p class="estudos-panel-kicker">Pastas</p>
                                    <h3 class="estudos-panel-title">Organização</h3>
                                </div>
                                <span class="estudos-panel-note">Agrupe por área.</span>
                            </div>
                            <div id="estudosFoldersPanel"></div>
                        </div>

                        <div class="estudos-panel">
                            <div class="estudos-panel-header">
                                <div>
                                    <p class="estudos-panel-kicker">Resumo</p>
                                    <h3 class="estudos-panel-title">Status rápido</h3>
                                </div>
                                <span class="estudos-panel-note">Baseado no filtro atual.</span>
                            </div>
                            <div id="estudosStatusGrid" class="estudos-stats-grid"></div>
                        </div>
                    </div>
                </section>
            </div>

            <div id="estudoModal" class="estudo-modal" style="display: none;">
                <div class="estudo-modal-overlay"></div>
                <div class="estudo-modal-content">
                    <div class="estudo-modal-header">
                        <h2 id="modalTopicoTitulo">Tópico</h2>
                        <button class="estudo-modal-close" id="modalClose">✕</button>
                    </div>
                    <div class="estudo-modal-body">
                        <div id="topicoDetailContainer"></div>
                        <div class="estudo-modal-grid">
                            <div id="pomodoroContainer"></div>
                            <div id="notasContainer"></div>
                        </div>
                    </div>
                    <div class="estudo-modal-footer">
                        <button class="btn btn-secondary" id="salvarTopicoBtn">💾 Salvar alterações</button>
                        <button class="btn btn-primary" id="salvarSessaoBtn">💾 Salvar Sessão</button>
                        <button class="btn btn-secondary" id="fecharModalBtn">Fechar</button>
                    </div>
                </div>
            </div>
        `;
    }

    _setupHeroActions() {
        const btnAdd = this.container.querySelector('#btnAddTopico');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => this._handleAddTopico());
        }
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
        const areaId = this.folderFilter && this.folderFilter !== 'sem-area' ? this.folderFilter : null;
        const topico = this.store.addTopico({
            titulo: parsed.titulo,
            areaId,
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

        this._renderTopicoDetail(topico);
        this._initPomodoro(topico);
        this._initNotas(topico);

        modal.querySelector('#modalClose')?.addEventListener('click', () => this._closeModal());
        modal.querySelector('#fecharModalBtn')?.addEventListener('click', () => this._closeModal());
        modal.querySelector('#salvarTopicoBtn')?.addEventListener('click', () => this._salvarTopicoEdits());
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
        const areas = this.store.getAreas();
        const allTopicos = this.store.getTopicos();
        const filteredTopicos = this._applyFilters(allTopicos);

        if (this.quickAdd) {
            this.quickAdd.updateData(areas, this.store.getAllTags());
        }

        this._renderTabs(areas);
        this._renderSpotlight(filteredTopicos, areas);
        this._renderStatus(filteredTopicos);
        this._renderFoldersPanel(areas, allTopicos);
        this._renderCardGrid(filteredTopicos, areas);
    }

    _renderStatus(topicos) {
        const container = this.container.querySelector('#estudosStatusGrid');
        if (!container) return;

        const counters = this._computeCounters(topicos);
        const stats = [
            { label: 'Backlog', value: counters.backlog, hint: 'Não iniciados', icon: '🗂️' },
            { label: 'Ativos', value: counters.andamento, hint: 'Estudando', icon: '⚡' },
            { label: 'Revisão', value: counters.revisoes, hint: 'Pendências', icon: '🔁' },
            { label: 'Concluídos (7d)', value: counters.concluidos7d, hint: 'Vitórias recentes', icon: '✅' }
        ];

        container.innerHTML = stats.map((stat) => `
            <div class="estudos-stat-card">
                <div class="estudos-stat-icon">${stat.icon}</div>
                <div class="estudos-stat-value">${stat.value}</div>
                <div class="estudos-stat-label">${stat.label}</div>
                <div class="estudos-stat-hint">${stat.hint}</div>
            </div>
        `).join('');
    }

    _renderTabs(areas) {
        const container = this.container.querySelector('#estudosTabs');
        if (!container) return;
        const tabs = [
            { key: 'all', label: 'Tudo' },
            { key: 'backlog', label: 'A fazer' },
            { key: 'andamento', label: 'Em foco' },
            { key: 'revisao', label: 'Revisão' },
            { key: 'concluido', label: 'Concluídos' }
        ];

        const folderLabel = this.folderFilter === 'sem-area'
            ? 'Sem pasta'
            : (areas.find((a) => a.id === this.folderFilter)?.nome || 'Todas as pastas');

        container.innerHTML = `
            ${tabs.map((tab) => `
                <button class="estudos-tab ${this.statusFilter === tab.key ? 'active' : ''}" data-status="${tab.key}">
                    ${tab.label}
                </button>
            `).join('')}
            <span class="estudos-panel-note">Pasta: ${this._escapeHtml(folderLabel)}</span>
        `;
    }

    _renderSpotlight(topicos, areas) {
        const container = this.container.querySelector('#estudosSpotlight');
        if (!container) return;

        const spotlight = this._pickSpotlight(topicos);
        if (!spotlight) {
            container.innerHTML = this._buildEmptyState('Nada em destaque', 'Crie um tópico ou ajuste filtros.');
            container.classList.add('estudos-spotlight');
            return;
        }

        const area = this._getArea(spotlight.areaId, areas);
        const progress = this._calcularCardProgresso(spotlight);
        const stage = this._getStage(spotlight);

        container.classList.add('estudos-spotlight');
        container.innerHTML = `
            <div class="estudos-card-meta">
                <span class="estudos-pill">${this._formatStatus(spotlight.status)}</span>
                <span class="estudos-pill priority-${this._prioritySlug(spotlight.prioridade)}">${this._formatPriority(spotlight.prioridade)}</span>
                ${area ? `<span class="estudos-pill estudos-pill-muted">${this._escapeHtml(area.icone || '📁')} ${this._escapeHtml(area.nome)}</span>` : ''}
            </div>
            <h3 class="estudos-card-title">${this._escapeHtml(spotlight.titulo)}</h3>
            ${spotlight.descricao ? `<p class="estudos-card-desc">${this._escapeHtml(spotlight.descricao)}</p>` : ''}
            <div class="estudos-card-meta">
                ${spotlight.tags?.length ? spotlight.tags.map((t) => `<span class="kanban-tag">#${this._escapeHtml(t)}</span>`).join('') : '<span class="estudos-pill-muted">Sem tags</span>'}
            </div>
            <div class="estudos-card-footer">
                <div class="kanban-progress" style="flex:1">
                    <div class="kanban-progress-bar" style="width:${progress}%"></div>
                </div>
                <span class="estudos-pill estudos-pill-muted">${this._formatStage(stage)}</span>
                <button class="estudos-list-btn primary" data-action="openTopico" data-topico-id="${spotlight.id}">Abrir</button>
            </div>
        `;
    }

    _renderCardGrid(topicos, areas) {
        const container = this.container.querySelector('#estudosCardGrid');
        if (!container) return;
        if (!topicos.length) {
            container.innerHTML = this._buildEmptyState('Nenhum item encontrado', 'Ajuste filtros ou crie um novo.');
            return;
        }

        const sorted = [...topicos].sort((a, b) => {
            const diff = this._priorityWeight(b.prioridade) - this._priorityWeight(a.prioridade);
            if (diff !== 0) return diff;
            return new Date(a.criadoEm || 0) - new Date(b.criadoEm || 0);
        });

        container.innerHTML = sorted.map((topico) => {
            const area = this._getArea(topico.areaId, areas);
            const progress = this._calcularCardProgresso(topico);
            return `
                <div class="estudos-card" data-topico-id="${topico.id}">
                    <div class="estudos-card-header">
                        <div class="estudos-card-meta">
                            ${area ? `<span class="estudos-pill estudos-pill-muted">${this._escapeHtml(area.icone || '📁')} ${this._escapeHtml(area.nome)}</span>` : '<span class="estudos-pill estudos-pill-muted">Sem pasta</span>'}
                        </div>
                        <span class="estudos-pill priority-${this._prioritySlug(topico.prioridade)}">${this._formatPriority(topico.prioridade)}</span>
                    </div>
                    <h4 class="estudos-card-title">${this._escapeHtml(topico.titulo)}</h4>
                    ${topico.descricao ? `<p class="estudos-card-desc">${this._escapeHtml(topico.descricao)}</p>` : ''}
                    <div class="estudos-card-meta">
                        <span class="estudos-pill estudos-pill-muted">${this._formatStatus(topico.status)}</span>
                        ${topico.tags?.length ? topico.tags.map((t) => `<span class="kanban-tag">#${this._escapeHtml(t)}</span>`).join('') : '<span class="estudos-pill-muted">#sem-tags</span>'}
                    </div>
                    <div class="estudos-card-actions">
                        <select class="estudos-list-select" data-action="cardStatus" data-topico-id="${topico.id}">
                            ${this._statusOptions().map((s) => `<option value="${s}" ${s === topico.status ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                        <select class="estudos-list-select" data-action="cardArea" data-topico-id="${topico.id}">
                            <option value="">Sem pasta</option>
                            ${areas.map((a) => `<option value="${a.id}" ${a.id === topico.areaId ? 'selected' : ''}>${this._escapeHtml(a.nome || 'Área')}</option>`).join('')}
                        </select>
                    </div>
                    <div class="estudos-card-footer">
                        <div class="kanban-progress" style="flex:1">
                            <div class="kanban-progress-bar" style="width:${progress}%"></div>
                        </div>
                        <div class="estudos-card-footer-actions">
                            <button class="estudos-list-btn" data-action="openTopico" data-topico-id="${topico.id}">Abrir</button>
                            <button class="estudos-list-btn danger" data-action="deleteTopico" data-topico-id="${topico.id}">Excluir</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    _renderFoldersPanel(areas, topicos) {
        const container = this.container.querySelector('#estudosFoldersPanel');
        if (!container) return;

        const agrupado = new Map();
        topicos.forEach((topico) => {
            const key = topico.areaId || 'sem-area';
            if (!agrupado.has(key)) agrupado.set(key, { total: 0, andamento: 0, revisao: 0, concluido: 0 });
            const bucket = agrupado.get(key);
            bucket.total += 1;
            const status = this._normalizeStatus(topico.status);
            if (status.includes('estud') || status.includes('andam')) bucket.andamento += 1;
            if (status.includes('revis') || this._hasRevisaoPendente(topico)) bucket.revisao += 1;
            if (status.includes('conclu')) bucket.concluido += 1;
        });

        const cards = [];
        areas.forEach((area) => {
            const data = agrupado.get(area.id) || { total: 0, andamento: 0, revisao: 0, concluido: 0 };
            cards.push({ ...area, ...data });
        });
        if (agrupado.has('sem-area')) {
            cards.push({ id: 'sem-area', nome: 'Sem pasta', icone: '📁', cor: 'var(--border, #e2e8f0)', ...agrupado.get('sem-area') });
        }

        cards.sort((a, b) => b.total - a.total);

        const form = `
            <form id="estudosAreaForm" class="estudos-area-form">
                <div class="estudos-inline-field">
                    <label>Nova pasta</label>
                    <input type="text" id="estudosAreaNome" class="estudos-list-input" placeholder="Ex: Backend, Revisão ENEM" required />
                </div>
                <div class="estudos-inline-field estudos-inline-compact">
                    <label>Ícone</label>
                    <input type="text" id="estudosAreaIcone" class="estudos-list-input" placeholder="📚" maxlength="2" />
                </div>
                <div class="estudos-inline-field estudos-inline-compact">
                    <label>Cor</label>
                    <input type="color" id="estudosAreaCor" class="estudos-list-input color" value="#3b82f6" />
                </div>
                <button type="submit" class="estudos-list-btn primary">Criar pasta</button>
            </form>
        `;

        const list = cards.map((area) => {
            const isEditing = this.editingAreaId === area.id && area.id !== 'sem-area';
            if (isEditing) {
                return `
                    <div class="estudos-folder-card" data-area-id="${area.id}">
                        <div class="estudos-inline-field">
                            <label>Nome</label>
                            <input type="text" class="estudos-list-input" data-area-field="nome" value="${this._escapeHtml(area.nome || '')}" placeholder="Nome da pasta" />
                        </div>
                        <div class="estudos-inline-field estudos-inline-compact">
                            <label>Ícone</label>
                            <input type="text" class="estudos-list-input" data-area-field="icone" value="${this._escapeHtml(area.icone || '')}" placeholder="📚" maxlength="2" />
                        </div>
                        <div class="estudos-inline-field estudos-inline-compact">
                            <label>Cor</label>
                            <input type="color" class="estudos-list-input color" data-area-field="cor" value="${area.cor || '#3b82f6'}" />
                        </div>
                        <div class="estudos-folder-actions">
                            <button class="estudos-list-btn primary" data-action="saveArea" data-area-id="${area.id}">Salvar</button>
                            <button class="estudos-list-btn" data-action="cancelAreaEdit">Cancelar</button>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="estudos-folder-card" data-area-id="${area.id}">
                    <div class="estudos-folder-header">
                        <p class="estudos-folder-name">${this._escapeHtml(area.icone || '📁')} ${this._escapeHtml(area.nome || 'Pasta')}</p>
                        <span class="estudos-pill estudos-pill-muted">${area.total || 0}</span>
                    </div>
                    <div class="estudos-folder-stats">
                        <span>Ativos: ${area.andamento || 0}</span>
                        <span>Revisão: ${area.revisao || 0}</span>
                        <span>Concl.: ${area.concluido || 0}</span>
                    </div>
                    <div class="estudos-folder-actions">
                        <button class="estudos-list-btn primary" data-action="folderFilter" data-area-id="${area.id}">${this.folderFilter === area.id ? 'Filtrando' : 'Filtrar'}</button>
                        ${area.id !== 'sem-area' ? `
                            <button class="estudos-list-btn" type="button" data-action="editArea" data-area-id="${area.id}">Editar</button>
                            <button class="estudos-list-btn danger" type="button" data-action="deleteArea" data-area-id="${area.id}">Excluir</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = form + `<div class="estudos-folder-grid">${list || ''}</div>`;
    }

    _applyFilters(topicos) {
        let list = Array.isArray(topicos) ? [...topicos] : [];
        if (this.folderFilter) {
            if (this.folderFilter === 'sem-area') {
                list = list.filter((t) => !t.areaId);
            } else {
                list = list.filter((t) => t.areaId === this.folderFilter);
            }
        }
        if (this.statusFilter && this.statusFilter !== 'all') {
            list = list.filter((t) => this._getStage(t) === this.statusFilter);
        }
        return list;
    }

    _getStage(topico) {
        const status = this._normalizeStatus(topico?.status);
        if (status.includes('conclu')) return 'concluido';
        if (status.includes('revis') || this._hasRevisaoPendente(topico)) return 'revisao';
        if (status.includes('estud') || status.includes('andam')) return 'andamento';
        return 'backlog';
    }

    _formatStage(stage) {
        if (stage === 'andamento') return 'Em foco';
        if (stage === 'revisao') return 'Revisão';
        if (stage === 'concluido') return 'Concluído';
        return 'A fazer';
    }

    _pickSpotlight(topicos) {
        if (!topicos.length) return null;
        const weights = {
            revisao: 4,
            andamento: 3,
            backlog: 2,
            concluido: 1
        };
        const sorted = [...topicos].sort((a, b) => {
            const stageA = this._getStage(a);
            const stageB = this._getStage(b);
            const stageDiff = (weights[stageB] || 0) - (weights[stageA] || 0);
            if (stageDiff !== 0) return stageDiff;
            const priorityDiff = this._priorityWeight(b.prioridade) - this._priorityWeight(a.prioridade);
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(a.criadoEm || 0) - new Date(b.criadoEm || 0);
        });
        return sorted[0];
    }

    _calcularCardProgresso(topico) {
        const status = this._normalizeStatus(topico.status);
        if (status.includes('conclu')) return 100;
        if (status.includes('estud')) return 50;
        if (topico.sessoes && topico.sessoes.length > 0) {
            const totalMinutos = topico.sessoes.reduce((acc, s) => acc + (s.duracao || 0), 0);
            const tempoEstimado = topico.tempoEstimado?.minutes || 0;
            if (tempoEstimado > 0) {
                return Math.min(100, Math.round((totalMinutos / tempoEstimado) * 100));
            }
        }
        return 10;
    }

    _renderPrioridades(topicos, areas) {
        const container = this.container.querySelector('#estudosPrioridades');
        if (!container) return;

        const fila = [...topicos]
            .filter((t) => !this._isConcluido(t))
            .sort((a, b) => {
                const diff = this._priorityWeight(b.prioridade) - this._priorityWeight(a.prioridade);
                if (diff !== 0) return diff;
                return new Date(a.criadoEm || 0) - new Date(b.criadoEm || 0);
            })
            .slice(0, 5);

        if (!fila.length) {
            container.innerHTML = this._buildEmptyState('Nada na fila', 'Use "Novo tópico" ou defina prioridade Alta.');
            return;
        }

        container.innerHTML = fila.map((topico) => {
            const area = this._getArea(topico.areaId, areas);
            const areaLabel = area ? `${this._escapeHtml(area.icone || '📁')} ${this._escapeHtml(area.nome || '')}` : '📁 Sem área';
            return `
                <div class="estudos-list-item" data-topico-id="${topico.id}">
                    <div class="estudos-list-title-row">
                        <span class="estudos-list-title">${this._escapeHtml(topico.titulo)}</span>
                        <span class="estudos-pill priority-${this._prioritySlug(topico.prioridade)}">${this._formatPriority(topico.prioridade)}</span>
                    </div>
                    ${topico.descricao ? `<p class="estudos-list-desc">${this._escapeHtml(topico.descricao)}</p>` : ''}
                    <div class="estudos-list-meta">
                        <span class="estudos-meta-item">${areaLabel}</span>
                        <span class="estudos-sep">•</span>
                        <span class="estudos-meta-item">${this._formatStatus(topico.status)}</span>
                    </div>
                    <div class="estudos-list-actions">
                        <div class="estudos-inline-field">
                            <label>Status</label>
                            <select class="estudos-list-select" data-action="setStatus" data-topico-id="${topico.id}">
                                ${this._statusOptions().map((s) => `
                                    <option value="${s}" ${s === topico.status ? 'selected' : ''}>${s}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="estudos-inline-field">
                            <label>Prioridade</label>
                            <select class="estudos-list-select" data-action="setPriority" data-topico-id="${topico.id}">
                                ${['Alta', 'Média', 'Baixa'].map((p) => `
                                    <option value="${p}" ${p === topico.prioridade ? 'selected' : ''}>${p}</option>
                                `).join('')}
                            </select>
                        </div>
                        <button class="estudos-list-btn" data-action="openTopico" data-topico-id="${topico.id}">Editar</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    _renderAreaManager(areas, topicos) {
        const container = this.container.querySelector('#estudosAreaManager');
        if (!container) return;

        const agrupado = new Map();
        topicos.forEach((topico) => {
            const key = topico.areaId || 'sem-area';
            if (!agrupado.has(key)) {
                agrupado.set(key, { total: 0, andamento: 0, revisao: 0 });
            }
            const bucket = agrupado.get(key);
            bucket.total += 1;
            const status = this._normalizeStatus(topico.status);
            if (status.includes('estud')) bucket.andamento += 1;
            if (status.includes('revis') || this._hasRevisaoPendente(topico)) bucket.revisao += 1;
        });

        const cards = [];
        areas.forEach((area) => {
            const data = agrupado.get(area.id) || { total: 0, andamento: 0, revisao: 0 };
            cards.push({ ...area, ...data });
        });
        if (agrupado.has('sem-area')) {
            const data = agrupado.get('sem-area');
            cards.push({
                id: 'sem-area',
                nome: 'Sem área',
                icone: '📁',
                cor: 'var(--border, #e2e8f0)',
                ...data
            });
        }
        cards.sort((a, b) => b.total - a.total);

        const filterInfo = this.selectedAreaId ? `
            <div class="estudos-area-filter">
                <span class="estudos-pill estudos-pill-muted">Filtro: ${this._getAreaName(this.selectedAreaId, areas)}</span>
                <button class="estudos-list-btn" data-action="clearAreaFilter">Limpar filtro</button>
            </div>
        ` : '';

        const form = `
            <form id="estudosAreaForm" class="estudos-area-form">
                <div class="estudos-inline-field">
                    <label>Nova área</label>
                    <input type="text" id="estudosAreaNome" class="estudos-list-input" placeholder="Ex: Backend, Revisão ENEM" required />
                </div>
                <div class="estudos-inline-field estudos-inline-compact">
                    <label>Ícone</label>
                    <input type="text" id="estudosAreaIcone" class="estudos-list-input" placeholder="📚" maxlength="2" />
                </div>
                <div class="estudos-inline-field estudos-inline-compact">
                    <label>Cor</label>
                    <input type="color" id="estudosAreaCor" class="estudos-list-input color" value="#3b82f6" />
                </div>
                <button type="submit" class="estudos-list-btn primary">Criar área</button>
            </form>
        `;

        const list = cards.map((area) => {
            const isEditing = this.editingAreaId === area.id;
            if (isEditing && area.id === 'sem-area') {
                this.editingAreaId = null;
            }
            if (isEditing && area.id !== 'sem-area') {
                return `
                    <div class="estudos-area-card active" data-area-id="${area.id}">
                        <div class="estudos-area-edit">
                            <input type="text" class="estudos-list-input" data-area-field="nome" value="${this._escapeHtml(area.nome || '')}" placeholder="Nome da área" />
                            <input type="text" class="estudos-list-input" data-area-field="icone" value="${this._escapeHtml(area.icone || '')}" placeholder="📚" maxlength="2" />
                            <input type="color" class="estudos-list-input color" data-area-field="cor" value="${area.cor || '#3b82f6'}" />
                        </div>
                        <div class="estudos-area-actions">
                            <button class="estudos-list-btn primary" data-action="saveArea" data-area-id="${area.id}">Salvar</button>
                            <button class="estudos-list-btn" data-action="cancelAreaEdit">Cancelar</button>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="estudos-area-card ${area.id === this.selectedAreaId ? 'active' : ''}" data-area-id="${area.id}">
                    <div class="estudos-area-meta">
                        <span class="estudos-area-icon" style="background:${area.cor || 'var(--border, #e2e8f0)'}">${this._escapeHtml(area.icone || '📚')}</span>
                        <div>
                            <p class="estudos-area-name">${this._escapeHtml(area.nome || 'Sem área')}</p>
                            <p class="estudos-area-count">${area.total} tópico(s)</p>
                        </div>
                    </div>
                    <div class="estudos-area-stats">
                        <span class="estudos-pill estudos-pill-muted">Ativos ${area.andamento}</span>
                        <span class="estudos-pill estudos-pill-muted">Revisão ${area.revisao}</span>
                    </div>
                    <div class="estudos-area-actions">
                        <button class="estudos-list-btn primary" data-action="filterArea" data-area-id="${area.id}">${area.id === this.selectedAreaId ? 'Filtrando' : 'Filtrar'}</button>
                        ${area.id !== 'sem-area' ? `
                            <button class="estudos-list-btn" type="button" data-action="editArea" data-area-id="${area.id}">Editar</button>
                            <button class="estudos-list-btn danger" type="button" data-action="deleteArea" data-area-id="${area.id}">Excluir</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = filterInfo + form + list;
    }

    _renderFilterPill(areas) {
        const container = this.container.querySelector('#estudosFilterPill');
        if (!container) return;
        if (!this.selectedAreaId) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = `
            <span class="estudos-pill estudos-pill-muted">Filtrando: ${this._getAreaName(this.selectedAreaId, areas)}</span>
            <button class="estudos-list-btn" data-action="clearAreaFilter">Limpar filtro</button>
        `;
    }

    _renderBoardControls(filteredTopicos, allTopicos) {
        const container = this.container.querySelector('#estudosBoardControls');
        if (!container) return;

        const isFallback = this.boardScope === 'filter' && !filteredTopicos.length && allTopicos.length > 0;
        const scopeLabel = this.boardScope === 'all' ? 'Todas as áreas' : 'Área filtrada';

        container.innerHTML = `
            <div class="estudos-board-scope">
                <span class="estudos-pill estudos-pill-muted">Quadro: ${scopeLabel}</span>
                <button class="estudos-list-btn" data-action="toggleBoardScope">
                    ${this.boardScope === 'all' ? 'Usar filtro do painel' : 'Ver tudo no quadro'}
                </button>
                ${isFallback ? '<span class="estudos-pill estudos-pill-ghost">Nenhum tópico na área filtrada — mostrando todos.</span>' : ''}
            </div>
        `;
    }

    _renderTopicoDetail(topico) {
        const container = this.container.querySelector('#topicoDetailContainer');
        if (!container) return;

        const tags = Array.isArray(topico.tags) ? topico.tags.join(', ') : '';
        const areas = this.store.getAreas();

        container.innerHTML = `
            <div class="estudo-detail">
                <div class="estudo-detail-grid">
                    <div class="estudo-detail-group">
                        <label class="estudo-detail-label">Título</label>
                        <input type="text" id="modalTopicoTituloInput" class="estudo-detail-input" value="${this._escapeHtml(topico.titulo || '')}" />
                    </div>
                    <div class="estudo-detail-group">
                        <label class="estudo-detail-label">Status</label>
                        <select id="modalTopicoStatus" class="estudo-detail-select">
                            ${this._statusOptions().map((status) => `
                                <option value="${status}" ${topico.status === status ? 'selected' : ''}>${status}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="estudo-detail-group">
                        <label class="estudo-detail-label">Prioridade</label>
                        <select id="modalTopicoPrioridade" class="estudo-detail-select">
                            ${['Alta', 'Média', 'Baixa'].map((p) => `
                                <option value="${p}" ${topico.prioridade === p ? 'selected' : ''}>${p}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="estudo-detail-group">
                        <label class="estudo-detail-label">Área</label>
                        <select id="modalTopicoArea" class="estudo-detail-select">
                            <option value="">Sem área</option>
                            ${areas.map((a) => `
                                <option value="${a.id}" ${a.id === topico.areaId ? 'selected' : ''}>${this._escapeHtml(a.nome || 'Área')}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <div class="estudo-detail-group">
                    <label class="estudo-detail-label">Descrição</label>
                    <textarea id="modalTopicoDescricao" rows="3" class="estudo-detail-textarea">${this._escapeHtml(topico.descricao || '')}</textarea>
                </div>
                <div class="estudo-detail-group">
                    <label class="estudo-detail-label">Tags (separadas por vírgula)</label>
                    <input type="text" id="modalTopicoTags" class="estudo-detail-input" value="${this._escapeHtml(tags)}" placeholder="ex: javascript, revisão" />
                </div>
            </div>
        `;
    }

    _salvarTopicoEdits() {
        if (!this.currentTopico) return;
        const topicoId = this.currentTopico.id;
        const topicoAtual = this.store.getTopicoById(topicoId);
        if (!topicoAtual) {
            this._showToast('⚠️ Tópico não encontrado');
            return;
        }

        const titulo = this.container.querySelector('#modalTopicoTituloInput')?.value.trim() || '';
        const descricao = this.container.querySelector('#modalTopicoDescricao')?.value.trim() || '';
        const status = this.container.querySelector('#modalTopicoStatus')?.value || topicoAtual.status;
        const prioridade = this.container.querySelector('#modalTopicoPrioridade')?.value || topicoAtual.prioridade;
        const areaId = this.container.querySelector('#modalTopicoArea')?.value || null;
        const tags = (this.container.querySelector('#modalTopicoTags')?.value || '')
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        if (!titulo) {
            this._showToast('⚠️ O título é obrigatório');
            return;
        }

        const wasConcluido = this._isConcluido(topicoAtual);
        const willConcluir = this._normalizeStatus(status).includes('conclu');

        const updates = {
            titulo,
            descricao,
            status,
            prioridade,
            areaId,
            tags
        };

        if (!willConcluir && wasConcluido) {
            updates.concluidoEm = null;
            updates.proximaRevisao = null;
        }

        const updated = this.store.updateTopico(topicoId, updates);

        if (willConcluir && !wasConcluido) {
            this.revisaoEspacada.agendarRevisaoInicial(updated);
            this.store.updateTopico(topicoId, {
                concluidoEm: new Date().toISOString(),
                proximaRevisao: updated?.proximaRevisao
            });
        }

        this.currentTopico = this.store.getTopicoById(topicoId);
        const modalTitle = this.container.querySelector('#modalTopicoTitulo');
        if (modalTitle && this.currentTopico) {
            modalTitle.textContent = this.currentTopico.titulo;
        }
        this._renderTopicoDetail(this.currentTopico);
        this._showToast('✅ Alterações salvas');
    }

    _setupEventBus() {
        this.container.addEventListener('click', async (e) => {
            const tab = e.target.closest('.estudos-tab');
            if (tab?.dataset?.status) {
                this.statusFilter = tab.dataset.status;
                this._updateView();
                return;
            }

            const openBtn = e.target.closest('[data-action="openTopico"]');
            if (openBtn?.dataset?.topicoId) {
                const topico = this.store.getTopicoById(openBtn.dataset.topicoId);
                if (topico) this._openModal(topico);
                return;
            }

            const folderBtn = e.target.closest('[data-action="folderFilter"], [data-action="filterArea"]');
            if (folderBtn) {
                const areaId = folderBtn.dataset.areaId || null;
                this.folderFilter = this.folderFilter === areaId ? null : areaId;
                this.selectedAreaId = this.folderFilter;
                this._updateView();
                return;
            }

            const editArea = e.target.closest('[data-action="editArea"]');
            if (editArea) {
                this.editingAreaId = editArea.dataset.areaId;
                this._renderFoldersPanel(this.store.getAreas(), this.store.getTopicos());
                return;
            }

            if (e.target.closest('[data-action="cancelAreaEdit"]')) {
                this.editingAreaId = null;
                this._renderFoldersPanel(this.store.getAreas(), this.store.getTopicos());
                return;
            }

            const saveArea = e.target.closest('[data-action="saveArea"]');
            if (saveArea) {
                this._handleSaveArea(saveArea.dataset.areaId);
                return;
            }

            const deleteArea = e.target.closest('[data-action="deleteArea"]');
            if (deleteArea) {
                await this._handleDeleteArea(deleteArea.dataset.areaId);
                return;
            }

            const deleteTopico = e.target.closest('[data-action="deleteTopico"]');
            if (deleteTopico?.dataset?.topicoId) {
                await this._handleDeleteTopico(deleteTopico.dataset.topicoId);
                return;
            }
        });

        this.container.addEventListener('change', (e) => {
            const prioritySelect = e.target.closest('[data-action="setPriority"]');
            if (prioritySelect?.dataset?.topicoId) {
                const id = prioritySelect.dataset.topicoId;
                const value = prioritySelect.value;
                this.store.updateTopico(id, { prioridade: value });
                this._showToast(`✅ Prioridade atualizada para ${value}`);
                this._updateView();
                return;
            }

            const statusSelect = e.target.closest('[data-action="setStatus"]');
            if (statusSelect?.dataset?.topicoId) {
                const id = statusSelect.dataset.topicoId;
                const value = statusSelect.value;
                this._handleStatusChange(id, value);
                this._updateView();
                return;
            }

            const cardStatus = e.target.closest('[data-action="cardStatus"]');
            if (cardStatus?.dataset?.topicoId) {
                this._handleStatusChange(cardStatus.dataset.topicoId, cardStatus.value);
                this._updateView();
                return;
            }

            const cardArea = e.target.closest('[data-action="cardArea"]');
            if (cardArea?.dataset?.topicoId) {
                const id = cardArea.dataset.topicoId;
                const value = cardArea.value || null;
                this.store.updateTopico(id, { areaId: value || null });
                this._showToast('✅ Pasta atualizada');
                this._updateView();
                return;
            }

            const areaSelect = e.target.closest('[data-action="setArea"]');
            if (areaSelect?.dataset?.topicoId) {
                const id = areaSelect.dataset.topicoId;
                const value = areaSelect.value || null;
                this.store.updateTopico(id, { areaId: value || null });
                this._showToast('✅ Área atualizada');
                this._updateView();
            }
        });

        this.container.addEventListener('submit', (e) => {
            const form = e.target.closest('#estudosAreaForm');
            if (form) {
                e.preventDefault();
                this._handleCreateArea();
            }
        });
    }

    _handleCreateArea() {
        const nomeInput = this.container.querySelector('#estudosAreaNome');
        if (!nomeInput) return;
        const nome = nomeInput.value.trim();
        const icone = this.container.querySelector('#estudosAreaIcone')?.value.trim() || '📚';
        const cor = this.container.querySelector('#estudosAreaCor')?.value || '#3b82f6';

        if (!nome) {
            this._showToast('⚠️ Informe o nome da área');
            return;
        }

        const area = this.store.addArea({
            nome,
            icone,
            cor,
            descricao: ''
        });

        this.selectedAreaId = area?.id || null;
        this.folderFilter = this.selectedAreaId;

        nomeInput.value = '';
        const iconInput = this.container.querySelector('#estudosAreaIcone');
        if (iconInput) iconInput.value = '';

        this._updateView();
        this._showToast('✅ Área criada');
    }

    _handleSaveArea(areaId) {
        const card = this.container.querySelector(`.estudos-area-card[data-area-id="${areaId}"]`);
        if (!card) return;
        const nome = card.querySelector('[data-area-field="nome"]')?.value.trim() || '';
        const icone = card.querySelector('[data-area-field="icone"]')?.value.trim() || '📚';
        const cor = card.querySelector('[data-area-field="cor"]')?.value || '#3b82f6';

        if (!nome) {
            this._showToast('⚠️ Informe o nome da área');
            return;
        }

        this.store.updateArea(areaId, { nome, icone, cor });
        this.editingAreaId = null;
        this._updateView();
        this._showToast('✅ Área atualizada');
    }

    async _handleDeleteArea(areaId) {
        if (!areaId || areaId === 'sem-area') return;
        const { confirmAction } = await import('../components/ConfirmModal.js');
        const ok = await confirmAction('Excluir esta área? Os tópicos ficarão sem área.');
        if (!ok) return;
        this.store.removeArea(areaId);
        if (this.selectedAreaId === areaId) {
            this.selectedAreaId = null;
        }
        if (this.folderFilter === areaId) {
            this.folderFilter = null;
        }
        this._updateView();
        this._showToast('✅ Área removida');
    }

    _handleAddTopico() {
        const newTopico = {
            titulo: 'Novo Tópico',
            descricao: '',
            areaId: this.folderFilter && this.folderFilter !== 'sem-area' ? this.folderFilter : null,
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
                areaId: this.selectedAreaId && this.selectedAreaId !== 'sem-area' ? this.selectedAreaId : null,
                status: topico.status || 'Não iniciado',
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

    _statusOptions() {
        return ['Não iniciado', 'Estudando', 'Precisa revisão', 'Concluído'];
    }

    _computeCounters(topicos) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        let backlog = 0;
        let andamento = 0;
        let revisoes = 0;
        let concluidos7d = 0;

        topicos.forEach((topico) => {
            const status = this._normalizeStatus(topico.status);
            if (!status || status.includes('nao') || status.includes('não')) backlog += 1;
            if (status.includes('estud')) andamento += 1;
            if (status.includes('revis') || this._hasRevisaoPendente(topico)) revisoes += 1;
            if (status.includes('conclu') && topico.concluidoEm) {
                const concluded = new Date(topico.concluidoEm);
                if (!Number.isNaN(concluded) && concluded >= weekAgo) {
                    concluidos7d += 1;
                }
            }
        });

        return { backlog, andamento, revisoes, concluidos7d, total: topicos.length };
    }

    _priorityWeight(prioridade) {
        const slug = this._prioritySlug(prioridade);
        if (slug === 'alta') return 3;
        if (slug === 'media') return 2;
        return 1;
    }

    _prioritySlug(prioridade) {
        const norm = (prioridade || '').toLowerCase();
        if (norm.includes('alta')) return 'alta';
        if (norm.includes('baixa')) return 'baixa';
        return 'media';
    }

    _formatPriority(prioridade) {
        if (!prioridade) return 'Média';
        return prioridade.charAt(0).toUpperCase() + prioridade.slice(1);
    }

    _formatStatus(status) {
        if (!status) return 'Não iniciado';
        const text = status.replace(/_/g, ' ');
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    _normalizeStatus(status) {
        if (!status) return '';
        return status
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    _hasRevisaoPendente(topico) {
        if (!topico) return false;
        const status = this._normalizeStatus(topico.status);
        if (status.includes('revis')) return true;
        if (!topico.proximaRevisao) return false;
        const revisaoDate = new Date(topico.proximaRevisao);
        if (Number.isNaN(revisaoDate)) return false;
        const now = new Date();
        return revisaoDate <= now;
    }

    _getArea(areaId, areas) {
        if (!areaId) return null;
        return areas.find((area) => area.id === areaId) || null;
    }

    _getAreaName(areaId, areas) {
        if (areaId === 'sem-area') return 'Sem área';
        const area = areas.find((a) => a.id === areaId);
        return area ? this._escapeHtml(area.nome || 'Área') : 'Área';
    }

    _isConcluido(topico) {
        const status = this._normalizeStatus(topico?.status);
        return status.includes('conclu');
    }

    _applyAreaFilter(topicos) {
        if (!this.selectedAreaId) return topicos;
        if (this.selectedAreaId === 'sem-area') {
            return topicos.filter((t) => !t.areaId);
        }
        return topicos.filter((t) => t.areaId === this.selectedAreaId);
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    _buildEmptyState(title, subtitle) {
        return `
            <div class="estudos-empty">
                <p class="estudos-empty-title">${title}</p>
                <p class="estudos-empty-subtitle">${subtitle}</p>
            </div>
        `;
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
