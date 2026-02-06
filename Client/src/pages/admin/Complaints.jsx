import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    XSquare,
    Clock,
    User,
    Building2,
    Calendar,
    MessageSquare,
    MoreVertical
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { COMPLAINT_API } from '../../services/apis';

import { updateComplaint, setComplaints } from '../../store/store';

//  COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import SearchInput from '../../components/common/SearchInput';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const Complaints = () => {
    const dispatch = useDispatch();
    const complaints = useSelector((state) => state.complaints.items);

    const [filter, setFilter] = useState('OPEN');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(new Set());

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                setLoading(true);
                const res = await apiConnector("GET", COMPLAINT_API.GET_ALL);
                if (res.success) {
                    dispatch(setComplaints(res.data));
                } else {
                    toast.error("Failed to load complaints registry");
                }
            } catch (err) {
                console.error("Fetch Complaints Error:", err);
                toast.error("Failed to load complaints registry");
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [dispatch]);

    const handleAction = useCallback(async (id, title, status) => {
        if (actionLoading.has(id)) return;
        
        // Input validation
        if (!id || !status || !['RESOLVED', 'REJECTED'].includes(status)) {
            toast.error('Invalid action parameters');
            return;
        }
        
        try {
            setActionLoading(prev => new Set(prev).add(id));
            const res = await apiConnector("PUT", COMPLAINT_API.UPDATE_STATUS(id), { status });
            if (res.success) {
                dispatch(updateComplaint({ id, status }));
                if (status === 'RESOLVED') {
                    toast.success(`Complaint "${title}" resolved!`, { icon: '✅' });
                } else {
                    toast.error(`Complaint "${title}" rejected.`, { icon: '❌' });
                }
            } else {
                toast.error("Failed to update complaint status");
            }
        } catch (err) {
            toast.error(err.message || "Failed to update complaint status");
        } finally {
            setActionLoading(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    }, [dispatch, actionLoading]);

    const filteredComplaints = useMemo(() => {
        return (complaints || []).filter(c => {
            const matchesTab = filter === 'All' || c.status === filter;
            const matchesSearch = (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.user?.name || c.user || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.flat?.flatNumber || c.flat || '').toString().includes(searchQuery);
            return matchesTab && matchesSearch;
        });
    }, [complaints, filter, searchQuery]);

    if (loading) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                <PageHeader
                    title="Complaints Registry"
                    subtitle="Everything in society must be perfect. Track and resolve issues here."
                    icon={AlertCircle}
                />
                <div className="flex items-center justify-center py-40">
                    <div className="text-slate-400">Loading complaints...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <PageHeader
                title="Complaints Registry"
                subtitle="Everything in society must be perfect. Track and resolve issues here."
                icon={AlertCircle}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by issue, resident or flat..."
                    className="flex-1 max-w-md"
                />

                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit self-start">
                    {['OPEN', 'RESOLVED', 'REJECTED', 'All'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredComplaints.map((complaint) => {
                    const complaintId = complaint._id || complaint.id;
                    const isLoading = actionLoading.has(complaintId);
                    return (
                    <Card key={complaintId} className="p-2 overflow-hidden group relative flex flex-col">
                        <div className="p-8 flex-1 bg-slate-50/50 rounded-[2rem] flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <Badge variant={complaint.status === 'RESOLVED' ? 'success' : complaint.status === 'OPEN' ? 'warning' : 'danger'}>
                                    <div className="flex items-center gap-1.5">
                                        {complaint.status === 'OPEN' ? <Clock size={12} /> : complaint.status === 'RESOLVED' ? <CheckCircle2 size={12} /> : <XSquare size={12} />}
                                        {complaint.status}
                                    </div>
                                </Badge>
                                <span className="text-[10px] font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : (complaint.date || '-')}
                                </span>
                            </div>

                            <div className="mb-6 flex-1">
                                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{complaint.title}</h3>
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                                        <MessageSquare className="w-4 h-4 text-slate-300 inline mr-2 mb-1" />
                                        "{complaint.description}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-700 uppercase tracking-tighter leading-none mb-1">{complaint.user?.name || complaint.user || 'Resident'}</p>
                                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest">
                                            <Building2 className="w-3.5 h-3.5 text-slate-200" /> Flat {complaint.flat?.flatNumber || complaint.flat || '-'}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {complaint.status === 'OPEN' && (
                            <div className="flex p-4 gap-3 mt-auto">
                                <button
                                    onClick={() => handleAction(complaintId, complaint.title, 'RESOLVED')}
                                    disabled={isLoading}
                                    className={`flex-1 ${isLoading ? 'bg-emerald-400' : 'bg-emerald-500 hover:bg-emerald-600'} text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] disabled:cursor-not-allowed`}
                                >
                                    <CheckCircle2 className="w-4 h-4" /> {isLoading ? 'Processing...' : 'Resolve'}
                                </button>
                                <button
                                    onClick={() => handleAction(complaintId, complaint.title, 'REJECTED')}
                                    disabled={isLoading}
                                    className={`flex-1 ${isLoading ? 'bg-slate-100' : 'bg-white hover:bg-rose-50'} border border-rose-100 text-rose-500 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] disabled:cursor-not-allowed disabled:text-slate-400`}
                                >
                                    <XSquare className="w-4 h-4" /> {isLoading ? 'Processing...' : 'Reject'}
                                </button>
                            </div>
                        )}

                        {complaint.status !== 'OPEN' && (
                            <div className="flex p-4 mt-auto">
                                <div className="w-full py-4 border border-dashed border-slate-200 text-slate-300 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em]">
                                    Case Finalized
                                </div>
                            </div>
                        )}
                    </Card>
                    );
                })}

                {(filteredComplaints || []).length === 0 && (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center bg-white rounded-[4rem] border border-dashed border-slate-200 group">
                        <AlertCircle className="w-20 h-20 text-slate-100 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                        <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">No complaints found</h3>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Peace prevails in Gokuldham Society!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complaints;
