import React from 'react';
import { useSelector } from 'react-redux';

const Notices = () => {
  const notices = useSelector(state => state.residentNotices?.notices || []);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="w-full">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-6 lg:mb-8 flex items-center mt-12 lg:mt-0">
          <span className="mr-3">📢</span>
          Society Notices
        </h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 lg:gap-4 mb-6 lg:mb-8">
          <button className="bg-white px-3 lg:px-6 py-2 lg:py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow font-bold text-gray-800 border-2 border-blue-500 text-xs lg:text-sm">
            📋 All Notices ({notices.length})
          </button>
          <button className="bg-white px-3 lg:px-6 py-2 lg:py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow font-bold text-gray-600 hover:text-gray-800 text-xs lg:text-sm">
            🚨 High Priority ({notices.filter(n => n.priority === 'high').length})
          </button>
          <button className="bg-white px-3 lg:px-6 py-2 lg:py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow font-bold text-gray-600 hover:text-gray-800 text-xs lg:text-sm">
            ⚠️ Medium Priority ({notices.filter(n => n.priority === 'medium').length})
          </button>
        </div>
        
        {/* Notices List */}
        <div className="space-y-4 lg:space-y-6">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white p-4 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between items-start mb-4 lg:mb-6">
                <div className="flex items-start flex-1 mb-4 lg:mb-0">
                  <div className="bg-blue-100 p-2 lg:p-3 rounded-full mr-3 lg:mr-4 flex-shrink-0">
                    <span className="text-xl lg:text-2xl">📢</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg lg:text-2xl font-bold text-gray-800 mb-2 break-words">{notice.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm text-gray-500">
                      <span>📅 {new Date(notice.createdAt).toLocaleDateString()}</span>
                      <span>👤 {notice.author}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-bold flex-shrink-0 ${getPriorityColor(notice.priority)}`}>
                  {notice.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 lg:p-6 rounded-xl border-l-4 border-blue-500 mb-4 lg:mb-6">
                <p className="text-gray-700 leading-relaxed text-sm lg:text-lg break-words">{notice.content}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 lg:gap-3 pt-4 lg:pt-6 border-t border-gray-200">
                <button className="bg-blue-100 text-blue-700 px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium text-xs lg:text-sm">
                  👍 Mark as Read
                </button>
                <button className="bg-green-100 text-green-700 px-3 lg:px-4 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium text-xs lg:text-sm">
                  📧 Email to Family
                </button>
                <button className="bg-purple-100 text-purple-700 px-3 lg:px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors font-medium text-xs lg:text-sm">
                  📱 Share via WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 lg:mt-8 bg-white p-4 lg:p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">📊 Notice Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">{notices.length}</div>
              <p className="text-blue-800 font-medium text-sm lg:text-base">Total Notices</p>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <div className="text-2xl lg:text-3xl font-bold text-red-600 mb-2">{notices.filter(n => n.priority === 'high').length}</div>
              <p className="text-red-800 font-medium text-sm lg:text-base">High Priority</p>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <div className="text-2xl lg:text-3xl font-bold text-yellow-600 mb-2">{notices.filter(n => n.priority === 'medium').length}</div>
              <p className="text-yellow-800 font-medium text-sm lg:text-base">Medium Priority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notices;