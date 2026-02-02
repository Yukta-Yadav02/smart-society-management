import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const baseStyles = 'text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-widest inline-flex items-center justify-center';

    const variants = {
        default: 'bg-slate-50 text-slate-600 border-slate-100',
        primary: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        warning: 'bg-amber-50 text-amber-600 border-amber-100',
        danger: 'bg-rose-50 text-rose-600 border-rose-100',
        info: 'bg-blue-50 text-blue-600 border-blue-100',
    };

    return (
        <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
