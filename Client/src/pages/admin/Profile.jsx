import React, { useState, useEffect } from 'react';
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

import { apiConnector } from '../../services/apiConnector';
import { AUTH_API } from '../../services/apis';

import { updateProfile } from '../../store/store';

// COMMON UI COMPONENTS
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';

const Profile = () => {
    const dispatch = useDispatch();
    const profileData = useSelector((state) => state.profile.data);

    const [isEditing, setIsEditing] = useState(false);

  
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Assuming GET /auth/profile exists or similar
                const res = await apiConnector("GET", AUTH_API.GET_ALL_RESIDENTS + "/profile"); // Use profile endpoint
                if (res.success) {
                    dispatch(updateProfile(res.data));
                }
            } catch (err) {
                console.error("Fetch Profile Error:", err);
            }
        };
        fetchProfile();
    }, [dispatch]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: profileData || {
            societyName: 'Gokuldham Society',
            regNumber: 'MH-RC-2024-X',
            address: 'Powai, Mumbai, Maharashtra 400076',
            email: 'admin@gokuldham.com',
            phone: '+91 98765 43210'
        }
    });

    useEffect(() => {
        if (profileData) {
            reset(profileData);
        }
    }, [profileData, reset]);

    const onSubmit = async (data) => {
        try {
            // Placeholder: Assume UPDATE_PROFILE exists
            // const res = await apiConnector("PUT", "/api/auth/update-profile", data);
            // if (res.success) {
            dispatch(updateProfile(data));
            toast.success('Society profile updated!', { icon: '🏢' });
            setIsEditing(false);
            // }
        } catch (err) {
            toast.error(err.message || "Update failed");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <PageHeader
                title="Society Profile"
                subtitle="Official configuration and administrative identity."
                actionLabel={!isEditing ? "Edit Profile" : "Save Changes"}
                onAction={!isEditing ? () => setIsEditing(true) : handleSubmit(onSubmit)}
                icon={!isEditing ? Edit3 : Save}
            />

            {isEditing && (
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 px-4 py-2"
                    >
                        Cancel Edits
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column - Identity */}
                <div className="space-y-8">
                    <Card className="p-10 text-center relative overflow-hidden group">
                        <div className="w-36 h-36 rounded-3xl bg-slate-50 mx-auto flex items-center justify-center text-indigo-600 border-[6px] border-white shadow-xl mb-6 relative group-hover:scale-105 transition-transform duration-500">
                            <Building2 size={64} />
                            {isEditing && (
                                <div className="absolute inset-0 bg-indigo-600/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                                    <Camera className="text-white" size={24} />
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase mb-2">{profileData?.societyName || 'Gokuldham Society'}</h2>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> Registered Society
                        </div>
                    </Card>

                    <Card className="bg-indigo-600 p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-100">
                        <div className="relative z-10">
                            <h3 className="font-black text-lg uppercase tracking-widest flex items-center gap-2 mb-6">
                                <LayoutGrid size={20} /> Storage
                            </h3>
                            <div className="space-y-4">
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-white h-full transition-all duration-1000" style={{ width: '45%' }} />
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <p className="opacity-60">4.5 GB Used</p>
                                    <p>10.0 GB Total</p>
                                </div>
                            </div>
                            <button className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                Upgrade Plan <ArrowRight size={14} />
                            </button>
                        </div>
                        <PieChart size={150} className="absolute -bottom-10 -right-10 text-white/5 -z-0 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                    </Card>
                </div>

                {/* Right Column - Detailed Form */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-10">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tight">
                            <Globe className="text-indigo-600" size={20} />
                            Core Records
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input label="Society Name" register={register('societyName')} disabled={!isEditing} icon={Building2} />
                            <Input label="Registration ID" register={register('regNumber')} disabled={!isEditing} icon={ShieldCheck} />
                            <div className="md:col-span-2">
                                <Input label="Registered Address" register={register('address')} disabled={!isEditing} icon={MapPin} />
                            </div>
                            <Input label="Society Email" register={register('email')} disabled={!isEditing} icon={Mail} />
                            <Input label="Society Phone" register={register('phone')} disabled={!isEditing} icon={Phone} />
                        </div>
                    </Card>

                    <Card className="p-10">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tight">
                            <User className="text-indigo-600" size={20} />
                            Administrative Authority
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input label="Secretary Name" register={register('secretaryName')} disabled={!isEditing} icon={User} />
                            <Input label="Secretary Phone" register={register('secretaryPhone')} disabled={!isEditing} icon={Phone} />
                            <Input label="Admin Email" register={register('secretaryEmail')} disabled={!isEditing} icon={Mail} />
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Security</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"><Lock size={18} /></div>
                                    <div className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-slate-50 border border-transparent text-slate-400 font-mono tracking-tighter flex items-center justify-between text-xs">
                                        <span>••••••••••••</span>
                                        <button type="button" className="text-indigo-600 font-black uppercase text-[9px] tracking-widest hover:underline">Reset</button>
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
