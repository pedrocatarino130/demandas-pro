import React from 'react';

export const NeonCheckbox = ({ checked, onChange }) => {
    return (
        <div className="relative flex items-center p-2 cursor-pointer group" onClick={onChange}>
            {/* Checkbox Container */}
            <div
                className={`
          relative w-6 h-6 border-2 rounded-lg flex justify-center items-center overflow-hidden transition-all duration-300
          ${checked
                        ? 'border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                        : 'border-gray-600 bg-black/20 group-hover:border-[#00ff88]/50'}
        `}
            >
                {/* Animated Background */}
                <div
                    className={`
            absolute w-full h-full bg-gradient-to-tr from-[#00ff88] to-[#00ffcc]
            transition-all duration-400 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
            ${checked ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-45'}
          `}
                />

                {/* Checkmark Icon */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`
            relative z-10 text-black w-4 h-4 transition-all duration-400
            ${checked ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}
          `}
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>

            {/* Glowing Dots (Decorative) */}
            <div className={`absolute -left-1 top-1/2 w-1 h-1 rounded-full bg-[#00ff88] transition-all duration-500 ${checked ? 'opacity-0' : 'opacity-0 group-hover:opacity-100 group-hover:-translate-x-2'}`} />
            <div className={`absolute -right-1 top-1/2 w-1 h-1 rounded-full bg-[#00ff88] transition-all duration-500 ${checked ? 'opacity-0' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-2'}`} />
        </div>
    );
};
