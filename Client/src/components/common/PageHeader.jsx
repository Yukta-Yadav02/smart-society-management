import React from 'react';
import { Plus } from 'lucide-react';
import Button from './Button';

const PageHeader = ({ title, subtitle, actionLabel, onAction, icon: ActionIcon = Plus }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{title}</h1>
                {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
            </div>

            {actionLabel && (
                <Button
                    onClick={onAction}
                    className="px-8 py-4 flex items-center gap-2"
                >
                    <ActionIcon className="w-5 h-5" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default PageHeader;
