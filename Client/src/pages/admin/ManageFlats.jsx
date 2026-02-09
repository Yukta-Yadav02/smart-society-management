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
    AlertCircle,
    Users,
    Home,

    Trash2,
    MoreVertical,
    Grid3X3,
    BarChart3,
    Pencil,
    Eye,
    Soup,
    Hash,
    ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import showToast from '../../utils/toast';

import { apiConnector } from '../../services/apiConnector';
import { FLAT_API, WING_API } from '../../services/apis';
import { addFlat, setFlats } from '../../store/store';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// 🛡️ FORM VALIDATION SCHEMA (Yup)
const schema = yup.object().shape({
    flatNumber: yup.string().required('Flat number is required'),
    wingId: yup.string().required('Wing is required'),
    kitchen: yup.string().default('1'),
    capacity: yup.number().typeError('Must be a number').min(1, 'At least 1 person').max(20, 'Too many people').default(4),
});

const ManageFlats = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 📥 REDUX STATE
    const flats = useSelector((state) => state.flats.items);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedFlatForDetails, setSelectedFlatForDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWing, setSelectedWing] = useState('All Wings');
    const [showWingDropdown, setShowWingDropdown] = useState(false);
    const [wings, setWings] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showOwnershipModal, setShowOwnershipModal] = useState(false);
    const [ownershipSummary, setOwnershipSummary] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Wings
                const wingRes = await apiConnector("GET", WING_API.GET_ALL);
                if (wingRes.success) {
                    setWings(wingRes.data);
                }

                // Fetch Flats
                const flatRes = await apiConnector("GET", FLAT_API.CREATE);
                if (flatRes.success) {
                    const cleanedFlats = flatRes.data.map(flat => ({
                        ...flat,
                        residentName: flat.resident?.name || flat.currentResident?.name || null
                    }));

                    dispatch(setFlats(cleanedFlats));
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                showToast.error("Failed to fetch society data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Listen for flat assignment events
        const handleFlatAssigned = (event) => {
            console.log('Flat assigned event received:', event.detail);
            fetchData();
        };

        window.addEventListener('flatAssigned', handleFlatAssigned);

        return () => {
            window.removeEventListener('flatAssigned', handleFlatAssigned);
        };
    }, [dispatch]);

    // 📝 REACT HOOK FORM SETUP
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const res = await apiConnector("POST", FLAT_API.CREATE, {
                flatNumber: data.flatNumber,
                wingId: data.wingId,
                kitchen: data.kitchen,
                capacity: data.capacity
            });

            if (res.success) {
                dispatch(addFlat(res.data));
                showToast.created(`Flat ${data.flatNumber} created successfully!`);
                reset();
                setShowAddModal(false);
            }
        } catch (err) {
            showToast.error(err.message || 'Failed to create flat');
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
    // [OWNERSHIP FLOW] - Get default owner name based on wing for display fallback
    const getExpectedOwner = (wingName) => {
        const name = wingName?.toUpperCase() || '';
        if (name.includes('A')) return 'Ram';
        if (name.includes('B')) return 'Riya';
        if (name.includes('C')) return 'Priya';
        if (name.includes('D')) return 'Himanshu';
        return 'Society Admin';
    };

    const filteredFlats = (flats || []).filter(f => {
        const matchesSearch = (f.flatNumber || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.wing?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.resident?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.owner?.name || '').toLowerCase().includes(searchQuery.toLowerCase()); // [OWNERSHIP FLOW] - Search by Owner name
        const matchesWing = selectedWing === 'All Wings' || (f.wing?.name === selectedWing);
        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'occupied' && f.isOccupied) ||
            (selectedStatus === 'vacant' && !f.isOccupied);
        return matchesSearch && matchesWing && matchesStatus;
    });

    const stats = {
        total: flats?.length || 0,
        occupied: flats?.filter(f => f.isOccupied)?.length || 0,
        vacant: flats?.filter(f => !f.isOccupied)?.length || 0
    };

    const handleVacateFlat = async (flatId) => {
        if (window.confirm('Are you sure you want to vacate this flat?')) {
            try {
                const res = await apiConnector("PUT", FLAT_API.VACATE(flatId));
                if (res.success) {
                    const updatedFlats = flats.map(f =>
                        f._id === flatId ? { ...f, isOccupied: false, resident: null } : f
                    );
                    dispatch(setFlats(updatedFlats));
                    showToast.vacated('Flat vacated successfully!');
                    window.location.reload();
                }
            } catch (err) {
                showToast.error('Failed to vacate flat');
            }
        }
    };

    const handleDeleteFlat = async (flatId) => {
        if (window.confirm('Are you sure you want to delete this flat?')) {
            try {
                const res = await apiConnector("DELETE", FLAT_API.DELETE(flatId));

                if (res.success) {
                    // Update Redux
                    const updatedFlats = flats.filter(f => f._id !== flatId);
                    dispatch(setFlats(updatedFlats));

                    showToast.deleted('Flat deleted successfully!');
                }
            } catch (err) {
                console.error("Delete Error:", err);
                showToast.error(err.response?.data?.message || 'Failed to delete flat');
            }
        }
    };

    const handleViewDetails = (flat) => {
        setSelectedFlatForDetails(flat);
        setShowDetailsModal(true);
        setShowActionMenu(null);
    };

    // [OWNERSHIP FLOW] - Initialize ownership for all unassigned flats with beautiful UI
    const handleInitializeOwnership = async () => {
        setIsInitializing(true);
        try {
            const res = await apiConnector("POST", FLAT_API.INITIALIZE_OWNERSHIP);
            if (res.success) {
                setOwnershipSummary(res);
                showToast.success(res.message || "Ownership Linked Successfully!");

                // Refresh data
                const flatRes = await apiConnector("GET", FLAT_API.CREATE);
                if (flatRes.success) {
                    const cleanedFlats = flatRes.data.map(flat => ({
                        ...flat,
                        residentName: flat.resident?.name || flat.currentResident?.name || null
                    }));
                    dispatch(setFlats(cleanedFlats));
                }
            }
        } catch (err) {
            showToast.error(err.message || 'Failed to initialize ownership');
        } finally {
            setIsInitializing(false);
        }
    };

    const ActionMenu = ({ flat, onClose }) => (
        <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-30 animate-in fade-in zoom-in-95 duration-200">
            <button
                onClick={() => handleViewDetails(flat)}
                className="w-full text-left px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
            >
                <Eye className="w-4 h-4" /> View Details
            </button>

            <button
                onClick={() => handleDeleteFlat(flat._id)}
                className="w-full text-left px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
                <Trash2 className="w-4 h-4" /> Delete Flat
            </button>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* [OWNERSHIP FLOW] - Premium Initialization Modal */}
            {showOwnershipModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                        {!ownershipSummary ? (
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
                                        <ShieldCheck className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <button onClick={() => setShowOwnershipModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase mb-2">Society Ownership Sync</h2>
                                <p className="text-slate-500 font-bold mb-8">Establish official ownership records for all wings. This will link every vacant flat to its respective society admin.</p>

                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    {[
                                        { wing: 'Wing A', owner: 'Ram', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                                        { wing: 'Wing B', owner: 'Riya', color: 'bg-rose-50 text-rose-600 border-rose-100' },
                                        { wing: 'Wing C', owner: 'Priya', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                                        { wing: 'Wing D', owner: 'Himanshu', color: 'bg-amber-50 text-amber-600 border-amber-100' }
                                    ].map((w, i) => (
                                        <div key={i} className={`p-4 rounded-2xl border ${w.color} flex flex-col items-center justify-center gap-1 group hover:scale-105 transition-transform cursor-default shadow-sm`}>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{w.wing}</span>
                                            <span className="text-sm font-black uppercase text-center">{w.owner} (Admin)</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 mb-8">
                                    <div className="flex gap-4 items-center text-slate-600">
                                        <AlertCircle className="w-6 h-6 text-indigo-500 shrink-0" />
                                        <p className="text-xs font-bold leading-relaxed italic">Real owners who occupy flats (like Saloni or Bhavish) will be preserved as primary malkins based on database records.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setShowOwnershipModal(false)} className="flex-1 py-4.5 rounded-2xl bg-slate-50 text-slate-400 font-black hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest">Cancel</button>
                                    <button
                                        onClick={handleInitializeOwnership}
                                        disabled={isInitializing}
                                        className={`flex-[1.5] py-4.5 rounded-2xl bg-indigo-600 text-white font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${isInitializing ? 'opacity-70' : ''}`}
                                    >
                                        {isInitializing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                        Initialize Ownership
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100 shadow-sm mx-auto mb-6 animate-bounce">
                                    <ShieldCheck className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase mb-2">Sync Success!</h2>
                                <p className="text-slate-500 font-bold mb-8">Society ownership is now officially registered in the blockchain records.</p>

                                <div className="space-y-3 mb-10 text-left">
                                    <div className="flex justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                        <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Actual Owners Identified</span>
                                        <span className="text-lg font-black text-indigo-600">{ownershipSummary.residentsUpdated || 0}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {ownershipSummary.summary?.map((s, i) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.wing}</p>
                                                <p className="text-xs font-black text-slate-700">{s.owner}: {s.count} Flats</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setShowOwnershipModal(false); setOwnershipSummary(null); }}
                                    className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                >
                                    Experience Updated Directory
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Manage Flats</h1>
                    <p className="text-slate-500 mt-1 font-bold">Efficiently track and organize society residential units.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                        >
                            <BarChart3 className="w-4 h-4" />
                        </button>
                    </div>
                    <Button onClick={() => setShowOwnershipModal(true)} variant="secondary" icon={ShieldCheck}>
                        Init Owners
                    </Button>
                    <Button onClick={() => setShowAddModal(true)} icon={Plus}>
                        Add New Flat
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Flats</p>
                            <p className="text-3xl font-black text-slate-800">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Occupied</p>
                            <p className="text-3xl font-black text-emerald-600">{stats.occupied}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Vacant</p>
                            <p className="text-3xl font-black text-amber-600">{stats.vacant}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Home className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by flat number, wing, or resident..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-slate-700 font-medium"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:outline-none font-medium text-slate-700"
                        >
                            <option value="all">All Status</option>
                            <option value="occupied">Occupied</option>
                            <option value="vacant">Vacant</option>
                        </select>
                        <select
                            value={selectedWing}
                            onChange={(e) => setSelectedWing(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:outline-none font-medium text-slate-700"
                        >
                            <option value="All Wings">All Wings</option>
                            {wings.map((wing) => (
                                <option key={wing._id} value={wing.name}>Wing {wing.name}</option>
                            ))}
                        </select>

                    </div>
                </div>
            </Card>

            {/* Flats Grid/List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFlats.map((flat) => (
                        <Card
                            key={flat._id || flat.id}
                            className="p-6 group relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${flat.isOccupied ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                    {flat.flatNumber}
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={flat.isOccupied} />
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowActionMenu(showActionMenu === flat._id ? null : flat._id)}
                                            className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            <MoreVertical className="w-4 h-4 text-slate-400" />
                                        </button>
                                        {showActionMenu === flat._id && (
                                            <ActionMenu flat={flat} onClose={() => setShowActionMenu(null)} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium">Wing {flat.wing?.name || flat.wing || '-'}</span>
                                </div>
                                {flat.isOccupied && (flat.resident?.name || flat.residentName) ? (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-medium">Resident: {flat.resident?.name || flat.residentName}</span>
                                    </div>
                                ) : flat.isOccupied ? (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-medium italic">Recently assigned</span>
                                    </div>
                                ) : null}

                                {/* [OWNERSHIP FLOW] - Prioritize Database Owner, then Resident-Owner, then Wing Fallback */}
                                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50">
                                    <Home className="w-4 h-4 text-indigo-400" />
                                    <span className="text-xs font-bold uppercase tracking-tight">
                                        Owner: {
                                            flat.owner?.name ||
                                            (flat.currentResident?.residentType === 'OWNER' ? flat.currentResident.name : null) ||
                                            getExpectedOwner(flat.wing?.name || flat.wing)
                                        }
                                    </span>
                                </div>
                            </div>

                            {flat.isOccupied ? (
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate('/admin/residents')}
                                        icon={ExternalLink}
                                        className="text-xs flex-1"
                                    >
                                        View Resident
                                    </Button>

                                </div>
                            ) : (
                                <div className="w-full py-3 rounded-xl bg-slate-50 text-slate-400 text-center text-sm font-medium border border-dashed border-slate-200">
                                    Available
                                </div>
                            )}
                        </Card>
                    ))}

                    <Card
                        onClick={() => setShowAddModal(true)}
                        className="p-8 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-all group min-h-[280px] flex flex-col items-center justify-center"
                        hover={false}
                    >
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 group-hover:border-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                            <Plus className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                        </div>
                        <p className="text-slate-500 group-hover:text-indigo-600 font-medium text-sm">Add New Flat</p>
                    </Card>
                </div>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Flat</th>
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Wing</th>
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Resident</th>
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Owner</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFlats.map((flat) => (
                                    <tr key={flat._id || flat.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${flat.isOccupied ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                    {flat.flatNumber}
                                                </div>
                                                <span className="font-medium text-slate-700">Flat {flat.flatNumber}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600">
                                            Wing {flat.wing?.name || flat.wing || '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <StatusBadge status={flat.isOccupied} />
                                        </td>
                                        <td className="py-4 px-6 text-slate-600">
                                            {flat.isOccupied && (flat.resident?.name || flat.residentName) ?
                                                flat.resident?.name || flat.residentName :
                                                flat.isOccupied ? 'Resident assigned' : '-'
                                            }
                                        </td>
                                        {/* [OWNERSHIP FLOW] - Owner column in table */}
                                        <td className="py-4 px-6">
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                                {
                                                    flat.owner?.name ||
                                                    (flat.currentResident?.residentType === 'OWNER' ? flat.currentResident.name : null) ||
                                                    getExpectedOwner(flat.wing?.name || flat.wing)
                                                }
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(flat)}
                                                    className="p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 text-emerald-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFlat(flat._id)}
                                                    className="p-2 rounded-lg hover:bg-rose-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-rose-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Add Flat Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">Add New Flat</h2>
                                            <p className="text-sm text-slate-500">Create a new residential unit</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setShowAddModal(false); reset(); }}
                                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Flat Number</label>
                                    <input
                                        {...register('flatNumber')}
                                        placeholder="e.g. 101"
                                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.flatNumber ? 'border-rose-300 focus:border-rose-400' : 'border-transparent focus:border-indigo-200'} focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700`}
                                    />
                                    {errors.flatNumber && (
                                        <p className="text-rose-500 text-sm flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.flatNumber.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Wing</label>
                                    <select
                                        {...register('wingId')}
                                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.wingId ? 'border-rose-300 focus:border-rose-400' : 'border-transparent focus:border-indigo-200'} focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700`}
                                    >
                                        <option value="">Select Wing</option>
                                        {wings.map(wing => (
                                            <option key={wing._id} value={wing._id}>Wing {wing.name}</option>
                                        ))}
                                    </select>
                                    {errors.wingId && (
                                        <p className="text-rose-500 text-sm flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.wingId.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Kitchen Type</label>
                                        <div className="relative">
                                            <Soup className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <select
                                                {...register('kitchen')}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700"
                                            >
                                                <option value="1 Kitchen">1 Kitchen</option>
                                                <option value="2 Kitchen">2 Kitchen</option>
                                                <option value="Modular">Modular</option>
                                                <option value="Open">Open</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Can stay (Max)</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="number"
                                                {...register('capacity')}
                                                placeholder="e.g. 4"
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border ${errors.capacity ? 'border-rose-300' : 'border-transparent'} focus:bg-white focus:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 flex gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => { setShowAddModal(false); reset(); }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    fullWidth
                                    icon={Plus}
                                >
                                    Create Flat
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Flat Details Modal */}
            {showDetailsModal && selectedFlatForDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl font-black text-indigo-600 border border-indigo-100">
                                    {selectedFlatForDetails.flatNumber}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Flat Information</h2>
                                    <p className="text-sm text-slate-500 font-medium">Detailed view of residential unit</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setShowDetailsModal(false); setSelectedFlatForDetails(null); }}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-400 hover:text-rose-500"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Wing / Block</p>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <MapPin className="w-4 h-4 text-indigo-500" />
                                        <p className="font-bold text-lg">Wing {selectedFlatForDetails.wing?.name || selectedFlatForDetails.wing || '-'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Current Status</p>
                                    <div className="pt-1">
                                        <StatusBadge status={selectedFlatForDetails.isOccupied} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Kitchen Type</p>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Soup className="w-4 h-4 text-orange-500" />
                                        <p className="font-bold">{selectedFlatForDetails.kitchen || 'Standard'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Max Capacity</p>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <p className="font-bold">{selectedFlatForDetails.capacity || '4'} Persons</p>
                                    </div>
                                </div>
                            </div>

                            {/* [OWNERSHIP FLOW] - Owner Details Section */}
                            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 relative overflow-hidden group">
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Home className="w-4 h-4 text-indigo-500" />
                                        <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-black">Owner Details (Malik)</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg font-black text-slate-800">
                                            {
                                                selectedFlatForDetails.owner?.name ||
                                                (selectedFlatForDetails.currentResident?.residentType === 'OWNER' ? selectedFlatForDetails.currentResident.name : null) ||
                                                getExpectedOwner(selectedFlatForDetails.wing?.name || selectedFlatForDetails.wing)
                                            }
                                        </p>
                                        {selectedFlatForDetails.owner?.email && (
                                            <p className="text-xs text-slate-500 font-medium">{selectedFlatForDetails.owner.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Users className="w-4 h-4 text-indigo-500" />
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Occupant Details</p>
                                    </div>

                                    {selectedFlatForDetails.isOccupied ? (
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-slate-500 font-medium mb-1">Full Name</p>
                                                <p className="text-lg font-black text-slate-800">{selectedFlatForDetails.resident?.name || selectedFlatForDetails.residentName || 'N/A'}</p>
                                            </div>
                                            {selectedFlatForDetails.resident?.email && (
                                                <div>
                                                    <p className="text-sm text-slate-500 font-medium mb-1">Email Address</p>
                                                    <p className="text-slate-700 font-bold">{selectedFlatForDetails.resident.email}</p>
                                                </div>
                                            )}
                                            <div className="pt-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setShowDetailsModal(false);
                                                        navigate('/admin/residents');
                                                    }}
                                                    icon={ExternalLink}
                                                    fullWidth
                                                >
                                                    Full Resident Profile
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-2">
                                            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                <p className="text-sm font-bold">This flat is currently vacant and available for assignment.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">Last Updated</p>
                                    <p className="text-sm font-bold text-slate-600">
                                        {selectedFlatForDetails.updatedAt ? new Date(selectedFlatForDetails.updatedAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        }) : 'Recently'}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">ID Reference</p>
                                    <p className="text-[10px] font-mono font-bold text-slate-400 truncate tracking-tight">{selectedFlatForDetails._id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => { setShowDetailsModal(false); setSelectedFlatForDetails(null); }}
                            >
                                Close View
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFlats;