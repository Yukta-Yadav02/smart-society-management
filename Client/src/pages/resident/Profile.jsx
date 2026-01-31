import React, { useState } from 'react';
import { User, Edit, Save, X, Home, Phone, Mail, Car, AlertTriangle, Briefcase } from 'lucide-react';


const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543210',
    flatNumber: '101',
    wing: 'A',
    emergencyContact: '+91 9876543211',
    emergencyName: 'Priya Kumar',
    relation: 'Spouse',
    occupation: 'Software Engineer',
    vehicleNumber: 'MH12AB1234'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Show success message or handle API call
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          </div>
          <p className="text-slate-600">Manage your personal information and settings</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="text-center lg:text-left flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{profile.name}</h2>
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Flat {profile.wing}-{profile.flatNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{profile.occupation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all ${
                  isEditing 
                    ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' 
                    : 'border-slate-200 bg-slate-50'
                } outline-none`}
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all ${
                  isEditing 
                    ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' 
                    : 'border-slate-200 bg-slate-50'
                } outline-none`}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all ${
                  isEditing 
                    ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' 
                    : 'border-slate-200 bg-slate-50'
                } outline-none`}
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Occupation</label>
            <div className="relative">
              <input
                type="text"
                value={profile.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all ${
                  isEditing 
                    ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' 
                    : 'border-slate-200 bg-slate-50'
                } outline-none`}
              />
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Flat Information */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Home className="w-5 h-5 text-green-600" />
          </div>
          Flat Information
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Wing</label>
            <div className="relative">
              <input
                type="text"
                value={profile.wing}
                disabled
                className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 bg-slate-50 outline-none"
              />
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Flat Number</label>
            <div className="relative">
              <input
                type="text"
                value={profile.flatNumber}
                disabled
                className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 bg-slate-50 outline-none"
              />
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Number</label>
            <div className="relative">
              <input
                type="text"
                value={profile.vehicleNumber}
                onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter vehicle number"
                className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all ${
                  isEditing 
                    ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' 
                    : 'border-slate-200 bg-slate-50'
                } outline-none`}
              />
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Name</label>
            <div className="relative">
              <input
                type="text"
                value={profile.emergencyName}
                onChange={(e) => handleChange('emergencyName', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter contact name"
                className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all ${
                  isEditing 
                    ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' 
                    : 'border-slate-200 bg-slate-50'
                } outline-none`}
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={profile.emergencyContact}
                onChange={(e) => handleChange('emergencyContact', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all ${
                  isEditing 
                    ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' 
                    : 'border-slate-200 bg-slate-50'
                } outline-none`}
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Relationship</label>
            <div className="relative">
              <input
                type="text"
                value={profile.relation}
                onChange={(e) => handleChange('relation', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., Spouse, Parent"
                className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all ${
                  isEditing 
                    ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' 
                    : 'border-slate-200 bg-slate-50'
                } outline-none`}
              />
              <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Account Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 text-left transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Change Password</p>
                <p className="text-sm text-slate-600">Update your account password</p>
              </div>
            </div>
          </button>
          
          <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-4 text-left transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Notification Settings</p>
                <p className="text-sm text-slate-600">Manage email and SMS preferences</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;