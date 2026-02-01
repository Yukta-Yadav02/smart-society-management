import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCircle, Bell, Settings } from 'lucide-react';

const Layout = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const path = location.pathname;

    // Admin route protection
    if (path.startsWith('/admin') && user.role !== 'ADMIN') {
        return <Navigate to="/login" replace />;
    }

    // Resident route protection
    if (path.startsWith('/resident')) {
        if (user.role !== 'RESIDENT') {
            return <Navigate to="/login" replace />;
        }
        // If resident is not active, they should only see the common dashboard
        if (user.status !== 'ACTIVE' && path !== '/resident/dashboard') {
            return <Navigate to="/dashboard" replace />;
        }
    }

    // Security route protection
    if (path.startsWith('/security') && user.role !== 'SECURITY') {
        return <Navigate to="/login" replace />;
    }

    const role = user?.role?.toUpperCase();

    const getThemeStyles = () => {
        if (role === 'ADMIN') return {
            text: 'text-indigo-600',
            bg: 'bg-indigo-100',
            border: 'border-indigo-200',
            activeText: 'text-indigo-700'
        };
        if (role === 'SECURITY') return {
            text: 'text-green-600',
            bg: 'bg-green-100',
            border: 'border-green-200',
            activeText: 'text-green-700'
        };
        return {
            text: 'text-blue-600',
            bg: 'bg-blue-100',
            border: 'border-blue-200',
            activeText: 'text-blue-700'
        };
    };

    const theme = getThemeStyles();

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 capitalize">
                            Welcome Back, {user?.name?.split(' ')[0] || 'User'}!
                        </h2>
                        <p className="text-xs font-medium text-slate-400">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="h-10 w-px bg-slate-100 mx-2" />

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">
                                    {user?.name || 'User'}
                                </p>
                                <p className={`text-[10px] font-bold ${theme.text} uppercase tracking-widest`}>
                                    {user?.role?.toLowerCase() || 'Role'}
                                </p>
                            </div>
                            <div className={`w-11 h-11 rounded-2xl ${theme.bg} border ${theme.border} flex items-center justify-center shadow-sm relative group cursor-pointer`}>
                                {user?.name ? (
                                    <span className={`${theme.activeText} font-extrabold text-lg`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                ) : (
                                    <UserCircle className={`w-6 h-6 ${theme.text}`} />
                                )}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" title="Online" />
                            </div>
                        </div>
                    </div>
                </header>


                {/* Page Content */}
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
