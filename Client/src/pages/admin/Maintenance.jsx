import React, { useState, useEffect } from 'react';
import {
    Receipt,
    Plus,
    Users,
    Search,
    CheckCircle2,
    Clock,
    X,
    AlertCircle,
    IndianRupee,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { MAINTENANCE_API, FLAT_API, WING_API } from '../../services/apis';
import {
    setMaintenance,
    addMaintenance,
    updateMaintenance,
    setFlats,
    clearMaintenance,
    deleteMaintenance
} from '../../store/store';

// Validation schemas
const commonSchema = yup.object().shape({
    amount: yup.number().typeError('Must be a number').required('Amount is required'),
    period: yup.string().required('Month/Year is required'),
});

const specialSchema = yup.object().shape({
    flatId: yup.string().required('Flat is required'),
    amount: yup.number().typeError('Must be a number').required('Amount is required'),
    description: yup.string().required('Description is required'),
    period: yup.string().required('Month/Year is required'),
});

const Maintenance = () => {
    const dispatch = useDispatch();
    const records = useSelector((state) => state.maintenance.records);
    const flats = useSelector((state) => state.flats.items);

    const [showCommonModal, setShowCommonModal] = useState(false);
    const [showSpecialModal, setShowSpecialModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterWing, setFilterWing] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // Force clear maintenance data first
        dispatch(clearMaintenance());
        
        const fetchData = async () => {
            try {
                // Try fetching flats directly first
                console.log('Fetching flats directly...');
                const directFlatsRes = await apiConnector("GET", FLAT_API.GET_ALL);
                console.log('Direct flats response:', directFlatsRes);
                
                if (directFlatsRes.success && directFlatsRes.data && directFlatsRes.data.length > 0) {
                    dispatch(setFlats(directFlatsRes.data));
                    console.log('Flats loaded directly:', directFlatsRes.data.length);
                } else {
                    // Fallback: Fetch flats from wings
                    console.log('Fetching flats from wings...');
                    const flatsRes = await apiConnector("GET", WING_API.GET_ALL);
                    console.log('Wings response:', flatsRes);
                    
                    if (flatsRes.success && flatsRes.data) {
                        const allFlats = [];
                        flatsRes.data.forEach(wing => {
                            if (wing.flats && wing.flats.length > 0) {
                                allFlats.push(...wing.flats);
                            }
                        });
                        dispatch(setFlats(allFlats));
                        console.log('Flats loaded from wings:', allFlats.length);
                    }
                }
                
                // Then fetch maintenance data
                console.log('Fetching maintenance data...');
                const maintenanceRes = await apiConnector("GET", MAINTENANCE_API.GET_ALL);
                console.log('Maintenance API Response:', maintenanceRes);
                
                if (maintenanceRes && maintenanceRes.success) {
                    const data = maintenanceRes.data || [];
                    console.log('Maintenance data received:', data.length, 'records');
                    dispatch(setMaintenance(data));
                } else {
                    console.log('No maintenance data or API failed');
                    dispatch(setMaintenance([]));
                }
            } catch (err) {
                console.error("Fetch Data Error:", err);
                dispatch(setMaintenance([]));
                toast.error("Failed to load data");
            }
        };
        fetchData();
    }, [dispatch]);

    const commonForm = useForm({ resolver: yupResolver(commonSchema) });
    const specialForm = useForm({ resolver: yupResolver(specialSchema) });

    const onGenerateCommon = async (data) => {
        try {
            console.log('Using bulk generate endpoint...');
            
            const payload = {
                amount: Number(data.amount),
                period: data.period
            };
            
            console.log('Bulk generate payload:', payload);
            const res = await apiConnector("POST", MAINTENANCE_API.GENERATE, payload);
            
            if (res.success) {
                toast.success(`✅ Maintenance generated for all flats!`, {
                    duration: 4000
                });
                // Refresh data
                const maintenanceRes = await apiConnector("GET", MAINTENANCE_API.GET_ALL);
                if (maintenanceRes.success) dispatch(setMaintenance(maintenanceRes.data));
                setShowCommonModal(false);
                commonForm.reset();
            } else {
                toast.error(res.message || "Failed to generate maintenance");
            }
        } catch (err) {
            console.error('Bulk generate error:', err);
            toast.error(`Error: ${err.message || 'Unknown error'}`);
        }
    };

    const onAddSpecial = async (data) => {
        try {
            const res = await apiConnector("POST", MAINTENANCE_API.CREATE, {
                title: data.description,
                flat: data.flatId,
                amount: data.amount,
                description: data.description,
                period: data.period,
                type: 'Special'
            });
            if (res.success) {
                const maintenanceRes = await apiConnector("GET", MAINTENANCE_API.GET_ALL);
                if (maintenanceRes.success) dispatch(setMaintenance(maintenanceRes.data));
                toast.success(`Special charge added successfully`, { icon: '🛠️' });
                setShowSpecialModal(false);
                specialForm.reset();
            }
        } catch (err) {
            toast.error(err.message || "Failed to generate special bill");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
            const res = await apiConnector("PUT", MAINTENANCE_API.UPDATE_STATUS(id), { status: newStatus });
            if (res.success) dispatch(updateMaintenance({ id, status: newStatus }));
        } catch (err) {
            toast.error(err.message || "Failed to update payment status");
        }
    };

    const filteredRecords = (records || []).filter(r => {
        const matchesStatus = filterStatus === 'All' || 
            (filterStatus === 'Paid' && r.status === 'PAID') ||
            (filterStatus === 'Unpaid' && r.status === 'UNPAID') ||
            (filterStatus === 'Vacant' && !r.flat?.resident?.name);
        
        const matchesMonth = filterMonth === 'All' || 
            (r.period && r.period.toLowerCase().includes(filterMonth.toLowerCase())) ||
            (r.month && r.month.toLowerCase() === filterMonth.toLowerCase());
            
        const matchesWing = filterWing === 'All' || 
            (r.flat?.wing?.name && r.flat.wing.name === filterWing) ||
            (r.flat?.flatNumber && r.flat.flatNumber.startsWith(filterWing));
            
        const flatNum = r.flat?.flatNumber || '';
        const matchesSearch = flatNum.toString().includes(searchQuery) ||
            (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesMonth && matchesWing && matchesSearch;
    });

    const totalCollected = filteredRecords.filter(r => r.status === 'PAID').reduce((sum, r) => sum + r.amount, 0);
    const totalPending = filteredRecords.filter(r => r.status === 'UNPAID').reduce((sum, r) => sum + r.amount, 0);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this maintenance record?')) {
            try {
                console.log('Deleting maintenance record:', id);
                const res = await apiConnector("DELETE", MAINTENANCE_API.DELETE(id));
                console.log('Delete response:', res);
                
                if (res.success) {
                    dispatch(deleteMaintenance(id));
                    toast.success('Maintenance record deleted successfully');
                    // Refresh maintenance data
                    const maintenanceRes = await apiConnector("GET", MAINTENANCE_API.GET_ALL);
                    if (maintenanceRes.success) dispatch(setMaintenance(maintenanceRes.data));
                } else {
                    toast.error(res.message || 'Failed to delete maintenance record');
                }
            } catch (err) {
                console.error('Delete error:', err);
                toast.error(err.message || 'Failed to delete maintenance record');
            }
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm('Are you sure you want to delete ALL maintenance records? This cannot be undone!')) {
            try {
                // Delete all records one by one
                let deletedCount = 0;
                for (const record of records) {
                    try {
                        const res = await apiConnector("DELETE", MAINTENANCE_API.DELETE(record._id || record.id));
                        if (res.success) deletedCount++;
                    } catch (err) {
                        console.error('Failed to delete record:', record._id);
                    }
                }
                
                if (deletedCount > 0) {
                    dispatch(setMaintenance([]));
                    toast.success(`${deletedCount} maintenance records deleted successfully`);
                } else {
                    toast.error('Failed to delete maintenance records');
                }
            } catch (err) {
                toast.error('Failed to delete maintenance records');
            }
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Maintenance Management</h1>
                    <p className="text-slate-500 mt-1">Generate bills and track payment status for society records.</p>
                </div>
                <div className="flex gap-3">
                    {records && records.length > 0 && (
                        <button 
                            onClick={handleDeleteAll}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm"
                        >
                            🗑️ Delete All
                        </button>
                    )}
                    <button onClick={() => setShowCommonModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-indigo-100 border border-indigo-500 text-sm">
                        <Users className="w-4 h-4" /> Generate Common Bill
                    </button>
                    <button onClick={() => setShowSpecialModal(true)} className="bg-white hover:bg-slate-50 text-indigo-600 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all border border-indigo-100 text-sm">
                        <Plus className="w-4 h-4" /> Special Charge
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                        <IndianRupee className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Due</p>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">₹{totalCollected + totalPending}</p>
                    </div>
                </div>
                <div className="bg-emerald-50/50 p-7 rounded-[2.5rem] border border-emerald-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-emerald-600/60 text-xs font-black uppercase tracking-widest mb-1">Collected</p>
                        <p className="text-3xl font-black text-emerald-600 tracking-tight">₹{totalCollected}</p>
                    </div>
                </div>
                <div className="bg-amber-50/50 p-7 rounded-[2.5rem] border border-amber-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200">
                        <Clock className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-amber-600/60 text-xs font-black uppercase tracking-widest mb-1">Pending</p>
                        <p className="text-3xl font-black text-amber-600 tracking-tight">₹{totalPending}</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by flat number or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 font-bold"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-slate-50 hover:bg-slate-100 px-6 py-4 rounded-[1.5rem] text-slate-700 font-bold flex items-center gap-2 transition-all"
                        >
                            🔽 Filters
                        </button>
                        {showFilters && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 min-w-[300px]">
                                <div className="space-y-4">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Status</label>
                                        <div className="flex gap-2">
                                            {['All', 'Paid', 'Unpaid', 'Vacant'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => setFilterStatus(status)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === status ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Wing Filter */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Wing</label>
                                        <div className="flex gap-2">
                                            {['All', 'A', 'B', 'C', 'D'].map(wing => (
                                                <button
                                                    key={wing}
                                                    onClick={() => setFilterWing(wing)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterWing === wing ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                >
                                                    {wing === 'All' ? 'All' : wing}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Month Filter */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Month</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                                                const fullMonth = index === 0 ? 'All' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][index - 1];
                                                return (
                                                    <button
                                                        key={month}
                                                        onClick={() => setFilterMonth(fullMonth)}
                                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterMonth === fullMonth ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                    >
                                                        {month}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    {/* Clear Filters */}
                                    <button
                                        onClick={() => {
                                            setFilterStatus('All');
                                            setFilterWing('All');
                                            setFilterMonth('All');
                                            setSearchQuery('');
                                        }}
                                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold transition-all"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Maintenance Cards */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Maintenance Records</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRecords.map((r) => (
                        <div key={r._id || r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                            {/* Status Strip */}
                            <div className={`h-1 ${r.status === 'PAID' ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`} />
                            
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm ${r.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {r.flat?.flatNumber || '-'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{r.title || 'Maintenance'}</h3>
                                            <p className="text-xs text-slate-500 font-medium">{r.period || '-'}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {r.status === 'PAID' ? '✓ Paid' : '⏳ Pending'}
                                    </span>
                                </div>

                                {/* Flat Info */}
                                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Flat Details</p>
                                            <p className="font-bold text-slate-700">Wing {r.flat?.wing?.name || '-'}, Flat {r.flat?.flatNumber || '-'}</p>
                                            {!r.flat?.resident?.name ? (
                                                <p className="text-xs text-amber-600 font-medium mt-1">⚠️ Vacant Flat</p>
                                            ) : (
                                                <p className="text-xs text-slate-600 font-medium mt-1">👤 {r.flat.resident.name}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 font-medium">Amount</p>
                                            <p className="text-xl font-black text-slate-800">₹{r.amount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Type Badge */}
                                <div className="mb-4">
                                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${r.type === 'Special' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {r.type === 'Special' ? '🎯 Special Charge' : '🏠 Monthly Maintenance'}
                                    </span>
                                </div>

                                {/* Description */}
                                {r.description && (
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                                            {r.description}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {r.status === 'PAID' ? (
                                        <div className="flex-1 bg-emerald-50 text-emerald-700 py-3 px-4 rounded-xl text-center font-bold text-sm">
                                            🎉 Payment Completed
                                        </div>
                                    ) : (
                                        <div className="flex-1 bg-amber-50 text-amber-700 py-3 px-4 rounded-xl text-center font-bold text-sm">
                                            💰 Payment Due
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            console.log('Delete clicked for record:', r._id || r.id);
                                            handleDelete(r._id || r.id);
                                        }}
                                        className="px-4 py-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors font-bold text-sm"
                                        title="Delete Record"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {filteredRecords.length === 0 && (
                <div className="py-20 text-center bg-slate-50 rounded-2xl">
                    <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-600 mb-2">No maintenance records found</h3>
                    <p className="text-slate-500">Create monthly maintenance or special charges to get started.</p>
                </div>
            )}



            {/* MODALS */}
            {showCommonModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        <form onSubmit={commonForm.handleSubmit(onGenerateCommon)}>
                            <div className="p-10 pb-6 relative text-center">
                                <button type="button" onClick={() => setShowCommonModal(false)} className="absolute right-8 top-8 w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800">Common Bill</h2>
                                <p className="text-slate-500 font-medium mt-1">Generate maintenance for ALL flats in your society.</p>
                            </div>

                            <div className="p-10 pt-4 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Amount (₹)</label>
                                    <input {...commonForm.register('amount')} placeholder="e.g. 2500" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700" />
                                    {commonForm.formState.errors.amount && <p className="text-rose-500 text-[10px] font-bold">{commonForm.formState.errors.amount.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period (Month / Year)</label>
                                    <input {...commonForm.register('period')} placeholder="e.g. March 2024" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700" />
                                    {commonForm.formState.errors.period && <p className="text-rose-500 text-[10px] font-bold">{commonForm.formState.errors.period.message}</p>}
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
                                    Generate Bills
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSpecialModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        <form onSubmit={specialForm.handleSubmit(onAddSpecial)}>
                            <div className="p-10 pb-6 relative text-center">
                                <button type="button" onClick={() => setShowSpecialModal(false)} className="absolute right-8 top-8 w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800">Special Charge</h2>
                                <p className="text-slate-500 font-medium mt-1">Add a charge for a specific flat.</p>
                            </div>

                            <div className="p-10 pt-4 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flat</label>
                                    <select {...specialForm.register('flatId')} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700">
                                        <option value="">Select flat</option>
                                        {flats.map(f => <option key={f._id || f.id} value={f._id || f.id}>{f.flatNumber}</option>)}
                                    </select>
                                    {specialForm.formState.errors.flatId && <p className="text-rose-500 text-[10px] font-bold">{specialForm.formState.errors.flatId.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                                    <input {...specialForm.register('amount')} placeholder="e.g. 500" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700" />
                                    {specialForm.formState.errors.amount && <p className="text-rose-500 text-[10px] font-bold">{specialForm.formState.errors.amount.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <input {...specialForm.register('description')} placeholder="Maintenance fine, etc." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700" />
                                    {specialForm.formState.errors.description && <p className="text-rose-500 text-[10px] font-bold">{specialForm.formState.errors.description.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period</label>
                                    <input {...specialForm.register('period')} placeholder="e.g. March 2024" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700" />
                                    {specialForm.formState.errors.period && <p className="text-rose-500 text-[10px] font-bold">{specialForm.formState.errors.period.message}</p>}
                                </div>
                                <button type="submit" className="w-full bg-amber-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all uppercase tracking-widest text-xs">
                                    Add Special Charge
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;
