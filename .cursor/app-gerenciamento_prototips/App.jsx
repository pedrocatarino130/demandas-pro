import React, { useState } from 'react';
import { Plus, Layers, Map, CheckSquare, Briefcase, Trash2, Edit2, ArrowRight, ArrowLeft, PlayCircle, CheckCircle, PauseCircle, XCircle, Link as LinkIcon, FileText, Zap, Mic, Sparkles, Filter, FileCode, Paperclip } from 'lucide-react';
import { Priority, Status, IdeaStage, CreationContext, PlanningStatus } from './types';
import { TaskCard } from './components/TaskCard';
import { Modal } from './components/Modal';
import { NeonButton } from './components/NeonButton';
import { Sidebar } from './components/Sidebar';

export default function App() {
    // --- States ---
    const [activeTab, setActiveTab] = useState('creation-home');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('task');
    const [editingItem, setEditingItem] = useState(undefined);

    // Quick Capture State
    const [quickIdeaTitle, setQuickIdeaTitle] = useState('');

    // Planning Specific State
    const [planningFilter, setPlanningFilter] = useState(PlanningStatus.ACTIVE);

    // Creation Task Filtering
    const [taskContextFilter, setTaskContextFilter] = useState('ALL');
    const [taskPriorityFilter, setTaskPriorityFilter] = useState('ALL');

    // Data Stores
    const [tasks, setTasks] = useState([]);
    const [creationTasks, setCreationTasks] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [plannings, setPlannings] = useState([]);
    const [taskTemplates, setTaskTemplates] = useState([
        {
            id: 'default-checklist',
            name: 'Checklist Padrão',
            context: CreationContext.DEV,
            aiPrompt: 'Crie uma lista de tarefas essenciais para [TÓPICO] focadas em produtividade.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ]);

    // Initialize with the standard PREVC template
    const [templates, setTemplates] = useState([
        {
            id: 'prevc-default',
            name: 'PREVC (Padrão)',
            description: 'Método padrão de 5 etapas para projetos.',
            context: CreationContext.DEV,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            steps: [
                { order: 1, name: 'Planejamento', emoji: '📋', guide: 'Criar escopo/PRD inicial, definir requisitos' },
                { order: 2, name: 'Revisão', emoji: '🔍', guide: 'Revisar com IA, remover excessos, validar escopo' },
                { order: 3, name: 'Execução', emoji: '⚡', guide: 'Executar as tarefas/fases planejadas' },
                { order: 4, name: 'Validação', emoji: '✅', guide: 'Verificar se entregou o esperado' },
                { order: 5, name: 'Confirmação', emoji: '🎯', guide: 'Confirmar conclusão, ajustes finais' }
            ]
        }
    ]);

    // --- Handlers ---

    const handleOpenModal = (type, item) => {
        setModalType(type);
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSave = (data) => {
        // Handle Batch Creation (Array) from AI Import
        if (Array.isArray(data)) {
            setCreationTasks(prev => [...prev, ...data]);
            return;
        }

        const id = editingItem?.id || Math.random().toString(36).substr(2, 9);
        let newItem = { ...data, id, updatedAt: new Date().toISOString() };

        if (!editingItem) {
            newItem.createdAt = new Date().toISOString();

            // Special logic for creating a new Planning
            if (modalType === 'planning') {
                const selectedTemplate = templates.find(t => t.id === newItem.templateUsedId);
                if (selectedTemplate) {
                    // Copy steps to planning instance to preserve history
                    newItem.steps = selectedTemplate.steps;
                    // Set defaults
                    newItem.currentStep = 1;
                } else {
                    newItem.steps = [];
                }
            }
        }

        switch (modalType) {
            case 'task':
                setTasks(prev => editingItem ? prev.map(t => t.id === id ? newItem : t) : [...prev, newItem]);
                break;
            case 'creation-task':
                setCreationTasks(prev => editingItem ? prev.map(t => t.id === id ? newItem : t) : [...prev, newItem]);
                break;
            case 'idea':
                setIdeas(prev => editingItem ? prev.map(i => i.id === id ? newItem : i) : [...prev, newItem]);
                break;
            case 'planning':
                setPlannings(prev => editingItem ? prev.map(p => p.id === id ? newItem : p) : [...prev, newItem]);
                break;
            case 'template':
                setTemplates(prev => editingItem ? prev.map(t => t.id === id ? newItem : t) : [...prev, newItem]);
                break;
            case 'task-template':
                setTaskTemplates(prev => editingItem ? prev.map(t => t.id === id ? newItem : t) : [...prev, newItem]);
                break;
        }
    };

    const handleQuickIdeaCapture = (e) => {
        e.preventDefault();
        if (!quickIdeaTitle.trim()) return;

        const newIdea = {
            id: Math.random().toString(36).substr(2, 9),
            title: quickIdeaTitle,
            description: '',
            context: CreationContext.DEV,
            stage: IdeaStage.INBOX,
            tags: [],
            attachments: [],
            impact: 1,
            effort: 1,
            score: 1.0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setIdeas([...ideas, newIdea]);
        setQuickIdeaTitle('');
    };

    const handleDelete = (id, type) => {
        switch (type) {
            case 'task': setTasks(prev => prev.filter(t => t.id !== id)); break;
            case 'creation-task': setCreationTasks(prev => prev.filter(t => t.id !== id)); break;
            case 'idea': setIdeas(prev => prev.filter(i => i.id !== id)); break;
            case 'planning': setPlannings(prev => prev.filter(p => p.id !== id)); break;
            case 'template': setTemplates(prev => prev.filter(t => t.id !== id)); break;
            case 'task-template': setTaskTemplates(prev => prev.filter(t => t.id !== id)); break;
        }
    };

    // Specific Idea Handlers
    const moveIdeaStage = (id, direction) => {
        const stages = Object.values(IdeaStage);
        setIdeas(prev => prev.map(idea => {
            if (idea.id !== id) return idea;
            const currentIndex = stages.indexOf(idea.stage);
            const nextIndex = direction === 'next' ? Math.min(currentIndex + 1, stages.length - 1) : Math.max(currentIndex - 1, 0);
            return { ...idea, stage: stages[nextIndex] };
        }));
    };

    // Specific Planning Handlers
    const movePlanningStep = (id, direction) => {
        setPlannings(prev => prev.map(plan => {
            if (plan.id !== id) return plan;

            const totalSteps = plan.steps.length;
            let newStep = plan.currentStep;
            let newStatus = plan.status;

            if (direction === 'next') {
                if (newStep < totalSteps) {
                    newStep++;
                } else {
                    // Reached end
                    newStatus = PlanningStatus.COMPLETED;
                }
            } else {
                if (newStep > 1) {
                    newStep--;
                    // If we go back from completed, reactivate
                    if (newStatus === PlanningStatus.COMPLETED) {
                        newStatus = PlanningStatus.ACTIVE;
                    }
                }
            }

            return { ...plan, currentStep: newStep, status: newStatus };
        }));
    };

    const changePlanningStatus = (id, newStatus) => {
        setPlannings(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    };

    // --- Render Functions ---

    const renderCreationIdeas = () => {
        // Define columns logic for Kanban
        const stages = Object.values(IdeaStage);

        return (
            <div className="space-y-6 animate-in fade-in duration-500 pb-20">

                {/* Header & Zero Friction Capture */}
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">Ideias</h2>
                            <p className="text-gray-400 mt-1">Capture, analise e priorize. (Score = Impacto / Esforço)</p>
                        </div>
                        <NeonButton onClick={() => handleOpenModal('idea')} variant="secondary">Nova Ideia Detalhada</NeonButton>
                    </div>

                    {/* Quick Capture Input */}
                    <form onSubmit={handleQuickIdeaCapture} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <input
                            type="text"
                            className="w-full bg-[#161329] border border-white/10 rounded-xl p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 relative z-10 transition-all shadow-lg"
                            placeholder="Captura rápida... Digite e pressione Enter para enviar ao Inbox 💡"
                            value={quickIdeaTitle}
                            onChange={(e) => setQuickIdeaTitle(e.target.value)}
                        />
                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 z-20" size={20} />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 z-20">
                            <span className="text-[10px] text-gray-500 border border-white/10 rounded px-1.5 py-0.5">ENTER</span>
                        </div>
                    </form>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto pb-4">
                    {stages.map((stage, i) => {
                        const stageIdeas = ideas.filter(idea => idea.stage === stage);

                        // Sorting: Score descending for Analyzing/Validated
                        if (stage === IdeaStage.ANALYZING || stage === IdeaStage.VALIDATED) {
                            stageIdeas.sort((a, b) => (b.score || 0) - (a.score || 0));
                        }

                        // Color coding headers
                        let headerColor = 'text-gray-300 border-white/5';
                        if (stage === IdeaStage.INBOX) headerColor = 'text-yellow-200 border-yellow-500/30 bg-yellow-500/5';
                        if (stage === IdeaStage.VALIDATED) headerColor = 'text-green-300 border-green-500/30 bg-green-500/5';
                        if (stage === IdeaStage.EXECUTING) headerColor = 'text-blue-300 border-blue-500/30 bg-blue-500/5';
                        if (stage === IdeaStage.DISCARDED) headerColor = 'text-gray-500 border-white/5 opacity-70';

                        return (
                            <div key={i} className={`flex flex-col rounded-xl min-w-[280px] ${stage === IdeaStage.DISCARDED ? 'opacity-60' : ''}`}>
                                <div className={`p-3 border-b rounded-t-xl font-semibold flex justify-between items-center ${headerColor} border`}>
                                    {stage}
                                    <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full border border-white/5">{stageIdeas.length}</span>
                                </div>

                                <div className="flex-1 p-2 bg-[#161329]/30 border-x border-b border-white/5 rounded-b-xl flex flex-col gap-3 min-h-[150px]">
                                    {stageIdeas.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center text-gray-700 text-xs border-dashed border border-white/5 rounded-lg m-2">
                                            Vazio
                                        </div>
                                    ) : (
                                        stageIdeas.map(idea => (
                                            <div key={idea.id} className="bg-[#1a1a1c] p-3 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all group relative shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex gap-2">
                                                        <span className="text-[10px] uppercase text-pink-400 bg-pink-400/10 px-1.5 py-0.5 rounded">{idea.context}</span>
                                                        {/* Score Badge */}
                                                        {(idea.impact && idea.effort) && (
                                                            <span
                                                                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border 
                                       ${(idea.score || 0) >= 3 ? 'text-green-400 border-green-500/20 bg-green-500/10' :
                                                                        (idea.score || 0) >= 1.5 ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                                                                            'text-red-400 border-red-500/20 bg-red-500/10'}`}
                                                            >
                                                                {idea.score}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenModal('idea', idea)} className="p-1 hover:text-white text-gray-500"><Edit2 size={12} /></button>
                                                        <button onClick={() => handleDelete(idea.id, 'idea')} className="p-1 hover:text-red-400 text-gray-500"><Trash2 size={12} /></button>
                                                    </div>
                                                </div>

                                                <h4 className="font-semibold text-gray-200 text-sm mb-1">{idea.title}</h4>
                                                {idea.description && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{idea.description}</p>}

                                                {/* Attachments Mini View */}
                                                {idea.attachments && idea.attachments.length > 0 && (
                                                    <div className="mb-2 flex flex-wrap gap-1">
                                                        {idea.attachments.map((att, idx) => {
                                                            const isLink = att.match(/^https?:\/\//) || att.match(/^www\./);
                                                            const isAudio = att.endsWith('.mp3');
                                                            if (idx > 2) return null; // Limit display
                                                            return (
                                                                <div key={idx} className={`px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1 max-w-full overflow-hidden ${isLink ? 'bg-blue-500/10 text-blue-300' : 'bg-gray-700/30 text-gray-400'}`}>
                                                                    {isLink ? <LinkIcon size={8} /> : isAudio ? <Mic size={8} /> : <FileText size={8} />}
                                                                    <span className="truncate max-w-[60px]">{att}</span>
                                                                </div>
                                                            )
                                                        })}
                                                        {idea.attachments.length > 3 && <span className="text-[9px] text-gray-600">+{idea.attachments.length - 3}</span>}
                                                    </div>
                                                )}

                                                {/* Movement Controls */}
                                                <div className="flex justify-between mt-2 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        disabled={i === 0}
                                                        onClick={() => moveIdeaStage(idea.id, 'prev')}
                                                        className="p-1 rounded hover:bg-white/10 disabled:opacity-0 text-gray-400 hover:text-white"
                                                    >
                                                        <ArrowLeft size={12} />
                                                    </button>
                                                    <button
                                                        disabled={i === stages.length - 1}
                                                        onClick={() => moveIdeaStage(idea.id, 'next')}
                                                        className="p-1 rounded hover:bg-white/10 disabled:opacity-0 text-gray-400 hover:text-white"
                                                    >
                                                        <ArrowRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderCreationPlanning = () => {
        // ... (No changes here, keeping existing implementation)
        const filteredPlannings = plannings.filter(p => p.status === planningFilter);
        return (
            <div className="space-y-6 animate-in fade-in duration-500 pb-20">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Planejamento</h2>
                        <p className="text-gray-400 mt-1">Estruture ideias com o método PREVC</p>
                    </div>
                    <NeonButton onClick={() => handleOpenModal('planning')} variant="secondary">Novo Planejamento</NeonButton>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3 space-y-4">
                        <div className="bg-[#1a1a1c] border border-white/5 rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Map size={14} /> Templates de Método
                            </h3>
                            <div className="space-y-2">
                                {templates.map(tmpl => (
                                    <div key={tmpl.id} className="p-3 bg-white/5 rounded-lg border border-transparent hover:border-blue-500/30 hover:bg-white/10 cursor-pointer transition-all group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium text-gray-200 text-sm">{tmpl.name}</div>
                                                <div className="text-[10px] text-gray-500 mt-1">{tmpl.steps.length} etapas</div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); handleOpenModal('template', tmpl); }} className="p-1 text-gray-400 hover:text-white"><Edit2 size={12} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(tmpl.id, 'template'); }} className="p-1 text-gray-400 hover:text-red-400"><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleOpenModal('template')}
                                    className="w-full py-2 border border-dashed border-white/10 rounded-lg text-xs text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={12} /> Criar Template
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-9 space-y-6">
                        <div className="flex gap-2 p-1 bg-black/20 rounded-xl w-fit">
                            {Object.values(PlanningStatus).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setPlanningFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${planningFilter === status
                                            ? 'bg-[#03a9f4]/10 text-[#03a9f4] shadow-[0_0_10px_rgba(3,169,244,0.1)]'
                                            : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredPlannings.length === 0 ? (
                                <div className="col-span-full border border-dashed border-white/10 rounded-2xl bg-[#1a1a1c]/30 h-64 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <Map className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-500">Nenhum planejamento {planningFilter.toLowerCase()}.</p>
                                </div>
                            ) : (
                                filteredPlannings.map(plan => {
                                    // ... (Keeping plan map logic same)
                                    const totalSteps = plan.steps.length;
                                    const currentStepData = plan.steps[plan.currentStep - 1] || {};
                                    const progressPercent = ((plan.currentStep - 1) / totalSteps) * 100;

                                    return (
                                        <div key={plan.id} className="group relative bg-[#1a1a1c] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all flex flex-col">
                                            <div className="h-1 w-full bg-gray-800">
                                                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.max(5, progressPercent + (100 / totalSteps))}%` }}></div>
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-lg font-bold text-white">{plan.title}</h3>
                                                            <span className="text-[10px] bg-white/5 border border-white/5 text-gray-400 px-2 py-0.5 rounded-full">{new Date(plan.deadline).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 line-clamp-2">{plan.descriptionOrObjective}</p>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenModal('planning', plan)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(plan.id, 'planning')} className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>

                                                {/* Current Step Display */}
                                                <div className="mt-auto bg-black/30 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 bg-blue-500/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                                                    <div className="flex items-center justify-between mb-2 relative z-10">
                                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Etapa Atual {plan.currentStep}/{totalSteps}</span>
                                                        <div className="flex gap-1">
                                                            {plan.status === PlanningStatus.ACTIVE && (
                                                                <>
                                                                    <button
                                                                        onClick={() => movePlanningStep(plan.id, 'prev')}
                                                                        disabled={plan.currentStep === 1}
                                                                        className="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-gray-400"
                                                                    >
                                                                        <ArrowLeft size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => movePlanningStep(plan.id, 'next')}
                                                                        className="p-1 rounded hover:bg-white/10 text-white hover:text-blue-400"
                                                                    >
                                                                        <ArrowRight size={16} />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 relative z-10">
                                                        <div className="text-2xl">{currentStepData.emoji || '❓'}</div>
                                                        <div>
                                                            <div className="font-semibold text-gray-200">{currentStepData.name || 'Fim'}</div>
                                                            <div className="text-xs text-gray-500 line-clamp-1">{currentStepData.guide || 'Concluído'}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Footer Actions */}
                                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                                    <div className="flex gap-1">
                                                        {plan.tags.map((tag, i) => (
                                                            <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded text-gray-400">#{tag}</span>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {/* Button for Resources & Files */}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleOpenModal('planning', plan); }}
                                                            className="p-1.5 rounded hover:bg-white/10 text-blue-400"
                                                            title="Recursos & Arquivos"
                                                        >
                                                            <Paperclip size={18} />
                                                        </button>

                                                        {plan.status === PlanningStatus.ACTIVE ? (
                                                            <button onClick={() => changePlanningStatus(plan.id, PlanningStatus.PAUSED)} className="p-1.5 rounded hover:bg-white/10 text-yellow-500" title="Pausar"><PauseCircle size={18} /></button>
                                                        ) : (
                                                            <button onClick={() => changePlanningStatus(plan.id, PlanningStatus.ACTIVE)} className="p-1.5 rounded hover:bg-white/10 text-green-500" title="Retomar"><PlayCircle size={18} /></button>
                                                        )}
                                                        <button onClick={() => changePlanningStatus(plan.id, PlanningStatus.CANCELED)} className="p-1.5 rounded hover:bg-white/10 text-red-500" title="Cancelar"><XCircle size={18} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCreationHome = () => {
        // Columns config: Inbox, Todo, InProgress, Done (Cancel hidden or specific section)
        const columns = [Status.INBOX, Status.TODO, Status.IN_PROGRESS, Status.DONE];

        // Filter tasks
        const filteredTasks = creationTasks.filter(t => {
            const contextMatch = taskContextFilter === 'ALL' || t.context === taskContextFilter;
            const priorityMatch = taskPriorityFilter === 'ALL' || t.priority === taskPriorityFilter;
            return contextMatch && priorityMatch;
        });

        return (
            <div className="space-y-6 animate-in fade-in duration-500 pb-20 h-full flex flex-col">
                {/* Header & Controls */}
                <div className="flex justify-between items-end flex-shrink-0">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Tarefas <span className="text-sm font-normal text-gray-500 ml-2">(Modo Criação)</span></h2>
                        <p className="text-gray-400 mt-1">Execução e controle diário</p>
                    </div>
                    <div className="flex gap-2">
                        <NeonButton onClick={() => handleOpenModal('task-template')} variant="secondary" className="border-dashed border-white/20 text-gray-400 hover:text-white">
                            <FileCode size={16} /> Novo Modelo
                        </NeonButton>
                        <NeonButton onClick={() => handleOpenModal('ai-task-import')} variant="secondary">
                            <Sparkles size={16} /> Importar de IA
                        </NeonButton>
                        <NeonButton onClick={() => handleOpenModal('creation-task')}>Nova Tarefa</NeonButton>
                    </div>
                </div>

                {/* Toolbar: Filters */}
                <div className="flex gap-4 p-4 bg-[#1a1a1c] border border-white/5 rounded-xl items-center flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mr-2">
                        <Filter size={16} /> Filtros:
                    </div>

                    <select
                        className="bg-black/20 text-gray-300 text-sm p-2 rounded-lg border border-white/10 outline-none focus:border-blue-500/50"
                        value={taskContextFilter}
                        onChange={(e) => setTaskContextFilter(e.target.value)}
                    >
                        <option value="ALL">Todos Contextos</option>
                        {Object.values(CreationContext).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                        className="bg-black/20 text-gray-300 text-sm p-2 rounded-lg border border-white/10 outline-none focus:border-blue-500/50"
                        value={taskPriorityFilter}
                        onChange={(e) => setTaskPriorityFilter(e.target.value)}
                    >
                        <option value="ALL">Todas Prioridades</option>
                        {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                {/* Board View */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="flex gap-4 h-full min-w-[1000px]">
                        {columns.map(status => {
                            const statusTasks = filteredTasks.filter(t => t.status === status);

                            let colColor = 'border-gray-700/30';
                            if (status === Status.INBOX) colColor = 'border-purple-500/20';
                            if (status === Status.TODO) colColor = 'border-blue-500/20';
                            if (status === Status.IN_PROGRESS) colColor = 'border-yellow-500/20';
                            if (status === Status.DONE) colColor = 'border-green-500/20';

                            return (
                                <div key={status} className={`flex-1 min-w-[280px] flex flex-col bg-[#161329]/30 rounded-xl border ${colColor} h-full`}>
                                    <div className="p-3 border-b border-white/5 font-semibold text-gray-200 flex justify-between sticky top-0 bg-[#161329]/80 backdrop-blur-sm rounded-t-xl z-10">
                                        {status}
                                        <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-gray-400">{statusTasks.length}</span>
                                    </div>

                                    <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar flex-1">
                                        {statusTasks.length === 0 ? (
                                            <div className="text-center py-10 text-gray-600 text-xs italic border-2 border-dashed border-white/5 rounded-lg">
                                                Vazio
                                            </div>
                                        ) : (
                                            statusTasks.map(task => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    onToggleStatus={(id) => {
                                                        // Custom logic for Kanban: Done -> Todo, else -> Done
                                                        setCreationTasks(prev => prev.map(t =>
                                                            t.id === id ? { ...t, status: t.status === Status.DONE ? Status.TODO : Status.DONE } : t
                                                        ));
                                                    }}
                                                    onDelete={(id) => handleDelete(id, 'creation-task')}
                                                    onEdit={(t) => handleOpenModal('creation-task', t)}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderGeneralHome = () => {
        // Also include visible creation tasks here
        const visibleCreationTasks = creationTasks.filter(t => t.visibleOnGeneralHome);
        const combinedTasks = [...tasks, ...visibleCreationTasks];

        return (
            <div className="space-y-8 animate-in fade-in duration-500 pb-20">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1d1b4b] to-[#161329] border border-white/5 relative overflow-hidden group min-h-[200px] flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-32 bg-[#03a9f4] opacity-5 blur-[80px] rounded-full group-hover:opacity-10 transition-opacity"></div>
                    <h2 className="text-3xl font-bold mb-2">Visão Geral</h2>
                    <p className="text-gray-400 max-w-xl">
                        Dashboard principal. Visualize todas as tarefas gerais aqui.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-2 border-dashed border-white/5 rounded-2xl p-8 min-h-[300px] items-start justify-center text-center">
                    {combinedTasks.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center text-gray-500 mt-20">
                            <Layers className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Conteúdo Vazio</p>
                            <div className="mt-6">
                                <NeonButton onClick={() => handleOpenModal('task')}>
                                    <Plus size={16} />
                                    <span className="ml-2">Adicionar Item</span>
                                </NeonButton>
                            </div>
                        </div>
                    ) : (
                        combinedTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggleStatus={(id) => {
                                    // Check if it's a creation task or regular task
                                    if (creationTasks.find(ct => ct.id === id)) {
                                        setCreationTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === Status.DONE ? Status.TODO : Status.DONE } : t));
                                    } else {
                                        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === Status.DONE ? Status.TODO : Status.DONE } : t));
                                    }
                                }}
                                onDelete={(id) => {
                                    if (creationTasks.find(ct => ct.id === id)) {
                                        handleDelete(id, 'creation-task');
                                    } else {
                                        handleDelete(id, 'task');
                                    }
                                }}
                                onEdit={(t) => {
                                    if (creationTasks.find(ct => ct.id === t.id)) {
                                        handleOpenModal('creation-task', t);
                                    } else {
                                        handleOpenModal('task', t);
                                    }
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
        );
    };

    const renderExamplePage = () => {
        // ... (No changes here)
        return (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="w-full h-64 border border-white/10 rounded-2xl bg-[#1a1a1c]/50 flex items-center justify-center mb-6">
                    <span className="text-gray-600 font-mono text-sm">Header / Banner Area</span>
                </div>
                <div className="grid grid-cols-3 gap-6 flex-1">
                    <div className="col-span-2 border border-white/10 rounded-2xl bg-[#1a1a1c]/50 flex items-center justify-center">
                        <span className="text-gray-600 font-mono text-sm">Main Content Area</span>
                    </div>
                    <div className="col-span-1 border border-white/10 rounded-2xl bg-[#1a1a1c]/50 flex items-center justify-center">
                        <span className="text-gray-600 font-mono text-sm">Sidebar / Widgets</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#0f0f10]">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-64 w-full h-full bg-grid-pattern opacity-[0.03]"></div>
                <div className="absolute -top-[200px] left-[200px] w-[500px] h-[500px] bg-[#cf30aa] rounded-full blur-[150px] opacity-[0.08]"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#03a9f4] rounded-full blur-[180px] opacity-[0.05]"></div>
            </div>

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'home' && renderGeneralHome()}
                    {activeTab === 'creation-ideas' && renderCreationIdeas()}
                    {activeTab === 'creation-planning' && renderCreationPlanning()}
                    {activeTab === 'creation-home' && renderCreationHome()}
                    {activeTab === 'example' && renderExamplePage()}
                </div>
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingItem}
                type={modalType}
                availableTemplates={templates}
                availableTaskTemplates={taskTemplates}
            />
        </div>
    );
}
