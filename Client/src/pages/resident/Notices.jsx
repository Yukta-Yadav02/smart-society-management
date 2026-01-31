import React, { useState } from 'react';
import { Bell, Search, Filter, Calendar, User, AlertTriangle } from 'lucide-react';


const Notices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Data will come from backend API
  const notices = [];

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || notice.priority === filter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'meeting': return '👥';
      case 'maintenance': return '🔧';
      case 'event': return '🎉';
      case 'security': return '🛡️';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Society Notices</h1>
        </div>
        <p className="text-sm sm:text-base text-slate-600">Stay updated with important society announcements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 lg:gap-4">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg sm:rounded-xl mb-2 sm:mb-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-slate-600">Total Notices</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">{notices.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 lg:gap-4">
            <div className="bg-red-100 p-2 sm:p-3 rounded-lg sm:rounded-xl mb-2 sm:mb-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-slate-600">High Priority</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">{notices.filter(n => n.priority === 'high').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 lg:gap-4">
            <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg sm:rounded-xl mb-2 sm:mb-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-slate-600">This Week</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">-</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 lg:gap-4">
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg sm:rounded-xl mb-2 sm:mb-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-slate-600">Read</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm sm:text-base"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 sm:pl-12 pr-6 sm:pr-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white min-w-[120px] sm:min-w-[150px] text-sm sm:text-base"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-8 sm:p-12 text-center">
            <div className="bg-slate-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">No notices found</h3>
            <p className="text-sm sm:text-base text-slate-600">Notices will appear here when available from the backend</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
                    <span className="text-lg sm:text-2xl">{getCategoryIcon(notice.category)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{notice.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : '-'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{notice.author || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getPriorityColor(notice.priority)}`}>
                  {notice.priority?.toUpperCase() || 'NORMAL'} PRIORITY
                </span>
              </div>
              
              <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-4 border-blue-500 mb-3 sm:mb-4">
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{notice.content}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200">
                <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  <span>👍</span>
                  <span className="hidden sm:inline">Mark as Read</span>
                  <span className="sm:hidden">Read</span>
                </button>
                <button className="bg-green-50 hover:bg-green-100 text-green-700 px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  <span>📧</span>
                  <span className="hidden sm:inline">Email to Family</span>
                  <span className="sm:hidden">Email</span>
                </button>
                <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  <span>📱</span>
                  <span className="hidden sm:inline">Share via WhatsApp</span>
                  <span className="sm:hidden">Share</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notices;