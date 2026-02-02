import React, { useState } from 'react';
import { UserMinus, Clock, MapPin, Search, Filter } from 'lucide-react';

const ExitVisitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const visitors = [];

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.flat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || visitor.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleExit = (visitorId, visitorName) => {
    alert(`${visitorName} has been marked as exited successfully!`);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Guest': 'bg-blue-100 text-blue-700 border-blue-200',
      'Delivery': 'bg-orange-100 text-orange-700 border-orange-200',
      'Maintenance': 'bg-purple-100 text-purple-700 border-purple-200',
      'Service': 'bg-green-100 text-green-700 border-green-200',
      'Family': 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-red-100 p-2 rounded-lg">
            <UserMinus className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Active Visitors</h1>
        </div>
        <p className="text-slate-600">Manage visitor exits and track active visitors</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or flat number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-12 pr-8 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all appearance-none bg-white min-w-[150px]"
            >
              <option value="all">All Types</option>
              <option value="guest">Guest</option>
              <option value="delivery">Delivery</option>
              <option value="maintenance">Maintenance</option>
              <option value="service">Service</option>
              <option value="family">Family</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisitors.map((visitor) => (
          <div
            key={visitor.id}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Visitor Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {visitor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">{visitor.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{visitor.flat}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(visitor.type)}`}>
                {visitor.type}
              </span>
            </div>

            {/* Time Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Entry Time</span>
                </div>
                <p className="font-semibold text-slate-800">{visitor.time}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Duration</span>
                </div>
                <p className="font-semibold text-slate-800">{visitor.duration}</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleExit(visitor.id, visitor.name)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <UserMinus className="w-4 h-4" />
              Mark Exit
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVisitors.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserMinus className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No visitors found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{visitors.filter(v => v.type === 'Guest').length}</p>
            <p className="text-sm text-slate-600">Guests</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{visitors.filter(v => v.type === 'Delivery').length}</p>
            <p className="text-sm text-slate-600">Deliveries</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{visitors.filter(v => v.type === 'Maintenance').length}</p>
            <p className="text-sm text-slate-600">Maintenance</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{visitors.length}</p>
            <p className="text-sm text-slate-600">Total Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitVisitor;