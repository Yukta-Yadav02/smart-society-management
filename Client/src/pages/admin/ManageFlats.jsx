import React, { useState, useEffect } from 'react';
import {
    Building2,
    Plus,
    Search,
    Filter,
    ChevronDown,
    ExternalLink,
    MapPin,
    Layers,
    X,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { FLAT_API, WING_API } from '../../services/apis';
import { addFlat, setFlats } from '../../store/store';

// 🛡️ FORM VALIDATION SCHEMA (Yup)
const schema = yup.object().shape({
    flatNumber: yup.string().required('Flat number is required').matches(/^\d+$/, 'Must be a number'),
    wingId: yup.string().required('Wing is required'),
});

const ManageFlats = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 📥 REDUX STATE
    const flats = useSelector((state) => state.flats.items);

    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWing, setSelectedWing] = useState('All Wings');
    const [showWingDropdown, setShowWingDropdown] = useState(false);
    const [wings, setWings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Wings
                const wingRes = await apiConnector("GET", WING_API.GET_ALL);
                if (wingRes.success) {
                    setWings(wingRes.data);
                }

                // Fetch Flats
                const flatRes = await apiConnector("GET", FLAT_API.CREATE);
                if (flatRes.success) {
                    dispatch(setFlats(flatRes.data));
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error("Failed to fetch society data");
            }
        };
        fetchData();
    }, [dispatch]);

    // 📝 REACT HOOK FORM SETUP
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const res = await apiConnector("POST", FLAT_API.CREATE, {
                flatNumber: data.flatNumber,
                wingId: data.wingId
            });

            if (res.success) {
                dispatch(addFlat(res.data));
                toast.success(`Flat ${data.flatNumber} added successfully!`, {
                    icon: '🏢',
                });
                reset();
                setShowAddModal(false);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to create flat');
        }
    };

    const StatusBadge = ({ status }) => {
        const isOccupied = status === true || status === 'Occupied';
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 ${isOccupied ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                {isOccupied ? 'Occupied' : 'Vacant'}
            </span>
        );
    };

    const filteredFlats = (flats || []).filter(f => {
        const matchesSearch = (f.flatNumber || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.wing?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesWing = selectedWing === 'All Wings' || (f.wing?.name === selectedWing.split(' ')[0]);
        return matchesSearch && matchesWing;
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Manage Flats</h1>
                    <p className="text-slate-500 mt-1 font-bold">Efficiently track and organize society residential units.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-widest text-[10px]"
                >
                    <Plus className="w-5 h-5" />
                    Add New Flat
                </button>
            </div>

            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm mb-10 flex flex-col md:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by flat or wing..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-4 py-4 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 font-bold"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto p-1 relative">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-[1.5rem] border border-slate-100 text-slate-600 hover:bg-slate-50 transition-all font-black text-xs uppercase tracking-widest">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <div className="relative flex-1 md:flex-none">
                        <button
                            onClick={() => setShowWingDropdown(!showWingDropdown)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-[1.5rem] border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all font-black text-xs whitespace-nowrap uppercase tracking-widest"
                        >
                            {selectedWing}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showWingDropdown ? 'rotate-180' : 'rotate-0'}`} />
                        </button>

                        {showWingDropdown && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                {['All Wings'].map((wing) => (
                                    <button
                                        key={wing}
                                        onClick={() => {
                                            setSelectedWing(wing);
                                            setShowWingDropdown(false);
                                        }}
                                        className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${selectedWing === wing ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {wing}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFlats.map((flat) => (
                    <div
                        key={flat._id || flat.id}
                        className="bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group overflow-hidden"
                    >
                        <div className={`rounded-[2rem] p-6 ${flat.isOccupied ? 'bg-slate-50/50' : 'bg-indigo-50/30'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${flat.isOccupied ? 'bg-white text-slate-800 border border-slate-100' : 'bg-indigo-600 text-white'}`}>
                                    {flat.flatNumber}
                                </div>
                                <StatusBadge status={flat.isOccupied} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-600 bg-white/60 p-2.5 rounded-xl border border-white/50">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="font-black text-[10px] uppercase tracking-widest">WING {flat.wing?.name || flat.wing || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 px-3">
                                    <Layers className="w-4 h-4 opacity-40" />
                                    <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Residential Unit</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            {flat.isOccupied ? (
                                <button
                                    onClick={() => navigate('/admin/residents')}
                                    className="w-full py-4 rounded-2xl bg-white border border-slate-100 text-indigo-600 font-extrabold text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                                >
                                    View Resident Info
                                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                </button>
                            ) : (
                                <button className="w-full py-4 rounded-2xl bg-slate-50/50 text-slate-300 font-black text-[10px] uppercase tracking-widest cursor-not-allowed border border-dashed border-slate-200">
                                    Empty Unit
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => setShowAddModal(true)}
                    className="rounded-[2.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-8 text-slate-300 hover:border-indigo-200 hover:text-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[320px]"
                >
                    <div className="w-16 h-16 rounded-full border-4 border-dashed border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                    </div>
                    <p className="font-black text-[10px] uppercase tracking-[0.3em]">Add New Flat</p>
                </button>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-10 pb-6 relative">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); reset(); }}
                                    className="absolute right-8 top-8 w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors focus:outline-none"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100 shadow-sm">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">New Flat</h2>
                                <p className="text-slate-500 font-bold mt-1">Register a new residential unit in the system.</p>
                            </div>

                            <div className="p-10 pt-4 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flat Number</label>
                                    <input
                                        {...register('flatNumber')}
                                        placeholder="e.g. 101"
                                        className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${errors.flatNumber ? 'border-rose-300 ring-2 ring-rose-50' : 'border-transparent'} focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700`}
                                    />
                                    {errors.flatNumber && <p className="text-rose-500 text-[10px] font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.flatNumber.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign to Wing</label>
                                    <select
                                        {...register('wingId')}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:22px_22px] bg-[right_1.5rem_center] bg-no-repeat"
                                    >
                                        <option value="">Select Wing</option>
                                        {wings.map(wing => (
                                            <option key={wing._id} value={wing._id}>{wing.name} Wing</option>
                                        ))}
                                    </select>
                                    {errors.wingId && <p className="text-rose-500 text-[10px] font-bold ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.wingId.message}</p>}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setShowAddModal(false); reset(); }}
                                        className="flex-1 py-4.5 rounded-2xl border border-slate-100 text-slate-500 font-extrabold hover:bg-slate-50 transition-all text-[10px] uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[1.5] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-indigo-100 border border-indigo-500 text-[10px] uppercase tracking-widest"
                                    >
                                        Create Flat
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

export default ManageFlats;