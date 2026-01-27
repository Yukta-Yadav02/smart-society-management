import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Manage Flats', icon: Building2, path: '/admin/flats' },
    { name: 'Manage Requests', icon: ClipboardList, path: '/admin/requests' },
    { name: 'Manage Residents', icon: Users, path: '/admin/residents' },
    { name: 'Complaints', icon: AlertCircle, path: '/admin/complaints' },
    { name: 'Maintenance', icon: Wrench, path: '/admin/maintenance' },
    { name: 'Notices', icon: Bell, path: '/admin/notices' },
    { name: 'Profile', icon: UserCircle, path: '/admin/profile' },
  ];

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
            end={item.path === '/admin'}
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
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 mb-2"
        >
          {isCollapsed ? <ChevronRight className="mx-auto" /> : <>
            <ChevronLeft className="w-5 h-5" />
            <span>Collapse</span>
          </>}
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50">
          <LogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
