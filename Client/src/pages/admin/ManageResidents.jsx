import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    Building2,
    Trash2,
    Edit,
    X,
    MoreVertical,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { AUTH_API } from '../../services/apis';
import {
    addResident,
    deleteResident,
    updateResident,
    setResidents
} from '../../store/store';

// 🛡️ FORM VALIDATION SCHEMA (Yup)
const schema = yup.object().shape({
    name: yup.string().required('Full name is required').min(3, 'Too short'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone is required').matches(/^\d{10}$/, 'Must be 10 digits'),
    wing: yup.string().required('Wing is required'),
    flat: yup.string().required('Flat number is required'),
    type: yup.string().required('Resident type is required'),
});

const ManageResidents = () => {
    const dispatch = useDispatch();

    // 📥 REDUX STATE
    const residents = useSelector((state) => state.residents.items);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedResidentId, setSelectedResidentId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchResidents = async () => {
            try {
                const res = await apiConnector("GET", AUTH_API.GET_ALL_RESIDENTS);
                if (res.success) {
                    dispatch(setResidents(res.data));
                }
            } catch (err) {
                console.error("Fetch Residents Error:", err);
                toast.error("Failed to load residents directory");
            }
        };
        fetchResidents();
    }, [dispatch]);

    // 📝 REACT HOOK FORM SETUP
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            wing: 'A',
            type: 'Owner'
        }
    });

    const onSubmit = async (data) => {
        try {
            if (isEditing) {
                const res = await apiConnector("PUT", AUTH_API.UPDATE_RESIDENT(selectedResidentId), data);
                if (res.success) {
                    dispatch(updateResident(res.data));
                    toast.success(`${data.name} updated successfully!`, { icon: '🔄' });
                }
            } else {
                // Add default password for new residents if not present in form
                const payload = { ...data, password: "password123", confirmPassword: "password123", role: "Resident" };
                const res = await apiConnector("POST", AUTH_API.REGISTER_RESIDENT, payload);
                if (res.success) {
                    dispatch(addResident(res.data));
                    toast.success(`${data.name} added successfully!`, { icon: '👤' });
                }
            }
            closeModal();
        } catch (err) {
            console.error("Resident Operation Error:", err);
            toast.error(err.message || 'Operation failed');
        }
    };

    const handleEdit = (resident) => {
        setIsEditing(true);
        setSelectedResidentId(resident._id || resident.id);

        setValue('name', resident.name);
        setValue('email', resident.email);
        setValue('phone', resident.phone || '');
        setValue('wing', resident.flat?.wing?.name || resident.wing || 'A');
        setValue('flat', resident.flat?.flatNumber || resident.flat || '');
        setValue('type', resident.type || 'Owner');

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedResidentId(null);
        reset({
            wing: 'A',
            type: 'Owner',
            name: '',
            email: '',
            phone: '',
            flat: ''
        });
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name}?`)) {
            try {
                const res = await apiConnector("DELETE", AUTH_API.DELETE_USER(id));
                if (res.success) {
                    dispatch(deleteResident(id));
                    toast.error(`${name} removed from directory`, { icon: '🗑️' });
                }
            } catch (err) {
                console.error("Delete Error:", err);
                toast.error(err.message || "Failed to remove resident");
            }
        }
    };

    const filteredResidents = (residents || []).filter(r =>
        (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.flat?.flatNumber || r.flat || '').toString().includes(searchQuery)
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight text-shadow-sm uppercase">Residents Directory</h1>
                    <p className="text-slate-500 mt-1 font-bold">Manage and view all registered society members.</p>
                </div>
                <button
                    onClick={() => { setIsEditing(false); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-widest text-[10px]"
                >
                    <Plus className="w-5 h-5" />
                    Add Resident
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Total Residents', value: (residents || []).length, color: 'bg-indigo-50 text-indigo-600', icon: Users },
                    { label: 'Owners', value: (residents || []).filter(r => r.type === 'Owner').length, color: 'bg-emerald-50 text-emerald-600', icon: ShieldCheck },
                    { label: 'Tenants', value: (residents || []).filter(r => r.type === 'Tenant').length, color: 'bg-amber-50 text-amber-600', icon: Building2 },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className={`text-3xl font-black ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]} flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm mb-10">
                <div className="relative w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or flat number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-4 py-4 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 font-bold"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResidents.map((res) => (
                    <div key={res._id || res.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group overflow-hidden">
                        <div className="rounded-[2rem] bg-slate-50/50 p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm overflow-hidden p-1">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${res.name}`} alt={res.name} className="w-full h-full object-cover rounded-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{res.name}</h3>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest mt-1 inline-block ${res.type === 'Owner' || (res.status === 'ACTIVE' && !res.type) ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {res.type || 'Owner'}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-white transition-all">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-500 bg-white/60 p-3 rounded-2xl border border-white/40">
                                    <Building2 className="w-4 h-4 text-indigo-400" />
                                    <span className="text-sm font-bold">
                                        Wing {res.wing || res.flat?.wing?.name || '-'} - Flat {res.flat?.flatNumber || res.flat || '-'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 border border-transparent px-3">
                                    <Mail className="w-4 h-4 text-slate-300" />
                                    <span className="text-xs font-bold truncate">{res.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 border border-transparent px-3">
                                    <Phone className="w-4 h-4 text-slate-300" />
                                    <span className="text-xs font-bold">{res.phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 flex gap-2">
                            <button
                                onClick={() => handleEdit(res)}
                                className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-100 text-slate-400 font-bold text-xs hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(res._id || res.id, res.name)}
                                className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-100 text-slate-400 font-bold text-xs hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-10 pb-6 relative">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="absolute right-8 top-8 w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors focus:outline-none"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100 shadow-sm">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">{isEditing ? 'Edit Resident' : 'Add Resident'}</h2>
                                <p className="text-slate-500 font-bold mt-1">{isEditing ? 'Update member details below.' : 'Register a new member to society records.'}</p>
                            </div>

                            <div className="p-10 pt-4 grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        {...register('name')}
                                        placeholder="John Doe"
                                        className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${errors.name ? 'border-rose-300 ring-2 ring-rose-50' : 'border-transparent'} focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700`}
                                    />
                                    {errors.name && <p className="text-rose-500 text-[10px] font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="john@example.com"
                                        className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${errors.email ? 'border-rose-300 ring-2 ring-rose-50' : 'border-transparent'} focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700`}
                                    />
                                    {errors.email && <p className="text-rose-500 text-[10px] font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        {...register('phone')}
                                        placeholder="91XXXXXXXX"
                                        className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${errors.phone ? 'border-rose-300 ring-2 ring-rose-50' : 'border-transparent'} focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700`}
                                    />
                                    {errors.phone && <p className="text-rose-500 text-[10px] font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4 col-span-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Wing</label>
                                        <select
                                            {...register('wing')}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:22px_22px] bg-[right_1.5rem_center] bg-no-repeat"
                                        >
                                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flat No</label>
                                        <input
                                            {...register('flat')}
                                            placeholder="101"
                                            className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${errors.flat ? 'border-rose-300 ring-2 ring-rose-50' : 'border-transparent'} focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700`}
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resident Type</label>
                                    <div className="flex gap-4">
                                        {['Owner', 'Tenant'].map((t) => (
                                            <label key={t} className="flex-1">
                                                <input
                                                    {...register('type')}
                                                    type="radio"
                                                    value={t}
                                                    className="hidden peer"
                                                />
                                                <div className="w-full py-4 text-center rounded-2xl border border-slate-100 bg-white text-slate-400 font-extrabold cursor-pointer peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-all text-xs uppercase tracking-[0.2em] shadow-sm peer-checked:shadow-indigo-200">
                                                    {t}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2 pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-4.5 rounded-2xl border border-slate-100 text-slate-400 font-black hover:bg-slate-50 transition-all text-xs uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[1.5] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-indigo-100 border border-indigo-500 text-xs uppercase tracking-widest"
                                    >
                                        {isEditing ? 'Update Details' : 'Register Resident'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageResidents;
