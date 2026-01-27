import React, { useState } from 'react';
import {
    Bell,
    Plus,
    Search,
    Calendar,
    Trash2,
    Edit,
    MoreVertical,
    ChevronRight,
    Pin,
    X,
    AlertCircle,
    Info
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { addNotice, removeNotice } from '../../redux/slices/noticeSlice';

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

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { pinned: false }
    });

    const onSubmit = (data) => {
        dispatch(addNotice(data));
        toast.success(`Notice "${data.title}" published!`, {
            icon: '📢',
            style: { background: '#f5f3ff', color: '#5b21b6' }
        });
        setShowAddModal(false);
        reset();
    };

    const handleDelete = (id, title) => {
        if (window.confirm(`Delete notice: "${title}"?`)) {
            dispatch(removeNotice(id));
            toast.error('Notice deleted permanently', { icon: '🗑️' });
        }
    };

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight text-shadow-sm uppercase">Society Notices</h1>
                    <p className="text-slate-400 mt-1 font-bold text-sm">Broadcast important announcements to all residents.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-widest text-[10px]"
                >
                    <Plus className="w-5 h-5" />
                    Create New Notice
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm mb-10 relative group">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search archives for notices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 rounded-[1.5rem] bg-slate-50/50 border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 font-bold"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredNotices.map((notice) => (
                    <div key={notice.id} className={`bg-white rounded-[3rem] border ${notice.pinned ? 'border-indigo-100 ring-[6px] ring-indigo-50 shadow-indigo-50' : 'border-slate-100 shadow-sm'} p-10 hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden group flex flex-col`}>
                        {notice.pinned && (
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2.5 rounded-bl-[1.5rem] font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg z-20">
                                <Pin className="w-3.5 h-3.5 fill-white" /> Pinned
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="w-14 h-14 rounded-[1.2rem] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500 border border-slate-100 group-hover:border-indigo-500">
                                <Bell className="w-7 h-7" />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2.5 rounded-xl border border-slate-50 text-slate-200 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all"><Edit className="w-5 h-5" /></button>
                                <button
                                    onClick={() => handleDelete(notice.id, notice.title)}
                                    className="p-2.5 rounded-xl border border-slate-50 text-slate-200 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10 flex-1">
                            <h3 className="text-2xl font-black text-slate-800 mb-4 pr-16 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{notice.title}</h3>
                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-50 group-hover:bg-white transition-colors mb-8">
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    {notice.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto relative z-10">
                            <span className="text-[10px] font-black text-slate-300 flex items-center gap-2 uppercase tracking-widest">
                                <Calendar className="w-4 h-4" /> {notice.date}
                            </span>
                            <button className="text-indigo-600 font-black text-[10px] flex items-center gap-2 group/btn hover:translate-x-1 transition-all uppercase tracking-widest">
                                Full Article
                                <ChevronRight className="w-4 h-4 bg-indigo-50 rounded-full p-0.5" />
                            </button>
                        </div>

                        {/* Decorative watermark */}
                        <Info className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 p-8" />
                    </div>
                ))}

                {filteredNotices.length === 0 && (
                    <div className="col-span-full py-40 bg-white rounded-[4rem] border border-dashed border-slate-100 text-center">
                        <Bell className="w-20 h-20 text-slate-50 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-200 uppercase tracking-tighter">No notices to broadcast</h3>
                        <p className="text-slate-400 text-sm font-bold mt-1">Keep the community informed with updates.</p>
                    </div>
                )}
            </div>

            {/* Create Notice Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-12 pb-6 border-b border-slate-50 relative">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); reset(); }}
                                    className="absolute right-10 top-10 w-12 h-12 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-800 transition-all border border-slate-50"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-8 border border-white shadow-sm">
                                    <Bell className="w-8 h-8" />
                                </div>
                                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">New Announcement</h2>
                                <p className="text-slate-400 font-bold text-sm mt-1">Everyone in Gokuldham will see this on their devices.</p>
                            </div>

                            <div className="p-12 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Announcement Title</label>
                                    <input
                                        {...register('title')}
                                        placeholder="e.g. Holi Celebration 2024"
                                        className={`w-full px-6 py-5 rounded-[1.5rem] border ${errors.title ? 'border-rose-200 ring-4 ring-rose-50' : 'border-slate-50'} bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700`}
                                    />
                                    {errors.title && <p className="text-rose-500 text-[10px] font-black flex items-center gap-1.5 ml-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.title.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detail Description</label>
                                    <textarea
                                        {...register('description')}
                                        placeholder="Enter all important details like date, time, venue..."
                                        className={`w-full px-6 py-5 rounded-[1.5rem] border ${errors.description ? 'border-rose-200 ring-4 ring-rose-50' : 'border-slate-50'} bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 h-48 resize-none transition-all font-bold text-slate-700 leading-relaxed`}
                                    />
                                    {errors.description && <p className="text-rose-500 text-[10px] font-black flex items-center gap-1.5 ml-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.description.message}</p>}
                                </div>

                                <div className="flex items-center gap-4 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/50">
                                    <input
                                        {...register('pinned')}
                                        type="checkbox"
                                        className="w-6 h-6 rounded-lg border-indigo-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer shadow-sm"
                                        id="pin-chk"
                                    />
                                    <label htmlFor="pin-chk" className="text-sm font-black text-indigo-900/60 uppercase tracking-tighter cursor-pointer flex items-center gap-2">
                                        <Pin className="w-4 h-4" /> Pin to Dashboard Top
                                    </label>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => { setShowAddModal(false); reset(); }}
                                        className="flex-1 py-5 font-black text-slate-400 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest text-[10px]"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] transition-all uppercase tracking-[0.2em] text-[10px] border border-indigo-500"
                                    >
                                        Broadcast Now
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notices;
export default function Notices() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Notices</h1>
      <p className="text-slate-500 mt-2">Create and view notices</p>
    </div>
  );
}
