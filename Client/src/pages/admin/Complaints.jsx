import React, { useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    XSquare,
    Clock,
    Search,
    User,
    Building2,
    Calendar,
    MessageSquare,
    MoreVertical
} from 'lucide-react';

const Complaints = () => {

    /* 🔹 TEMP DATA (Branch-2) */
    const [complaints, setComplaints] = useState([
        {
            id: 1,
            title: 'Water Leakage',
            description: 'Water leaking from ceiling since morning.',
            resident: 'Aatmaram Bhide',
            flat: 'A-101',
            date: '12 Mar 2024',
            status: 'Pending'
        },
        {
            id: 2,
            title: 'Lift Not Working',
            description: 'Lift stopped between floors yesterday.',
            resident: 'Jethalal Gada',
            flat: 'B-305',
            date: '10 Mar 2024',
            status: 'Resolved'
        },
        {
            id: 3,
            title: 'Parking Issue',
            description: 'Unauthorized parking in my slot.',
            resident: 'Tarak Mehta',
            flat: 'C-210',
            date: '09 Mar 2024',
            status: 'Rejected'
        }
    ]);

    const [filter, setFilter] = useState('Pending');
    const [searchQuery, setSearchQuery] = useState('');

    /* 🔹 STATUS UPDATE (FAKE) */
    const handleAction = (id, status) => {
        setComplaints(prev =>
            prev.map(c =>
                c.id === id ? { ...c, status } : c
            )
        );
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesTab = filter === 'All' || c.status === filter;
        const matchesSearch =
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.resident.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const StatusBadge = ({ status }) => {
        const styles = {
            Pending: 'bg-amber-50 text-amber-600 border-amber-100',
            Resolved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            Rejected: 'bg-rose-50 text-rose-600 border-rose-100'
        };
        const Icons = {
            Pending: Clock,
            Resolved: CheckCircle2,
            Rejected: XSquare
        };
        const Icon = Icons[status];

        return (
            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 ${styles[status]}`}>
                <Icon className="w-3.5 h-3.5" />
                {status}
            </span>
        );
    };

    return (
        <div className="pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                        Complaints Registry
                    </h1>
                    <p className="text-slate-400 mt-1 font-bold text-sm">
                        Track and manage society complaints.
                    </p>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl border shadow-sm">
                    {['Pending', 'Resolved', 'Rejected', 'All'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === tab
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                    : 'text-slate-400 hover:bg-slate-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-2 rounded-2xl border shadow-sm mb-10 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by issue title or resident..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 rounded-xl bg-slate-50 font-bold"
                />
            </div>

            {/* COMPLAINTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredComplaints.map(c => (
                    <div
                        key={c.id}
                        className="bg-white rounded-3xl border shadow-sm hover:shadow-2xl transition-all overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between mb-6">
                                <StatusBadge status={c.status} />
                                <span className="text-[10px] font-black text-slate-300 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" /> {c.date}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-slate-800 mb-4">
                                {c.title}
                            </h3>

                            <div className="bg-slate-50 p-5 rounded-2xl mb-6">
                                <p className="text-slate-500 text-sm italic">
                                    <MessageSquare className="inline w-4 h-4 mr-2 text-slate-300" />
                                    "{c.description}"
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t pt-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <User className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-700 text-sm uppercase">
                                            {c.resident}
                                        </p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Building2 className="w-3.5 h-3.5" /> Flat {c.flat}
                                        </p>
                                    </div>
                                </div>
                                <MoreVertical className="w-5 h-5 text-slate-300" />
                            </div>
                        </div>

                        {c.status === 'Pending' && (
                            <div className="flex gap-3 p-4 bg-slate-50 border-t">
                                <button
                                    onClick={() => handleAction(c.id, 'Resolved')}
                                    className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                                >
                                    <CheckCircle2 className="w-4 h-4 inline mr-2" />
                                    Resolve
                                </button>
                                <button
                                    onClick={() => handleAction(c.id, 'Rejected')}
                                    className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white border border-rose-100 text-rose-500 hover:bg-rose-600 hover:text-white transition-all"
                                >
                                    <XSquare className="w-4 h-4 inline mr-2" />
                                    Reject
                                </button>
                            </div>
                        )}

                        {c.status !== 'Pending' && (
                            <div className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 border-t">
                                Archived Complaint #{c.id}
                            </div>
                        )}
                    </div>
                ))}

                {filteredComplaints.length === 0 && (
                    <div className="col-span-full py-40 bg-white rounded-3xl border-dashed border text-center">
                        <AlertCircle className="w-20 h-20 text-slate-100 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-300 uppercase">
                            No complaints found
                        </h3>
                        <p className="text-slate-400 text-sm font-bold mt-1">
                            Peace prevails in Gokuldham 🙂
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complaints;
