import React from 'react';

const LogoutButton = ({ onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-2.5 rounded-xl font-bold text-[15px] transition-all duration-300 shadow-md hover:shadow-lg
            bg-[#1e2332] text-white hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0
            dark:bg-white dark:text-slate-900 dark:hover:bg-gray-50 dark:hover:shadow-gray-200/20 ${className}`}
        >
            {/* Background Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] dark:via-black/5" />

            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Log Out</span>

            <svg
                width="28"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#4F68F9] relative z-10 transition-transform duration-300"
            >
                {/* Running Person - Animates right on hover */}
                <g fill="currentColor" className="transition-transform duration-300 group-hover:translate-x-2">
                    {/* Head */}
                    <circle cx="12" cy="5" r="2.5" />
                    {/* Body */}
                    <path d="M11 9l-1 5 3 2 1.5-3.5c.5-1.5-.5-3.5-3.5-3.5z" />
                    {/* Arms */}
                    <path d="M11 9c-1.5 2-4 3-4 3l-1.5-1.5s2.5-1 3.5-3l2 1.5z" />
                    <path d="M11 9c1.5 1.5 4 2 4 2l1.5-1.5s-2.5-1-3.5-2.5l-2 2z" />
                    {/* Legs */}
                    <path d="M10 14l-2 5h-3l2.5-6.5 2.5 1.5z" />
                    <path d="M13 16l3 4.5h-3l-2.5-4 2.5-.5z" />
                </g>

                {/* Door slightly offset to the right - Animates right and scales on hover */}
                <g className="transition-all duration-300 origin-right group-hover:translate-x-1 group-hover:scale-y-105">
                    <path
                        d="M18 3h7v18h-7V3z"
                        fill="currentColor"
                    />
                    {/* Door handle */}
                    <circle cx="20" cy="12" r="1.5" fill="#fff" className="dark:fill-[#1e2332] transition-transform duration-300 group-hover:scale-125" />
                </g>
            </svg>
        </button>
    );
};

export default LogoutButton;
