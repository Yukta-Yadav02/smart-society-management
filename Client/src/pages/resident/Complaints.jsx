import React, { useState } from 'react';
import { AlertTriangle, Plus, Search, Filter, Clock, CheckCircle, X } from 'lucide-react';

const Complaints = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: 'maintenance',
    priority: 'medium'
  });
  
  // Data will come from backend API
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: Date.now(), // Temporary ID, backend will provide real ID
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      response: null
    };
    setComplaints([newComplaint, ...complaints]);
    setFormData({ description: '', category: 'maintenance', priority: 'medium' });
    setShowForm(false);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || complaint.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'in-progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">My Complaints</h1>
          </div>
          <p className="text-slate-600">Track and manage your society complaints</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Complaint'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">In Progress</p>
              <p className="text-2xl font-bold text-slate-800">{inProgressCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Resolved</p>
              <p className="text-2xl font-bold text-slate-800">{resolvedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-2xl font-bold text-slate-800">{complaints.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Complaint Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Raise New Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your complaint in detail..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="security">Security</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="noise">Noise</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority *</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Submit Complaint
            </button>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-12 pr-8 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all appearance-none bg-white min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No complaints found</h3>
            <p className="text-slate-600">
              {complaints.length === 0 
                ? "You haven't submitted any complaints yet. Click 'New Complaint' to get started."
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-800">#{complaint.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-3">{complaint.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span>Category: <span className="font-semibold text-slate-700">{complaint.category}</span></span>
                    <span>Date: <span className="font-semibold text-slate-700">{complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : '-'}</span></span>
                  </div>
                </div>
                
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(complaint.status)}`}>
                  {complaint.status?.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              
              {complaint.response && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 mb-1">Management Response:</p>
                      <p className="text-green-700">{complaint.response}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Complaints;