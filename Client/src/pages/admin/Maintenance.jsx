import React, { useState } from 'react';
import {
    Receipt,
    Plus,
    Users,
    Filter,
    Search,
    CheckCircle2,
    Clock,
    X,
    AlertCircle,
    TrendingUp,
    LayoutGrid,
    Calendar,
    IndianRupee,
    Building2
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { addMaintenance, updateMaintenance } from '../../store/store';


// 🛡️ VALIDATION SCHEMAS
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
    const [searchQuery, setSearchQuery] = useState('');

    // 📝 FORMS SETUP
    const commonForm = useForm({ resolver: yupResolver(commonSchema) });
    const specialForm = useForm({ resolver: yupResolver(specialSchema) });

    const onGenerateCommon = (data) => {
        // Generate maintenance for each flat
        flats.forEach(flat => {
            dispatch(addMaintenance({
                id: Date.now() + Math.random(),
                flat: flat.flatNumber,
                wing: flat.wing,
                amount: data.amount,
                period: data.period,
                status: 'Unpaid',
                type: 'Common',
                description: 'Monthly Maintenance'
            }));
        });

        toast.success(`Common maintenance generated for ${flats?.length || 0} flats!`, { icon: '🧾' });
        setShowCommonModal(false);
        commonForm.reset();
    };

    const onAddSpecial = (data) => {
        const selectedFlat = flats?.find(f => f.id.toString() === data.flatId);
        if (!selectedFlat) {
            toast.error('Selected flat not found');
            return;
        }
        dispatch(addMaintenance({
            id: Date.now(),
            flat: selectedFlat.flatNumber,
            wing: selectedFlat.wing,
            amount: data.amount,
            period: data.period,
            status: 'Unpaid',
            type: 'Special',
            description: data.description
        }));
        toast.success(`Special charge added for Flat ${selectedFlat.flatNumber}`, { icon: '🛠️' });
        setShowSpecialModal(false);
        specialForm.reset();
    };

    const toggleStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
        dispatch(updateMaintenance({ id, status: newStatus }));
        toast.success(`Status updated to ${newStatus}`, {
            style: { background: newStatus === 'Paid' ? '#ecfdf5' : '#fff7ed', color: newStatus === 'Paid' ? '#059669' : '#d97706' }
        });
    };

    const filteredRecords = (records || []).filter(r => {
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
        const matchesSearch = r.flat?.includes(searchQuery) || r.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalCollected = (records || []).filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);
    const totalPending = (records || []).filter(r => r.status === 'Unpaid').reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Maintenance Management</h1>
                    <p className="text-slate-500 mt-1">Generate bills and track payment status for society records.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCommonModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-indigo-100 border border-indigo-500 text-sm"
                    >
                        <Users className="w-4 h-4" /> Generate Common Bill
                    </button>
                    <button
                        onClick={() => setShowSpecialModal(true)}
                        className="bg-white hover:bg-slate-50 text-indigo-600 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all border border-indigo-100 text-sm"
                    >
                        <Plus className="w-4 h-4" /> Special Charge
                    </button>
                </div>
            </div>

            {/* Stats Board */}
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

            {/* Filters & Search */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by flat or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-4 py-4 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 font-bold"
                    />
                </div>
                <div className="flex bg-slate-50 p-1 rounded-[1.5rem] gap-1">
                    {['All', 'Paid', 'Unpaid'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Records Grid (Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecords.map((req) => (
                    <div key={req.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group overflow-hidden">
                        <div className={`rounded-[2rem] p-6 ${req.status === 'Paid' ? 'bg-emerald-50/30' : 'bg-amber-50/30'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-xl text-slate-800 shadow-sm">
                                    {req.flat}
                                </div>
                                <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${req.status === 'Paid'
                                    ? 'bg-white text-emerald-600 border-emerald-100'
                                    : 'bg-white text-amber-600 border-amber-100'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    {req.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wing</p>
                                        <p className="font-bold text-slate-700">{req.wing}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</p>
                                        <p className="font-bold text-slate-700">{req.period}</p>
                                    </div>
                                </div>

                                <div>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md mb-1 inline-block ${req.type === 'Special' ? 'bg-amber-200/50 text-amber-700' : 'bg-indigo-100 text-indigo-600'
                                        }`}>
                                        {req.type}
                                    </span>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed line-clamp-1">{req.description}</p>
                                </div>

                                <div className="pt-2 border-t border-slate-100/50 flex items-end justify-between">
                                    <p className="text-2xl font-black text-slate-800 tracking-tight">₹{req.amount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 px-2">
                            <button
                                onClick={() => toggleStatus(req.id, req.status)}
                                className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${req.status === 'Paid'
                                    ? 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600 border border-transparent'
                                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 border border-emerald-500'
                                    }`}
                            >
                                {req.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredRecords.length === 0 && (
                <div className="py-20 text-center">
                    <Receipt className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-black">No maintenance records found.</p>
                </div>
            )}

            {/* MODAL: Common Maintenance */}
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
                                <p className="text-slate-500 font-medium mt-1">This will apply to all {flats?.length || 0} registered flats.</p>
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
                                    Generate All Bills
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Special Charge */}
            {showSpecialModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        <form onSubmit={specialForm.handleSubmit(onAddSpecial)}>
                            <div className="p-10 pb-6 relative text-center">
                                <button type="button" onClick={() => setShowSpecialModal(false)} className="absolute right-8 top-8 w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800">Special Charge</h2>
                                <p className="text-slate-500 font-medium mt-1">Apply emergency charges to a specific flat.</p>
                            </div>

                            <div className="p-10 pt-4 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Flat</label>
                                    <select {...specialForm.register('flatId')} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700 appearance-none">
                                        <option value="">Select Flat...</option>
                                        {(flats || []).map(f => <option key={f.id} value={f.id}>Wing {f.wing} - Flat {f.number}</option>)}
                                    </select>
                                    {specialForm.formState.errors.flatId && <p className="text-rose-500 text-[10px] font-bold">{specialForm.formState.errors.flatId.message}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                                        <input {...specialForm.register('amount')} placeholder="500" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period</label>
                                        <input {...specialForm.register('period')} placeholder="March 2024" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Description</label>
                                    <textarea {...specialForm.register('description')} placeholder="e.g. Pipe Leakage Repair" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent font-bold text-slate-700 h-24 resize-none" />
                                </div>
                                <button type="submit" className="w-full bg-amber-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-amber-100 hover:bg-amber-600 transition-all uppercase tracking-widest text-xs">
                                    Create Special Bill
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
