import React, { useState } from 'react';
import { Home, Layout, Settings, LogOut, Zap, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
    const [isCreationOpen, setIsCreationOpen] = useState(true);

    // Helper to check if a sub-tab is active
    const isCreationActive = ['creation-ideas', 'creation-planning', 'creation-home'].includes(activeTab);

    return (
        <div className="w-64 h-full bg-[#161329] border-r border-white/5 flex flex-col relative z-20 shadow-2xl overflow-y-auto custom-scrollbar">
            {/* Logo Area */}
            <div className="p-8 pb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f441a5] to-[#03a9f4] flex items-center justify-center">
                            <Zap className="text-white w-5 h-5 fill-white" />
                        </div>
                        <div className="absolute -inset-2 bg-[#f441a5] opacity-20 blur-lg rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">Prototipagem</h1>
                        <p className="text-xs text-gray-500 font-medium">Design System</p>
                    </div>
                </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-6 mb-6 flex-shrink-0"></div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {/* General Home */}
                <button
                    onClick={() => setActiveTab('home')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === 'home'
                            ? 'bg-white/5 text-white shadow-[0_0_20px_rgba(3,169,244,0.1)]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {activeTab === 'home' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#03a9f4] shadow-[0_0_10px_#03a9f4]"></div>
                    )}
                    <Home size={20} className={`transition-colors duration-300 ${activeTab === 'home' ? 'text-[#03a9f4]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    <span className="font-medium">Início Geral</span>
                </button>

                {/* Creation Module Group */}
                <div className="pt-2">
                    <button
                        onClick={() => setIsCreationOpen(!isCreationOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5 ${isCreationActive ? 'text-white' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <Lightbulb size={20} className={isCreationActive ? 'text-[#f441a5]' : 'text-gray-500'} />
                            <span className="font-medium">Criação</span>
                        </div>
                        {isCreationOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {/* Sub-menu */}
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isCreationOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>

                        {/* Planejamento */}
                        <button
                            onClick={() => setActiveTab('creation-planning')}
                            className={`w-full flex items-center gap-3 pl-11 pr-4 py-2 text-sm rounded-lg transition-all ${activeTab === 'creation-planning' ? 'text-[#f441a5] bg-white/5' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'creation-planning' ? 'bg-[#f441a5] shadow-[0_0_5px_#f441a5]' : 'bg-gray-700'}`}></div>
                            <span>Planejamento</span>
                        </button>

                        {/* Ideias */}
                        <button
                            onClick={() => setActiveTab('creation-ideas')}
                            className={`w-full flex items-center gap-3 pl-11 pr-4 py-2 text-sm rounded-lg transition-all ${activeTab === 'creation-ideas' ? 'text-[#f441a5] bg-white/5' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'creation-ideas' ? 'bg-[#f441a5] shadow-[0_0_5px_#f441a5]' : 'bg-gray-700'}`}></div>
                            <span>Ideias</span>
                        </button>

                        {/* Home (Tarefas) */}
                        <button
                            onClick={() => setActiveTab('creation-home')}
                            className={`w-full flex items-center gap-3 pl-11 pr-4 py-2 text-sm rounded-lg transition-all ${activeTab === 'creation-home' ? 'text-[#f441a5] bg-white/5' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'creation-home' ? 'bg-[#f441a5] shadow-[0_0_5px_#f441a5]' : 'bg-gray-700'}`}></div>
                            <span>Home (Tarefas)</span>
                        </button>

                    </div>
                </div>

                {/* Separator */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-4 my-2"></div>

                {/* Example (Legacy) */}
                <button
                    onClick={() => setActiveTab('example')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === 'example'
                            ? 'bg-white/5 text-white shadow-[0_0_20px_rgba(3,169,244,0.1)]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {activeTab === 'example' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#03a9f4] shadow-[0_0_10px_#03a9f4]"></div>
                    )}
                    <Layout size={20} className={`transition-colors duration-300 ${activeTab === 'example' ? 'text-[#03a9f4]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    <span className="font-medium">Exemplo</span>
                </button>

            </nav>

            {/* Footer Actions */}
            <div className="p-4 mt-auto flex-shrink-0">
                <div className="bg-[#0f0f10] rounded-xl p-4 border border-white/5">
                    <button className="w-full flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors mb-3">
                        <Settings size={18} />
                        <span>Configurações</span>
                    </button>
                    <button className="w-full flex items-center gap-3 text-sm text-red-400/70 hover:text-red-400 transition-colors">
                        <LogOut size={18} />
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
