import React, { useState, useEffect } from 'react';
import {
    Bell,
    Plus,
    Calendar,
    Trash2,
    Edit,
    Pin,
    Megaphone,
    Clock,
    X,
    Search,
    MoreVertical,
    AlertCircle
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { NOTICE_API } from '../../services/apis';
import { addNotice, deleteNotice, setNotices } from '../../store/store';

// COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import SearchInput from '../../components/common/SearchInput';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';

// 🛡️ VALIDATION SCHEMA
const schema = yup.object().shape({
    title: yup.string().required('Title is required').min(5, 'Title too short'),
    description: yup.string().required('Description is required').min(10, 'Description too short'),
});

const Notices = () => {
    const dispatch = useDispatch();
    const notices = useSelector((state) => state.notices.items);

    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await apiConnector("GET", NOTICE_API.GET_ALL);
                if (res.success) {
                    dispatch(setNotices(res.data));
                }
            } catch (err) {
                console.error("Fetch Notices Error:", err);
                toast.error("Failed to load announcements");
            }
        };
        fetchNotices();
    }, [dispatch]);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { pinned: false }
    });

    const onSubmit = async (data) => {
        try {
            const res = await apiConnector("POST", NOTICE_API.CREATE, {
                title: data.title,
                content: data.description,
                pinned: data.pinned
            });

            if (res.success) {
                dispatch(addNotice(res.data));
                toast.success(`Announcement broadcasted!`, { icon: '📢' });
                setShowAddModal(false);
                reset();
            }
        } catch (err) {
            toast.error(err.message || "Failed to post notice");
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                const res = await apiConnector("DELETE", `/api/notice/${id}`);
                if (res.success || res) {
                    dispatch(deleteNotice(id));
                    toast.error('Notice removed', { icon: '🗑️' });
                }
            } catch (err) {
                toast.error(err.message || "Failed to delete notice");
            }
        }
    };

    const filteredNotices = (notices || []).filter(n =>
        (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.description || n.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight text-shadow-sm uppercase">Society Broadcasts</h1>
                    <p className="text-slate-500 mt-1 font-bold">Manage and view all official society announcements.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-widest text-[10px]"
                >
                    <Plus className="w-5 h-5" />
                    New Notice
                </button>
            </div>

            <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for announcements..."
                className="mb-12"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredNotices.map((notice) => (
                    <div key={notice._id || notice.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group overflow-hidden relative">
                        {notice.pinned && (
                            <div className="absolute top-2 right-2 bg-indigo-600 text-white px-4 py-1.5 rounded-[1.5rem] font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 z-20 shadow-lg shadow-indigo-100">
                                <Pin size={10} className="fill-current" /> Pinned
                            </div>
                        )}

                        <div className="rounded-[2.2rem] bg-slate-50/50 p-8 sm:p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-5">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-12 duration-500 z-10 ${notice.pinned ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-indigo-600 border border-slate-100 shadow-sm'}`}>
                                        <Bell size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Calendar size={12} />
                                                {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'Today'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                            {notice.title}
                                        </h3>
                                    </div>
                                </div>
                                <button className="p-2.5 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-white transition-all">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-white/70 p-6 sm:p-8 rounded-[2rem] border border-white shadow-sm mb-2 min-h-[120px]">
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-bold">
                                    {notice.description || notice.content}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 flex gap-3">
                            <button
                                className="flex-1 py-4.5 rounded-2xl bg-white border border-slate-100 text-slate-400 font-black text-xs hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                            >
                                <Edit className="w-4 h-4" /> Edit Notice
                            </button>
                            <button
                                onClick={() => handleDelete(notice._id || notice.id, notice.title)}
                                className="flex-1 py-4.5 rounded-2xl bg-white border border-slate-100 text-slate-400 font-black text-xs hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                            >
                                <Trash2 className="w-4 h-4" /> Remove
                            </button>
                        </div>
                    </div>
                ))}

                {(filteredNotices || []).length === 0 && (
                    <div className="col-span-full py-40 bg-white border border-dashed border-slate-200 rounded-[4rem] text-center flex flex-col items-center group">
                        <Megaphone size={64} className="text-slate-100 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                        <h3 className="text-2xl font-black text-slate-200 uppercase tracking-tighter">No notices found</h3>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Broadcast something important to the community.</p>
                    </div>
                )}
            </div>

            {/* Create Notice Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => { setShowAddModal(false); reset(); }}
                title="New Broadcast"
                subtitle="Create a notice that will be visible to all residents."
                icon={Megaphone}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Notice Title"
                        placeholder="e.g. Annual Society Meeting"
                        register={register('title')}
                        error={errors.title?.message}
                    />
                    <TextArea
                        label="Announcement Content"
                        placeholder="Describe the notice in detail here..."
                        rows={6}
                        register={register('description')}
                        error={errors.description?.message}
                    />

                    <div className="flex items-center gap-3 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/40 cursor-pointer" onClick={() => setValue('pinned', !watch('pinned'))}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${watch('pinned') ? 'bg-indigo-600 border-indigo-600' : 'border-indigo-200'}`}>
                            {watch('pinned') && <Pin size={12} className="text-white fill-current" />}
                        </div>
                        <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest cursor-pointer select-none">
                            Pin this broadcast for priority notice
                        </label>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => { setShowAddModal(false); reset(); }}
                            className="flex-1 py-4.5 font-black text-slate-400 hover:bg-slate-50 transition-all rounded-2xl uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-widest text-[10px]">
                            Publish Notice
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Notices;
