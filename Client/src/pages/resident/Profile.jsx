import React, { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    flatNumber: '',
    wing: '',
    emergencyContact: '',
    emergencyName: '',
    relation: '',
    occupation: '',
    vehicleNumber: ''
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('✅ Profile updated successfully!');
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 mt-12 lg:mt-0">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-2 lg:mr-3">👤</span>
              My Profile
            </h1>
            <p className="text-gray-600 text-base lg:text-lg">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-bold text-sm lg:text-base"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-bold text-sm lg:text-base"
              >
                💾 Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 shadow-lg font-bold text-sm lg:text-base"
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 lg:p-8 rounded-full">
              <span className="text-4xl lg:text-6xl text-white">👤</span>
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{profile.name}</h2>
              <p className="text-lg lg:text-xl text-gray-600 mb-2">Flat {profile.wing}-{profile.flatNumber}</p>
              <p className="text-base lg:text-lg text-gray-500">{profile.occupation}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg mb-6 lg:mb-8">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2 lg:mr-3">📋</span>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl ${isEditing ? 'border-gray-200 focus:border-blue-500' : 'border-gray-100 bg-gray-50'} focus:outline-none`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl ${isEditing ? 'border-gray-200 focus:border-blue-500' : 'border-gray-100 bg-gray-50'} focus:outline-none`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl ${isEditing ? 'border-gray-200 focus:border-blue-500' : 'border-gray-100 bg-gray-50'} focus:outline-none`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Occupation</label>
              <input
                type="text"
                value={profile.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl ${isEditing ? 'border-gray-200 focus:border-blue-500' : 'border-gray-100 bg-gray-50'} focus:outline-none`}
              />
            </div>
          </div>
        </div>

        {/* Flat Information */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg mb-6 lg:mb-8">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2 lg:mr-3">🏠</span>
            Flat Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Wing</label>
              <input
                type="text"
                value={profile.wing}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 rounded-xl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Flat Number</label>
              <input
                type="text"
                value={profile.flatNumber}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 rounded-xl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Number</label>
              <input
                type="text"
                value={profile.vehicleNumber}
                onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl ${isEditing ? 'border-gray-200 focus:border-blue-500' : 'border-gray-100 bg-gray-50'} focus:outline-none`}
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2 lg:mr-3">🚨</span>
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Name</label>
              <input
                type="text"
                value={profile.emergencyName}
                onChange={(e) => handleChange('emergencyName', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl ${isEditing ? 'border-gray-200 focus:border-blue-500' : 'border-gray-100 bg-gray-50'} focus:outline-none`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profile.emergencyContact}
                onChange={(e) => handleChange('emergencyContact', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl ${isEditing ? 'border-gray-200 focus:border-blue-500' : 'border-gray-100 bg-gray-50'} focus:outline-none`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Relation</label>
              <input
                type="text"
                value={profile.relation}
                onChange={(e) => handleChange('relation', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl ${isEditing ? 'border-gray-200 focus:border-blue-500' : 'border-gray-100 bg-gray-50'} focus:outline-none`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;