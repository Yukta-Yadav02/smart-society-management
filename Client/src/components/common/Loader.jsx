import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullPage = false, size = 32, className = "" }) => {
    const content = (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <Loader2 size={size} className="text-indigo-600 animate-spin" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Loading...</p>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-sm flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
};

export default Loader;
