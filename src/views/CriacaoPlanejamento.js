/**
 * Criação Planejamento View - Sistema PREVC
 * Gerenciamento de planejamentos com método PREVC (5 etapas)
 */

import { store } from '../store.js';
import { createNeonButton } from '../components/NeonButton.js';
import { creationModal } from '../components/CreationModal.js';
import { confirmAction } from '../components/ConfirmModal.js';
import { PlanningStatus } from '../types.js';

class CriacaoPlanejamentoView {
    constructor() {
        this.unsubscribe = null;
        this.statusFilter = PlanningStatus.ACTIVE;
    }

    render() {
        return `
            <div class="criacao-planejamento-view">
                <!-- Header -->
                <div class="criacao-planejamento-header">
                    <div class="criacao-planejamento-header-content">
                        <h2 class="criacao-planejamento-title">Planejamento</h2>
                        <p class="criacao-planejamento-subtitle">Estruture ideias com o método PREVC</p>
                    </div>
                    <div class="criacao-planejamento-header-actions" id="planejamento-header-actions"></div>
                </div>

                <div class="criacao-planejamento-content">
                    <!-- Sidebar: Templates -->
                    <aside class="criacao-planejamento-sidebar" id="planejamento-sidebar"></aside>

                    <!-- Main: Plannings List -->
                    <main class="criacao-planejamento-main">
                        <!-- Status Filter -->
                        <div class="criacao-planejamento-filter" id="planejamento-filter"></div>

                        <!-- Plannings Grid -->
                        <div class="criacao-planejamento-grid" id="planejamento-grid"></div>
                    </main>
                </div>
            </div>
        `;
    }

    mount() {
        this.renderHeaderActions();
        this.renderSidebar();
        this.renderFilter();
        this.renderGrid();
        
        this.unsubscribe = store.subscribe(() => {
            this.renderSidebar();
            this.renderGrid();
        });
        
        return this;
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    renderHeaderActions() {
        const container = document.getElementById('planejamento-header-actions');
        if (!container) return;

        container.innerHTML = '';

        const newPlanningBtn = createNeonButton({
            text: 'Novo Planejamento',
            variant: 'secondary',
            onClick: () => this.handleNewPlanning()
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
        
        const content = newPlanningBtn.querySelector('.neon-button-content');
        if (content) {
            content.insertBefore(icon, content.firstChild);
        }
        
        container.appendChild(newPlanningBtn);
    }

    renderSidebar() {
        const container = document.getElementById('planejamento-sidebar');
        if (!container) return;

        const templates = store.state.templates || [];

        container.innerHTML = `
            <div class="planejamento-sidebar-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                <span>Templates de Método</span>
            </div>
            <div class="planejamento-sidebar-content" id="templates-container"></div>
            <button class="planejamento-sidebar-add" id="add-template-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Criar Template
            </button>
        `;

        // Render templates
        const templatesContainer = document.getElementById('templates-container');
        if (templatesContainer) {
            templates.forEach(template => {
                const templateCard = this.createTemplateCard(template);
                templatesContainer.appendChild(templateCard);
            });
        }

        // Add template button
        const addBtn = document.getElementById('add-template-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.handleNewTemplate());
        }
    }

    createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'planejamento-template-card';

        card.innerHTML = `
            <div class="planejamento-template-header">
                <div class="planejamento-template-name">${this.escapeHtml(template.name)}</div>
                <div class="planejamento-template-actions">
                    <button class="planejamento-template-action-btn edit" data-action="edit-template" data-id="${template.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="planejamento-template-action-btn delete" data-action="delete-template" data-id="${template.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="planejamento-template-info">${template.steps.length} etapas</div>
        `;

        // Event listeners
        const editBtn = card.querySelector('[data-action="edit-template"]');
        const deleteBtn = card.querySelector('[data-action="delete-template"]');

        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleEditTemplate(template);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDeleteTemplate(template.id);
            });
        }

        return card;
    }

    renderFilter() {
        const container = document.getElementById('planejamento-filter');
        if (!container) return;

        const statuses = Object.values(PlanningStatus);

        container.innerHTML = '';

        statuses.forEach(status => {
            const button = document.createElement('button');
            button.className = `planejamento-filter-btn ${this.statusFilter === status ? 'active' : ''}`;
            button.textContent = status;
            button.addEventListener('click', () => {
                this.statusFilter = status;
                this.renderFilter();
                this.renderGrid();
            });
            container.appendChild(button);
        });
    }

    renderGrid() {
        const container = document.getElementById('planejamento-grid');
        if (!container) return;

        const plannings = store.state.plannings || [];
        const filtered = plannings.filter(p => p.status === this.statusFilter);

        container.innerHTML = '';

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="planejamento-empty">
                    <div class="planejamento-empty-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 17 12 22 22 17"></polyline>
                            <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                    </div>
                    <p>Nenhum planejamento ${this.statusFilter.toLowerCase()}.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(planning => {
            const card = this.createPlanningCard(planning);
            container.appendChild(card);
        });
    }

    createPlanningCard(planning) {
        const card = document.createElement('div');
        card.className = 'planejamento-card';

        const totalSteps = planning.steps ? planning.steps.length : 0;
        const currentStep = planning.currentStep || 1;
        const currentStepData = planning.steps ? planning.steps[currentStep - 1] : null;
        const progressPercent = totalSteps > 0 ? ((currentStep - 1) / totalSteps) * 100 : 0;

        card.innerHTML = `
            <div class="planejamento-card-progress">
                <div class="planejamento-card-progress-bar" style="width: ${Math.max(5, progressPercent + (100 / totalSteps))}%"></div>
            </div>

            <div class="planejamento-card-content">
                <div class="planejamento-card-header">
                    <div class="planejamento-card-title-wrapper">
                        <h3 class="planejamento-card-title">${this.escapeHtml(planning.title)}</h3>
                        <span class="planejamento-card-deadline">${new Date(planning.deadline).toLocaleDateString()}</span>
                    </div>
                    <div class="planejamento-card-actions">
                        <button class="planejamento-card-action-btn edit" data-action="edit" data-id="${planning.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="planejamento-card-action-btn delete" data-action="delete" data-id="${planning.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <p class="planejamento-card-description">${this.escapeHtml(planning.descriptionOrObjective || planning.description || 'Sem descrição')}</p>

                <!-- Current Step Display -->
                <div class="planejamento-card-step">
                    <div class="planejamento-card-step-header">
                        <span class="planejamento-card-step-label">Etapa Atual ${currentStep}/${totalSteps}</span>
                        ${planning.status === PlanningStatus.ACTIVE ? `
                            <div class="planejamento-card-step-nav">
                                <button class="planejamento-card-step-nav-btn prev" data-action="move-prev" data-id="${planning.id}" ${currentStep === 1 ? 'disabled' : ''}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <button class="planejamento-card-step-nav-btn next" data-action="move-next" data-id="${planning.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        ` : ''}
                    </div>

                    ${currentStepData ? `
                        <div class="planejamento-card-step-content">
                            <div class="planejamento-card-step-emoji">${currentStepData.emoji || '❓'}</div>
                            <div class="planejamento-card-step-info">
                                <div class="planejamento-card-step-name">${this.escapeHtml(currentStepData.name)}</div>
                                <div class="planejamento-card-step-guide">${this.escapeHtml(currentStepData.guide || '')}</div>
                            </div>
                        </div>
                    ` : '<div class="planejamento-card-step-content">Concluído</div>'}
                </div>

                <!-- Footer with Tags and Status Controls -->
                <div class="planejamento-card-footer">
                    <div class="planejamento-card-tags">
                        ${(planning.tags || []).map(tag => `<span class="planejamento-card-tag">#${tag}</span>`).join('')}
                    </div>
                    <div class="planejamento-card-status-controls">
                        ${planning.status === PlanningStatus.ACTIVE ? `
                            <button class="planejamento-card-status-btn pause" data-action="pause" data-id="${planning.id}" title="Pausar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="10" y1="15" x2="10" y2="9"></line>
                                    <line x1="14" y1="15" x2="14" y2="9"></line>
                                </svg>
                            </button>
                        ` : ''}
                        ${planning.status === PlanningStatus.PAUSED ? `
                            <button class="planejamento-card-status-btn resume" data-action="resume" data-id="${planning.id}" title="Retomar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                </svg>
                            </button>
                        ` : ''}
                        <button class="planejamento-card-status-btn cancel" data-action="cancel" data-id="${planning.id}" title="Cancelar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Event listeners
        const editBtn = card.querySelector('[data-action="edit"]');
        const deleteBtn = card.querySelector('[data-action="delete"]');
        const prevBtn = card.querySelector('[data-action="move-prev"]');
        const nextBtn = card.querySelector('[data-action="move-next"]');
        const pauseBtn = card.querySelector('[data-action="pause"]');
        const resumeBtn = card.querySelector('[data-action="resume"]');
        const cancelBtn = card.querySelector('[data-action="cancel"]');

        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleEditPlanning(planning);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDeletePlanning(planning.id);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                store.movePlanningStep(planning.id, 'prev');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                store.movePlanningStep(planning.id, 'next');
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                store.changePlanningStatus(planning.id, PlanningStatus.PAUSED);
            });
        }

        if (resumeBtn) {
            resumeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                store.changePlanningStatus(planning.id, PlanningStatus.ACTIVE);
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                store.changePlanningStatus(planning.id, PlanningStatus.CANCELED);
            });
        }

        return card;
    }

    handleNewPlanning() {
        console.log('📋 Abrindo modal para novo planejamento');
        
        const templates = store.state.templates || [];
        
        creationModal.show('planning', null, (planningData) => {
            console.log('💾 Salvando novo planejamento:', planningData);
            
            // Copiar steps do template selecionado
            const template = templates.find(t => t.id === planningData.templateUsedId);
            if (template) {
                planningData.steps = template.steps;
                planningData.currentStep = 1;
            }
            
            store.addPlanning(planningData);
        }, {
            templates: templates
        });
    }

    handleEditPlanning(planning) {
        console.log('✏️ Editando planejamento:', planning);
        
        const templates = store.state.templates || [];
        
        creationModal.show('planning', planning, (planningData) => {
            console.log('💾 Salvando alterações do planejamento:', planningData);
            store.updatePlanning(planning.id, planningData);
        }, {
            templates: templates
        });
    }

    async handleDeletePlanning(id) {
        console.log('🗑️ Deletando planejamento:', id);
        const confirmed = await confirmAction('Tem certeza que deseja excluir este planejamento?', {
            confirmLabel: 'Excluir',
            cancelLabel: 'Cancelar'
        });
        
        if (confirmed) {
            console.log('✅ Confirmado delete do planejamento:', id);
            store.deletePlanning(id);
        } else {
            console.log('❌ Delete cancelado');
        }
    }

    handleNewTemplate() {
        console.log('📝 Abrindo modal para novo template');
        
        creationModal.show('template', null, (templateData) => {
            console.log('💾 Salvando novo template:', templateData);
            store.addTemplate(templateData);
        });
    }

    handleEditTemplate(template) {
        console.log('✏️ Editando template:', template);
        
        creationModal.show('template', template, (templateData) => {
            console.log('💾 Salvando alterações do template:', templateData);
            store.updateTemplate(template.id, templateData);
        });
    }

    async handleDeleteTemplate(id) {
        console.log('🗑️ Deletando template:', id);
        const confirmed = await confirmAction('Tem certeza que deseja excluir este template?', {
            confirmLabel: 'Excluir',
            cancelLabel: 'Cancelar'
        });
        
        if (confirmed) {
            console.log('✅ Confirmado delete do template:', id);
            store.deleteTemplate(id);
        } else {
            console.log('❌ Delete cancelado');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
}

// Exportar como função factory para compatibilidade com o router
export default function renderCriacaoPlanejamento() {
    return new CriacaoPlanejamentoView();
}

