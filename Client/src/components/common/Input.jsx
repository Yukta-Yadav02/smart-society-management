import React from 'react';

const Input = ({
    label,
    error,
    className = '',
    type = 'text',
    icon: Icon,
    ...props
}) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${Icon ? 'pl-12' : ''
                        } ${error ? 'border-rose-500 ring-rose-500/20' : ''}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
