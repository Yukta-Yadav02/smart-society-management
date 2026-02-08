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
    const [filterYear, setFilterYear] = useState('All');
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterWing, setFilterWing] = useState('All');
    const [filterType, setFilterType] = useState('Monthly');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFlats, setSelectedFlats] = useState([]);
    const [isAllFlats, setIsAllFlats] = useState(false);
    const [wingSearch, setWingSearch] = useState('All');

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

            // NEW COMMENT: includeVacant flag determines if empty flats get the bill or not
            const payload = {
                amount: Number(data.amount),
                period: data.period,
                includeVacant: data.includeVacant // Taken from the checkbox in modal
            };

            console.log('Bulk generate payload:', payload);
            const res = await apiConnector("POST", MAINTENANCE_API.GENERATE, payload);

            if (res.success) {
                toast.success(`✅ Maintenance generated!`, {
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
        if (!isAllFlats && selectedFlats.length === 0) {
            toast.error("Please select at least one flat");
            return;
        }

        try {
            const res = await apiConnector("POST", MAINTENANCE_API.CREATE, {
                title: data.description,
                flat: isAllFlats ? "ALL" : (selectedFlats.length === 1 ? selectedFlats[0] : selectedFlats),
                amount: data.amount,
                description: data.description,
                period: data.period,
                type: 'Special',
                status: data.isPaid ? 'PAID' : 'UNPAID'
            });
            if (res.success) {
                const maintenanceRes = await apiConnector("GET", MAINTENANCE_API.GET_ALL);
                if (maintenanceRes.success) {
                    dispatch(setMaintenance(maintenanceRes.data));
                    setFilterType('Special');
                }
                toast.success(`Special charge added successfully`, { icon: '🎯' });
                setShowSpecialModal(false);
                setSelectedFlats([]);
                setIsAllFlats(false);
                specialForm.reset();
            }
        } catch (err) {
            toast.error(err.message || "Failed to generate special bill");
        }
    };

    const toggleFlatSelection = (id) => {
        if (isAllFlats) setIsAllFlats(false);
        setSelectedFlats(prev =>
            prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
        );
    };

    const handleSelectAllChanged = (checked) => {
        setIsAllFlats(checked);
        if (checked) setSelectedFlats([]);
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus.toUpperCase() === 'PAID' ? 'UNPAID' : 'PAID';
            const res = await apiConnector("PUT", MAINTENANCE_API.UPDATE_STATUS(id), { status: newStatus });
            if (res.success) {
                dispatch(updateMaintenance({ id, ...res.data }));
                toast.success(`Marked as ${newStatus}`, { icon: newStatus === 'PAID' ? '✅' : '⏳' });
            }
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

        const matchesYear = filterYear === 'All' ||
            (r.period && r.period.toLowerCase().includes(filterYear.toString().toLowerCase())) ||
            (r.year && r.year.toString() === filterYear.toString());

        const matchesWing = filterWing === 'All' ||
            (r.flat?.wing?.name && r.flat.wing.name === filterWing) ||
            (r.flat?.flatNumber && r.flat.flatNumber.startsWith(filterWing));

        const rType = r.type || 'Common';
        const matchesType = filterType === 'All' ||
            (filterType === 'Monthly' && rType === 'Common') ||
            (filterType === 'Special' && rType === 'Special');

        const flatNum = r.flat?.flatNumber || '';
        const matchesSearch = flatNum.toString().includes(searchQuery) ||
            (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesMonth && matchesYear && matchesWing && matchesType && matchesSearch;
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
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setShowCommonModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 border border-indigo-500 text-sm">
                        <Users className="w-4 h-4" /> Common Bill
                    </button>
                    <button onClick={() => setShowSpecialModal(true)} className="bg-white hover:bg-slate-50 text-indigo-600 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border border-indigo-100 text-sm shadow-sm">
                        <Plus className="w-4 h-4" /> Special Charge
                    </button>
                </div>
            </div>

            {/* Type Selector Tabs */}
            <div className="flex p-1.5 bg-slate-100/80 rounded-2xl w-fit mb-8 backdrop-blur-sm border border-slate-200/50">
                <button
                    onClick={() => setFilterType('Monthly')}
                    className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${filterType === 'Monthly' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    🏠 Monthly Maintenance
                </button>
                <button
                    onClick={() => setFilterType('Special')}
                    className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${filterType === 'Special' ? 'bg-white text-purple-600 shadow-md ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    🎯 Special Charges
                </button>
                <button
                    onClick={() => setFilterType('All')}
                    className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${filterType === 'All' ? 'bg-white text-slate-800 shadow-md ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    📋 All Records
                </button>
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
                                            {['All', 'Paid', 'Unpaid'].map(status => (
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

                                    {/* Type Filter */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Bill Type</label>
                                        <div className="flex gap-2">
                                            {[
                                                { label: 'All', value: 'All' },
                                                { label: 'Monthly', value: 'Monthly' },
                                                { label: 'Special', value: 'Special' }
                                            ].map(type => (
                                                <button
                                                    key={type.value}
                                                    onClick={() => setFilterType(type.value)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === type.value ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Year Filter */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Year</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {['All', '2024', '2025', '2026', '2027', '2028'].map(year => (
                                                <button
                                                    key={year}
                                                    onClick={() => {
                                                        setFilterYear(year);
                                                        if (year === 'All') setFilterMonth('All');
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterYear === year ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Month Filter */}
                                    {filterYear !== 'All' && (
                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">{filterYear} Months</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                                                    const fullMonth = index === 0 ? 'All' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][index - 1];
                                                    return (
                                                        <button
                                                            key={month}
                                                            onClick={() => setFilterMonth(fullMonth)}
                                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterMonth === fullMonth ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                                                        >
                                                            {month}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Clear Filters */}
                                    <button
                                        onClick={() => {
                                            setFilterYear('All');
                                            setFilterStatus('All');
                                            setFilterWing('All');
                                            setFilterMonth('All');
                                            setFilterType('All');
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
            {/* Maintenance Records Cards */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        {filterType === 'Special' ? '🎯 Special Charges' : filterType === 'Monthly' ? '📅 Monthly Maintenance' : '📋 All Records'}
                        <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full font-bold shadow-sm border border-indigo-100/50">{filteredRecords.length}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecords.map((r) => (
                        <div key={r._id || r.id} className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 overflow-hidden hover:-translate-y-1">
                            {/* Top Accent Bar */}
                            <div className={`h-1.5 w-full ${r.status === 'PAID' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`} />

                            <div className="p-6">
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner ${r.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {r.flat?.flatNumber || '-'}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Wing {r.flat?.wing?.name || '-'}</p>
                                            <h3 className="font-bold text-slate-800 text-sm truncate max-w-[120px]">{r.title || 'Maintenance'}</h3>


                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(r._id || r.id)}
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Amount & Period */}
                                <div className="bg-slate-50/50 rounded-2xl p-4 mb-5 border border-slate-100/50">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tight">₹{r.amount}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Period</p>
                                            <p className="text-xs font-bold text-slate-600">{r.period || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata & Status */}
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${r.type === 'Special' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {r.type === 'Special' ? '🎯 Special' : '🏠 Monthly'}
                                    </span>

                                    {/* Status Badge - CLICKABLE FOR ADMIN */}
                                    <button
                                        onClick={() => toggleStatus(r._id || r.id, r.status === 'PAID' ? 'Paid' : 'Unpaid')}
                                        title={r.status === 'PAID' ? "Mark as UNPAID" : "Mark as PAID"}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${r.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 border border-amber-200/50'}`}
                                    >
                                        {r.status === 'PAID' ? (
                                            <><CheckCircle2 className="w-3 h-3" /> PAID ({r.paymentMode || 'ONLINE'})</>
                                        ) : (
                                            <><Clock className="w-3 h-3" /> Pending</>
                                        )}
                                    </button>
                                </div>

                                {/* Description Preview */}
                                {r.description && (
                                    <div className="mt-4 pt-4 border-t border-slate-50">
                                        <p className="text-[11px] text-slate-400 font-medium italic truncate">
                                            "{r.description}"
                                        </p>
                                    </div>
                                )}

                                {/* Quick Action Section */}
                                {r.status === 'UNPAID' ? (
                                    <button
                                        onClick={() => toggleStatus(r._id || r.id, 'Unpaid')}
                                        className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <IndianRupee className="w-3 h-3" /> Collect Cash
                                    </button>
                                ) : (
                                    <div className="w-full mt-4 py-3 bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        Payment Received via {r.paymentMode || 'ONLINE'}
                                    </div>
                                )}
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

                            <div className="p-8 pt-4 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Amount (₹)</label>
                                    <input {...commonForm.register('amount')} placeholder="e.g. 2500" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700 focus:bg-white focus:border-indigo-100 outline-none" />
                                    {commonForm.formState.errors.amount && <p className="text-rose-500 text-[10px] font-bold">{commonForm.formState.errors.amount.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period (Month / Year)</label>
                                    <input {...commonForm.register('period')} placeholder="e.g. March 2024" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700 focus:bg-white focus:border-indigo-100 outline-none" />
                                    {commonForm.formState.errors.period && <p className="text-rose-500 text-[10px] font-bold">{commonForm.formState.errors.period.message}</p>}
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <input
                                        type="checkbox"
                                        id="includeVacant"
                                        {...commonForm.register('includeVacant')}
                                        className="w-4 h-4 accent-indigo-600 rounded"
                                    />
                                    <label htmlFor="includeVacant" className="text-xs font-bold text-slate-600 cursor-pointer">
                                        Include Vacant Flats
                                    </label>
                                </div>                                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
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
                            <div className="p-8 pb-4 relative text-center border-b border-slate-50">
                                <button type="button" onClick={() => setShowSpecialModal(false)} className="absolute right-6 top-6 w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                                <h2 className="text-2xl font-black text-slate-800">Special Charge</h2>
                                <p className="text-slate-500 text-xs font-medium mt-1">Add charges for specific flats.</p>
                            </div>

                            <div className="p-8 pt-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                                        <span className="text-sm font-bold text-slate-700">Send to All Flats</span>
                                        <input
                                            type="checkbox"
                                            checked={isAllFlats}
                                            onChange={(e) => handleSelectAllChanged(e.target.checked)}
                                            className="w-5 h-5 accent-indigo-600 rounded-lg"
                                        />
                                    </div>

                                    {!isAllFlats && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Flats ({selectedFlats.length} selected)</label>
                                                <div className="flex gap-2">
                                                    {['All', 'A', 'B', 'C', 'D'].map(w => (
                                                        <button
                                                            key={w}
                                                            type="button"
                                                            onClick={() => setWingSearch(w)}
                                                            className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all ${wingSearch === w ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                                                        >
                                                            {w}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                                {flats
                                                    .filter(f => wingSearch === 'All' || f.wing?.name === wingSearch)
                                                    .map(f => (
                                                        <button
                                                            key={f._id || f.id}
                                                            type="button"
                                                            onClick={() => toggleFlatSelection(f._id || f.id)}
                                                            className={`py-2 rounded-xl text-xs font-bold transition-all border ${selectedFlats.includes(f._id || f.id)
                                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-95'
                                                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                                                                }`}
                                                        >
                                                            {f.flatNumber}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                                        <input {...specialForm.register('amount')} placeholder="e.g. 500" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-transparent font-bold text-slate-700 text-sm focus:bg-white focus:border-indigo-100 outline-none" />
                                        {specialForm.formState.errors.amount && <p className="text-rose-500 text-[9px] font-bold">{specialForm.formState.errors.amount.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period</label>
                                        <input {...specialForm.register('period')} placeholder="e.g. March 2024" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-transparent font-bold text-slate-700 text-sm focus:bg-white focus:border-indigo-100 outline-none" />
                                        {specialForm.formState.errors.period && <p className="text-rose-500 text-[9px] font-bold">{specialForm.formState.errors.period.message}</p>}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <input {...specialForm.register('description')} placeholder="Maintenance fine, etc." className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-transparent font-bold text-slate-700 text-sm focus:bg-white focus:border-indigo-100 outline-none" />
                                    {specialForm.formState.errors.description && <p className="text-rose-500 text-[9px] font-bold">{specialForm.formState.errors.description.message}</p>}
                                </div>
                                <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <input
                                        type="checkbox"
                                        id="isPaid"
                                        {...specialForm.register('isPaid')}
                                        className="w-4 h-4 accent-emerald-600 rounded"
                                    />
                                    <label htmlFor="isPaid" className="text-xs font-bold text-emerald-800 cursor-pointer">
                                        Received Cash (Mark as Paid Immediately)
                                    </label>
                                </div>
                                <button type="submit" className="w-full bg-amber-600 text-white font-black py-4 rounded-xl shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all uppercase tracking-widest text-[10px] mt-2">
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
