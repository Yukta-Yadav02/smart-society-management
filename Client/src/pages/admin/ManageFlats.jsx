import React, { useEffect, useState } from 'react';
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

import {
    fetchFlatsByWing,
    createFlat
} from '../../redux/slices/flatSlice';

/* ================= VALIDATION ================= */
const schema = yup.object().shape({
    flatNumber: yup
        .string()
        .required('Flat number is required')
        .matches(/^\d+$/, 'Must be a number'),
    wingId: yup.string().required('Wing is required'),
});

/* ================= COMPONENT ================= */
const ManageFlats = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /* ---------- REDUX ---------- */
    const { items: flats, status } = useSelector((state) => state.flats);

    /* ---------- LOCAL STATE ---------- */
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWing, setSelectedWing] = useState(null);
    const [showWingDropdown, setShowWingDropdown] = useState(false);

    /* ---------- FORM ---------- */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
    });

    /* ---------- FETCH FLATS ---------- */
    useEffect(() => {
        if (selectedWing) {
            dispatch(fetchFlatsByWing(selectedWing));
        }
    }, [selectedWing, dispatch]);

    /* ---------- SUBMIT ---------- */
    const onSubmit = async (data) => {
        try {
            await dispatch(createFlat(data)).unwrap();
            toast.success('Flat created successfully 🏢');
            reset();
            setShowAddModal(false);
        } catch (err) {
            toast.error(err || 'Failed to create flat');
        }
    };

    /* ---------- FILTER ---------- */
    const filteredFlats = flats.filter((f) =>
        f.flatNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* ---------- STATUS BADGE ---------- */
    const StatusBadge = ({ resident }) => {
        const occupied = Boolean(resident);
        return (
            <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5
                ${occupied
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
            >
                <div
                    className={`w-1.5 h-1.5 rounded-full
                    ${occupied ? 'bg-emerald-500' : 'bg-amber-500'}`}
                />
                {occupied ? 'Occupied' : 'Vacant'}
            </span>
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* ================= HEADER ================= */}
            <div className="flex justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Manage Flats</h1>
                    <p className="text-slate-500">Backend-connected flat management</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2"
                >
                    <Plus />
                    Add Flat
                </button>
            </div>

            {/* ================= SEARCH ================= */}
            <input
                placeholder="Search flat number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-8 px-6 py-4 rounded-2xl bg-slate-50"
            />

            {/* ================= GRID ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFlats.map((flat) => (
                    <div
                        key={flat._id}
                        className="bg-white rounded-3xl p-6 border shadow-sm"
                    >
                        <div className="flex justify-between mb-4">
                            <div className="text-2xl font-black">
                                {flat.flatNumber}
                            </div>
                            <StatusBadge resident={flat.currentResident} />
                        </div>

                        <div className="space-y-2 text-slate-600">
                            <div className="flex gap-2 items-center">
                                <MapPin size={16} />
                                Wing
                            </div>
                        </div>

                        {flat.currentResident && (
                            <button
                                onClick={() => navigate('/residents')}
                                className="mt-4 w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold"
                            >
                                View Resident
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* ================= MODAL ================= */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white p-8 rounded-3xl w-full max-w-md"
                    >
                        <h2 className="text-2xl font-black mb-6">Create Flat</h2>

                        <input
                            {...register('flatNumber')}
                            placeholder="Flat Number"
                            className="w-full mb-3 px-4 py-3 rounded-xl bg-slate-50"
                        />
                        {errors.flatNumber && (
                            <p className="text-red-500 text-xs">{errors.flatNumber.message}</p>
                        )}

                        <select
                            {...register('wingId')}
                            className="w-full mb-6 px-4 py-3 rounded-xl bg-slate-50"
                        >
                            <option value="">Select Wing</option>
                            <option value="WING_ID_A">A Wing</option>
                            <option value="WING_ID_B">B Wing</option>
                        </select>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 border rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageFlats;