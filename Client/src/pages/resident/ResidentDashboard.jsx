import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResidentDashboard = () => {
  const navigate = useNavigate();
  
  const profile = { wing: 'A', flatNumber: '101' };
  const complaints = [{ id: 1, status: 'pending' }];
  const maintenance = [
    { id: 1, paid: false, amount: 5000 },
    { id: 2, paid: true, amount: 1500 }
  ];
  const notices = [{ id: 1, title: 'Society Meeting' }];

  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const unpaidMaintenance = maintenance.filter(m => !m.paid).length;
  const totalDue = maintenance.filter(m => !m.paid).reduce((sum, m) => sum + m.amount, 0);
  const unreadNotices = notices.length;

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
              <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                <div className="bg-blue-500 p-2 rounded-full mr-4">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Maintenance paid</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-yellow-50 rounded-xl">
                <div className="bg-yellow-500 p-2 rounded-full mr-4">
                  <span className="text-white text-sm">!</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">New complaint raised</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-xl">
                <div className="bg-green-500 p-2 rounded-full mr-4">
                  <span className="text-white text-sm">📢</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">New notice received</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;