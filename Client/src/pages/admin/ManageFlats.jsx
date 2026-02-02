import React, { useState, useEffect } from 'react';
import {
    Plus,
    Building2,
    MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { FLAT_API, WING_API } from '../../services/apis';

import {
    addFlat,
    setFlats
} from '../../store/store';

// COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import SearchInput from '../../components/common/SearchInput';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

/* ================= VALIDATION ================= */
const schema = yup.object().shape({
    flatNumber: yup
        .string()
        .required('Flat number is required'),
    wingId: yup.string().required('Wing is required'),
});

const ManageFlats = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /* ---------- REDUX ---------- */
    const { items: flats } = useSelector((state) => state.flats);

    /* ---------- LOCAL STATE ---------- */
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
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

    /* ---------- FORM ---------- */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await apiConnector("POST", FLAT_API.CREATE, {
                flatNumber: data.flatNumber,
                wing: data.wingId
            });

            if (res.success) {
                dispatch(addFlat(res.data));
                toast.success('Flat created successfully 🏢');
                reset();
                setShowAddModal(false);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to create flat');
        }
    };

    /* ---------- FILTER ---------- */
    const filteredFlats = (flats || []).filter((f) =>
        f.flatNumber?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.wing?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <PageHeader
                title="Manage Flats"
                subtitle="Configure and assign society flats to wings."
                actionLabel="Add Flat"
                onAction={() => setShowAddModal(true)}
                icon={Plus}
            />

            {/* Search */}
            <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flat number or wing..."
                className="mb-8"
            />

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(flats || []).length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Building2 size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No flats registered in database.</p>
                    </div>
                ) : (
                    filteredFlats.map((flat) => (
                        <Card key={flat._id || flat.id} className="p-6 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Flat Number</span>
                                    <h3 className="text-3xl font-black text-slate-800">{flat.flatNumber}</h3>
                                </div>
                                <Badge variant={flat.isOccupied ? 'success' : 'warning'}>
                                    {flat.isOccupied ? 'Occupied' : 'Vacant'}
                                </Badge>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <Building2 size={18} className="text-indigo-500" />
                                    <span className="text-sm font-bold">Wing {flat.wing?.name || flat.wing || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 px-3">
                                    <MapPin size={16} className="text-slate-300" />
                                    <span className="text-xs font-semibold">{flat.wing?.block || 'Tower 1'}</span>
                                </div>
                            </div>

                            {flat.isOccupied ? (
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => navigate('/admin/residents')}
                                    className="py-3"
                                >
                                    View Resident
                                </Button>
                            ) : (
                                <div className="h-[48px] flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest border border-dashed border-slate-200 rounded-2xl">
                                    No Resident Assigned
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Create New Flat"
                subtitle="Add a new residential unit to the society database."
                icon={Building2}
                maxWidth="max-w-md"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Flat Number"
                        placeholder="e.g. 101"
                        register={register('flatNumber')}
                        error={errors.flatNumber?.message}
                    />

                    <Select
                        label="Assign to Wing"
                        options={[
                            { label: 'Select Wing', value: '' },
                            ...wings.map(wing => ({
                                label: `${wing.name} Wing`,
                                value: wing._id
                            }))
                        ]}
                        register={register('wingId')}
                        error={errors.wingId?.message}
                    />

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="flex-1 py-4 rounded-2xl border border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            fullWidth
                            className="flex-1 py-4"
                        >
                            Create Flat
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageFlats;