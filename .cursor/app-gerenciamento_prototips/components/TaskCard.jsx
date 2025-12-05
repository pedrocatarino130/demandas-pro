import React from 'react';
import { Clock, Edit2, Trash2, User, Calendar, List, Eye } from 'lucide-react';
import { Priority, Status } from '../types';
import { NeonCheckbox } from './NeonCheckbox';

const getPriorityColor = (p) => {
    switch (p) {
        case Priority.HIGH: return 'text-red-400 bg-red-400/10 border-red-400/20';
        case Priority.MEDIUM: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        case Priority.LOW: return 'text-green-400 bg-green-400/10 border-green-400/20';
        default: return 'text-gray-400';
    }
};

export const TaskCard = ({ task, onToggleStatus, onDelete, onEdit }) => {
    const isDone = task.status === Status.DONE;

    // Calculate checklist progress if available
    const totalChecklist = task.checklist ? task.checklist.length : 0;
    const doneChecklist = task.checklist ? task.checklist.filter(i => i.done).length : 0;

    return (
        <div className="group relative w-full rounded-2xl border border-white/5 bg-[#1a1a1c] shadow-lg overflow-hidden hover:border-white/10 transition-all duration-300">

            {/* Top Graphic Area */}
            <div className={`h-28 w-full flex flex-col items-center justify-center bg-gradient-to-br ${isDone ? 'from-green-900/20 to-emerald-900/10' : 'from-[#1c1c20] to-[#0f0f10]'} relative overflow-hidden`}>
                {/* Decorative Background Grid */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>

                {/* Main Icon */}
                <div className={`relative z-10 p-4 rounded-full ${isDone ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-500'}`}>
                    {isDone ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    )}
                </div>

                {/* Status Badge Top Right */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border font-bold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </span>
                    {task.visibleOnGeneralHome && (
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-1 rounded-full" title="Visível no Home Geral">
                            <Eye size={10} />
                        </span>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold text-gray-100 truncate ${isDone ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                            {task.description || "Sem descrição"}
                        </p>
                    </div>
                    <div className="flex-shrink-0 pt-1">
                        <NeonCheckbox checked={isDone} onChange={() => onToggleStatus(task.id)} />
                    </div>
                </div>

                {/* Checklist Indicator */}
                {totalChecklist > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(doneChecklist / totalChecklist) * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                            <List size={10} /> {doneChecklist}/{totalChecklist}
                        </span>
                    </div>
                )}

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {task.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5 hover:border-[#cf30aa]/50 hover:text-[#cf30aa] transition-colors">
                            #{tag.trim()}
                        </span>
                    ))}
                </div>

                {/* Meta Info */}
                <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        {task.assignee && (
                            <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span className="max-w-[80px] truncate">{task.assignee}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                            className="p-1.5 hover:bg-white/10 rounded-md text-blue-400 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                            className="p-1.5 hover:bg-white/10 rounded-md text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
