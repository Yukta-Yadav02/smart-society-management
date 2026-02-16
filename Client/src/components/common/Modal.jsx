import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    maxWidth = 'max-w-2xl',
    icon: Icon
}) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
                        className={`bg-white rounded-2xl sm:rounded-[3rem] shadow-2xl w-full ${maxWidth} overflow-hidden border border-white/20 relative z-10 max-h-[95vh] flex flex-col`}
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-10 pb-3 sm:pb-6 relative shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-3 top-3 sm:right-8 sm:top-8 w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            {Icon && (
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-600 mb-3 sm:mb-6 font-black">
                                    <Icon size={24} className="sm:w-8 sm:h-8" />
                                </div>
                            )}

                            {title && <h2 className="text-xl sm:text-3xl font-black text-slate-800 pr-8">{title}</h2>}
                            {subtitle && <p className="text-xs sm:text-base text-slate-500 font-medium mt-1">{subtitle}</p>}
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-10 pt-2 sm:pt-4 overflow-y-auto flex-1">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
