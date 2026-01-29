import React from 'react';
import { LayoutDashboard, Home, Users, AlertTriangle, Wrench, Bell, TrendingUp } from 'lucide-react';

const ResidentDashboard = () => {
  // Data will come from backend API
  const stats = [
    { title: 'My Flat', value: '-', subtitle: 'Loading...', icon: Home, color: 'bg-blue-100 text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Pending Complaints', value: '-', subtitle: 'Loading...', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600', bgColor: 'bg-orange-50' },
    { title: 'Maintenance Due', value: '-', subtitle: 'Loading...', icon: Wrench, color: 'bg-red-100 text-red-600', bgColor: 'bg-red-50' },
    { title: 'New Notices', value: '-', subtitle: 'Loading...', icon: Bell, color: 'bg-green-100 text-green-600', bgColor: 'bg-green-50' },
  ];

  const recentActivity = [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-lg">
            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Dashboard</h1>
        </div>
        <p className="text-sm sm:text-base text-slate-600">Welcome back! Here's what's happening in your society.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.color}`}>
                <stat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs sm:text-sm text-slate-600">{stat.subtitle}</p>
              </div>
            </div>
            <h3 className="font-semibold text-slate-700 text-sm sm:text-base">{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center transition-all duration-200 group">
              <div className="bg-blue-100 group-hover:bg-blue-200 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <p className="font-semibold text-slate-700 text-xs sm:text-sm">New Complaint</p>
            </button>
            
            <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center transition-all duration-200 group">
              <div className="bg-green-100 group-hover:bg-green-200 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <p className="font-semibold text-slate-700 text-xs sm:text-sm">Pay Maintenance</p>
            </button>
            
            <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center transition-all duration-200 group">
              <div className="bg-purple-100 group-hover:bg-purple-200 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <p className="font-semibold text-slate-700 text-xs sm:text-sm">View Notices</p>
            </button>
            
            <button className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center transition-all duration-200 group">
              <div className="bg-orange-100 group-hover:bg-orange-200 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <p className="font-semibold text-slate-700 text-xs sm:text-sm">My Profile</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6">Recent Activity</h2>
          <div className="space-y-3 sm:space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-slate-500">
                <p className="text-sm sm:text-base">No recent activity</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
                  <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    {activity.type === 'complaint' && <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />}
                    {activity.type === 'maintenance' && <Wrench className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />}
                    {activity.type === 'notice' && <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-xs sm:text-sm">{activity.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6">Monthly Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
            <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">-</p>
            <p className="text-xs sm:text-sm text-slate-600">Maintenance Paid</p>
          </div>
          
          <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl">
            <div className="bg-green-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-600">-</p>
            <p className="text-xs sm:text-sm text-slate-600">Complaints Resolved</p>
          </div>
          
          <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
            <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">-</p>
            <p className="text-xs sm:text-sm text-slate-600">Notices Received</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;