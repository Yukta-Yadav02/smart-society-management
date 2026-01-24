import React, { useState } from 'react';

const Complaints = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    priority: 'medium'
  });
  
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: 'Water leakage in bathroom',
      description: 'There is water leakage from the ceiling in my bathroom',
      category: 'maintenance',
      priority: 'high',
      status: 'pending',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Noise complaint',
      description: 'Loud music from neighbor after 10 PM',
      category: 'noise',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2024-01-10',
      response: 'Issue has been resolved. Neighbor has been warned.'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: complaints.length + 1,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setComplaints([...complaints, newComplaint]);
    alert('🎉 Complaint submitted successfully!');
    setFormData({ title: '', description: '', category: 'maintenance', priority: 'medium' });
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 mt-12 lg:mt-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-3">📝</span>
              My Complaints
            </h1>
            <p className="text-gray-600 text-lg">Track and manage your society complaints</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-bold"
          >
            {showForm ? '✕ Cancel' : '+ New Complaint'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{complaints.filter(c => c.status === 'pending').length}</p>
                <p className="text-gray-600 font-medium">Pending</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{complaints.filter(c => c.status === 'in-progress').length}</p>
                <p className="text-gray-600 font-medium">In Progress</p>
              </div>
              <span className="text-3xl">🔄</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{complaints.filter(c => c.status === 'resolved').length}</p>
                <p className="text-gray-600 font-medium">Resolved</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{complaints.length}</p>
                <p className="text-gray-600 font-medium">Total</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Raise New Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="maintenance">🔧 Maintenance</option>
                    <option value="security">🛡️ Security</option>
                    <option value="cleanliness">🧹 Cleanliness</option>
                    <option value="noise">🔊 Noise</option>
                    <option value="other">📋 Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 h-32"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-bold"
              >
                🚀 Submit Complaint
              </button>
            </form>
          </div>
        )}

        {/* Complaints List */}
        <div className="space-y-6">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{complaint.title}</h4>
                  <p className="text-gray-500 text-sm">ID: #{complaint.id}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(complaint.status)}`}>
                  {complaint.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <p className="text-gray-600">Category: <span className="font-semibold">{complaint.category}</span></p>
                <p className="text-gray-600">Priority: <span className="font-semibold">{complaint.priority}</span></p>
                <p className="text-gray-600">Date: <span className="font-semibold">{new Date(complaint.createdAt).toLocaleDateString()}</span></p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <p className="text-gray-700">{complaint.description}</p>
              </div>
              
              {complaint.response && (
                <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                  <p className="font-bold text-green-800 mb-2">Management Response:</p>
                  <p className="text-green-700">{complaint.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Complaints;