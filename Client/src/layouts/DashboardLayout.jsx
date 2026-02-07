import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Menu, X } from 'lucide-react';
import { roleBgClass } from '../utils/userHelpers';

const DashboardLayout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    console.log('Current user:', user);
    console.log('Current path:', location.pathname);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const path = location.pathname;

    // Admin route protection - check both ADMIN and admin
    if (path.startsWith('/admin')) {
        const userRole = user.role?.toUpperCase();
        if (userRole !== 'ADMIN') {
            console.log('Access denied - User role:', user.role, 'Required: ADMIN');
            return <Navigate to="/login" replace />;
        }
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
        <div className="flex min-h-screen bg-slate-50/50 relative">
            {/* Sidebar with mobile props */}
            <Sidebar
                mobileOpen={mobileSidebarOpen}
                setMobileOpen={setMobileSidebarOpen}
            />

            <main className="flex-1 transition-all duration-300 w-full">
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
                    {/* Mobile Menu Button - Visible on small screens */}
                    <button
                        onClick={() => setMobileSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Right Side Header Content */}
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
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
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;