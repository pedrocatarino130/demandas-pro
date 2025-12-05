/**
 * Criação Ideias View - Kanban de Ideias
 * Sistema de captura, análise e priorização de ideias
 */

import { store } from '../store.js';
import { createNeonButton } from '../components/NeonButton.js';
import { creationModal } from '../components/CreationModal.js';
import { confirmAction } from '../components/ConfirmModal.js';
import { IdeaStage, CreationContext } from '../types.js';

class CriacaoIdeiasView {
    constructor() {
        this.unsubscribe = null;
        this.quickIdeaTitle = '';
    }

    render() {
        return `
            <div class="criacao-ideias-view">
                <!-- Header & Quick Capture -->
                <div class="criacao-ideias-header">
                    <div class="criacao-ideias-header-content">
                        <div class="criacao-ideias-header-title-wrapper">
                            <h2 class="criacao-ideias-title">Ideias</h2>
                            <p class="criacao-ideias-subtitle">Capture, analise e priorize. (Score = Impacto / Esforço)</p>
                        </div>
                        <div class="criacao-ideias-header-actions" id="ideias-header-actions"></div>
                    </div>

                    <!-- Quick Capture Input -->
                    <form id="quick-idea-form" class="criacao-ideias-quick-capture">
                        <div class="criacao-ideias-quick-capture-wrapper" id="quick-capture-wrapper">
                            <input
                                type="text"
                                id="quick-idea-input"
                                class="criacao-ideias-quick-input"
                                placeholder="Captura rápida... Digite e pressione Enter para enviar ao Inbox 💡"
                            />
                            <div class="criacao-ideias-quick-hint">
                                <span class="criacao-ideias-quick-hint-key">ENTER</span>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Kanban Board -->
                <div class="criacao-ideias-kanban" id="ideias-kanban"></div>
            </div>
        `;
    }

    mount() {
        this.renderHeaderActions();
        this.renderKanban();
        this.setupQuickCapture();
        this.addQuickCaptureIcon();
        
        this.unsubscribe = store.subscribe(() => {
            this.renderKanban();
        });
        
        return this;
    }

    addQuickCaptureIcon() {
        const wrapper = document.getElementById('quick-capture-wrapper');
        if (!wrapper) return;

        // Criar ícone Lightning
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'criacao-ideias-quick-icon');
        icon.setAttribute('width', '20');
        icon.setAttribute('height', '20');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '13 2 3 14 12 14 11 22 21 10 12 10 13 2');
        
        icon.appendChild(polygon);
        wrapper.insertBefore(icon, wrapper.firstChild);
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    renderHeaderActions() {
        const container = document.getElementById('ideias-header-actions');
        if (!container) return;

        container.innerHTML = '';

        // Botão de Nova Ideia Detalhada
        const newIdeaBtn = createNeonButton({
            text: 'Nova Ideia Detalhada',
            variant: 'secondary',
            onClick: () => this.handleNewIdea()
        });
        
        // Adicionar ícone Plus
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('width', '16');
        icon.setAttribute('height', '16');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', '12');
        line1.setAttribute('y1', '5');
        line1.setAttribute('x2', '12');
        line1.setAttribute('y2', '19');
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', '5');
        line2.setAttribute('y1', '12');
        line2.setAttribute('x2', '19');
        line2.setAttribute('y2', '12');
        icon.appendChild(line1);
        icon.appendChild(line2);
        
        const content = newIdeaBtn.querySelector('.neon-button-content');
        if (content) {
            content.insertBefore(icon, content.firstChild);
        }
        
        container.appendChild(newIdeaBtn);
    }

    setupQuickCapture() {
        const form = document.getElementById('quick-idea-form');
        const input = document.getElementById('quick-idea-input');
        
        if (form && input) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = input.value.trim();
                if (title) {
                    this.handleQuickIdeaCapture(title);
                    input.value = '';
                }
            });
        }
    }

    handleQuickIdeaCapture(title) {
        const newIdea = {
            title,
            description: '',
            context: CreationContext.DEV,
            stage: IdeaStage.INBOX,
            tags: [],
            attachments: [],
            impact: 1,
            effort: 1,
            score: 1.0,
            source: ''
        };

        store.addIdea(newIdea);
    }

    renderKanban() {
        const container = document.getElementById('ideias-kanban');
        if (!container) return;

        const ideas = store.state.ideas || [];
        const stages = Object.values(IdeaStage);

        container.innerHTML = '';

        stages.forEach((stage) => {
            const column = this.createKanbanColumn(stage, ideas);
            container.appendChild(column);
        });
    }

    createKanbanColumn(stage, allIdeas) {
        const stageIdeas = allIdeas.filter(idea => idea.stage === stage);

        // Sorting: Score descending for Analyzing/Validated
        if (stage === IdeaStage.ANALYZING || stage === IdeaStage.VALIDATED) {
            stageIdeas.sort((a, b) => (b.score || 0) - (a.score || 0));
        }

        const column = document.createElement('div');
        column.className = 'ideias-kanban-column';

        // Add stage-specific classes for styling
        const stageClass = stage.toLowerCase().replace(/\s/g, '-');
        column.classList.add(`column-${stageClass}`);

        // Header
        const header = document.createElement('div');
        header.className = 'ideias-kanban-header';
        header.innerHTML = `
            <span class="ideias-kanban-header-title">${stage}</span>
            <span class="ideias-kanban-header-count">${stageIdeas.length}</span>
        `;
        column.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.className = 'ideias-kanban-body';

        if (stageIdeas.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'ideias-kanban-empty';
            empty.textContent = 'Vazio';
            body.appendChild(empty);
        } else {
            stageIdeas.forEach(idea => {
                const card = this.createIdeaCard(idea, stage);
                body.appendChild(card);
            });
        }

        column.appendChild(body);
        return column;
    }

    createIdeaCard(idea, stage) {
        const card = document.createElement('div');
        card.className = 'ideias-kanban-card';
        card.setAttribute('data-idea-id', idea.id);

        // Context badge color
        const contextColors = {
            'Dev': 'pink',
            'Conteúdo': 'blue',
            'Negócio': 'purple',
            'Pessoal': 'green'
        };
        const contextColor = contextColors[idea.context] || 'pink';

        // Score badge
        let scoreBadge = '';
        if (idea.impact && idea.effort) {
            const scoreValue = idea.score || 1.0;
            const scoreClass = scoreValue >= 3 ? 'high' : scoreValue >= 1.5 ? 'medium' : 'low';
            scoreBadge = `<span class="ideias-card-score ${scoreClass}">${scoreValue.toFixed(1)}</span>`;
        }

        card.innerHTML = `
            <div class="ideias-card-header">
                <div class="ideias-card-badges">
                    <span class="ideias-card-context ${contextColor}">${idea.context}</span>
                    ${scoreBadge}
                </div>
                <div class="ideias-card-actions">
                    <button class="ideias-card-action-btn edit" data-action="edit" data-id="${idea.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="ideias-card-action-btn delete" data-action="delete" data-id="${idea.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <h4 class="ideias-card-title">${this.escapeHtml(idea.title)}</h4>
            ${idea.description ? `<p class="ideias-card-description">${this.escapeHtml(idea.description)}</p>` : ''}

            ${idea.attachments && idea.attachments.length > 0 ? this.renderAttachmentsMini(idea.attachments) : ''}

            <div class="ideias-card-footer">
                <button class="ideias-card-nav-btn prev" data-action="move-prev" data-id="${idea.id}" ${this.isFirstStage(stage) ? 'disabled' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <button class="ideias-card-nav-btn next" data-action="move-next" data-id="${idea.id}" ${this.isLastStage(stage) ? 'disabled' : ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        `;

        // Event listeners
        const editBtn = card.querySelector('[data-action="edit"]');
        const deleteBtn = card.querySelector('[data-action="delete"]');
        const prevBtn = card.querySelector('[data-action="move-prev"]');
        const nextBtn = card.querySelector('[data-action="move-next"]');

        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleEditIdea(idea);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDeleteIdea(idea.id);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleMoveStage(idea.id, 'prev');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleMoveStage(idea.id, 'next');
            });
        }

        return card;
    }

    renderAttachmentsMini(attachments) {
        const displayAttachments = attachments.slice(0, 3);
        const remaining = attachments.length - 3;

        let html = '<div class="ideias-card-attachments">';
        displayAttachments.forEach(att => {
            const isLink = att.match(/^https?:\/\//) || att.match(/^www\./);
            const isAudio = att.endsWith('.mp3') || att.endsWith('.wav');
            const icon = isLink ? '🔗' : isAudio ? '🎤' : '📄';
            html += `<span class="ideias-card-attachment" title="${this.escapeHtml(att)}">${icon}</span>`;
        });
        if (remaining > 0) {
            html += `<span class="ideias-card-attachment-more">+${remaining}</span>`;
        }
        html += '</div>';
        return html;
    }

    isFirstStage(stage) {
        const stages = Object.values(IdeaStage);
        return stages.indexOf(stage) === 0;
    }

    isLastStage(stage) {
        const stages = Object.values(IdeaStage);
        return stages.indexOf(stage) === stages.length - 1;
    }

    handleNewIdea() {
        console.log('💡 Abrindo modal para nova ideia');
        
        creationModal.show('idea', null, (ideaData) => {
            console.log('💾 Salvando nova ideia:', ideaData);
            store.addIdea(ideaData);
        });
    }

    handleEditIdea(idea) {
        console.log('✏️ Editando ideia:', idea);
        
        creationModal.show('idea', idea, (ideaData) => {
            console.log('💾 Salvando alterações da ideia:', ideaData);
            store.updateIdea(idea.id, ideaData);
        });
    }

    async handleDeleteIdea(id) {
        console.log('🗑️ Deletando ideia:', id);
        const confirmed = await confirmAction('Tem certeza que deseja excluir esta ideia?', {
            confirmLabel: 'Excluir',
            cancelLabel: 'Cancelar'
        });
        
        if (confirmed) {
            console.log('✅ Confirmado delete da ideia:', id);
            store.deleteIdea(id);
        } else {
            console.log('❌ Delete cancelado');
        }
    }

    handleMoveStage(id, direction) {
        store.moveIdeaStage(id, direction);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
}

// Exportar como função factory para compatibilidade com o router
export default function renderCriacaoIdeias() {
    return new CriacaoIdeiasView();
}

