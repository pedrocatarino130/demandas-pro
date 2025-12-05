import React from 'react';
import { Search, Filter } from 'lucide-react';

export const ComplexSearch = ({ value, onChange }) => {
    return (
        <div className="relative w-full max-w-2xl h-[60px] flex items-center justify-center group" id="poda">
            {/* Background Grid - decorative */}
            <div className="absolute inset-0 bg-transparent z-0"></div>

            {/* Glow Effect */}
            <div className="absolute inset-0 w-full h-full blur-[30px] opacity-20 max-h-[130px] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[conic-gradient(#000,#402fb5_5%,#000_38%,#000_50%,#cf30aa_60%,#000_87%)] transition-all duration-1000 group-focus-within:rotate-[420deg]"></div>
            </div>

            {/* Main Border Animation */}
            <div className="absolute inset-0 rounded-[12px] overflow-hidden p-[1px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[conic-gradient(rgba(0,0,0,0),#a099d8,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#dfa2da,rgba(0,0,0,0)_60%)] transition-all duration-1000 group-hover:rotate-[263deg] group-focus-within:rotate-[443deg] opacity-70"></div>
                <div className="w-full h-full bg-[#0f0f10] rounded-[11px]"></div>
            </div>

            {/* Inner Border Animation */}
            <div className="absolute inset-[3px] rounded-[10px] overflow-hidden p-[1px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[conic-gradient(#1c191c,#402fb5_5%,#1c191c_14%,#1c191c_50%,#cf30aa_60%,#1c191c_64%)] transition-all duration-1000 group-hover:rotate-[250deg] group-focus-within:rotate-[430deg]"></div>
                <div className="w-full h-full bg-[#010201] rounded-[9px]"></div>
            </div>

            {/* Input Field */}
            <div className="relative z-10 w-full h-full flex items-center px-4">
                <Search className="w-5 h-5 text-gray-500 ml-2" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Buscar tarefas..."
                    className="w-full h-full bg-transparent border-none outline-none text-white px-4 text-lg placeholder-gray-600 font-light"
                />

                {/* Filter Icon Area */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden bg-gradient-to-b from-[#161329] to-[#1d1b4b] border border-white/5 cursor-pointer hover:brightness-125 transition-all">
                    {/* Spinning border for filter */}
                    <div className="absolute inset-0 opacity-50">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-[conic-gradient(rgba(0,0,0,0),#3d3a4f,rgba(0,0,0,0)_50%,#3d3a4f,rgba(0,0,0,0)_100%)] animate-[spin_4s_linear_infinite]"></div>
                    </div>
                    <Filter className="w-5 h-5 text-gray-400 relative z-10" />
                </div>
            </div>

            {/* Decorative Masks */}
            <div className="absolute top-4 left-16 w-8 h-5 bg-[#cf30aa] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
        </div>
    );
};
