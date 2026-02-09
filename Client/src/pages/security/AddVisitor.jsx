import React, { useState, useEffect } from "react";
import { UserPlus, Phone, Building, Tag, Clock, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiConnector } from '../../services/apiConnector';
import { VISITOR_API, FLAT_API } from '../../services/apis';

const AddVisitor = () => {
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

  useEffect(() => {
    fetchFlats();
    updateVisitorStats();
  }, []);

  const updateVisitorStats = async () => {
    try {
      const res = await apiConnector("GET", VISITOR_API.GET_ACTIVE);

      if (res.success) {
        const visitors = res.data || [];
        const today = new Date().toDateString();

        // Today's visitors
        const todayVisitors = visitors.filter(v =>
          new Date(v.entryTime).toDateString() === today
        ).length;

        // Active visitors (all visitors in localStorage are active)
        const activeVisitors = visitors.length;

        // Peak hours calculation
        const hourCounts = {};
        visitors.forEach(v => {
          const hour = new Date(v.entryTime).getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const peakHour = Object.keys(hourCounts).reduce((a, b) =>
          hourCounts[a] > hourCounts[b] ? a : b, '0'
        );

        const peakHours = visitors.length > 0 ? `${peakHour}:00-${parseInt(peakHour) + 1}:00` : '-';

        setVisitorStats({ todayVisitors, activeVisitors, peakHours });
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
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Continue
                </button>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="p-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 sm:w-auto w-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Add New Visitor</h1>
        </div>
        <p className="text-sm sm:text-base text-slate-600">Register a new visitor for society entry</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Row 1 */}
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

          {/* Row 2 */}
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

          {/* Purpose */}
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

          {/* Submit Button */}
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
    </div>
  );
};

export default AddVisitor;