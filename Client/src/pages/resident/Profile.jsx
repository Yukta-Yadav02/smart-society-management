import React, { useState, useEffect } from 'react';
import {
  User,
  Edit3,
  Save,
  Home,
  Phone,
  Mail,
  ShieldAlert,
  Briefcase,
  Camera,
  Lock,
  Bell
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { AUTH_API } from '../../services/apis';

import { updateProfile } from '../../store/store';

// COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.data);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Already fetched during login/auth context likely, 
    // but can re-fetch if needed.
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: user || {}
  });

  useEffect(() => {
    if (user) {
      // Flatten user data for form
      const formData = {
        ...user,
        wing: user.flat?.wing?.name || user.wing || '-',
        flat: user.flat?.flatNumber || user.flatCode || '-',
      };
      reset(formData);
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      // Assume update-profile exists
      // const res = await apiConnector("PUT", "/api/auth/update-resident-profile", data);
      dispatch(updateProfile(data));
      toast.success('Profile settings updated! ✨');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your personal information and preferences."
        actionLabel={!isEditing ? "Edit Profile" : "Save Profile"}
        onAction={!isEditing ? () => setIsEditing(true) : handleSubmit(onSubmit)}
        icon={!isEditing ? Edit3 : Save}
      />

      {isEditing && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 px-4 py-2"
          >
            Discard Changes
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Snapshot */}
        <div className="space-y-8">
          <Card className="p-10 text-center relative overflow-hidden group">
            <div className="w-36 h-36 rounded-3xl bg-indigo-600 mx-auto flex items-center justify-center text-white border-[6px] border-white shadow-2xl mb-6 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
              <span className="text-5xl font-black">{(user?.name || 'R')[0]}</span>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase mb-1">{user?.name || 'Resident Name'}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Society Member</p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wing</p>
                <p className="font-black text-slate-700">{user?.flat?.wing?.name || user?.wing || '-'}</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flat</p>
                <p className="font-black text-slate-700">{user?.flat?.flatNumber || user?.flat || '-'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-amber-100 bg-amber-50/30">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight text-sm">
              <ShieldAlert className="text-amber-500" size={18} />
              Emergency Protocol
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-amber-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">ICE Contact</p>
                <p className="font-bold text-slate-700">{user?.emergencyContact || '+91 00000 00000'}</p>
              </div>
              <p className="text-[10px] text-amber-600 font-bold leading-relaxed uppercase">Important: Management will use this number if you are unreachable during emergencies.</p>
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
              <Input label="Full Name" register={register('name')} disabled={!isEditing} icon={User} />
              <Input label="Email Address" register={register('email')} disabled={!isEditing} icon={Mail} />
              <Input label="Phone Number" register={register('phone')} disabled={!isEditing} icon={Phone} />
              <Input label="Occupation" register={register('occupation')} disabled={!isEditing} icon={Briefcase} />
            </div>
          </Card>

          <Card className="p-10">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Home className="text-indigo-600" size={20} />
              Residency & Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input label="Assigned Wing" register={register('wing')} disabled={true} icon={Home} />
              <Input label="Flat Number" register={register('flat')} disabled={true} icon={Home} />
              <Input label="Vehicle Registration" register={register('vehicleNumber')} disabled={!isEditing} icon={ShieldAlert} />
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Privacy Control</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Lock size={18} /></div>
                  <div className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-slate-50 border border-transparent text-slate-400 font-mono tracking-tighter flex items-center justify-between text-xs">
                    <span>••••••••••••</span>
                    <button type="button" className="text-indigo-600 font-black uppercase text-[9px] tracking-widest hover:underline">Change</button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;