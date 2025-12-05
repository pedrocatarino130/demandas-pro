import React from 'react';

export const NeonButton = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseClasses = "relative px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform active:scale-95 shadow-lg group overflow-hidden";

    const variants = {
        primary: "text-white bg-black border border-[#333] hover:border-[#03a9f4]",
        secondary: "text-gray-300 bg-transparent border border-[#333] hover:bg-white/5 hover:text-white",
        danger: "text-red-400 bg-transparent border border-red-900/30 hover:border-red-500 hover:text-red-100"
    };

    return (
        <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
            {variant === 'primary' && (
                <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 bg-gradient-to-r from-[#03a9f4] to-[#f441a5] transition-opacity duration-500 blur-md"></div>
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
};
