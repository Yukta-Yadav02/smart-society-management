import React, { useState, useEffect } from 'react';
import {
  User,
  Home,
  Phone,
  Mail,
  UserCircle
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

  useEffect(() => {
    fetchProfile();
  }, []);

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
              <Input label="Phone Number" value={user?.phone || ''} disabled={true} icon={Phone} />
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