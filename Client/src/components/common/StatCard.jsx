import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const StatCard = ({
    label,
    value,
    icon: Icon,
    colorClass = 'bg-indigo-50 text-indigo-600',
    subStats,
    onClick,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onClick={onClick}
            className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-300 group ${onClick ? 'cursor-pointer hover:shadow-xl hover:translate-y-[-4px] hover:border-indigo-100' : ''
                }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]} flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity font-black`}>
                    <Icon size={24} />
                </div>
                {onClick && (
                    <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                )}
            </div>

            <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
            </div>

            {subStats && (
                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-50">
                    {subStats.map((sub, idx) => (
                        <div key={idx} className="text-center">
                            <p className={`text-[9px] uppercase tracking-[0.15em] font-black mb-1 ${sub.color || 'text-slate-400'}`}>
                                {sub.label}
                            </p>
                            <p className="text-sm font-black text-slate-700">{sub.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default StatCard;
