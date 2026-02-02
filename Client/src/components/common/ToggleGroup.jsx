import React from 'react';

const ToggleGroup = ({ label, options, value, onChange, register = {} }) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    {label}
                </label>
            )}
            <div className="flex gap-4">
                {options.map((opt) => (
                    <label key={opt.value} className="flex-1">
                        <input
                            type="radio"
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onChange && onChange(opt.value)}
                            className="hidden peer"
                            {...register}
                        />
                        <div className="w-full py-4 text-center rounded-2xl border border-slate-100 bg-white text-slate-400 font-bold cursor-pointer peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-all text-sm uppercase tracking-widest shadow-sm hover:border-indigo-200">
                            {opt.label}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ToggleGroup;
