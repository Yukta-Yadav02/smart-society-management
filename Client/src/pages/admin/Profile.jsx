import React, { useState } from 'react';
import {
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Camera,
    Save,
    Lock,
    Globe,
    Edit3,
    ArrowRight,
    LayoutGrid,
    PieChart
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { updateProfile } from '../../store/store';

const Profile = () => {
    const dispatch = useDispatch();
    const profileData = useSelector((state) => state.profile.data);

    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: profileData
    });

    const onSubmit = (data) => {
        dispatch(updateProfile(data));
        toast.success('Society profile updated successfully!', {
            icon: '🏢',
            style: { border: '1px solid #e2e8f0', padding: '16px', color: '#1e293b', borderRadius: '24px' }
        });
        setIsEditing(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase text-shadow-sm">Society Profile</h1>
                    <p className="text-slate-400 mt-1 font-bold text-sm">Official configuration and administrative identity.</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-[1.5rem] font-black flex items-center gap-3 transition-all shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-[0.2em] text-[10px]"
                    >
                        <Edit3 className="w-5 h-5" /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-white hover:bg-slate-50 text-slate-500 px-8 py-4 rounded-[1.5rem] font-black border border-slate-100 transition-all uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-[1.5rem] font-black flex items-center gap-3 transition-all shadow-xl shadow-emerald-100 border border-emerald-500 uppercase tracking-[0.2em] text-[10px]"
                        >
                            <Save className="w-5 h-5" /> Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column - Stats & Identity */}
                <div className="space-y-10">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                        {/* Abstract glow */}
                        <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 mx-auto flex items-center justify-center text-indigo-600 border-[8px] border-white shadow-2xl mb-8 relative group-hover:scale-105 transition-transform duration-700 overflow-hidden">
                            <Building2 className="w-16 h-16 group-hover:rotate-12 transition-transform" />
                            {isEditing && (
                                <div className="absolute inset-0 bg-indigo-600/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase leading-none mb-2">{profileData.societyName}</h2>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" />
                            Registered Society
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 p-10 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)] text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-xl uppercase tracking-tighter flex items-center gap-2">
                                    <LayoutGrid className="w-5 h-5" /> Analytics Storage
                                </h3>
                                <PieChart className="w-6 h-6 text-indigo-200 group-hover:rotate-45 transition-transform duration-1000" />
                            </div>

                            <div className="space-y-4">
                                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="bg-white h-full shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                                        style={{ width: `${(profileData.storageUsedGb / profileData.storageTotalGb) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-xs text-indigo-100 font-bold uppercase tracking-widest leading-none">
                                        {profileData.storageUsedGb} GB Used
                                    </p>
                                    <p className="text-[10px] text-white/40 font-black">CAPACITY: {profileData.storageTotalGb}GB</p>
                                </div>
                            </div>

                            <button className="mt-10 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group/btn">
                                Upgrade Storage <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-50" />
                    </div>
                </div>

                {/* Right Column - Detailed Form */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Society Information */}
                    <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4 uppercase tracking-tighter">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                                <Globe className="w-5 h-5" />
                            </div>
                            Core Society Records
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <ProfileField
                                label="Society Name"
                                {...register('societyName')}
                                disabled={!isEditing}
                                icon={Building2}
                            />
                            <ProfileField
                                label="Registration ID"
                                {...register('regNumber')}
                                disabled={!isEditing}
                                icon={ShieldCheck}
                            />
                            <div className="md:col-span-2">
                                <ProfileField
                                    label="Registered Address"
                                    {...register('address')}
                                    disabled={!isEditing}
                                    icon={MapPin}
                                />
                            </div>
                            <ProfileField
                                label="Official Society Email"
                                {...register('email')}
                                disabled={!isEditing}
                                icon={Mail}
                            />
                            <ProfileField
                                label="Official Contact"
                                {...register('phone')}
                                disabled={!isEditing}
                                icon={Phone}
                            />
                        </div>
                    </div>

                    {/* Official Information */}
                    <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4 uppercase tracking-tighter">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                                <User className="w-5 h-5" />
                            </div>
                            Administrative Authority
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <ProfileField
                                label="Secretary Full Name"
                                {...register('secretaryName')}
                                disabled={!isEditing}
                                icon={User}
                            />
                            <ProfileField
                                label="Secretary Phone"
                                {...register('secretaryPhone')}
                                disabled={!isEditing}
                                icon={Phone}
                            />
                            <ProfileField
                                label="Administrative Email"
                                {...register('secretaryEmail')}
                                disabled={!isEditing}
                                icon={Mail}
                            />
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none block">System Integrity</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5"><Lock className="w-full h-full" /></div>
                                    <div className="w-full pl-14 pr-6 py-5 rounded-2.5xl bg-slate-50/50 border border-transparent text-slate-400 font-mono tracking-tighter flex items-center justify-between">
                                        <span>••••••••••••</span>
                                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline px-2">Secure Update</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for form fields to match premium UI
const ProfileField = React.forwardRef(({ label, icon: Icon, disabled, ...props }, ref) => (
    <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1 leading-none block">{label}</label>
        <div className="relative group">
            {Icon && (
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors ${!disabled && 'group-focus-within:text-indigo-600'}`}>
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <input
                ref={ref}
                disabled={disabled}
                className={`w-full ${Icon ? 'pl-14' : 'px-6'} py-5 rounded-2.5xl border transition-all font-bold text-slate-700 ${disabled
                    ? 'bg-slate-50/50 border-transparent text-slate-400 cursor-not-allowed'
                    : 'bg-white border-indigo-100 ring-8 ring-indigo-50 focus:ring-indigo-100/50 focus:outline-none focus:border-indigo-400 text-slate-800'
                    }`}
                {...props}
            />
        </div>
    </div>
));

export default Profile;
