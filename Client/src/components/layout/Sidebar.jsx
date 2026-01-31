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
  Home
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
    { name: 'Dashboard', icon: LayoutDashboard, path: '/security/dashboard' },
    { name: 'Visitors', icon: Users, path: '/security/visitors' },
    { name: 'Notices', icon: Bell, path: '/security/notices' },
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
    dashboardPath = '/security/dashboard';
  }

  return (
    <div
      className={`h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 sticky top-0 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <Home className="text-white w-6 h-6" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-xl text-slate-800">Gokuldham</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === dashboardPath}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive
                ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 rounded-l-none'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-100 flex flex-col gap-4">
        {/* User Profile Info */}
        <div className={`flex items-center gap-3 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-indigo-600 font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase() || <UserCircle className="w-6 h-6" />}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-slate-800 text-sm truncate">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-indigo-600 font-medium capitalize">
                {user?.role?.toLowerCase() || 'Role'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="mx-auto" /> : <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>}
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <LogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
