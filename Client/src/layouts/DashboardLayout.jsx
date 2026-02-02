import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';
import { roleBgClass } from '../utils/userHelpers';

const DashboardLayout = () => {
    const { user } = useAuth();
    const location = useLocation();

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
        if (user.status !== 'ACTIVE') {
            return <Navigate to="/dashboard" replace />;
        }
    }
    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar />

            <main className="flex-1 transition-all duration-300">
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-end px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-800">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">
                                {user?.role?.toLowerCase() || 'Role'}
                            </p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-sm ${roleBgClass(user?.role)}`}>
                            {user?.name ? (
                                user.name.charAt(0).toUpperCase()
                            ) : (
                                <UserCircle className="w-6 h-6" />
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;