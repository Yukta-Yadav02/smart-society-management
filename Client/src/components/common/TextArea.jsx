import React from 'react';

const TextArea = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    {label}
                </label>
            )}
            <textarea
                className={`w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none ${error ? 'border-rose-500 ring-rose-500/20' : ''
                    }`}
                {...props}
            />
            {error && (
                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default TextArea;
