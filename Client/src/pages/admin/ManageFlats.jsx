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
    Eye,
    Edit3,
    Trash2,
    MoreVertical,
    Grid3X3,
    BarChart3
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
    const [viewMode, setViewMode] = useState('grid');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    // Mark flat as occupied if it has resident data
                    const cleanedFlats = flatRes.data.map(flat => {
                        // Check if flat has any resident data
                        const hasResidentName = flat.resident && flat.resident.name && flat.resident.name.trim() !== '';
                        const hasCurrentResident = flat.currentResident !== null && flat.currentResident !== undefined;
                        
                        // Mark as occupied if there's any resident information
                        const isActuallyOccupied = hasResidentName || hasCurrentResident;
                        
                        return { 
                            ...flat, 
                            isOccupied: isActuallyOccupied,
                            residentName: flat.resident?.name || null
                        };
                    });
                    
                    // Auto-vacate B-107 and B-102 if they exist
                    const flatsToVacate = cleanedFlats.filter(f => 
                        (f.flatNumber === 'B-107' || f.flatNumber === 'B-102' || f.flatNumber === '107' || f.flatNumber === '102') &&
                        f.wing?.name === 'B' && f.isOccupied
                    );
                    
                    for (const flat of flatsToVacate) {
                        try {
                            await apiConnector("PUT", FLAT_API.VACATE(flat._id));
                            console.log(`Auto-vacated flat ${flat.flatNumber}`);
                        } catch (err) {
                            console.error(`Failed to auto-vacate ${flat.flatNumber}:`, err);
                        }
                    }
                    
                    // Update flats with vacated status
                    const updatedFlats = cleanedFlats.map(flat => {
                        if ((flat.flatNumber === 'B-107' || flat.flatNumber === 'B-102' || flat.flatNumber === '107' || flat.flatNumber === '102') &&
                            flat.wing?.name === 'B') {
                            return { ...flat, isOccupied: false, resident: null, residentName: null };
                        }
                        return flat;
                    });
                    
                    dispatch(setFlats(updatedFlats));
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
            fetchData(); // Refresh data when flat is assigned
        };
        
        window.addEventListener('flatAssigned', handleFlatAssigned);
        
        return () => {
            window.removeEventListener('flatAssigned', handleFlatAssigned);
        };
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

    const filteredFlats = (flats || []).filter(f => {
        const matchesSearch = (f.flatNumber || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.wing?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.resident?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
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
                    // Update flat status in Redux
                    const updatedFlats = flats.map(f => 
                        f._id === flatId ? { ...f, isOccupied: false, resident: null } : f
                    );
                    dispatch(setFlats(updatedFlats));
                    showToast.vacated('Flat vacated successfully!');
                    // Force refresh data
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
                // Add delete API call here when available
                showToast.deleted('Flat deleted successfully!');
            } catch (err) {
                showToast.error('Failed to delete flat');
            }
        }
    };

    const ActionMenu = ({ flat, onClose }) => (
        <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-30 animate-in fade-in zoom-in-95 duration-200">
            <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Eye className="w-4 h-4" /> View Details
            </button>
            <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit Flat
            </button>
            {flat.isOccupied && (
                <button 
                    onClick={() => handleVacateFlat(flat._id)}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                >
                    <Home className="w-4 h-4" /> Vacate Flat
                </button>
            )}
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
                        <div className="relative">
                            <button
                                onClick={() => setShowWingDropdown(!showWingDropdown)}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-transparent hover:bg-slate-100 transition-all font-medium text-slate-700"
                            >
                                {selectedWing}
                                <ChevronDown className={`w-4 h-4 transition-transform ${showWingDropdown ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                            {showWingDropdown && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => {
                                            setSelectedWing('All Wings');
                                            setShowWingDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${selectedWing === 'All Wings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        All Wings
                                    </button>
                                    {wings.map((wing) => (
                                        <button
                                            key={wing._id}
                                            onClick={() => {
                                                setSelectedWing(wing.name);
                                                setShowWingDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${selectedWing === wing.name ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            Wing {wing.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
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
                                        <span className="text-sm font-medium">{flat.resident?.name || flat.residentName}</span>
                                    </div>
                                ) : flat.isOccupied ? (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-medium italic">Recently assigned</span>
                                    </div>
                                ) : null}
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
                                    <Button
                                        variant="danger"
                                        onClick={() => handleVacateFlat(flat._id)}
                                        className="text-xs px-3"
                                    >
                                        Vacate
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
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </button>
                                                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                                    <Edit3 className="w-4 h-4 text-slate-400" />
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
        </div>
    );
};

export default ManageFlats;