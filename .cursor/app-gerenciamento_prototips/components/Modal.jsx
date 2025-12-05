import React, { useEffect, useState, useRef } from 'react';
import { X, Save, Plus, Trash2, Bot, Check, Copy, Download, ChevronDown, ChevronUp, AlertCircle, Link as LinkIcon, Paperclip, Upload, FileText, Mic, Info, List, Eye, Sparkles, FileCode } from 'lucide-react';
import { Priority, Status, CreationContext, IdeaStage, PlanningStatus } from '../types';
import { NeonButton } from './NeonButton';
import { NeonCheckbox } from './NeonCheckbox';

export const Modal = ({ isOpen, onClose, onSave, initialData, type = 'task', availableTemplates = [], availableTaskTemplates = [] }) => {
    // Generic state container
    const [formData, setFormData] = useState({});
    const [tagInput, setTagInput] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    // Injection State
    const [showInjection, setShowInjection] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [injectionError, setInjectionError] = useState('');

    // Checklist State
    const [checklistItemInput, setChecklistItemInput] = useState('');

    // Attachment State
    const [attachmentInput, setAttachmentInput] = useState('');
    const fileInputRef = useRef(null);

    // AI Import State
    const [aiImportText, setAiImportText] = useState('');
    const [selectedTaskTemplateId, setSelectedTaskTemplateId] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({ ...initialData });
                setTagInput(initialData.tags ? initialData.tags.join(', ') : '');
            } else {
                // Initialize based on type
                initializeForm(type);
            }
            // Reset generic UI states
            setShowInjection(false);
            setJsonInput('');
            setInjectionError('');
            setAttachmentInput('');
            setChecklistItemInput('');
            setAiImportText('');
            setSelectedTaskTemplateId('');
        }
    }, [isOpen, initialData, type]);

    // Scoring Logic Effect
    useEffect(() => {
        if (type === 'idea') {
            const impact = parseFloat(formData.impact) || 1;
            const effort = parseFloat(formData.effort) || 1;
            const score = (impact / effort).toFixed(1);

            // Only update if it actually changed to avoid infinite loops
            if (formData.score !== score) {
                setFormData(prev => ({ ...prev, score }));
            }
        }
    }, [formData.impact, formData.effort, type]);

    const initializeForm = (modalType) => {
        const base = { title: '', tags: [], attachments: [] };
        switch (modalType) {
            case 'task':
            case 'creation-task':
                setFormData({
                    ...base,
                    description: '',
                    priority: Priority.MEDIUM,
                    status: Status.INBOX, // Default to Inbox for creation tasks
                    dueDate: new Date().toISOString().split('T')[0],
                    assignee: '',
                    context: CreationContext.DEV,
                    checklist: [],
                    visibleOnGeneralHome: false
                });
                break;
            case 'idea':
                setFormData({
                    ...base,
                    description: '',
                    context: CreationContext.DEV,
                    stage: IdeaStage.INBOX,
                    impact: 3,
                    effort: 3,
                    score: '1.0',
                    source: ''
                });
                break;
            case 'planning':
                setFormData({
                    ...base,
                    descriptionOrObjective: '',
                    deadline: new Date().toISOString().split('T')[0],
                    currentStep: 1,
                    status: PlanningStatus.ACTIVE,
                    templateUsedId: availableTemplates.length > 0 ? availableTemplates[0].id : ''
                });
                break;
            case 'template':
                setFormData({
                    name: '',
                    description: '',
                    context: CreationContext.DEV,
                    steps: [
                        { order: 1, name: 'Etapa 1', emoji: '1️⃣', guide: 'Descrição da etapa' },
                        { order: 2, name: 'Etapa 2', emoji: '2️⃣', guide: 'Descrição da etapa' }
                    ]
                });
                break;
            case 'task-template':
                setFormData({
                    name: '',
                    context: CreationContext.DEV,
                    aiPrompt: 'Gere uma lista de tarefas para [OBJETIVO] com o seguinte formato:\n- [Tarefa 1]\n- [Tarefa 2]'
                });
                break;
            case 'ai-task-import':
                setFormData({});
                break;
        }
        setTagInput('');
    };

    const handleAddStep = () => {
        const currentSteps = formData.steps || [];
        const newStep = {
            order: currentSteps.length + 1,
            name: '',
            emoji: '📝',
            guide: ''
        };
        setFormData({ ...formData, steps: [...currentSteps, newStep] });
    };

    const handleUpdateStep = (index, field, value) => {
        const newSteps = [...(formData.steps || [])];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setFormData({ ...formData, steps: newSteps });
    };

    const handleRemoveStep = (index) => {
        const newSteps = [...(formData.steps || [])].filter((_, i) => i !== index);
        const reordered = newSteps.map((step, i) => ({ ...step, order: i + 1 }));
        setFormData({ ...formData, steps: reordered });
    };

    const handleAddAttachment = () => {
        if (!attachmentInput.trim()) return;
        const currentAttachments = formData.attachments || [];
        setFormData({ ...formData, attachments: [...currentAttachments, attachmentInput.trim()] });
        setAttachmentInput('');
    };

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const currentAttachments = formData.attachments || [];
            setFormData({ ...formData, attachments: [...currentAttachments, file.name] });
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRecordAudio = () => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `Audio-Note-${timestamp.slice(0, 19)}.mp3`;
        const currentAttachments = formData.attachments || [];
        setFormData({ ...formData, attachments: [...currentAttachments, filename] });
    };

    const handleRemoveAttachment = (index) => {
        const currentAttachments = formData.attachments || [];
        setFormData({ ...formData, attachments: currentAttachments.filter((_, i) => i !== index) });
    };

    // --- Checklist Handlers ---
    const handleAddChecklistItem = () => {
        if (!checklistItemInput.trim()) return;
        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            text: checklistItemInput.trim(),
            done: false
        };
        setFormData({ ...formData, checklist: [...(formData.checklist || []), newItem] });
        setChecklistItemInput('');
    };

    const handleToggleChecklistItem = (itemId) => {
        const updatedChecklist = (formData.checklist || []).map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
        );
        setFormData({ ...formData, checklist: updatedChecklist });
    };

    const handleRemoveChecklistItem = (itemId) => {
        setFormData({ ...formData, checklist: (formData.checklist || []).filter((item) => item.id !== itemId) });
    };

    // --- AI HELPERS ---

    const handleCopyPrompt = (promptType, customText) => {
        let promptText = '';

        if (promptType === 'custom-task' && customText) {
            promptText = customText;
        } else if (promptType === 'template') {
            promptText = `Aja como um Arquiteto de Processos Sênior. Eu preciso criar um Template de Método JSON...`;
        } else {
            promptText = `Aja como um Gerente de Projetos. Eu tenho o seguinte objetivo: ...`;
        }

        navigator.clipboard.writeText(promptText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleInjectJson = () => {
        setInjectionError('');
        try {
            const parsed = JSON.parse(jsonInput);

            if (type === 'planning') {
                if (!parsed.title || !parsed.descriptionOrObjective) throw new Error("JSON deve conter 'title' e 'descriptionOrObjective'");
                setFormData(prev => ({
                    ...prev,
                    title: parsed.title,
                    descriptionOrObjective: parsed.descriptionOrObjective,
                    deadline: parsed.deadline || prev.deadline,
                }));
                if (parsed.tags && Array.isArray(parsed.tags)) setTagInput(parsed.tags.join(', '));
                setShowInjection(false);
                setJsonInput('');
            } else if (type === 'template') {
                if (!parsed.name || !Array.isArray(parsed.steps)) throw new Error("JSON deve conter 'name' e array de 'steps'");
                setFormData(prev => ({
                    ...prev,
                    name: parsed.name,
                    description: parsed.description || prev.description,
                    context: parsed.context || prev.context,
                    steps: parsed.steps
                }));
                setShowInjection(false);
                setJsonInput('');
            }
        } catch (e) {
            setInjectionError('Erro ao ler JSON: ' + e.message);
        }
    };

    const handleAiImport = () => {
        // Simple parser: assumes each non-empty line is a task title
        const lines = aiImportText.split('\n').filter(line => line.trim().length > 0);
        const tasks = lines.map(line => {
            // remove leading numbers or bullets (e.g., "1. Task" or "- Task")
            const cleanTitle = line.replace(/^[\d\.\-\*]+\s*/, '');
            return {
                id: Math.random().toString(36).substr(2, 9),
                title: cleanTitle,
                status: Status.INBOX,
                priority: Priority.MEDIUM,
                context: CreationContext.DEV,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: ['Importado-IA'],
                checklist: [],
                attachments: [],
                visibleOnGeneralHome: false
            };
        });

        onSave(tasks); // Pass array of tasks
        onClose();
    };

    // ---

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'ai-task-import') return; // Handled separately

        const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
        const finalData = type === 'template' || type === 'task-template' ? { ...formData, title: formData.name } : { ...formData, tags };

        if (type === 'idea') {
            finalData.impact = parseFloat(finalData.impact);
            finalData.effort = parseFloat(finalData.effort);
            finalData.score = parseFloat(finalData.score);
        }

        onSave(finalData);
        onClose();
    };

    const inputClass = "w-full p-3 bg-[#3a3a3a] text-white rounded-xl border border-transparent focus:border-white outline-none transition-all placeholder-gray-500 text-sm";
    const labelClass = "block text-xs font-semibold text-gray-400 mb-1.5 ml-1";

    const renderAttachments = () => (
        <div className="mt-4">
            <label className={labelClass}>Recursos & Arquivos</label>
            <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        className={`${inputClass} pl-9`}
                        placeholder="Cole um link ou adicione arquivo..."
                        value={attachmentInput}
                        onChange={(e) => setAttachmentInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddAttachment();
                            }
                        }}
                    />
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-gray-300"
                    title="Anexar arquivo"
                >
                    <Upload size={18} />
                </button>

                <button
                    type="button"
                    onClick={handleRecordAudio}
                    className="px-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-red-400"
                    title="Gravar Áudio (Simulado)"
                >
                    <Mic size={18} />
                </button>

                <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="px-3 bg-[#03a9f4]/10 border border-[#03a9f4]/30 rounded-xl hover:bg-[#03a9f4]/20 transition-all text-[#03a9f4]"
                    title="Adicionar Link (Texto)"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Attachment List */}
            <div className="flex flex-wrap gap-2">
                {(formData.attachments || []).map((att, idx) => {
                    const isLink = att.match(/^https?:\/\//) || att.match(/^www\./);
                    const isAudio = att.endsWith('.mp3') || att.endsWith('.wav');
                    return (
                        <div key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg group animate-in zoom-in duration-200 border ${isLink ? 'bg-[#1a1a1c] border-blue-500/20' : 'bg-[#1a1a1c] border-white/10'}`}>
                            {isLink ? <LinkIcon size={12} className="text-blue-400" /> : isAudio ? <Mic size={12} className="text-red-400" /> : <FileText size={12} className="text-yellow-400" />}
                            <span className={`text-xs max-w-[200px] truncate ${isLink ? 'text-blue-300' : 'text-gray-300'}`}>{att}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveAttachment(idx)}
                                className="text-gray-600 hover:text-red-400 ml-1 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderChecklist = () => (
        <div className="mt-4">
            <label className={labelClass}>Checklist</label>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    className={inputClass}
                    placeholder="Adicionar item..."
                    value={checklistItemInput}
                    onChange={(e) => setChecklistItemInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); handleAddChecklistItem(); }
                    }}
                />
                <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="px-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white"
                >
                    <Plus size={18} />
                </button>
            </div>

            <div className="space-y-1 max-h-[150px] overflow-y-auto custom-scrollbar">
                {(formData.checklist || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded bg-black/20 hover:bg-black/30 group">
                        <NeonCheckbox checked={item.done} onChange={() => handleToggleChecklistItem(item.id)} />
                        <span className={`text-sm flex-1 ${item.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{item.text}</span>
                        <button type="button" onClick={() => handleRemoveChecklistItem(item.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderFields = () => {
        switch (type) {
            case 'task-template':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Contexto</label>
                            <select className={inputClass} value={formData.context} onChange={e => setFormData({ ...formData, context: e.target.value })}>
                                {Object.values(CreationContext).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Prompt para IA</label>
                            <p className="text-[10px] text-gray-500 mb-1">Defina o texto que será copiado para o ChatGPT/Claude.</p>
                            <textarea
                                rows={8}
                                className={`${inputClass} font-mono text-xs text-green-400/80 resize-none border border-green-500/20 focus:border-green-500/50`}
                                value={formData.aiPrompt}
                                onChange={e => setFormData({ ...formData, aiPrompt: e.target.value })}
                            />
                        </div>
                    </div>
                );

            case 'ai-task-import':
                return (
                    <div className="space-y-4">

                        {/* Template Selector */}
                        {availableTaskTemplates.length > 0 && (
                            <div className="bg-[#1a1a1c] p-3 rounded-xl border border-white/5 mb-4">
                                <label className={labelClass}>Usar Template (Prompt)</label>
                                <div className="flex gap-2">
                                    <select
                                        className={`${inputClass} flex-1`}
                                        value={selectedTaskTemplateId}
                                        onChange={(e) => setSelectedTaskTemplateId(e.target.value)}
                                    >
                                        <option value="">-- Selecione um Modelo --</option>
                                        {availableTaskTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>

                                    <button
                                        type="button"
                                        disabled={!selectedTaskTemplateId}
                                        onClick={() => {
                                            const tmpl = availableTaskTemplates.find(t => t.id === selectedTaskTemplateId);
                                            if (tmpl) handleCopyPrompt('custom-task', tmpl.aiPrompt);
                                        }}
                                        className={`px-3 rounded-xl border flex items-center gap-2 transition-all ${selectedTaskTemplateId ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' : 'bg-gray-700/20 border-gray-600 text-gray-500 cursor-not-allowed'}`}
                                        title="Copiar Prompt"
                                    >
                                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                {selectedTaskTemplateId && (
                                    <div className="mt-2 p-2 bg-black/40 rounded border border-white/5 max-h-20 overflow-y-auto custom-scrollbar">
                                        <pre className="text-[10px] text-gray-500 whitespace-pre-wrap font-mono">
                                            {availableTaskTemplates.find(t => t.id === selectedTaskTemplateId)?.aiPrompt}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-[#1a1a1c] p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2 text-pink-400">
                                <Sparkles size={18} />
                                <span className="font-bold text-sm">Parser Inteligente de Tarefas</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">
                                Cole uma lista de tarefas gerada por IA (ChatGPT, Claude, etc). O sistema identificará cada linha como uma nova tarefa.
                            </p>
                            <textarea
                                className="w-full h-48 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-600 focus:border-pink-500/50 outline-none resize-none"
                                placeholder={"1. Pesquisar referências\n2. Criar esboço\n3. Revisar com a equipe..."}
                                value={aiImportText}
                                onChange={(e) => setAiImportText(e.target.value)}
                            />
                        </div>
                    </div>
                );

            case 'idea':
                // ... (No changes here, keeping existing)
                return (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Status (Pipeline)</label>
                                <select
                                    className={inputClass}
                                    value={formData.stage}
                                    onChange={e => setFormData({ ...formData, stage: e.target.value })}
                                >
                                    {Object.values(IdeaStage).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Contexto</label>
                                <select
                                    className={inputClass}
                                    value={formData.context}
                                    onChange={e => setFormData({ ...formData, context: e.target.value })}
                                >
                                    {Object.values(CreationContext).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Scoring Section */}
                        <div className="bg-black/20 border border-white/5 rounded-xl p-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                    <Info size={12} /> Sistema de Scoring
                                </span>
                                <div className="text-xs font-mono">
                                    Score: <span className={`font-bold ${parseFloat(formData.score) >= 3 ? 'text-green-400' : 'text-gray-400'}`}>{formData.score}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 mb-1 block flex justify-between">
                                        Impacto (1-5) <span>{formData.impact}</span>
                                    </label>
                                    <input
                                        type="range" min="1" max="5" step="0.5"
                                        className="w-full accent-[#03a9f4] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        value={formData.impact}
                                        onChange={e => setFormData({ ...formData, impact: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 mb-1 block flex justify-between">
                                        Esforço (1-5) <span>{formData.effort}</span>
                                    </label>
                                    <input
                                        type="range" min="1" max="5" step="0.5"
                                        className="w-full accent-red-400 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        value={formData.effort}
                                        onChange={e => setFormData({ ...formData, effort: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Fonte / Inspiração</label>
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="Ex: Livro X, Conversa com Fulano..."
                                value={formData.source}
                                onChange={e => setFormData({ ...formData, source: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Descrição Detalhada</label>
                            <textarea rows={4} className={`${inputClass} resize-none`} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        {renderAttachments()}
                    </>
                );
            case 'planning':
                // ... (Planning code kept same)
                return (
                    <>
                        {/* AI Injection Section for Planning */}
                        <div className="bg-[#1a1a1c] border border-dashed border-blue-500/30 p-3 rounded-xl mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <div className="text-xs font-semibold text-blue-300 flex items-center gap-1.5 mb-0.5">
                                        <Bot size={14} />
                                        Assistente de Planejamento
                                    </div>
                                    {!showInjection && <p className="text-[10px] text-gray-500">Gere o conteúdo com IA e preencha automaticamente.</p>}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCopyPrompt('planning')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${isCopied ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20'}`}
                                    >
                                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                        {isCopied ? 'Copiado!' : 'Prompt'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowInjection(!showInjection)}
                                        className="px-2 py-1.5 rounded-lg text-xs font-medium bg-gray-700/50 text-gray-300 hover:bg-gray-600 border border-transparent hover:border-gray-500 transition-all flex items-center gap-1"
                                    >
                                        <Download size={12} />
                                        {showInjection ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                </div>
                            </div>

                            {showInjection && (
                                <div className="mt-3 pt-3 border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
                                    <textarea
                                        className="w-full h-24 p-2 bg-black/40 rounded-lg text-xs font-mono text-green-400 placeholder-green-900/50 border border-white/5 focus:border-green-500/50 outline-none resize-none mb-2"
                                        placeholder='Cole o JSON aqui... Ex: { "title": "...", "descriptionOrObjective": "..." }'
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-red-400 flex items-center gap-1">
                                            {injectionError && <><AlertCircle size={10} /> {injectionError}</>}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleInjectJson}
                                            disabled={!jsonInput.trim()}
                                            className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Preencher Formulário
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!initialData && (
                            <div>
                                <label className={labelClass}>Template de Método</label>
                                <select
                                    className={inputClass}
                                    value={formData.templateUsedId}
                                    onChange={e => setFormData({ ...formData, templateUsedId: e.target.value })}
                                >
                                    {availableTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <p className="text-[10px] text-gray-500 mt-1 ml-1">O método define as etapas do planejamento.</p>
                            </div>
                        )}
                        <div>
                            <label className={labelClass}>Título do Planejamento</label>
                            <input
                                type="text"
                                className={inputClass}
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ex: Lançamento do Site v2"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Objetivo / Descrição</label>
                            <textarea rows={3} className={`${inputClass} resize-none`} value={formData.descriptionOrObjective} onChange={e => setFormData({ ...formData, descriptionOrObjective: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Prazo Estimado</label>
                                <input type="date" className={inputClass} value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClass}>Status</label>
                                <select
                                    className={inputClass}
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    {Object.values(PlanningStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        {renderAttachments()}
                    </>
                );
            case 'template':
                // ... (Template code kept same)
                return (
                    <>
                        <div className="bg-[#1a1a1c] border border-dashed border-purple-500/30 p-3 rounded-xl mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <div className="text-xs font-semibold text-purple-300 flex items-center gap-1.5 mb-0.5">
                                        <Bot size={14} />
                                        Assistente de Estrutura
                                    </div>
                                    {!showInjection && <p className="text-[10px] text-gray-500 leading-tight">Copie o prompt e use no ChatGPT/Gemini.</p>}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCopyPrompt('template')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${isCopied ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20'}`}
                                    >
                                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                        {isCopied ? 'Copiado!' : 'Prompt'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowInjection(!showInjection)}
                                        className="px-2 py-1.5 rounded-lg text-xs font-medium bg-gray-700/50 text-gray-300 hover:bg-gray-600 border border-transparent hover:border-gray-500 transition-all flex items-center gap-1"
                                    >
                                        <Download size={12} />
                                        {showInjection ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                </div>
                            </div>

                            {showInjection && (
                                <div className="mt-3 pt-3 border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
                                    <textarea
                                        className="w-full h-40 p-2 bg-black/40 rounded-lg text-xs font-mono text-purple-400 placeholder-purple-900/50 border border-white/5 focus:border-purple-500/50 outline-none resize-none mb-2"
                                        placeholder='Cole o JSON aqui... Ex: { "name": "...", "steps": [...] }'
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-red-400 flex items-center gap-1">
                                            {injectionError && <><AlertCircle size={10} /> {injectionError}</>}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleInjectJson}
                                            disabled={!jsonInput.trim()}
                                            className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Preencher Estrutura
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Descrição do Método</label>
                            <textarea rows={2} className={`${inputClass} resize-none`} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Contexto Sugerido</label>
                            <select className={inputClass} value={formData.context} onChange={e => setFormData({ ...formData, context: e.target.value })}>
                                {Object.values(CreationContext).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="pt-2 border-t border-white/10 mt-2">
                            <div className="flex justify-between items-center mb-2">
                                <label className={labelClass}>Etapas do Método</label>
                                <button type="button" onClick={handleAddStep} className="text-xs flex items-center gap-1 text-[#03a9f4] hover:text-white transition-colors">
                                    <Plus size={12} /> Adicionar Etapa
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                                {(formData.steps || []).map((step, idx) => (
                                    <div key={idx} className="flex gap-2 items-start bg-black/20 p-2 rounded-lg border border-white/5">
                                        <div className="flex flex-col gap-2 w-12">
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-b border-white/10 text-center text-xl outline-none"
                                                value={step.emoji}
                                                onChange={(e) => handleUpdateStep(idx, 'emoji', e.target.value)}
                                                placeholder="Emoji"
                                            />
                                            <span className="text-[10px] text-gray-500 text-center">#{step.order}</span>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-b border-white/10 text-sm outline-none placeholder-gray-600"
                                                value={step.name}
                                                onChange={(e) => handleUpdateStep(idx, 'name', e.target.value)}
                                                placeholder="Nome da etapa"
                                            />
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-b border-white/10 text-xs outline-none text-gray-400 placeholder-gray-700"
                                                value={step.guide}
                                                onChange={(e) => handleUpdateStep(idx, 'guide', e.target.value)}
                                                placeholder="O que fazer nesta etapa?"
                                            />
                                        </div>
                                        <button type="button" onClick={() => handleRemoveStep(idx)} className="text-gray-600 hover:text-red-400 pt-1">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {(formData.steps || []).length === 0 && (
                                    <div className="text-center text-xs text-gray-600 py-4 border border-dashed border-white/10 rounded-lg">
                                        Nenhuma etapa definida
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                );
            default: // Task and CreationTask
                return (
                    <>
                        <div>
                            <label className={labelClass}>Título</label>
                            <input
                                type="text"
                                required
                                className={`${inputClass} ring-1 ring-[#03a9f4]/50 focus:ring-[#03a9f4] bg-[#03a9f4]/5 mb-3`}
                                placeholder="Nome da tarefa..."
                                value={formData.title || ''}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Descrição</label>
                            <textarea rows={3} className={`${inputClass} resize-none`} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Status</label>
                                <select className={inputClass} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Prioridade</label>
                                <select className={inputClass} value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className={labelClass}>Data</label>
                                <input type="date" className={inputClass} value={formData.dueDate || formData.deadline} onChange={e => setFormData({ ...formData, [type === 'creation-task' ? 'deadline' : 'dueDate']: e.target.value })} />
                            </div>
                            {type === 'creation-task' && (
                                <div>
                                    <label className={labelClass}>Contexto</label>
                                    <select className={inputClass} value={formData.context} onChange={e => setFormData({ ...formData, context: e.target.value })}>
                                        {Object.values(CreationContext).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Extended Options for Creation Task */}
                        {type === 'creation-task' && (
                            <div className="bg-black/20 p-3 rounded-xl mt-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <NeonCheckbox checked={formData.visibleOnGeneralHome} onChange={() => setFormData({ ...formData, visibleOnGeneralHome: !formData.visibleOnGeneralHome })} />
                                    <span className="text-xs text-gray-300 flex items-center gap-1">Visível no Home Geral <Eye size={12} className="text-gray-500" /></span>
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/5">
                                    {renderChecklist()}
                                </div>
                            </div>
                        )}

                        {renderAttachments()}
                    </>
                );
        }
    };

    const getTitle = () => {
        if (type === 'ai-task-import') return 'Importar de IA';
        if (type === 'task-template') return 'Modelo de Tarefa (Prompt)';
        const action = initialData ? 'Editar' : 'Criar';
        switch (type) {
            case 'idea': return `${action} Ideia`;
            case 'planning': return `${action} Planejamento`;
            case 'template': return `${action} Template`;
            default: return `${action} Tarefa`;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#272727] rounded-[24px] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 animate-in fade-in zoom-in duration-200">
                <div className="absolute inset-[-50px] z-[-2] bg-[conic-gradient(from_45deg,transparent_75%,#fff,transparent_100%)] animate-[spin_4s_linear_infinite] opacity-20"></div>
                <div className="absolute inset-[1px] bg-[#272727] rounded-[24px] z-[-1]"></div>

                <div className="p-8 relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            {getTitle()}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Special header for normal tasks only (Title handled inside renderFields for generic to allow custom order) */}
                        {type !== 'creation-task' && type !== 'task' && type !== 'ai-task-import' && type !== 'task-template' && (
                            <div>
                                <label className={labelClass}>{type === 'template' ? 'Nome do Template *' : 'Título *'}</label>
                                <input
                                    type="text"
                                    required
                                    className={`${inputClass} ring-1 ring-[#03a9f4]/50 focus:ring-[#03a9f4] bg-[#03a9f4]/5`}
                                    placeholder="Nome do item..."
                                    value={type === 'template' ? (formData.name || formData.title || '') : (formData.title || '')}
                                    onChange={e => type === 'template' ? setFormData({ ...formData, name: e.target.value }) : setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                        )}

                        {/* Special header for task template name */}
                        {type === 'task-template' && (
                            <div>
                                <label className={labelClass}>Nome do Modelo *</label>
                                <input
                                    type="text"
                                    required
                                    className={`${inputClass} ring-1 ring-[#03a9f4]/50 focus:ring-[#03a9f4] bg-[#03a9f4]/5`}
                                    placeholder="Ex: Checklist de Lançamento..."
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        )}

                        {renderFields()}

                        {type !== 'template' && type !== 'ai-task-import' && type !== 'task-template' && (
                            <div>
                                <label className={labelClass}>Tags (separadas por vírgula)</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="tag1, tag2"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-transparent border border-gray-600 text-gray-300 font-medium hover:bg-gray-800 transition-colors">
                                Cancelar
                            </button>
                            <div className="flex-1">
                                {type === 'ai-task-import' ? (
                                    <NeonButton type="button" onClick={handleAiImport} className="w-full">
                                        <Sparkles size={18} />
                                        <span>Gerar Tarefas</span>
                                    </NeonButton>
                                ) : (
                                    <NeonButton type="submit" className="w-full">
                                        <Save size={18} />
                                        <span>Salvar</span>
                                    </NeonButton>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
