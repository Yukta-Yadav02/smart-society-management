import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    User,
    Mail,
    Phone,
    Building,
    MapPin,
    Shield,
    Calendar,
    Edit2,
    Save,
    Camera
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { roleBgClass } from '../../utils/userHelpers';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // We'll use local state for the form, initialized with user data
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || 'Not provided',
        address: user?.address || 'Not provided',
        bio: 'No bio added yet.'
    });

    const handleSave = () => {
        // In a real app, you would call an API here to update the user profile
        toast.success("Profile updated successfully!");
        setIsEditing(false);
    };

    if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

    const RoleBadge = () => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${roleBgClass(user.role)}`}>
            {user.role}
        </span>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Cover */}
            <div className="relative h-48 rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 right-4">
                    <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                        <Camera className="w-4 h-4" /> Change Cover
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 px-4 -mt-16 relative z-10">
                {/* Left Column: Avatar & Quick Stats */}
                <div className="flex-shrink-0 flex flex-col items-center md:items-start space-y-4">
                    <div className="relative group">
                        <div className={`w-32 h-32 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-4xl font-bold text-white overflow-hidden ${roleBgClass(user.role)}`}>
                            {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user.name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <button className="absolute bottom-2 right-2 bg-slate-900/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-black text-slate-800">{user.name}</h1>
                        <p className="text-slate-500 font-medium">{user.email}</p>
                        <div className="mt-2">
                            <RoleBadge />
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex-1 pt-4 md:pt-16 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-500" />
                            Personal Information
                        </h2>
                        <Button
                            variant={isEditing ? "primary" : "secondary"}
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            icon={isEditing ? Save : Edit2}
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                            {isEditing ? (
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            ) : (
                                <div className="text-slate-700 font-semibold">{user.name}</div>
                            )}
                        </Card>

                        <Card className="p-4 space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <div className="text-slate-700 font-semibold flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {user.email}
                            </div>
                        </Card>

                        <Card className="p-4 space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                            {isEditing ? (
                                <input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            ) : (
                                <div className="text-slate-700 font-semibold flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {formData.phone}
                                </div>
                            )}
                        </Card>

                        <Card className="p-4 space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Joined On</label>
                            <div className="text-slate-700 font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                        </Card>
                    </div>

                    {/* Role Specific Details */}
                    {user.role === 'RESIDENT' && (
                        <>
                            <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2 mt-8">
                                <Home className="w-5 h-5 text-emerald-500" />
                                Residence Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">🏢</div>
                                        <div>
                                            <p className="text-sm text-slate-500 font-medium">Flat Number</p>
                                            <p className="text-2xl font-black text-slate-800">{user.flatNumber || 'Not Assigned'}</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">📍</div>
                                        <div>
                                            <p className="text-sm text-slate-500 font-medium">Wing</p>
                                            <p className="text-2xl font-black text-slate-800">{user.wing || 'Not Assigned'}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}

                    {user.role === 'SECURITY' && (
                        <>
                            <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2 mt-8">
                                <Shield className="w-5 h-5 text-blue-500" />
                                Security Details
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <Card className="p-6 border-l-4 border-l-blue-500">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 rounded-xl">
                                            <Shield className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-slate-800">Gate Security Access</p>
                                            <p className="text-slate-500 text-sm">You have authorization to manage visitor entries and exits.</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper icon component for conditional rendering
import { Home } from 'lucide-react';

export default ProfilePage;
