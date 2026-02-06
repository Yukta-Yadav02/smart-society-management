import React, { useState, useEffect } from 'react';
import {
    Bell,
    Plus,
    Calendar,
    Trash2,
    Edit,
    Megaphone,
    MoreVertical
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
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



const Notices = () => {
    const dispatch = useDispatch();
    const notices = useSelector((state) => state.notices.items);

    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await apiConnector("GET", NOTICE_API.GET_ALL);
                console.log('Fetch notices response:', res);
                if (res && res.success) {
                    dispatch(setNotices(res.data || []));
                }
            } catch (err) {
                console.error("Fetch Notices Error:", err);
                toast.error("Failed to load notices");
            }
        };
        fetchNotices();
    }, [dispatch]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        if (!data.title || !data.description) {
            toast.error('Please fill both fields');
            return;
        }
        
        try {
            const res = await apiConnector("POST", NOTICE_API.CREATE, {
                title: data.title,
                message: data.description,
                flat: null
            });

            if (res && res.success) {
                dispatch(addNotice(res.data));
                toast.success('Notice published!');
                setShowAddModal(false);
                reset();
            } else {
                toast.error('Failed to create notice');
            }
        } catch (err) {
            toast.error('Error creating notice');
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                console.log('Deleting notice with ID:', id);
                const res = await apiConnector("DELETE", NOTICE_API.DELETE(id));
                console.log('Delete response:', res);
                
                if (res && (res.success || res.status === 200)) {
                    dispatch(deleteNotice(id));
                    toast.success('Notice deleted successfully', { icon: '🗑️' });
                } else {
                    console.error('Delete failed:', res);
                    toast.error('Failed to delete notice');
                }
            } catch (err) {
                console.error('Delete error:', err);
                toast.error('Failed to delete notice');
            }
        }
    };

    const filteredNotices = (notices || []).filter(n =>
        (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.message || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight text-shadow-sm uppercase">Society Broadcasts</h1>
                    <p className="text-slate-500 mt-1 font-bold">Manage and view all official society announcements.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            try {
                                const res = await apiConnector("GET", NOTICE_API.GET_ALL);
                                if (res && res.success) {
                                    dispatch(setNotices(res.data || []));
                                    toast.success('Notices refreshed!');
                                } else {
                                    toast.error('Failed to fetch notices');
                                }
                            } catch (err) {
                                toast.error('Error fetching notices');
                            }
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-widest text-[10px]"
                    >
                        <Plus className="w-5 h-5" />
                        New Broadcast
                    </button>
                </div>
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
                        <div className="rounded-[2.2rem] bg-slate-50/50 p-8 sm:p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-12 duration-500 z-10 bg-white text-indigo-600 border border-slate-100 shadow-sm">
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
                                    {notice.message}
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
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notice Title</label>
                        <input
                            name="title"
                            type="text"
                            placeholder="e.g. Annual Society Meeting"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Announcement Content</label>
                        <textarea
                            name="description"
                            placeholder="Describe the notice in detail here..."
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => { setShowAddModal(false); reset(); }}
                            className="flex-1 py-4.5 font-black text-slate-400 hover:bg-slate-50 transition-all rounded-2xl uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            onClick={async () => {
                                const titleInput = document.querySelector('input[name="title"]');
                                const descInput = document.querySelector('textarea[name="description"]');
                                
                                if (!titleInput.value || !descInput.value) {
                                    toast.error('Please fill both fields');
                                    return;
                                }
                                
                                try {
                                    const res = await apiConnector("POST", NOTICE_API.CREATE, {
                                        title: titleInput.value,
                                        message: descInput.value,
                                        flat: null
                                    });
                                    
                                    if (res && res.success) {
                                        dispatch(addNotice(res.data));
                                        toast.success('Notice published!');
                                        setShowAddModal(false);
                                        titleInput.value = '';
                                        descInput.value = '';
                                    } else {
                                        toast.error('Failed to create notice');
                                    }
                                } catch (err) {
                                    toast.error('Error creating notice');
                                }
                            }}
                            className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-widest text-[10px]"
                        >
                            Publish Notice
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Notices;









