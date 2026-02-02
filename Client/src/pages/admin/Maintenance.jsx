import React, { useState, useEffect } from 'react';
import {
    Receipt,
    Plus,
    Users,
    CheckCircle2,
    Clock,
    X,
    AlertCircle,
    IndianRupee,
    Building2,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { MAINTENANCE_API, FLAT_API } from '../../services/apis';

import { addMaintenance, updateMaintenance, setMaintenance } from '../../store/store';

// COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import SearchInput from '../../components/common/SearchInput';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';

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

  
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Maintenance
                const maintenanceRes = await apiConnector("GET", MAINTENANCE_API.CREATE); // Assuming GET for list is base URL
                if (maintenanceRes.success) {
                    dispatch(setMaintenance(maintenanceRes.data));
                }

                // Fetch Flats (needed for building Special Charge dropdown)
                const flatRes = await apiConnector("GET", FLAT_API.CREATE);
                if (flatRes.success) {
                    // dispatch(setFlats(flatRes.data)); // Redux check
                }
            } catch (err) {
                console.error("Fetch Maintenance Error:", err);
                toast.error("Failed to load maintenance records");
            }
        };
        fetchData();
    }, [dispatch]);

    // 📝 FORMS SETUP
    const { register: regCommon, handleSubmit: handleCommon, reset: resetCommon, formState: { errors: errCommon } } = useForm({
        resolver: yupResolver(commonSchema)
    });

    const { register: regSpecial, handleSubmit: handleSpecial, reset: resetSpecial, formState: { errors: errSpecial } } = useForm({
        resolver: yupResolver(specialSchema)
    });

    const onGenerateCommon = async (data) => {
        try {
            // Backend might need a dedicated endpoint, but normally it's a loop on backend
            // For now assuming existing API handler or creating multi-request
            const res = await apiConnector("POST", MAINTENANCE_API.CREATE + "/generate-common", data);
            if (res.success) {
                // Re-fetch to get new list
                const maintenanceRes = await apiConnector("GET", MAINTENANCE_API.CREATE);
                if (maintenanceRes.success) dispatch(setMaintenance(maintenanceRes.data));
                toast.success(`Broadcasting common bills successful!`, { icon: '🧾' });
                setShowCommonModal(false);
                resetCommon();
            }
        } catch (err) {
            toast.error(err.message || "Failed to generate common bills");
        }
    };

    const onAddSpecial = async (data) => {
        try {
            const res = await apiConnector("POST", MAINTENANCE_API.CREATE, {
                flat: data.flatId,
                amount: data.amount,
                description: data.description,
                period: data.period,
                type: 'Special'
            });
            if (res.success) {
                dispatch(addMaintenance(res.data));
                toast.success(`Special bill generated successfully`, { icon: '🛠️' });
                setShowSpecialModal(false);
                resetSpecial();
            }
        } catch (err) {
            toast.error(err.message || "Failed to generate special bill");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
            // Using PAY endpoint if status change is considered a "payment mark"
            const res = await apiConnector("PUT", MAINTENANCE_API.PAY(id), { status: newStatus });
            if (res.success) {
                dispatch(updateMaintenance({ id, status: newStatus }));
                toast.success(`Payment marked as ${newStatus}`);
            }
        } catch (err) {
            toast.error(err.message || "Failed to update payment status");
        }
    };

    const filteredRecords = (records || []).filter(r => {
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
        const matchesSearch = (r.flat?.flatNumber || r.flat || '').toString().includes(searchQuery) ||
            (r.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalCollected = (records || []).filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);
    const totalPending = (records || []).filter(r => r.status === 'Unpaid').reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <PageHeader
                title="Maintenance Registry"
                subtitle="Generate bills and track payment status for society funds."
                icon={Receipt}
            />

            <div className="flex flex-wrap gap-4 mb-10">
                <Button
                    onClick={() => setShowCommonModal(true)}
                    className="flex-1 md:flex-none py-4 px-8"
                    icon={Users}
                >
                    Generate Common Bill
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => setShowSpecialModal(true)}
                    className="flex-1 md:flex-none py-4 px-8"
                    icon={Plus}
                >
                    Add Special Charge
                </Button>
            </div>

            {/* Stats Board */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <IndianRupee size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                        <p className="text-3xl font-black text-slate-800 tabular-nums">₹{totalCollected + totalPending}</p>
                    </div>
                </div>
                <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <p className="text-emerald-600/60 text-[10px] font-black uppercase tracking-widest mb-1">Collected</p>
                        <p className="text-3xl font-black text-emerald-600 tabular-nums">₹{totalCollected}</p>
                    </div>
                </div>
                <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200">
                        <Clock size={28} />
                    </div>
                    <div className="flex-1">
                        <p className="text-amber-600/60 text-[10px] font-black uppercase tracking-widest mb-1">Pending Out</p>
                        <p className="text-3xl font-black text-amber-600 tabular-nums">₹{totalPending}</p>
                    </div>
                    <ArrowUpRight className="text-amber-300 w-5 h-5 self-start mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center">
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by flat, month or description..."
                    className="flex-1 w-full max-w-xl"
                />
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shrink-0">
                    {['All', 'Paid', 'Unpaid'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Records Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredRecords.map((req) => (
                    <Card key={req._id || req.id} className="p-2 overflow-hidden flex flex-col group">
                        <div className={`rounded-[2rem] p-8 flex-1 ${req.status === 'Paid' ? 'bg-emerald-50/10' : 'bg-rose-50/10'}`}>
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-2xl text-slate-800 shadow-sm">
                                    {req.flat?.flatNumber || req.flat || '-'}
                                </div>
                                <Badge variant={req.status === 'Paid' ? 'success' : 'warning'}>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${req.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        {req.status}
                                    </div>
                                </Badge>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/50 p-4 rounded-2xl border border-white/50 shadow-sm">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <Building2 size={10} /> Wing
                                        </p>
                                        <p className="font-black text-slate-700 uppercase">{req.flat?.wing?.name || req.wing || '-'}</p>
                                    </div>
                                    <div className="bg-white/50 p-4 rounded-2xl border border-white/50 shadow-sm">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <Calendar size={10} /> Cycle
                                        </p>
                                        <p className="font-black text-slate-700 uppercase tracking-tighter">{req.period}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={req.type === 'Special' ? 'warning' : 'primary'} className="rounded-md">
                                            {req.type}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed italic opacity-80 min-h-[3rem]">"{req.description || 'Monthly Maintenance charge.'}"</p>
                                </div>

                                <div className="pt-4 border-t border-slate-200/50">
                                    <p className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums flex items-end gap-1">
                                        <span className="text-lg opacity-40">₹</span>{req.amount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <button
                                onClick={() => toggleStatus(req._id || req.id, req.status)}
                                className={`w-full py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 ${req.status === 'Paid'
                                    ? 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-transparent'
                                    : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 border border-indigo-500'
                                    }`}
                            >
                                {req.status === 'Paid' ? 'Revert Payment Status' : <>Mark as Paid <IndianRupee size={12} /></>}
                            </button>
                        </div>
                    </Card>
                ))}

                {(filteredRecords || []).length === 0 && (
                    <div className="col-span-full py-40 border-2 border-dashed border-slate-100 rounded-[4rem] text-center flex flex-col items-center">
                        <Receipt size={64} className="text-slate-100 mb-6" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No billing records found for this criteria.</p>
                    </div>
                )}
            </div>

            {/* MODALS */}
            <Modal
                isOpen={showCommonModal}
                onClose={() => setShowCommonModal(false)}
                title="Broadcast Common Bill"
                subtitle={`Generate monthly maintenance for all society units.`}
                icon={Users}
            >
                <form onSubmit={handleCommon(onGenerateCommon)} className="space-y-6">
                    <Input
                        label="Standard Monthly Amount (₹)"
                        placeholder="e.g. 2500"
                        register={regCommon('amount')}
                        error={errCommon.amount?.message}
                        type="number"
                    />
                    <Input
                        label="Billing Period"
                        placeholder="e.g. March 2024"
                        register={regCommon('period')}
                        error={errCommon.period?.message}
                    />
                    <div className="bg-indigo-50 p-4 rounded-xl flex gap-3 items-start border border-indigo-100 mb-6">
                        <AlertCircle className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                        <p className="text-[11px] text-indigo-700 font-bold leading-relaxed uppercase">Important: This will generate separate bills for every occupied flat registered in the system.</p>
                    </div>
                    <Button type="submit" fullWidth className="py-5">Broadcast Now</Button>
                </form>
            </Modal>

            <Modal
                isOpen={showSpecialModal}
                onClose={() => setShowSpecialModal(false)}
                title="Special Charge"
                subtitle="Apply one-time repair or utility costs to a flat."
                icon={Plus}
            >
                <form onSubmit={handleSpecial(onAddSpecial)} className="space-y-5">
                    <Select
                        label="Select Flat"
                        options={[
                            { label: 'Select Flat...', value: '' },
                            ...(flats || []).map(f => ({ label: `Flat ${f.flatNumber} (Wing ${f.wing?.name || f.wing})`, value: f._id || f.id }))
                        ]}
                        register={regSpecial('flatId')}
                        error={errSpecial.flatId?.message}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Amount (₹)"
                            placeholder="e.g. 500"
                            register={regSpecial('amount')}
                            error={errSpecial.amount?.message}
                            type="number"
                        />
                        <Input
                            label="Period"
                            placeholder="March 2024"
                            register={regSpecial('period')}
                            error={errSpecial.period?.message}
                        />
                    </div>
                    <TextArea
                        label="Charge Reason"
                        placeholder="e.g. Bathroom leakage repair (Plumbing)"
                        register={regSpecial('description')}
                        error={errSpecial.description?.message}
                    />
                    <Button type="submit" fullWidth className="py-5">Generate Bill</Button>
                </form>
            </Modal>
        </div>
    );
};

export default Maintenance;
