import React, { useState, useEffect } from "react";
import { UserPlus, UserMinus, Phone, Building, Tag, Clock, CheckCircle, X, Search, Filter, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiConnector } from '../../services/apiConnector';
import { VISITOR_API, FLAT_API } from '../../services/apis';

const VisitorManagement = () => {
  const [activeTab, setActiveTab] = useState('checkin');
  
  // Check-in state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    flat: '',
    type: '',
    purpose: ''
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [flats, setFlats] = useState([]);
  const [visitorStats, setVisitorStats] = useState({
    todayVisitors: 0,
    activeVisitors: 0,
    peakHours: '-'
  });

  // Check-out state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFlats();
    updateVisitorStats();
    if (activeTab === 'checkout') {
      fetchActiveVisitors();
    }
  }, [activeTab]);

  const updateVisitorStats = async () => {
    try {
      const activeRes = await apiConnector("GET", VISITOR_API.GET_ACTIVE);
      const historyRes = await apiConnector("GET", VISITOR_API.GET_HISTORY);

      if (activeRes.success) {
        const activeVisitors = activeRes.data || [];
        const allVisitors = historyRes.success ? historyRes.data || [] : [];
        const today = new Date().toDateString();

        const todayVisitors = allVisitors.filter(v =>
          new Date(v.entryTime).toDateString() === today
        ).length;

        const activeCount = activeVisitors.length;

        // Peak hours - show exact time of most recent entry
        const todayEntries = allVisitors.filter(v =>
          new Date(v.entryTime).toDateString() === today
        );

        let peakHours = '-';
        if (todayEntries.length > 0) {
          const latestEntry = todayEntries.reduce((latest, v) => 
            new Date(v.entryTime) > new Date(latest.entryTime) ? v : latest
          );
          
          const entryDate = new Date(latestEntry.entryTime);
          const hours = entryDate.getHours();
          const minutes = entryDate.getMinutes();
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
          const displayMinutes = minutes.toString().padStart(2, '0');
          
          peakHours = `${displayHour}:${displayMinutes} ${period} (${todayEntries.length})`;
        }

        setVisitorStats({ todayVisitors, activeVisitors: activeCount, peakHours });
      }
    } catch (error) {
      console.error('Failed to fetch visitor stats:', error);
    }
  };

  const fetchFlats = async () => {
    try {
      const res = await apiConnector("GET", FLAT_API.GET_ALL);
      if (res.success) {
        setFlats(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch flats:', error);
    }
  };

  const fetchActiveVisitors = async () => {
    try {
      setLoading(true);
      const res = await apiConnector("GET", VISITOR_API.GET_ACTIVE);
      if (res.success) {
        setVisitors(res.data || []);
      } else {
        toast.error('Failed to fetch active visitors');
      }
    } catch (error) {
      console.error('Failed to load visitors:', error);
      toast.error('Error loading visitors');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.flat || !formData.purpose) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        mobile: formData.mobile,
        flatId: formData.flat,
        purpose: formData.purpose,
      };

      const res = await apiConnector("POST", VISITOR_API.ENTRY, payload);

      if (res.success) {
        toast.success('Visitor checked-in successfully!');
        setShowSuccessPopup(true);
        setFormData({ name: '', mobile: '', flat: '', type: '', purpose: '' });
        updateVisitorStats();

        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      } else {
        toast.error(res.message || 'Failed to add visitor');
      }
    } catch (error) {
      console.error('Visitor entry error:', error);
      toast.error('Error adding visitor');
    }
  };

  const handleExit = async (visitorId, visitorName) => {
    try {
      const res = await apiConnector("PUT", VISITOR_API.EXIT(visitorId));

      if (res.success) {
        setVisitors(visitors.filter(v => v._id !== visitorId));
        toast.success(`${visitorName} has been marked as exited!`);
        updateVisitorStats();
      } else {
        toast.error(res.message || 'Failed to mark exit');
      }
    } catch (error) {
      console.error('Error marking exit:', error);
      toast.error('Error marking exit');
    }
  };

  const filteredVisitors = visitors.filter(visitor => {
    const flatNumber = visitor.flat?.flatNumber || '';
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flatNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || visitor.purpose.toLowerCase().includes(filterType);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full relative">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md transform animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Visitor Added Successfully!</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6">The visitor has been checked-in and registered in the system.</p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-100 p-2 rounded-lg">
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Visitor Management</h1>
        </div>
        <p className="text-sm sm:text-base text-slate-600">Check-in and check-out visitors</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm mb-6 w-fit">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'checkin'
              ? 'bg-green-600 text-white shadow-lg'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <UserPlus className="w-4 h-4 inline mr-2" />
          Check-In
        </button>
        <button
          onClick={() => setActiveTab('checkout')}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'checkout'
              ? 'bg-red-600 text-white shadow-lg'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <UserMinus className="w-4 h-4 inline mr-2" />
          Check-Out
        </button>
      </div>

      {/* Check-In Tab */}
      {activeTab === 'checkin' && (
        <>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Visitor Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 pl-10 sm:pl-12 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm sm:text-base"
                      required
                    />
                    <UserPlus className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 pl-10 sm:pl-12 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm sm:text-base"
                      required
                    />
                    <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Flat Number *
                  </label>
                  <div className="relative">
                    <select
                      name="flat"
                      value={formData.flat}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 sm:pl-12 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all appearance-none bg-white text-sm sm:text-base"
                      required
                    >
                      <option value="">Select flat</option>
                      {flats.map((flat) => (
                        <option key={flat._id} value={flat._id}>
                          {flat.wing?.name || 'Wing'}-{flat.flatNumber}
                        </option>
                      ))}
                    </select>
                    <Building className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Visitor Type
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 sm:pl-12 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all appearance-none bg-white text-sm sm:text-base"
                    >
                      <option value="">Select visitor type</option>
                      <option value="guest">Guest</option>
                      <option value="delivery">Delivery</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="service">Service Provider</option>
                      <option value="family">Family Member</option>
                    </select>
                    <Tag className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Purpose of Visit *
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Brief description of visit purpose"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all resize-none text-sm sm:text-base"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Check-In Visitor
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ name: '', mobile: '', flat: '', type: '', purpose: '' })}
                  className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm sm:text-base"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 sm:mt-8">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Today's Visitors</p>
                  <p className="text-lg sm:text-xl font-bold text-slate-800">{visitorStats.todayVisitors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Active Visitors</p>
                  <p className="text-lg sm:text-xl font-bold text-slate-800">{visitorStats.activeVisitors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Peak Hours</p>
                  <p className="text-lg sm:text-xl font-bold text-slate-800">{visitorStats.peakHours}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Check-Out Tab */}
      {activeTab === 'checkout' && (
        <>
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
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-12 pr-8 py-3 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all appearance-none bg-white min-w-[150px]"
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
                key={visitor._id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {visitor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">{visitor.name}</h3>
                      <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>Flat {visitor.flat?.flatNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-100 text-blue-700 border-blue-200">
                    {visitor.purpose}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
                      <Clock className="w-3 h-3" />
                      <span>Entry Time</span>
                    </div>
                    <p className="font-semibold text-slate-800">{new Date(visitor.entryTime || visitor.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-600 text-xs mb-1">
                      <Clock className="w-3 h-3" />
                      <span>Duration</span>
                    </div>
                    <p className="font-semibold text-slate-800">{Math.floor((Date.now() - new Date(visitor.entryTime || visitor.createdAt)) / (1000 * 60))} min</p>
                  </div>
                </div>

                <button
                  onClick={() => handleExit(visitor._id, visitor.name)}
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
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No active visitors</h3>
              <p className="text-slate-600">All visitors have checked out</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VisitorManagement;
