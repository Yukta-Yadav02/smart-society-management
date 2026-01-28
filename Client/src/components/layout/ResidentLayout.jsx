import React from 'react';
import ResidentSidebar from './ResidentSidebar';
import { Outlet } from 'react-router-dom';

const ResidentLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <ResidentSidebar />
            <main className="flex-1 transition-all duration-300">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-end px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-800">Rajesh Kumar</p>
                            <p className="text-xs text-slate-500">Resident - A-101</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                            RK
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ResidentLayout;