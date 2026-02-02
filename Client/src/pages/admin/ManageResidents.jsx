import React, { useState, useEffect } from 'react';
import {
    Users,
    Trash2,
    Edit,
    MoreVertical,
    ShieldCheck,
    Building2,
    Plus,
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

//  COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import SearchInput from '../../components/common/SearchInput';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import ToggleGroup from '../../components/common/ToggleGroup';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

// 🛡️ FORM VALIDATION SCHEMA (Yup)
const schema = yup.object().shape({
    name: yup.string().required('Full name is required').min(3, 'Too short'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().when('isEditing', {
        is: false,
        then: () => yup.string().required('Password is required').min(6, 'Min 6 chars'),
        otherwise: () => yup.string().optional()
    }),
    role: yup.string().required('Role is required'),
    status: yup.string().required('Status is required'),
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
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 'RESIDENT',
            status: 'ACTIVE'
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
                const res = await apiConnector("POST", AUTH_API.REGISTER_RESIDENT, data);
                if (res.success) {
                    dispatch(addResident(res.data));
                    toast.success(`${data.name} registered and waiting for approval!`, { icon: '👤' });
                }
            }
            closeModal();
        } catch (err) {
            toast.error(err.message || 'Operation failed');
        }
    };

    const handleEdit = (resident) => {
        setIsEditing(true);
        setSelectedResidentId(resident._id || resident.id);
        setValue('isEditing', true);
        setValue('name', resident.name);
        setValue('email', resident.email);
        setValue('role', resident.role || 'RESIDENT');
        setValue('status', resident.status || 'ACTIVE');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedResidentId(null);
        reset({
            role: 'RESIDENT',
            status: 'ACTIVE',
            name: '',
            email: '',
            password: ''
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
                toast.error(err.message || 'Failed to delete resident');
            }
        }
    };

    const filteredResidents = (residents || []).filter(r =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.flat?.flatNumber?.includes(searchQuery)
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <PageHeader
                title="Residents Directory"
                subtitle="Manage and view all registered society members."
                actionLabel="Add Resident"
                onAction={() => { setIsEditing(false); setShowModal(true); setValue('isEditing', false); }}
                icon={Plus}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    label="Total Registered"
                    value={(residents || []).length}
                    icon={Users}
                    colorClass="bg-indigo-50 text-indigo-600"
                    delay={0.1}
                />
                <StatCard
                    label="Active"
                    value={(residents || []).filter(r => r.status === 'ACTIVE').length}
                    icon={ShieldCheck}
                    colorClass="bg-emerald-50 text-emerald-600"
                    delay={0.2}
                />
                <StatCard
                    label="Pending Approval"
                    value={(residents || []).filter(r => r.status === 'PENDING').length}
                    icon={Building2}
                    colorClass="bg-amber-50 text-amber-600"
                    delay={0.3}
                />
            </div>

            {/* Search */}
            <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or flat number..."
                className="mb-10"
            />

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(residents || []).length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Users size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active residents found.</p>
                    </div>
                ) : (
                    filteredResidents.map((res) => (
                        <Card key={res._id || res.id} className="p-2 overflow-hidden group">
                            <div className="rounded-[2rem] bg-slate-50/50 p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm overflow-hidden p-1">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${res.name}`} alt={res.name} className="w-full h-full object-cover rounded-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{res.name}</h3>
                                            <Badge variant={res.status === 'ACTIVE' ? 'success' : res.status === 'PENDING' ? 'warning' : 'danger'} className="mt-1">
                                                {res.status}
                                            </Badge>
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
                                            {res.flat ? `Wing ${res.flat.wing?.name || '-'} - Flat ${res.flat.flatNumber}` : 'Not Assigned'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 px-3">
                                        <span className="text-xs font-bold truncate opacity-60">Email: {res.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 px-3">
                                        <span className="text-[10px] bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">
                                            Role: {res.role}
                                        </span>
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
                        </Card>
                    ))
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={isEditing ? 'Edit Resident' : 'Register New Resident'}
                subtitle={isEditing ? 'Update member details below.' : 'Add a new member to society records.'}
                icon={isEditing ? Edit : Users}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Full Name"
                        placeholder="e.g. Aatmaram Bhide"
                        register={register('name')}
                        error={errors.name?.message}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="e.g. bhide@gokuldham.com"
                        register={register('email')}
                        error={errors.email?.message}
                    />

                    {!isEditing && (
                        <Input
                            label="Temporary Password"
                            type="password"
                            placeholder="Min 6 characters"
                            register={register('password')}
                            error={errors.password?.message}
                        />
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <Select
                            label="Role"
                            options={[
                                { label: 'Resident', value: 'RESIDENT' },
                                { label: 'Security', value: 'SECURITY' },
                                { label: 'Admin', value: 'ADMIN' },
                            ]}
                            register={register('role')}
                            error={errors.role?.message}
                        />
                        <Select
                            label="Status"
                            options={[
                                { label: 'Active', value: 'ACTIVE' },
                                { label: 'Pending', value: 'PENDING' },
                                { label: 'Rejected', value: 'REJECTED' },
                            ]}
                            register={register('status')}
                            error={errors.status?.message}
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 py-4.5 rounded-2xl border border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            fullWidth
                            className="flex-[1.5] py-4.5"
                        >
                            {isEditing ? 'Update Details' : 'Register Member'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageResidents;
