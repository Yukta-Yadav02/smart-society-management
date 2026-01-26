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

const Profile = () => {

    /* 🔹 TEMP DATA (Branch-2) */
    const [profileData, setProfileData] = useState({
        societyName: 'Gokuldham Society',
        regNumber: 'MH-12345',
        address: 'Gokuldham, Goregaon East, Mumbai',
        email: 'gokuldham@society.com',
        phone: '9876543210',
        secretaryName: 'Yukta Yadav',
        secretaryPhone: '9123456789',
        secretaryEmail: 'secretary@gokuldham.com',
        storageUsedGb: 32,
        storageTotalGb: 100
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">
                        Society Profile
                    </h1>
                    <p className="text-slate-400 mt-1 font-bold text-sm">
                        Official configuration and administrative identity.
                    </p>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-[0.2em] text-[10px]"
                    >
                        <Edit3 className="w-5 h-5" /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-white px-8 py-4 rounded-[1.5rem] font-black border text-slate-500 uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-emerald-600 text-white px-10 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-emerald-100 border border-emerald-500 uppercase tracking-[0.2em] text-[10px]"
                        >
                            <Save className="w-5 h-5" /> Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* LEFT COLUMN */}
                <div className="space-y-10">

                    {/* IDENTITY CARD */}
                    <div className="bg-white p-10 rounded-[3.5rem] border shadow-sm text-center relative">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 mx-auto flex items-center justify-center text-indigo-600 border-[8px] border-white shadow-2xl mb-8 relative">
                            <Building2 className="w-16 h-16" />
                            {isEditing && (
                                <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            )}
                        </div>

                        <h2 className="text-3xl font-black uppercase mb-2">
                            {profileData.societyName}
                        </h2>

                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase">
                            <ShieldCheck className="w-4 h-4" />
                            Registered Society
                        </div>
                    </div>

                    {/* STORAGE */}
                    <div className="bg-indigo-700 p-10 rounded-[3.5rem] text-white shadow-xl relative">
                        <div className="flex justify-between mb-6">
                            <h3 className="font-black uppercase flex items-center gap-2">
                                <LayoutGrid className="w-5 h-5" /> Analytics Storage
                            </h3>
                            <PieChart className="w-6 h-6 text-indigo-200" />
                        </div>

                        <div className="space-y-4">
                            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-white h-full"
                                    style={{
                                        width: `${(profileData.storageUsedGb / profileData.storageTotalGb) * 100}%`
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase">
                                <span>{profileData.storageUsedGb} GB Used</span>
                                <span>{profileData.storageTotalGb} GB</span>
                            </div>
                        </div>

                        <button className="mt-10 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
                            Upgrade Storage <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-2 space-y-10">

                    {/* SOCIETY INFO */}
                    <ProfileSection title="Core Society Records" icon={Globe}>
                        <ProfileField label="Society Name" name="societyName" value={profileData.societyName} onChange={handleChange} disabled={!isEditing} icon={Building2} />
                        <ProfileField label="Registration ID" name="regNumber" value={profileData.regNumber} onChange={handleChange} disabled={!isEditing} icon={ShieldCheck} />
                        <ProfileField label="Registered Address" name="address" value={profileData.address} onChange={handleChange} disabled={!isEditing} icon={MapPin} full />
                        <ProfileField label="Official Email" name="email" value={profileData.email} onChange={handleChange} disabled={!isEditing} icon={Mail} />
                        <ProfileField label="Official Contact" name="phone" value={profileData.phone} onChange={handleChange} disabled={!isEditing} icon={Phone} />
                    </ProfileSection>

                    {/* ADMIN INFO */}
                    <ProfileSection title="Administrative Authority" icon={User}>
                        <ProfileField label="Secretary Name" name="secretaryName" value={profileData.secretaryName} onChange={handleChange} disabled={!isEditing} icon={User} />
                        <ProfileField label="Secretary Phone" name="secretaryPhone" value={profileData.secretaryPhone} onChange={handleChange} disabled={!isEditing} icon={Phone} />
                        <ProfileField label="Administrative Email" name="secretaryEmail" value={profileData.secretaryEmail} onChange={handleChange} disabled={!isEditing} icon={Mail} />

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase">System Integrity</label>
                            <div className="flex items-center justify-between bg-slate-50 px-6 py-5 rounded-2xl text-slate-400 font-mono">
                                ••••••••••
                                <button className="text-indigo-600 text-[10px] font-black uppercase">
                                    Secure Update
                                </button>
                            </div>
                        </div>
                    </ProfileSection>
                </div>
            </div>
        </div>
    );
};

/* 🔹 UI HELPERS */
const ProfileSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-12 rounded-[3.5rem] border shadow-sm">
        <h3 className="text-2xl font-black uppercase flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl">
                <Icon className="w-5 h-5" />
            </div>
            {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">{children}</div>
    </div>
);

const ProfileField = ({ label, icon: Icon, full, ...props }) => (
    <div className={full ? 'md:col-span-2 space-y-4' : 'space-y-4'}>
        <label className="text-[10px] font-black text-slate-400 uppercase">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />}
            <input
                {...props}
                className={`w-full ${Icon ? 'pl-14' : 'px-6'} py-5 rounded-2xl font-bold border ${
                    props.disabled
                        ? 'bg-slate-50 border-transparent text-slate-400'
                        : 'bg-white border-indigo-100 ring-8 ring-indigo-50'
                }`}
            />
        </div>
    </div>
);

export default Profile;
