import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../../store/slices/residentSlice';

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { complaints, maintenance, notices, loading, error } = useSelector(state => state.residentDashboard || {});
  
  const profile = { wing: 'A', flatNumber: '101' };

  useEffect(() => {
    // dispatch(fetchDashboardData()); // Disabled until backend is ready
  }, [dispatch]);

  const pendingComplaints = complaints?.filter(c => c.status === 'pending').length || 0;
  const unpaidMaintenance = maintenance?.filter(m => !m.paid).length || 0;
  const totalDue = maintenance?.filter(m => !m.paid).reduce((sum, m) => sum + m.amount, 0) || 0;
  const unreadNotices = notices?.length || 0;

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <button 
            onClick={() => dispatch(fetchDashboardData())}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 lg:mb-8 mt-12 lg:mt-0">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h1>
          <p className="text-gray-600 text-base lg:text-lg">Here's what's happening in your society today</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm lg:text-lg font-semibold text-gray-700 mb-1 lg:mb-2">My Flat</h3>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{profile.wing}-{profile.flatNumber}</p>
                <p className="text-xs lg:text-sm text-gray-500">2BHK</p>
              </div>
              <div className="bg-blue-100 p-2 lg:p-3 rounded-full">
                <span className="text-xl lg:text-2xl">🏠</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Complaints</h3>
                <p className="text-3xl font-bold text-orange-600">{pendingComplaints}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Maintenance</h3>
                <p className="text-3xl font-bold text-red-600">₹{totalDue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{unpaidMaintenance} Unpaid</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Notices</h3>
                <p className="text-3xl font-bold text-green-600">{unreadNotices}</p>
                <p className="text-sm text-gray-500">New</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">📢</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <button 
                onClick={() => navigate('/complaints')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 lg:p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-2xl lg:text-3xl mb-1 lg:mb-2">📝</div>
                <div className="font-semibold text-xs lg:text-sm">New Complaint</div>
              </button>
              <button 
                onClick={() => navigate('/maintenance')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-3xl mb-2">💳</div>
                <div className="font-semibold">Pay Bills</div>
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-3xl mb-2">👤</div>
                <div className="font-semibold">Edit Profile</div>
              </button>
              <button 
                onClick={() => navigate('/notices')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-3xl mb-2">📢</div>
                <div className="font-semibold">View Notices</div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {/* Activity will be loaded from API */}
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;