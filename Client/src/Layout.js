import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/complaints', label: 'Complaints', icon: '📝' },
    { path: '/maintenance', label: 'Maintenance', icon: '💰' },
    { path: '/notices', label: 'Notices', icon: '📢' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-64 bg-white shadow-lg flex flex-col transition-transform duration-300 z-40 h-full`}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-lg mr-3">
              <span className="text-white text-lg lg:text-xl">🏠</span>
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-gray-800">Resident Portal</h2>
              <p className="text-xs lg:text-sm text-gray-500">Sunrise Apartments</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg lg:text-xl mr-3">{item.icon}</span>
                <span className="text-sm lg:text-base font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Section */}
        <div className="p-3 lg:p-4 border-t border-gray-200">
          <div className="flex items-center p-2 lg:p-3 bg-gray-50 rounded-lg mb-3">
            <div className="bg-blue-500 p-1 lg:p-2 rounded-full mr-2 lg:mr-3">
              <span className="text-white text-xs lg:text-sm">👤</span>
            </div>
            <div>
              <p className="text-sm lg:text-base font-semibold text-gray-800">Rajesh Kumar</p>
              <p className="text-xs lg:text-sm text-gray-500">Flat A-101</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-300 hover:bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base font-medium"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-4 lg:px-0 lg:py-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;