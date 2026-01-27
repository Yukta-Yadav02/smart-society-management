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
    ChevronRight,
    MessageSquare,
    MoreVertical
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateComplaintStatus } from '../../redux/slices/complaintSlice';

const Complaints = () => {
    const dispatch = useDispatch();
    const complaints = useSelector((state) => state.complaints.items);

    const [filter, setFilter] = useState('Pending');
    const [searchQuery, setSearchQuery] = useState('');

    const handleAction = (id, title, status) => {
        dispatch(updateComplaintStatus({ id, status }));
        if (status === 'Resolved') {
            toast.success(`Complaint "${title}" resolved!`, {
                icon: '✅',
                style: { background: '#ecfdf5', color: '#065f46' }
            });
        } else {
            toast.error(`Complaint "${title}" rejected.`, {
                icon: '❌',
                style: { background: '#fef2f2', color: '#991b1b' }
            });
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesTab = filter === 'All' || c.status === filter;
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight text-shadow-sm uppercase">Complaints Registry</h1>
                    <p className="text-slate-400 mt-1 font-bold text-sm">Everything in society must be perfect. Track issues here.</p>
                </div>

                <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm w-fit">
                    {['Pending', 'Resolved', 'Rejected', 'All'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm mb-10 relative group">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by issue title or resident name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 rounded-[1.5rem] bg-slate-50/50 border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 font-bold"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredComplaints.map((complaint) => (
                    <div key={complaint.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col group overflow-hidden relative">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors duration-500" />

                        <div className="p-8 flex-1 relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <StatusBadge status={complaint.status} />
                                <span className="text-[10px] font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5" /> {complaint.date}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">{complaint.title}</h3>
                                <div className="bg-slate-50/80 p-5 rounded-[1.5rem] border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                                        <MessageSquare className="w-4 h-4 text-slate-300 inline mr-2 mb-1" />
                                        "{complaint.description}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[1.1rem] bg-slate-100 flex items-center justify-center text-slate-400 border border-white shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-700 uppercase tracking-tighter leading-none mb-1">{complaint.resident}</p>
                                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                            <Building2 className="w-3.5 h-3.5" /> Flat {complaint.flat}
                                        </p>
                                    </div>
                                </div>
                                <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-slate-600 transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {complaint.status === 'Pending' && (
                            <div className="flex p-3 gap-3 bg-slate-50/50 border-t border-slate-100">
                                <button
                                    onClick={() => handleAction(complaint.id, complaint.title, 'Resolved')}
                                    className="flex-1 bg-white hover:bg-emerald-600 hover:text-white text-emerald-600 border border-emerald-100 font-black py-4 rounded-2xl transition-all shadow-sm hover:shadow-emerald-100 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Finalize Resolve
                                </button>
                                <button
                                    onClick={() => handleAction(complaint.id, complaint.title, 'Rejected')}
                                    className="flex-1 bg-white hover:bg-rose-600 hover:text-white text-rose-500 border border-rose-100 font-black py-4 rounded-2xl transition-all shadow-sm hover:shadow-rose-100 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                                >
                                    <XSquare className="w-4 h-4" /> Reject Issue
                                </button>
                            </div>
                        )}

                        {complaint.status !== 'Pending' && (
                            <div className="px-8 py-4 bg-slate-50/30 text-center border-t border-slate-50">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Archive Record #{complaint.id}</p>
                            </div>
                        )}
                    </div>
                ))}

                {filteredComplaints.length === 0 && (
                    <div className="col-span-full py-40 bg-white rounded-[4rem] border border-dashed border-slate-100 text-center group">
                        <AlertCircle className="w-20 h-20 text-slate-100 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                        <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">No complaints found</h3>
                        <p className="text-slate-400 text-sm font-bold mt-1">Peace prevails in Gokuldham Society!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complaints;
export default function Complaints() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Complaints</h1>
      <p className="text-slate-500 mt-2">View and resolve complaints</p>
    </div>
  );
}
