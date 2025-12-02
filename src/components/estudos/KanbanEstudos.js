/**
 * TASK-014: View Kanban 4 Colunas para Estudos
 * 
 * Layout de cards organizados por status:
 * - Prioridade (Não iniciado com prioridade)
 * - Revisões (Precisa revisão)
 * - Em Andamento (Estudando)
 * - Concluídos
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
        
        this.draggedCard = null;
        this._createKanban();
        this._attachEvents();
    }

    /**
     * Cria estrutura do Kanban
     */
    _createKanban() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'kanban-estudos';
        this.wrapper.innerHTML = `
            <div class="kanban-estudos-container">
                <div class="kanban-column" data-status="prioridade">
                    <div class="kanban-column-header">
                        <h3>🎯 Prioridade</h3>
                        <span class="kanban-count" id="countPrioridade">0</span>
                    </div>
                    <div class="kanban-column-content" data-status="prioridade"></div>
                </div>
                
                <div class="kanban-column" data-status="revisoes">
                    <div class="kanban-column-header">
                        <h3>🔄 Revisões</h3>
                        <span class="kanban-count" id="countRevisoes">0</span>
                    </div>
                    <div class="kanban-column-content" data-status="revisoes"></div>
                </div>
                
                <div class="kanban-column" data-status="andamento">
                    <div class="kanban-column-header">
                        <h3>📚 Em Andamento</h3>
                        <span class="kanban-count" id="countAndamento">0</span>
                    </div>
                    <div class="kanban-column-content" data-status="andamento"></div>
                </div>
                
                <div class="kanban-column" data-status="concluidos">
                    <div class="kanban-column-header">
                        <h3>✅ Concluídos</h3>
                        <span class="kanban-count" id="countConcluidos">0</span>
                    </div>
                    <div class="kanban-column-content" data-status="concluidos"></div>
                </div>
            </div>
        `;
        
        this.container.appendChild(this.wrapper);
        this.render();
    }

    /**
     * Renderiza os cards
     */
    render() {
        const columns = {
            prioridade: this.wrapper.querySelector('[data-status="prioridade"] .kanban-column-content'),
            revisoes: this.wrapper.querySelector('[data-status="revisoes"] .kanban-column-content'),
            andamento: this.wrapper.querySelector('[data-status="andamento"] .kanban-column-content'),
            concluidos: this.wrapper.querySelector('[data-status="concluidos"] .kanban-column-content')
        };

        // Limpar colunas
        Object.values(columns).forEach(col => col.innerHTML = '');

        // Agrupar tópicos
        const grupos = this._groupTopicos();

        // Renderizar cada grupo
        grupos.prioridade.forEach(topico => {
            columns.prioridade.appendChild(this._createCard(topico));
        });

        grupos.revisoes.forEach(topico => {
            columns.revisoes.appendChild(this._createCard(topico));
        });

        grupos.andamento.forEach(topico => {
            columns.andamento.appendChild(this._createCard(topico));
        });

        grupos.concluidos.forEach(topico => {
            columns.concluidos.appendChild(this._createCard(topico));
        });

        // Atualizar contadores
        this._updateCounters(grupos);
    }

    /**
     * Agrupa tópicos por coluna
     */
    _groupTopicos() {
        const grupos = {
            prioridade: [],
            revisoes: [],
            andamento: [],
            concluidos: []
        };

        this.topicos.forEach(topico => {
            // Revisões pendentes
            if (topico.status === 'Precisa revisão' || this._isRevisaoPendente(topico)) {
                grupos.revisoes.push(topico);
            }
            // Em andamento
            else if (topico.status === 'Estudando') {
                grupos.andamento.push(topico);
            }
            // Concluídos
            else if (topico.status === 'Concluído') {
                grupos.concluidos.push(topico);
            }
            // Prioridade (Não iniciado com prioridade alta/média)
            else if (topico.status === 'Não iniciado' && 
                     (topico.prioridade === 'Alta' || topico.prioridade === 'Média')) {
                grupos.prioridade.push(topico);
            }
            // Outros não iniciados vão para prioridade também
            else {
                grupos.prioridade.push(topico);
            }
        });

        // Ordenar cada grupo
        grupos.prioridade.sort((a, b) => this._sortByPriority(a, b));
        grupos.revisoes.sort((a, b) => {
            const aDate = new Date(a.proximaRevisao || 0);
            const bDate = new Date(b.proximaRevisao || 0);
            return aDate - bDate;
        });
        grupos.andamento.sort((a, b) => {
            const aDate = new Date(a.criadoEm || 0);
            const bDate = new Date(b.criadoEm || 0);
            return aDate - bDate;
        });
        grupos.concluidos.sort((a, b) => {
            const aDate = new Date(a.concluidoEm || 0);
            const bDate = new Date(b.concluidoEm || 0);
            return bDate - aDate; // Mais recentes primeiro
        });

        return grupos;
    }

    /**
     * Verifica se revisão está pendente
     */
    _isRevisaoPendente(topico) {
        if (!topico.proximaRevisao) return false;
        const revisaoDate = new Date(topico.proximaRevisao);
        return revisaoDate <= new Date();
    }

    /**
     * Ordena por prioridade
     */
    _sortByPriority(a, b) {
        const priorityOrder = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
        const aPriority = priorityOrder[a.prioridade] || 0;
        const bPriority = priorityOrder[b.prioridade] || 0;
        
        if (aPriority !== bPriority) {
            return bPriority - aPriority;
        }
        
        // Se mesma prioridade, ordenar por data de criação
        const aDate = new Date(a.criadoEm || 0);
        const bDate = new Date(b.criadoEm || 0);
        return aDate - bDate;
    }

    /**
     * Cria card de tópico
     */
    _createCard(topico) {
        const area = this.areas.find(a => a.id === topico.areaId);
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.draggable = true;
        card.dataset.id = topico.id;
        
        // Calcular progresso
        const progresso = this._calcularProgresso(topico);
        
        // Badge de revisão
        const revisaoBadge = this._isRevisaoPendente(topico) 
            ? '<span class="kanban-badge revisao-pendente">� Revisão</span>' 
            : '';
        
        // Tags
        const tagsHtml = topico.tags && topico.tags.length > 0
            ? `<div class="kanban-tags">${topico.tags.map(t => `<span class="kanban-tag">#${t}</span>`).join('')}</div>`
            : '';
        
        // Última sessão
        const ultimaSessao = this._getUltimaSessao(topico);
        const sessaoHtml = ultimaSessao
            ? `<div class="kanban-meta">📅 ${this._formatDate(ultimaSessao.data)}</div>`
            : '';

        card.innerHTML = `
            <div class="kanban-card-header">
                <span class="kanban-priority ${topico.prioridade?.toLowerCase()}">${topico.prioridade || 'Média'}</span>
                ${revisaoBadge}
                <div class="kanban-card-actions">
                    <button class="btn-icon-small" data-action="edit" data-topico-id="${topico.id}" title="Editar">Edit</button>
                    <button class="btn-icon-small" data-action="delete" data-topico-id="${topico.id}" title="Excluir">Del</button>
                </div>
            </div>
            <div class="kanban-card-body">
                <h4 class="kanban-card-title">${this._escapeHtml(topico.titulo)}</h4>
                ${topico.descricao ? `<p class="kanban-card-desc">${this._escapeHtml(topico.descricao)}</p>` : ''}
                ${tagsHtml}
            </div>
            <div class="kanban-card-footer">
                ${progresso > 0 ? `
                    <div class="kanban-progress">
                        <div class="kanban-progress-bar" style="width: ${progresso}%"></div>
                        <span class="kanban-progress-text">${progresso}%</span>
                    </div>
                ` : ''}
                ${sessaoHtml}
            </div>
        `;

        // Anexar eventos de drag
        card.addEventListener('dragstart', (e) => this._handleDragStart(e, topico));
        card.addEventListener('dragend', (e) => this._handleDragEnd(e));
        
        // Anexar evento de click (apenas no body, não nos botões)
        const cardBody = card.querySelector('.kanban-card-body');
        cardBody.addEventListener('click', () => {
            this.onCardClick(topico);
        });
        
        // Prevenir propagação nos botões de ação
        const actionButtons = card.querySelectorAll('[data-action]');
        actionButtons.forEach(btn => {
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

    /**
     * Calcula progresso do tópico
     */
    _calcularProgresso(topico) {
        // Se tem sessões, calcular baseado nelas
        if (topico.sessoes && topico.sessoes.length > 0) {
            const totalMinutos = topico.sessoes.reduce((acc, s) => acc + (s.duracao || 0), 0);
            const tempoEstimado = topico.tempoEstimado?.minutes || 0;
            if (tempoEstimado > 0) {
                return Math.min(100, Math.round((totalMinutos / tempoEstimado) * 100));
            }
        }
        
        // Fallback: status
        if (topico.status === 'Concluído') return 100;
        if (topico.status === 'Estudando') return 50;
        return 0;
    }

    /**
     * Obtém última sessão
     */
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

    /**
     * Formata data
     */
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

    /**
     * Escape HTML
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Atualiza contadores
     */
    _updateCounters(grupos) {
        this.wrapper.querySelector('#countPrioridade').textContent = grupos.prioridade.length;
        this.wrapper.querySelector('#countRevisoes').textContent = grupos.revisoes.length;
        this.wrapper.querySelector('#countAndamento').textContent = grupos.andamento.length;
        this.wrapper.querySelector('#countConcluidos').textContent = grupos.concluidos.length;
    }

    /**
     * Handler de drag start
     */
    _handleDragStart(e, topico) {
        this.draggedCard = topico;
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('dragging');
    }

    /**
     * Handler de drag end
     */
    _handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        this.draggedCard = null;
        
        // Remover classes de drag-over
        this.wrapper.querySelectorAll('.kanban-column').forEach(col => {
            col.classList.remove('drag-over');
        });
    }

    /**
     * Anexa eventos de drag and drop
     */
    _attachEvents() {
        const columns = this.wrapper.querySelectorAll('.kanban-column-content');
        
        columns.forEach(column => {
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

    /**
     * Mapeia coluna para status
     */
    _mapStatusFromColumn(columnStatus) {
        const map = {
            'prioridade': 'Não iniciado',
            'revisoes': 'Precisa revisão',
            'andamento': 'Estudando',
            'concluidos': 'Concluído'
        };
        return map[columnStatus] || 'Não iniciado';
    }

    /**
     * Atualiza tópicos
     */
    updateTopicos(topicos) {
        this.topicos = topicos || [];
        this.render();
    }

    /**
     * Atualiza áreas
     */
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


