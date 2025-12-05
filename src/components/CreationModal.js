/**
 * Creation Modal - Modal Polimórfico para Módulo de Criação
 * Suporta: task, idea, planning, template, task-template, ai-task-import
 */

import { createNeonButton } from './NeonButton.js';
import { createNeonCheckbox } from './NeonCheckbox.js';
import { Priority, Status, CreationContext, IdeaStage, PlanningStatus } from '../types.js';

export class CreationModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.modalType = 'task';
        this.initialData = null;
        this.onSave = null;
        this.formData = {};
        this.availableTemplates = [];
        this.availableTaskTemplates = [];
        this.init();
    }

    init() {
        if (document.getElementById('creation-modal')) {
            this.modal = document.getElementById('creation-modal');
        } else {
            this.modal = document.createElement('div');
            this.modal.id = 'creation-modal';
            this.modal.className = 'creation-modal';
            this.modal.style.display = 'none';
            document.body.appendChild(this.modal);
        }
    }

    show(type, initialData, onSave, options = {}) {
        this.modalType = type;
        this.initialData = initialData;
        this.onSave = onSave;
        this.availableTemplates = options.templates || [];
        this.availableTaskTemplates = options.taskTemplates || [];
        
        this.initializeForm();
        this.render();
        this.setupEventListeners();
        
        this.modal.style.display = 'flex';
        this.isOpen = true;

        // Focus no primeiro input
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input, textarea, select');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    close() {
        this.modal.style.display = 'none';
        this.isOpen = false;
        this.formData = {};
    }

    initializeForm() {
        if (this.initialData) {
            this.formData = { ...this.initialData };
        } else {
            // Defaults por tipo
            const base = { title: '', tags: [], attachments: [] };
            
            switch (this.modalType) {
                case 'task':
                case 'creation-task':
                    this.formData = {
                        ...base,
                        description: '',
                        priority: Priority.MEDIUM,
                        status: Status.INBOX,
                        dueDate: new Date().toISOString().split('T')[0],
                        context: CreationContext.DEV,
                        checklist: [],
                        visibleOnGeneralHome: false
                    };
                    break;
                
                case 'idea':
                    this.formData = {
                        ...base,
                        description: '',
                        context: CreationContext.DEV,
                        stage: IdeaStage.INBOX,
                        impact: 3,
                        effort: 3,
                        score: 1.0,
                        source: '',
                        attachments: []
                    };
                    break;
                
                case 'planning':
                    this.formData = {
                        ...base,
                        descriptionOrObjective: '',
                        deadline: new Date().toISOString().split('T')[0],
                        currentStep: 1,
                        status: PlanningStatus.ACTIVE,
                        templateUsedId: this.availableTemplates[0]?.id || '',
                        attachments: []
                    };
                    break;
                
                case 'template':
                    this.formData = {
                        name: '',
                        description: '',
                        context: CreationContext.DEV,
                        steps: [
                            { order: 1, name: 'Etapa 1', emoji: '1️⃣', guide: 'Descrição da etapa' }
                        ]
                    };
                    break;
                
                case 'task-template':
                    this.formData = {
                        name: '',
                        context: CreationContext.DEV,
                        aiPrompt: 'Gere uma lista de tarefas para [OBJETIVO] com o seguinte formato:\n- [Tarefa 1]\n- [Tarefa 2]'
                    };
                    break;
                
                case 'ai-task-import':
                    this.formData = {
                        aiImportText: '',
                        selectedTemplateId: ''
                    };
                    break;
            }
        }
    }

    getTitle() {
        if (this.modalType === 'ai-task-import') return 'Importar de IA';
        if (this.modalType === 'task-template') return 'Modelo de Tarefa (Prompt)';
        
        const action = this.initialData ? 'Editar' : 'Criar';
        const typeNames = {
            'task': 'Tarefa',
            'creation-task': 'Tarefa',
            'idea': 'Ideia',
            'planning': 'Planejamento',
            'template': 'Template'
        };
        return `${action} ${typeNames[this.modalType] || 'Item'}`;
    }

    render() {
        const inputClass = "creation-modal-input";
        const labelClass = "creation-modal-label";
        
        this.modal.innerHTML = `
            <div class="creation-modal-overlay"></div>
            <div class="creation-modal-content">
                <div class="creation-modal-header">
                    <h2 class="creation-modal-title">${this.getTitle()}</h2>
                    <button class="creation-modal-close" id="modal-close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form class="creation-modal-form" id="creation-modal-form">
                    <div class="creation-modal-body">
                        ${this.renderFields(inputClass, labelClass)}
                    </div>

                    <div class="creation-modal-footer">
                        <button type="button" class="creation-modal-btn-cancel" id="modal-cancel">
                            Cancelar
                        </button>
                        <div id="modal-save-btn-container"></div>
                    </div>
                </form>
            </div>
        `;
    }

    renderFields(inputClass, labelClass) {
        switch (this.modalType) {
            case 'task-template':
                return `
                    <div class="creation-modal-field">
                        <label class="${labelClass}">Nome do Modelo *</label>
                        <input 
                            type="text" 
                            class="${inputClass}" 
                            id="field-name" 
                            placeholder="Ex: Checklist de Lançamento..."
                            value="${this.escapeHtml(this.formData.name || '')}"
                            required
                        />
                    </div>

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Contexto</label>
                        <select class="${inputClass}" id="field-context">
                            ${Object.values(CreationContext).map(c => 
                                `<option value="${c}" ${this.formData.context === c ? 'selected' : ''}>${c}</option>`
                            ).join('')}
                        </select>
                    </div>

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Prompt para IA</label>
                        <p class="creation-modal-hint">Defina o texto que será copiado para o ChatGPT/Claude.</p>
                        <textarea 
                            rows="8" 
                            class="${inputClass} creation-modal-code-input" 
                            id="field-aiPrompt"
                            placeholder="Digite o prompt aqui..."
                        >${this.escapeHtml(this.formData.aiPrompt || '')}</textarea>
                    </div>
                `;
            
            case 'ai-task-import':
                return `
                    ${this.availableTaskTemplates.length > 0 ? `
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Usar Template (Prompt)</label>
                            <div class="creation-modal-template-selector">
                                <select class="${inputClass}" id="field-template-selector">
                                    <option value="">-- Selecione um Modelo --</option>
                                    ${this.availableTaskTemplates.map(t => 
                                        `<option value="${t.id}">${this.escapeHtml(t.name)}</option>`
                                    ).join('')}
                                </select>
                                <button type="button" class="creation-modal-copy-btn" id="copy-template-prompt" disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    Copiar
                                </button>
                            </div>
                            <div class="creation-modal-template-preview" id="template-preview"></div>
                        </div>
                    ` : ''}

                    <div class="creation-modal-field">
                        <div class="creation-modal-ai-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3v18m9-9H3m15.5-6.5L6.5 17.5m11-11L6.5 6.5"/>
                            </svg>
                            <span>Parser Inteligente de Tarefas</span>
                        </div>
                        <p class="creation-modal-hint">Cole uma lista de tarefas gerada por IA (ChatGPT, Claude, etc). O sistema identificará cada linha como uma nova tarefa.</p>
                        <textarea 
                            class="${inputClass}" 
                            id="field-ai-import-text" 
                            rows="10"
                            placeholder="1. Pesquisar referências\n2. Criar esboço\n3. Revisar com a equipe..."
                        ></textarea>
                    </div>
                `;
            
            case 'idea':
                return `
                    <div class="creation-modal-field">
                        <label class="${labelClass}">Título *</label>
                        <input 
                            type="text" 
                            class="${inputClass} highlight" 
                            id="field-title" 
                            placeholder="Nome da ideia..."
                            value="${this.escapeHtml(this.formData.title || '')}"
                            required
                        />
                    </div>

                    <div class="creation-modal-row">
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Status (Pipeline)</label>
                            <select class="${inputClass}" id="field-stage">
                                ${Object.values(IdeaStage).map(s => 
                                    `<option value="${s}" ${this.formData.stage === s ? 'selected' : ''}>${s}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Contexto</label>
                            <select class="${inputClass}" id="field-context">
                                ${Object.values(CreationContext).map(c => 
                                    `<option value="${c}" ${this.formData.context === c ? 'selected' : ''}>${c}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="creation-modal-scoring">
                        <div class="creation-modal-scoring-header">
                            <span>Sistema de Scoring</span>
                            <span class="creation-modal-score-value">Score: <strong id="score-display">${(this.formData.score || 1.0).toFixed(1)}</strong></span>
                        </div>
                        <div class="creation-modal-row">
                            <div class="creation-modal-field">
                                <label class="${labelClass}">Impacto (1-5) <span id="impact-value">${this.formData.impact || 3}</span></label>
                                <input type="range" min="1" max="5" step="0.5" class="creation-modal-slider" id="field-impact" value="${this.formData.impact || 3}" />
                            </div>
                            <div class="creation-modal-field">
                                <label class="${labelClass}">Esforço (1-5) <span id="effort-value">${this.formData.effort || 3}</span></label>
                                <input type="range" min="1" max="5" step="0.5" class="creation-modal-slider" id="field-effort" value="${this.formData.effort || 3}" />
                            </div>
                        </div>
                    </div>

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Fonte / Inspiração</label>
                        <input 
                            type="text" 
                            class="${inputClass}" 
                            id="field-source" 
                            placeholder="Ex: Livro X, Conversa com Fulano..."
                            value="${this.escapeHtml(this.formData.source || '')}"
                        />
                    </div>

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Descrição Detalhada</label>
                        <textarea rows="4" class="${inputClass}" id="field-description">${this.escapeHtml(this.formData.description || '')}</textarea>
                    </div>

                    ${this.renderAttachments()}

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Tags (separadas por vírgula)</label>
                        <input type="text" class="${inputClass}" id="field-tags" placeholder="tag1, tag2" value="${(this.formData.tags || []).join(', ')}" />
                    </div>
                `;
            
            case 'creation-task':
                return `
                    <div class="creation-modal-field">
                        <label class="${labelClass}">Título *</label>
                        <input 
                            type="text" 
                            class="${inputClass} highlight" 
                            id="field-title" 
                            placeholder="Nome da tarefa..."
                            value="${this.escapeHtml(this.formData.title || '')}"
                            required
                        />
                    </div>

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Descrição</label>
                        <textarea rows="3" class="${inputClass}" id="field-description">${this.escapeHtml(this.formData.description || '')}</textarea>
                    </div>

                    <div class="creation-modal-row">
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Status</label>
                            <select class="${inputClass}" id="field-status">
                                ${Object.values(Status).map(s => 
                                    `<option value="${s}" ${this.formData.status === s ? 'selected' : ''}>${s}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Prioridade</label>
                            <select class="${inputClass}" id="field-priority">
                                ${Object.values(Priority).map(p => 
                                    `<option value="${p}" ${this.formData.priority === p ? 'selected' : ''}>${p}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="creation-modal-row">
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Data</label>
                            <input type="date" class="${inputClass}" id="field-dueDate" value="${this.formData.dueDate || ''}" />
                        </div>
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Contexto</label>
                            <select class="${inputClass}" id="field-context">
                                ${Object.values(CreationContext).map(c => 
                                    `<option value="${c}" ${this.formData.context === c ? 'selected' : ''}>${c}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>

                    ${this.renderAttachments()}

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Tags (separadas por vírgula)</label>
                        <input type="text" class="${inputClass}" id="field-tags" placeholder="tag1, tag2" value="${(this.formData.tags || []).join(', ')}" />
                    </div>
                `;
            
            case 'planning':
                return `
                    ${!this.initialData ? `
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Template de Método</label>
                            <select class="${inputClass}" id="field-templateUsedId">
                                ${this.availableTemplates.map(t => 
                                    `<option value="${t.id}" ${this.formData.templateUsedId === t.id ? 'selected' : ''}>${this.escapeHtml(t.name)}</option>`
                                ).join('')}
                            </select>
                            <p class="creation-modal-hint">O método define as etapas do planejamento.</p>
                        </div>
                    ` : ''}

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Título do Planejamento *</label>
                        <input 
                            type="text" 
                            class="${inputClass} highlight" 
                            id="field-title" 
                            placeholder="Ex: Lançamento do Site v2"
                            value="${this.escapeHtml(this.formData.title || '')}"
                            required
                        />
                    </div>

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Objetivo / Descrição</label>
                        <textarea rows="3" class="${inputClass}" id="field-descriptionOrObjective">${this.escapeHtml(this.formData.descriptionOrObjective || '')}</textarea>
                    </div>

                    <div class="creation-modal-row">
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Prazo Estimado</label>
                            <input type="date" class="${inputClass}" id="field-deadline" value="${this.formData.deadline || ''}" />
                        </div>
                        <div class="creation-modal-field">
                            <label class="${labelClass}">Status</label>
                            <select class="${inputClass}" id="field-status">
                                ${Object.values(PlanningStatus).map(s => 
                                    `<option value="${s}" ${this.formData.status === s ? 'selected' : ''}>${s}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>

                    ${this.renderAttachments()}

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Tags (separadas por vírgula)</label>
                        <input type="text" class="${inputClass}" id="field-tags" placeholder="tag1, tag2" value="${(this.formData.tags || []).join(', ')}" />
                    </div>
                `;
            
            case 'template':
                return `
                    <div class="creation-modal-field">
                        <label class="${labelClass}">Nome do Template *</label>
                        <input 
                            type="text" 
                            class="${inputClass} highlight" 
                            id="field-name" 
                            placeholder="Ex: PREVC, Scrum Setup..."
                            value="${this.escapeHtml(this.formData.name || '')}"
                            required
                        />
                    </div>

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Descrição do Método</label>
                        <textarea rows="2" class="${inputClass}" id="field-description">${this.escapeHtml(this.formData.description || '')}</textarea>
                    </div>

                    <div class="creation-modal-field">
                        <label class="${labelClass}">Contexto Sugerido</label>
                        <select class="${inputClass}" id="field-context">
                            ${Object.values(CreationContext).map(c => 
                                `<option value="${c}" ${this.formData.context === c ? 'selected' : ''}>${c}</option>`
                            ).join('')}
                        </select>
                    </div>

                    <div class="creation-modal-field">
                        <div class="creation-modal-steps-header">
                            <label class="${labelClass}">Etapas do Método</label>
                            <button type="button" class="creation-modal-add-step-btn" id="add-step-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Adicionar Etapa
                            </button>
                        </div>
                        <div class="creation-modal-steps-container" id="steps-container">
                            ${this.renderSteps()}
                        </div>
                    </div>
                `;
            
            default:
                return `<p>Tipo de modal não implementado: ${this.modalType}</p>`;
        }
    }

    renderAttachments() {
        const attachments = this.formData.attachments || [];
        
        return `
            <div class="creation-modal-field">
                <label class="creation-modal-label">Recursos & Arquivos</label>
                <div class="creation-modal-attachments-input-row">
                    <div class="creation-modal-attachment-input-wrapper">
                        <svg class="creation-modal-attachment-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <input 
                            type="text" 
                            class="creation-modal-input" 
                            id="attachment-input"
                            placeholder="Cole um link ou adicione arquivo..."
                        />
                    </div>
                    
                    <button type="button" class="creation-modal-attachment-btn upload" id="attachment-upload-btn" title="Anexar arquivo (simulado)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                    </button>
                    
                    <button type="button" class="creation-modal-attachment-btn audio" id="attachment-audio-btn" title="Gravar áudio (simulado)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    </button>
                    
                    <button type="button" class="creation-modal-attachment-btn add" id="attachment-add-btn" title="Adicionar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>

                <div class="creation-modal-attachments-list" id="attachments-list">
                    ${attachments.map((att, index) => this.renderAttachmentItem(att, index)).join('')}
                </div>
            </div>
        `;
    }

    renderAttachmentItem(attachment, index) {
        const isLink = attachment.match(/^https?:\/\//) || attachment.match(/^www\./);
        const isAudio = attachment.endsWith('.mp3') || attachment.endsWith('.wav');
        
        let icon = '';
        let colorClass = '';
        
        if (isLink) {
            icon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>`;
            colorClass = 'link';
        } else if (isAudio) {
            icon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            </svg>`;
            colorClass = 'audio';
        } else {
            icon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
            </svg>`;
            colorClass = 'file';
        }

        return `
            <div class="creation-modal-attachment-item ${colorClass}">
                ${icon}
                <span class="creation-modal-attachment-name">${this.escapeHtml(attachment)}</span>
                <button type="button" class="creation-modal-attachment-remove" data-remove-attachment="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
    }

    renderSteps() {
        const steps = this.formData.steps || [];
        
        if (steps.length === 0) {
            return '<div class="creation-modal-steps-empty">Nenhuma etapa definida</div>';
        }

        return steps.map((step, index) => `
            <div class="creation-modal-step-item" data-step-index="${index}">
                <div class="creation-modal-step-emoji">
                    <input 
                        type="text" 
                        class="creation-modal-step-emoji-input" 
                        value="${this.escapeHtml(step.emoji)}"
                        maxlength="2"
                        placeholder="📝"
                        data-step-field="emoji"
                        data-step-index="${index}"
                    />
                    <span class="creation-modal-step-order">#${step.order}</span>
                </div>
                <div class="creation-modal-step-content">
                    <input 
                        type="text" 
                        class="creation-modal-step-name-input" 
                        value="${this.escapeHtml(step.name)}"
                        placeholder="Nome da etapa"
                        data-step-field="name"
                        data-step-index="${index}"
                    />
                    <input 
                        type="text" 
                        class="creation-modal-step-guide-input" 
                        value="${this.escapeHtml(step.guide || '')}"
                        placeholder="O que fazer nesta etapa?"
                        data-step-field="guide"
                        data-step-index="${index}"
                    />
                </div>
                <button type="button" class="creation-modal-step-remove-btn" data-remove-step="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Fechar modal
        const closeBtn = this.modal.querySelector('#modal-close');
        const cancelBtn = this.modal.querySelector('#modal-cancel');
        const overlay = this.modal.querySelector('.creation-modal-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // ESC para fechar
        const escHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Criar botão Salvar com NeonButton
        const saveContainer = this.modal.querySelector('#modal-save-btn-container');
        if (saveContainer) {
            const saveBtn = createNeonButton({
                text: this.modalType === 'ai-task-import' ? 'Gerar Tarefas' : 'Salvar',
                type: 'button',
                onClick: () => this.handleSave()
            });
            
            // Adicionar ícone
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('width', '18');
            icon.setAttribute('height', '18');
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('fill', 'none');
            icon.setAttribute('stroke', 'currentColor');
            icon.setAttribute('stroke-width', '2');
            
            if (this.modalType === 'ai-task-import') {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M12 3v18m9-9H3m15.5-6.5L6.5 17.5m11-11L6.5 6.5');
                icon.appendChild(path);
            } else {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z');
                const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                polyline.setAttribute('points', '17 21 17 13 7 13 7 21');
                const polyline2 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                polyline2.setAttribute('points', '7 3 7 8 15 8');
                icon.appendChild(path);
                icon.appendChild(polyline);
                icon.appendChild(polyline2);
            }
            
            const content = saveBtn.querySelector('.neon-button-content');
            if (content) {
                content.insertBefore(icon, content.firstChild);
            }
            
            saveContainer.appendChild(saveBtn);
        }

        // Listeners específicos por tipo
        if (this.modalType === 'idea') {
            this.setupIdeaListeners();
        } else if (this.modalType === 'ai-task-import') {
            this.setupAIImportListeners();
        } else if (this.modalType === 'template') {
            this.setupTemplateListeners();
        }
        
        // Attachments (para idea, planning, creation-task)
        if (['idea', 'planning', 'creation-task'].includes(this.modalType)) {
            this.setupAttachmentListeners();
        }
    }

    setupAttachmentListeners() {
        const addBtn = this.modal.querySelector('#attachment-add-btn');
        const uploadBtn = this.modal.querySelector('#attachment-upload-btn');
        const audioBtn = this.modal.querySelector('#attachment-audio-btn');
        const input = this.modal.querySelector('#attachment-input');
        const list = this.modal.querySelector('#attachments-list');

        // Adicionar link/texto
        const addAttachment = () => {
            if (!input || !input.value.trim()) return;
            
            if (!this.formData.attachments) {
                this.formData.attachments = [];
            }
            
            this.formData.attachments.push(input.value.trim());
            input.value = '';
            this.updateAttachmentsList();
        };

        if (addBtn) {
            addBtn.addEventListener('click', addAttachment);
        }

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addAttachment();
                }
            });
        }

        // Simular upload de arquivo
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                const filename = `arquivo-${Date.now()}.pdf`;
                if (!this.formData.attachments) {
                    this.formData.attachments = [];
                }
                this.formData.attachments.push(filename);
                this.updateAttachmentsList();
            });
        }

        // Simular gravação de áudio
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                const filename = `Audio-Note-${timestamp}.mp3`;
                if (!this.formData.attachments) {
                    this.formData.attachments = [];
                }
                this.formData.attachments.push(filename);
                this.updateAttachmentsList();
            });
        }

        // Remover attachment
        if (list) {
            list.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('[data-remove-attachment]');
                if (removeBtn) {
                    const index = parseInt(removeBtn.getAttribute('data-remove-attachment'));
                    this.removeAttachment(index);
                }
            });
        }
    }

    updateAttachmentsList() {
        const list = this.modal.querySelector('#attachments-list');
        if (!list) return;
        
        const attachments = this.formData.attachments || [];
        list.innerHTML = attachments.map((att, index) => this.renderAttachmentItem(att, index)).join('');
    }

    removeAttachment(index) {
        if (!this.formData.attachments) return;
        this.formData.attachments.splice(index, 1);
        this.updateAttachmentsList();
    }

    renderSteps() {
        const steps = this.formData.steps || [];
        
        if (steps.length === 0) {
            return '<div class="creation-modal-steps-empty">Nenhuma etapa definida</div>';
        }

        return steps.map((step, index) => `
            <div class="creation-modal-step-item" data-step-index="${index}">
                <div class="creation-modal-step-emoji">
                    <input 
                        type="text" 
                        class="creation-modal-step-emoji-input" 
                        value="${this.escapeHtml(step.emoji)}"
                        maxlength="2"
                        placeholder="📝"
                        data-step-field="emoji"
                        data-step-index="${index}"
                    />
                    <span class="creation-modal-step-order">#${step.order}</span>
                </div>
                <div class="creation-modal-step-content">
                    <input 
                        type="text" 
                        class="creation-modal-step-name-input" 
                        value="${this.escapeHtml(step.name)}"
                        placeholder="Nome da etapa"
                        data-step-field="name"
                        data-step-index="${index}"
                    />
                    <input 
                        type="text" 
                        class="creation-modal-step-guide-input" 
                        value="${this.escapeHtml(step.guide || '')}"
                        placeholder="O que fazer nesta etapa?"
                        data-step-field="guide"
                        data-step-index="${index}"
                    />
                </div>
                <button type="button" class="creation-modal-step-remove-btn" data-remove-step="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    setupTemplateListeners() {
        const addStepBtn = this.modal.querySelector('#add-step-btn');
        
        if (addStepBtn) {
            addStepBtn.addEventListener('click', () => {
                const steps = this.formData.steps || [];
                steps.push({
                    order: steps.length + 1,
                    name: '',
                    emoji: '📝',
                    guide: ''
                });
                this.formData.steps = steps;
                this.updateStepsContainer();
            });
        }

        // Delegates para steps
        const stepsContainer = this.modal.querySelector('#steps-container');
        if (stepsContainer) {
            stepsContainer.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('[data-remove-step]');
                if (removeBtn) {
                    const index = parseInt(removeBtn.getAttribute('data-remove-step'));
                    this.removeStep(index);
                }
            });

            stepsContainer.addEventListener('input', (e) => {
                const field = e.target;
                if (field.hasAttribute('data-step-field')) {
                    const index = parseInt(field.getAttribute('data-step-index'));
                    const fieldName = field.getAttribute('data-step-field');
                    this.updateStepField(index, fieldName, field.value);
                }
            });
        }
    }

    updateStepsContainer() {
        const container = this.modal.querySelector('#steps-container');
        if (container) {
            container.innerHTML = this.renderSteps();
        }
    }

    updateStepField(index, fieldName, value) {
        if (!this.formData.steps || !this.formData.steps[index]) return;
        this.formData.steps[index][fieldName] = value;
    }

    removeStep(index) {
        if (!this.formData.steps) return;
        this.formData.steps.splice(index, 1);
        // Reordenar
        this.formData.steps.forEach((step, i) => {
            step.order = i + 1;
        });
        this.updateStepsContainer();
    }

    setupIdeaListeners() {
        const impactInput = this.modal.querySelector('#field-impact');
        const effortInput = this.modal.querySelector('#field-effort');
        const scoreDisplay = this.modal.querySelector('#score-display');
        const impactValue = this.modal.querySelector('#impact-value');
        const effortValue = this.modal.querySelector('#effort-value');

        const updateScore = () => {
            const impact = parseFloat(impactInput?.value || 3);
            const effort = parseFloat(effortInput?.value || 3);
            const score = (impact / effort).toFixed(1);
            
            if (scoreDisplay) scoreDisplay.textContent = score;
            if (impactValue) impactValue.textContent = impact;
            if (effortValue) effortValue.textContent = effort;
            
            // Atualizar cor do score
            const scoreClass = score >= 3 ? 'high' : score >= 1.5 ? 'medium' : 'low';
            scoreDisplay?.setAttribute('data-score', scoreClass);
        };

        if (impactInput) {
            impactInput.addEventListener('input', updateScore);
        }
        if (effortInput) {
            effortInput.addEventListener('input', updateScore);
        }
        
        updateScore(); // Initial update
    }

    setupAIImportListeners() {
        const templateSelector = this.modal.querySelector('#field-template-selector');
        const copyBtn = this.modal.querySelector('#copy-template-prompt');
        const preview = this.modal.querySelector('#template-preview');

        if (templateSelector && copyBtn) {
            templateSelector.addEventListener('change', (e) => {
                const templateId = e.target.value;
                const template = this.availableTaskTemplates.find(t => t.id === templateId);
                
                if (template) {
                    copyBtn.disabled = false;
                    if (preview) {
                        preview.style.display = 'block';
                        preview.textContent = template.aiPrompt;
                    }
                } else {
                    copyBtn.disabled = true;
                    if (preview) {
                        preview.style.display = 'none';
                    }
                }
            });

            copyBtn.addEventListener('click', () => {
                const templateId = templateSelector.value;
                const template = this.availableTaskTemplates.find(t => t.id === templateId);
                
                if (template) {
                    navigator.clipboard.writeText(template.aiPrompt);
                    copyBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Copiado!
                    `;
                    setTimeout(() => {
                        copyBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copiar
                        `;
                    }, 2000);
                }
            });
        }
    }

    handleSave() {
        if (this.modalType === 'ai-task-import') {
            this.handleAIImport();
            return;
        }

        // Coletar dados do formulário
        const formElement = this.modal.querySelector('#creation-modal-form');
        const formDataObj = new FormData(formElement);
        
        // Extrair valores dos campos
        const fields = this.modal.querySelectorAll('[id^="field-"]');
        const data = {};
        
        fields.forEach(field => {
            const fieldName = field.id.replace('field-', '');
            const value = field.value;
            
            if (field.type === 'number' || field.type === 'range') {
                data[fieldName] = parseFloat(value);
            } else {
                data[fieldName] = value;
            }
        });

        // Processar tags
        const tagsInput = this.modal.querySelector('#field-tags');
        if (tagsInput) {
            data.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
        }

        // Calcular score para ideias
        if (this.modalType === 'idea') {
            data.impact = parseFloat(data.impact || 3);
            data.effort = parseFloat(data.effort || 3);
            data.score = parseFloat((data.impact / data.effort).toFixed(1));
        }

        // Merge com dados iniciais (preservando arrays complexos)
        const finalData = {
            ...this.formData,
            ...data
        };

        // Preservar arrays que são gerenciados separadamente
        if (this.modalType === 'template' && this.formData.steps) {
            finalData.steps = this.formData.steps;
        }
        
        // Preservar attachments
        if (['idea', 'planning', 'creation-task'].includes(this.modalType) && this.formData.attachments) {
            finalData.attachments = this.formData.attachments;
        }

        console.log('💾 Salvando dados do modal:', finalData);

        if (this.onSave) {
            this.onSave(finalData);
        }
        
        this.close();
    }

    handleAIImport() {
        const textarea = this.modal.querySelector('#field-ai-import-text');
        if (!textarea) return;

        const text = textarea.value;
        if (!text.trim()) {
            alert('Por favor, cole uma lista de tarefas.');
            return;
        }

        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const tasks = lines.map(line => {
            const cleanTitle = line.replace(/^[\d\.\-\*]+\s*/, '');
            return {
                title: cleanTitle,
                description: '',
                priority: Priority.MEDIUM,
                status: Status.INBOX,
                context: CreationContext.DEV,
                dueDate: new Date().toISOString().split('T')[0],
                checklist: [],
                tags: ['Importado-IA'],
                attachments: [],
                visibleOnGeneralHome: false
            };
        });

        console.log(`📥 Importando ${tasks.length} tarefas via IA`);

        if (this.onSave) {
            this.onSave(tasks);
        }
        
        this.close();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
}

// Singleton
export const creationModal = new CreationModal();

