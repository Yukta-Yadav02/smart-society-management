import React, { useState, useEffect } from 'react';
import {
    Building2,
    User,
    Mail,
    Phone,
    ShieldCheck
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { AUTH_API } from '../../services/apis';

import { updateProfile } from '../../store/store';

// COMMON UI COMPONENTS
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';

const Profile = () => {
    const dispatch = useDispatch();
    const profileData = useSelector((state) => state.profile.data);
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
                title="Society Profile"
                subtitle="Official configuration and administrative identity."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column - Identity */}
                <div className="space-y-8">
                    <Card className="p-10 text-center relative overflow-hidden group">
                        <div className="w-36 h-36 rounded-3xl bg-slate-50 mx-auto flex items-center justify-center text-indigo-600 border-[6px] border-white shadow-xl mb-6 relative group-hover:scale-105 transition-transform duration-500">
                            <Building2 size={64} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase mb-2">{profileData?.name || 'Admin Name'}</h2>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> {profileData?.role || 'ADMIN'}
                        </div>
                    </Card>
                </div>

                {/* Right Column - Detailed Form */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-10">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tight">
                            <User className="text-indigo-600" size={20} />
                            Admin Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input label="Full Name" value={profileData?.name || ''} disabled={true} icon={User} />
                            <Input label="Email Address" value={profileData?.email || ''} disabled={true} icon={Mail} />
                            <Input label="Phone Number" value={profileData?.phone || ''} disabled={true} icon={Phone} />
                            <Input label="Role" value={profileData?.role || 'ADMIN'} disabled={true} icon={ShieldCheck} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
