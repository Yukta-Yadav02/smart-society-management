import React, { useState } from 'react';
import {
    Bell,
    Plus,
    Search,
    Calendar,
    Trash2,
    Edit,
    ChevronRight,
    Pin,
    X,
    AlertCircle,
    Info
} from 'lucide-react';

const Notices = () => {

    /* 🔹 TEMP DATA (Branch-2) */
    const [notices, setNotices] = useState([
        {
            id: 1,
            title: 'Holi Celebration 2024',
            description: 'All residents are invited to celebrate Holi on 25th March at society ground.',
            date: '15 Mar 2024',
            pinned: true
        },
        {
            id: 2,
            title: 'Water Supply Maintenance',
            description: 'Water supply will be interrupted from 10 AM to 2 PM due to pipeline maintenance.',
            date: '10 Mar 2024',
            pinned: false
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pinned: false
    });

    /* 🔹 ADD NOTICE */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.title.length < 5 || formData.description.length < 10) {
            return;
        }

        setNotices(prev => [
            {
                id: Date.now(),
                title: formData.title,
                description: formData.description,
                pinned: formData.pinned,
                date: new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            },
            ...prev
        ]);

        setShowAddModal(false);
        setFormData({ title: '', description: '', pinned: false });
    };

    /* 🔹 DELETE NOTICE */
    const handleDelete = (id) => {
        if (window.confirm('Delete this notice?')) {
            setNotices(prev => prev.filter(n => n.id !== id));
        }
    };

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                        Society Notices
                    </h1>
                    <p className="text-slate-400 mt-1 font-bold text-sm">
                        Broadcast important announcements to all residents.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-indigo-100 border border-indigo-500 uppercase tracking-widest text-[10px]"
                >
                    <Plus className="w-5 h-5" />
                    Create New Notice
                </button>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-2 rounded-[2rem] border shadow-sm mb-10 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search notices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 rounded-[1.5rem] bg-slate-50 font-bold"
                />
            </div>

            {/* NOTICES GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredNotices.map((notice) => (
                    <div
                        key={notice.id}
                        className={`bg-white rounded-[3rem] border p-10 transition-all hover:shadow-2xl hover:-translate-y-1 relative group ${
                            notice.pinned
                                ? 'border-indigo-100 ring-[6px] ring-indigo-50'
                                : 'border-slate-100 shadow-sm'
                        }`}
                    >
                        {notice.pinned && (
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2.5 rounded-bl-[1.5rem] font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                                <Pin className="w-3.5 h-3.5 fill-white" /> Pinned
                            </div>
                        )}

                        <div className="flex justify-between mb-8">
                            <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Bell className="w-7 h-7" />
                            </div>
                            <button
                                onClick={() => handleDelete(notice.id)}
                                className="p-2.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tight group-hover:text-indigo-600">
                            {notice.title}
                        </h3>

                        <div className="bg-slate-50 p-6 rounded-[2rem] mb-8">
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                {notice.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t pt-6">
                            <span className="text-[10px] font-black text-slate-300 flex items-center gap-2 uppercase tracking-widest">
                                <Calendar className="w-4 h-4" /> {notice.date}
                            </span>
                            <button className="text-indigo-600 font-black text-[10px] flex items-center gap-2 uppercase tracking-widest">
                                Full Article
                                <ChevronRight className="w-4 h-4 bg-indigo-50 rounded-full p-0.5" />
                            </button>
                        </div>

                        <Info className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}

                {filteredNotices.length === 0 && (
                    <div className="col-span-full py-40 bg-white rounded-[4rem] border border-dashed text-center">
                        <Bell className="w-20 h-20 text-slate-50 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-200 uppercase">
                            No notices found
                        </h3>
                    </div>
                )}
            </div>

            {/* ADD NOTICE MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <div className="bg-white rounded-[3.5rem] w-full max-w-xl overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            <div className="p-12 pb-6 relative">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute right-10 top-10 w-12 h-12 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-300"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                    <Bell className="w-8 h-8" />
                                </div>

                                <h2 className="text-4xl font-black text-slate-800">
                                    New Announcement
                                </h2>
                                <p className="text-slate-400 font-bold text-sm mt-1">
                                    Everyone will see this notice.
                                </p>
                            </div>

                            <div className="p-12 space-y-8">
                                <input
                                    placeholder="Announcement Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-6 py-5 rounded-xl bg-slate-50 font-bold"
                                />

                                <textarea
                                    placeholder="Notice description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-5 rounded-xl bg-slate-50 h-40 resize-none font-bold"
                                />

                                <label className="flex items-center gap-3 text-sm font-black text-indigo-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.pinned}
                                        onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <Pin className="w-4 h-4" /> Pin this notice
                                </label>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-5 text-slate-400 font-black"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px]"
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
