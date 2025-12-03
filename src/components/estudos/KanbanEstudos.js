/**
 * Kanban de Estudos com fluxo claro de 4 colunas:
 * - A Fazer (backlog)
 * - Em foco (estudando)
 * - Revisão (pendências de revisão)
 * - Concluído (finalizados)
 */
class KanbanEstudos {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.topicos = options.topicos || [];
        this.areas = options.areas || [];
        this.onStatusChange = options.onStatusChange || (() => {});
        this.onCardClick = options.onCardClick || (() => {});
        this.onEdit = options.onEdit || (() => {});
        this.onDelete = options.onDelete || (() => {});

        this.columnsConfig = [
            { key: 'backlog', title: 'A Fazer', icon: '🗂️' },
            { key: 'andamento', title: 'Em foco', icon: '⚡' },
            { key: 'revisao', title: 'Revisão', icon: '🔁' },
            { key: 'concluido', title: 'Concluído', icon: '✅' }
        ];

        this.draggedCard = null;
        this._createKanban();
        this._attachEvents();
    }

    _createKanban() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'kanban-estudos';
        this.wrapper.innerHTML = `
            <div class="kanban-estudos-container">
                ${this.columnsConfig.map((col) => `
                    <div class="kanban-column" data-status="${col.key}">
                        <div class="kanban-column-header">
                            <h3>${col.icon} ${col.title}</h3>
                            <span class="kanban-count" id="count-${col.key}">0</span>
                        </div>
                        <div class="kanban-column-content" data-status="${col.key}"></div>
                    </div>
                `).join('')}
            </div>
        `;

        this.container.appendChild(this.wrapper);
        this.render();
    }

    render() {
        const columns = this.columnsConfig.reduce((acc, col) => {
            acc[col.key] = this.wrapper.querySelector(`[data-status="${col.key}"] .kanban-column-content`);
            return acc;
        }, {});
        Object.values(columns).forEach((col) => {
            if (col) col.innerHTML = '';
        });

        const grupos = this._groupTopicos();

        this.columnsConfig.forEach((col) => {
            const target = columns[col.key];
            if (!target) return;
            const cards = grupos[col.key] || [];
            if (!cards.length) {
                target.innerHTML = `<div class="kanban-empty-state">Sem itens</div>`;
                return;
            }
            cards.forEach((topico) => {
                target.appendChild(this._createCard(topico));
            });
        });

        this._updateCounters(grupos);
    }

    _groupTopicos() {
        const grupos = {
            backlog: [],
            andamento: [],
            revisao: [],
            concluido: []
        };
        const now = new Date();

        this.topicos.forEach((topico) => {
            const stage = this._resolveStage(topico, now);
            if (!grupos[stage]) {
                grupos.backlog.push(topico);
            } else {
                grupos[stage].push(topico);
            }
        });

        grupos.backlog.sort((a, b) => {
            const diff = this._priorityWeight(b.prioridade) - this._priorityWeight(a.prioridade);
            if (diff !== 0) return diff;
            return new Date(a.criadoEm || 0) - new Date(b.criadoEm || 0);
        });

        grupos.andamento.sort((a, b) => this._getLastActivity(b) - this._getLastActivity(a));

        grupos.revisao.sort((a, b) => {
            const aDate = this._getReviewDate(a);
            const bDate = this._getReviewDate(b);
            if (aDate && bDate) return aDate - bDate;
            if (aDate) return -1;
            if (bDate) return 1;
            return this._getLastActivity(b) - this._getLastActivity(a);
        });

        grupos.concluido.sort((a, b) => {
            const aDate = new Date(a.concluidoEm || a.criadoEm || 0);
            const bDate = new Date(b.concluidoEm || b.criadoEm || 0);
            return bDate - aDate;
        });

        return grupos;
    }

    _resolveStage(topico, now = new Date()) {
        const status = this._normalizeStatus(topico.status);
        const hasReviewDue = this._hasReviewDue(topico, now);

        if (hasReviewDue || status.includes('revis')) return 'revisao';
        if (status.includes('estud') || status.includes('andam')) return 'andamento';
        if (status.includes('conclu') || status.includes('feito')) return 'concluido';
        return 'backlog';
    }

    _normalizeStatus(status) {
        if (!status) return '';
        return status.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    _hasReviewDue(topico, now = new Date()) {
        if (!topico.proximaRevisao) return false;
        const revisaoDate = new Date(topico.proximaRevisao);
        if (Number.isNaN(revisaoDate)) return false;
        return revisaoDate <= now;
    }

    _getReviewDate(topico) {
        if (!topico.proximaRevisao) return null;
        const date = new Date(topico.proximaRevisao);
        return Number.isNaN(date) ? null : date;
    }

    _priorityWeight(prioridade) {
        const map = { alta: 3, media: 2, média: 2, baixa: 1 };
        const key = (prioridade || '').toLowerCase();
        return map[key] || 0;
    }

    _getLastActivity(topico) {
        const ultimaSessao = this._getUltimaSessao(topico);
        if (ultimaSessao) return new Date(ultimaSessao.data || 0);
        return new Date(topico.criadoEm || 0);
    }

    _createCard(topico) {
        const area = this.areas.find((a) => a.id === topico.areaId);
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.draggable = true;
        card.dataset.id = topico.id;

        const progresso = this._calcularProgresso(topico);
        const reviewBadge = this._buildReviewBadge(topico);
        const tagsHtml = topico.tags && topico.tags.length > 0
            ? `<div class="kanban-tags">${topico.tags.map((t) => `<span class="kanban-tag">#${t}</span>`).join('')}</div>`
            : '';
        const ultimaSessao = this._getUltimaSessao(topico);
        const sessaoHtml = ultimaSessao
            ? `<div class="kanban-meta">📅 ${this._formatDate(ultimaSessao.data)}</div>`
            : '';
        const areaHtml = area
            ? `<div class="kanban-meta" title="${this._escapeHtml(area.nome || '')}" style="color:${area.cor || 'inherit'}">${this._escapeHtml(area.icone || '📚')} ${this._escapeHtml(area.nome || '')}</div>`
            : '';

        card.innerHTML = `
            <div class="kanban-card-header">
                <span class="kanban-priority ${topico.prioridade?.toLowerCase()}">${topico.prioridade || 'Média'}</span>
                <div class="kanban-card-actions">
                    <button class="btn-icon-small" data-action="edit" data-topico-id="${topico.id}" title="Editar">Edit</button>
                    <button class="btn-icon-small" data-action="delete" data-topico-id="${topico.id}" title="Excluir">Del</button>
                </div>
            </div>
            <div class="kanban-card-body">
                <h4 class="kanban-card-title">${this._escapeHtml(topico.titulo)}</h4>
                ${topico.descricao ? `<p class="kanban-card-desc">${this._escapeHtml(topico.descricao)}</p>` : ''}
                ${tagsHtml}
                ${areaHtml}
            </div>
            <div class="kanban-card-footer">
                ${reviewBadge}
                ${progresso > 0 ? `
                    <div class="kanban-progress">
                        <div class="kanban-progress-bar" style="width: ${progresso}%"></div>
                        <span class="kanban-progress-text">${progresso}%</span>
                    </div>
                ` : ''}
                ${sessaoHtml}
            </div>
        `;

        card.addEventListener('dragstart', (e) => this._handleDragStart(e, topico));
        card.addEventListener('dragend', (e) => this._handleDragEnd(e));

        const cardBody = card.querySelector('.kanban-card-body');
        cardBody.addEventListener('click', () => {
            this.onCardClick(topico);
        });

        const actionButtons = card.querySelectorAll('[data-action]');
        actionButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const id = btn.getAttribute('data-topico-id');
                if (action === 'edit') {
                    this.onEdit(id);
                } else if (action === 'delete') {
                    this.onDelete(id);
                }
            });
        });

        return card;
    }

    _buildReviewBadge(topico) {
        const date = this._getReviewDate(topico);
        if (!date) return '';
        const now = new Date();
        const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
        const isDue = diffDays <= 0;
        const label = isDue ? 'Revisão pendente' : `Revisão em ${diffDays}d`;
        const cls = isDue ? 'kanban-badge revisao-pendente' : 'kanban-badge revisao-agendada';
        return `<span class="${cls}" title="Próxima revisão ${date.toLocaleDateString('pt-BR')}">${label}</span>`;
    }

    _calcularProgresso(topico) {
        if (topico.sessoes && topico.sessoes.length > 0) {
            const totalMinutos = topico.sessoes.reduce((acc, s) => acc + (s.duracao || 0), 0);
            const tempoEstimado = topico.tempoEstimado?.minutes || 0;
            if (tempoEstimado > 0) {
                return Math.min(100, Math.round((totalMinutos / tempoEstimado) * 100));
            }
        }

        const status = this._normalizeStatus(topico.status);
        if (status.includes('conclu')) return 100;
        if (status.includes('estud')) return 50;
        return 0;
    }

    _getUltimaSessao(topico) {
        if (topico.sessoes && topico.sessoes.length > 0) {
            const sessoes = [...topico.sessoes].sort((a, b) => {
                const aDate = new Date(a.data || 0);
                const bDate = new Date(b.data || 0);
                return bDate - aDate;
            });
            return sessoes[0];
        }
        return null;
    }

    _formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `${diffDays} dias atrás`;

        return date.toLocaleDateString('pt-BR');
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    _updateCounters(grupos) {
        this.columnsConfig.forEach((col) => {
            const el = this.wrapper.querySelector(`#count-${col.key}`);
            if (el) {
                el.textContent = grupos[col.key]?.length || 0;
            }
        });
    }

    _handleDragStart(e, topico) {
        this.draggedCard = topico;
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('dragging');
    }

    _handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        this.draggedCard = null;

        this.wrapper.querySelectorAll('.kanban-column').forEach((col) => {
            col.classList.remove('drag-over');
        });
    }

    _attachEvents() {
        const columns = this.wrapper.querySelectorAll('.kanban-column-content');

        columns.forEach((column) => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                column.parentElement.classList.add('drag-over');
            });

            column.addEventListener('dragleave', () => {
                column.parentElement.classList.remove('drag-over');
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.parentElement.classList.remove('drag-over');

                if (this.draggedCard) {
                    const novoStatus = this._mapStatusFromColumn(column.dataset.status);
                    this.onStatusChange(this.draggedCard.id, novoStatus);
                }
            });
        });
    }

    _mapStatusFromColumn(columnStatus) {
        const map = {
            backlog: 'Não iniciado',
            revisao: 'Precisa revisão',
            andamento: 'Estudando',
            concluido: 'Concluído'
        };
        return map[columnStatus] || 'Não iniciado';
    }

    updateTopicos(topicos) {
        this.topicos = topicos || [];
        this.render();
    }

    updateAreas(areas) {
        this.areas = areas || [];
        this.render();
    }
}

// Export ES6
export { KanbanEstudos };
export default KanbanEstudos;

// Export para uso global (compatibilidade)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KanbanEstudos;
}
