import React, { useState, useEffect } from 'react';
import {
  User,
  Home,
  Phone,
  Mail,
  UserCircle,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { AUTH_API } from '../../services/apis';

import { updateProfile } from '../../store/store';

// COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.data);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiConnector('GET', AUTH_API.GET_PROFILE);
      if (response.success) {
        dispatch(updateProfile(response.data));
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!phone || phone === user?.phone) {
      setIsEditing(false);
      return;
    }

    try {
      setUpdating(true);
      const response = await apiConnector('PUT', AUTH_API.UPDATE_PROFILE, { phone });
      if (response.success) {
        dispatch(updateProfile(response.data));
        toast.success('Phone number updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(response.message || 'Failed to update phone');
      }
    } catch (error) {
      toast.error('Failed to update phone number');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <PageHeader
        title="Account Settings"
        subtitle="View your personal information and preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Snapshot */}
        <div className="space-y-8">
          <Card className="p-10 text-center relative overflow-hidden group">
            <div className="w-36 h-36 rounded-3xl bg-indigo-600 mx-auto flex items-center justify-center text-white border-[6px] border-white shadow-2xl mb-6 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
              <span className="text-5xl font-black">{(user?.name || 'R')[0]}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase mb-1">{user?.name || 'Resident Name'}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">{user?.role || 'RESIDENT'}</p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wing</p>
                <p className="font-black text-slate-700">{user?.flat?.wing?.name || '-'}</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flat</p>
                <p className="font-black text-slate-700">{user?.flat?.flatNumber || '-'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Forms */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-10">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <User className="text-indigo-600" size={20} />
              Identity Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input label="Full Name" value={user?.name || ''} disabled={true} icon={User} />
              <Input label="Email Address" value={user?.email || ''} disabled={true} icon={Mail} />
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 font-bold"
                    >
                      <Edit2 size={16} />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleUpdatePhone}
                        disabled={updating}
                        className="px-4 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all flex items-center gap-2 font-bold disabled:opacity-50"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setPhone(user?.phone || '');
                        }}
                        className="px-4 py-3 bg-slate-600 text-white rounded-2xl hover:bg-slate-700 transition-all flex items-center gap-2 font-bold"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <Input label="Role" value={user?.role || 'RESIDENT'} disabled={true} icon={UserCircle} />
              <Input label="Assigned Wing" value={user?.flat?.wing?.name || '-'} disabled={true} icon={Home} />
              <Input label="Flat Number" value={user?.flat?.flatNumber || '-'} disabled={true} icon={Home} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;