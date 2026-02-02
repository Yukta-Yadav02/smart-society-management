import React, { useState, useEffect } from 'react';
import {
    Bell,
    Plus,
    Calendar,
    Trash2,
    Edit,
    MoreVertical,
    ChevronRight,
    Pin,
    AlertCircle,
    Info
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
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';

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
        if (window.confirm(`Delete notice: "${title}"?`)) {
            try {
                // DELETE might need to be implemented or ID based
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <PageHeader
                title="Society Broadcasts"
                subtitle="Keep every resident informed with official announcements."
                actionLabel="New Notice"
                onAction={() => setShowAddModal(true)}
                icon={Bell}
            />

            <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search through announcement archives..."
                className="mb-10"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredNotices.map((notice) => (
                    <Card key={notice._id || notice.id} className={`p-10 relative overflow-hidden group flex flex-col ${notice.pinned ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
                        {notice.pinned && (
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2.5 rounded-bl-3xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 z-20">
                                <Pin size={12} className="fill-white" /> Pinned
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-sm border border-indigo-100">
                                <Bell size={28} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-indigo-600 hover:border-indigo-100 transition-all"><Edit size={18} /></button>
                                <button
                                    onClick={() => handleDelete(notice._id || notice.id, notice.title)}
                                    className="p-3 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 relative z-10">
                            <h3 className="text-2xl font-black text-slate-800 mb-4 pr-12 leading-tight tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                                {notice.title}
                            </h3>
                            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-50 mb-8 max-h-[150px] overflow-hidden relative">
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    {notice.description || notice.content}
                                </p>
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                            <span className="text-[10px] font-black text-slate-300 flex items-center gap-2 uppercase tracking-widest">
                                <Calendar size={14} />
                                {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : (notice.date || '-')}
                            </span>
                            <button className="text-indigo-600 font-black text-[10px] flex items-center gap-2 hover:translate-x-1 transition-all uppercase tracking-widest group/btn">
                                Read More
                                <ChevronRight size={14} className="bg-indigo-50 rounded-full p-0.5 group-hover/btn:bg-indigo-100 transition-colors" />
                            </button>
                        </div>

                        <Info size={120} className="absolute -bottom-10 -right-10 text-slate-50 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </Card>
                ))}

                {(filteredNotices || []).length === 0 && (
                    <div className="col-span-full py-40 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center flex flex-col items-center">
                        <Bell size={64} className="text-slate-100 mb-6" />
                        <h3 className="text-2xl font-black text-slate-200 uppercase tracking-tighter">No active notices</h3>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Share important society updates here.</p>
                    </div>
                )}
            </div>

            {/* Create Notice Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="New Announcement"
                subtitle="Post a notice that every resident will see on their dashboard."
                icon={Bell}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Announcement Title"
                        placeholder="e.g. Society General Meeting 2024"
                        register={register('title')}
                        error={errors.title?.message}
                    />
                    <TextArea
                        label="Notice Content"
                        placeholder="Detail the announcement here..."
                        rows={6}
                        register={register('description')}
                        error={errors.description?.message}
                    />

                    <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/30">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-indigo-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            id="pin-chk"
                            onChange={(e) => setValue('pinned', e.target.checked)}
                            checked={watch('pinned')}
                        />
                        <label htmlFor="pin-chk" className="text-xs font-black text-indigo-900/40 uppercase tracking-widest cursor-pointer select-none">
                            Pin to the top of dashboard
                        </label>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="flex-1 py-4 font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </button>
                        <Button type="submit" fullWidth className="flex-[2]">Broadcast Now</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Notices;
