import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Users,
  AlertCircle,
  Wrench,
  Bell,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Shield,
  UserPlus,
  UserMinus
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const role = user?.role?.toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isResident = role === 'RESIDENT';
  const isSecurity = role === 'SECURITY';

  const adminMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Manage Flats', icon: Building2, path: '/admin/flats' },
    { name: 'Manage Requests', icon: ClipboardList, path: '/admin/requests' },
    { name: 'Manage Residents', icon: Users, path: '/admin/residents' },
    { name: 'Complaints', icon: AlertCircle, path: '/admin/complaints' },
    { name: 'Maintenance', icon: Wrench, path: '/admin/maintenance' },
    { name: 'Notices', icon: Bell, path: '/admin/notices' },
    { name: 'Profile', icon: UserCircle, path: '/admin/profile' },
  ];

  const residentMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/resident/dashboard' },
    { name: 'Complaints', icon: AlertCircle, path: '/resident/complaints' },
    { name: 'Maintenance', icon: Wrench, path: '/resident/maintenance' },
    { name: 'Notices', icon: Bell, path: '/resident/notices' },
    { name: 'Profile', icon: UserCircle, path: '/resident/profile' },
  ];

  const securityMenuItems = [
    { name: 'Add Visitor', icon: UserPlus, path: '/security/add-visitor' },
    { name: 'Exit Visitor', icon: UserMinus, path: '/security/exit-visitor' },
    { name: 'Profile', icon: UserCircle, path: '/security/profile' },
  ];

  let menuItems = [];
  let dashboardPath = '/';

  if (isAdmin) {
    menuItems = adminMenuItems;
    dashboardPath = '/admin/dashboard';
  } else if (isResident) {
    menuItems = residentMenuItems;
    dashboardPath = '/resident/dashboard';
  } else if (isSecurity) {
    menuItems = securityMenuItems;
    dashboardPath = '/security/add-visitor'; // Security doesn't seem to have a dashboard yet
  }

  const getThemeStyles = () => {
    if (isAdmin) return {
      light: 'bg-indigo-50',
      main: 'bg-indigo-600',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
      shadow: 'shadow-indigo-200',
      activeText: 'text-indigo-700'
    };
    if (isResident) return {
      light: 'bg-blue-50',
      main: 'bg-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-200',
      shadow: 'shadow-blue-200',
      activeText: 'text-blue-700'
    };
    if (isSecurity) return {
      light: 'bg-green-50',
      main: 'bg-green-600',
      text: 'text-green-600',
      border: 'border-green-200',
      shadow: 'shadow-green-200',
      activeText: 'text-green-700'
    };
    return {
      light: 'bg-indigo-50',
      main: 'bg-indigo-600',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
      shadow: 'shadow-indigo-200',
      activeText: 'text-indigo-700'
    };
  };

  const theme = getThemeStyles();

  return (
    <aside
      className={`h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-500 ease-in-out sticky top-0 z-20 shadow-sm ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3 overflow-hidden">
        <div className={`${theme.main} p-2.5 rounded-2xl shadow-lg ${theme.shadow} shrink-0 transition-transform hover:scale-105 duration-300`}>
          {isSecurity ? (
            <Shield className="text-white w-6 h-6" />
          ) : (
            <Home className="text-white w-6 h-6" />
          )}
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-slate-800 tracking-tight leading-none">
              {isAdmin ? 'Admin' : isSecurity ? 'Security' : 'Resident'}
            </span>
            <span className={`text-[10px] font-bold ${theme.text} uppercase tracking-widest mt-0.5`}>
              Panel
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 px-3 space-y-1.5 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === dashboardPath}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative
              ${isActive
                ? `${theme.light} ${theme.text} shadow-sm`
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && (
              <span className="font-semibold text-[15px] whitespace-nowrap">
                {item.name}
              </span>
            )}

            {/* Active Indicator Pin */}
            {({ isActive }) => isActive && !isCollapsed && (
              <div className={`absolute right-3 w-1.5 h-1.5 rounded-full ${theme.main} shadow-md`} />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        {/* User Profile Card */}
        <div className={`flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 ${isCollapsed ? 'justify-center' : 'hover:bg-white hover:shadow-sm'}`}>
          <div className={`w-10 h-10 rounded-xl ${theme.light} flex items-center justify-center shrink-0 border ${theme.border} shadow-inner`}>
            {user?.name ? (
              <span className={`${theme.activeText} font-bold text-lg`}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserCircle className={`w-6 h-6 ${theme.text}`} />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="font-bold text-slate-800 text-sm truncate">
                {user?.name || 'User'}
              </span>
              <span className={`text-[11px] ${theme.text} font-bold uppercase tracking-wider`}>
                {user?.role || 'Guest'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-slate-900 transition-all duration-300 hover:shadow-sm group"
          >
            {isCollapsed ? (
              <ChevronRight className="mx-auto group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="font-medium text-sm">Collapse Sidebar</span>
              </>
            )}
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all duration-300 hover:shadow-sm group"
          >
            <LogOut className={`w-5 h-5 group-hover:translate-x-0.5 transition-transform ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

