import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

const Select = ({
    label,
    options = [],
    error,
    className = "",
    register = {},
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
                <select
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-12 ${error ? 'border-rose-500 ring-rose-500/20' : ''
                        }`}
                    {...register}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors">
                    <ChevronDown size={20} />
                </div>
            </div>
            {error && (
                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {error}
                </p>
            )}
        </div>
    );
};

export default Select;
