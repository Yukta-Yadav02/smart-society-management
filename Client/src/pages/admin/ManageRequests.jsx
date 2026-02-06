import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    CheckCircle2,
    XSquare,
    Mail,
    Phone,
    MessageSquare,
    ChevronRight,
    ExternalLink,
    Search,
    XCircle
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { FLAT_REQUEST_API } from '../../services/apis';
import { updateRequest, setRequests } from '../../store/store';

// REUSABLE COMPONENTS FOR STRUCTURE
import PageHeader from '../../components/common/PageHeader';
import SearchInput from '../../components/common/SearchInput';
import Modal from '../../components/common/Modal';

const ManageRequests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((state) => state.requests.items);

    const [filter, setFilter] = useState('Pending');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await apiConnector("GET", FLAT_REQUEST_API.GET_ALL);
                if (res.success) {
                    dispatch(setRequests(res.data));
                }
            } catch (err) {
                console.error("Fetch Requests Error:", err);
                toast.error("Failed to load flat requests");
            }
        };
        fetchRequests();
    }, [dispatch]);

    const filteredRequests = (requests || []).filter(r => {
        const matchesFilter = filter === 'All' || r.status === filter;
        const matchesSearch = (r.user?.name || r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.flat?.flatNumber || r.flat || '').toString().includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    // 🏷️ YOUR SPECIFIC STATUS BADGE
    const StatusBadge = ({ status }) => {
        const styles = {
            Pending: 'bg-amber-50 text-amber-600',
            Approved: 'bg-emerald-50 text-emerald-600',
            Rejected: 'bg-rose-50 text-rose-600'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-current opacity-80 ${styles[status]}`}>
                {status}
            </span>
        );
    };

    const handleAction = async (id, name, status, reason = '') => {
        try {
            const decision = status === 'Approved' ? 'Approved' : 'Rejected';
            const res = await apiConnector("PUT", FLAT_REQUEST_API.ADMIN_DECISION(id), {
                decision,
                reason
            });

            if (res.success) {
                dispatch(updateRequest({ id, status, reason }));
                if (status === 'Approved') {
                    toast.success(`${name}'s request approved!`, { icon: '✅' });
                } else {
                    toast.error(`${name}'s request rejected.`, { icon: '❌' });
                    setShowRejectionModal(false);
                    setRejectionReason('');
                }
            }
        } catch (err) {
            toast.error(err.message || "Failed to update request");
        }
    };
    const handleRejectClick = (request) => {
        setSelectedRequest(request);
        setShowRejectionModal(true);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight text-shadow-sm uppercase">Access Requests</h1>
                    <p className="text-slate-500 mt-1 font-bold italic">Review and manage resident registration requests.</p>
                </div>

                <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm w-fit">
                    {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar matching your theme */}
            <div className="mb-8 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by resident or flat number..."
                    className="w-full"
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredRequests.map((req) => (
                    <div key={req._id || req.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-2 hover:shadow-2xl hover:translate-y-[-2px] transition-all duration-300 group overflow-hidden">
                        <div className="p-8 flex flex-col lg:flex-row gap-8 bg-slate-50/50 rounded-[2rem]">
                            {/* Profile/Info Section */}
                            <div className="flex-1">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-16 h-16 rounded-[1.2rem] bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
                                        {(req.user?.name || req.name || 'U')[0]}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                            <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">{req.user?.name || req.name}</h3>
                                            <StatusBadge status={req.status} />
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {req.user?.email || req.email}</span>
                                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {req.user?.phone || req.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3-Column Info Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-inner group-hover:border-indigo-100 transition-colors">
                                    <div>
                                        <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-1">Wing / Flat</p>
                                        <p className="font-black text-slate-700 text-sm">
                                            {req.flat?.wing?.name || req.wing || '-'} - {req.flat?.flatNumber || req.flat || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-1">Resident Type</p>
                                        <p className="font-black text-indigo-600 text-sm uppercase tracking-tighter text-[11px]">{req.userRole || req.type || 'Resident'}</p>
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-1">Date</p>
                                        <p className="font-black text-slate-700 text-sm">
                                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : (req.date || '-')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message & Action Buttons Section */}
                            <div className="lg:w-1/3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-8 pt-8 lg:pt-0">
                                <div className="mb-6">
                                    <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Message from Resident
                                    </p>
                                    <p className="text-sm text-slate-500 font-medium italic bg-white/50 p-4 rounded-xl border border-white">"{req.remark || req.message || 'No additional details provided.'}"</p>
                                    {(req.reason || req.rejectionReason) && (
                                        <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-2 h-full bg-orange-400/20" />
                                            <p className="text-[9px] uppercase font-black text-orange-400 tracking-widest mb-1">Rejection Reason</p>
                                            <p className="text-sm text-orange-600 font-bold">{req.reason || req.rejectionReason}</p>
                                        </div>
                                    )}
                                </div>

                                {req.status === 'Pending' && (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleAction(req._id || req.id, req.user?.name || req.name, 'Approved')}
                                            className="grow bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest text-[10px]"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectClick(req)}
                                            className="grow bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[10px]"
                                        >
                                            <XSquare className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                )}

                                {req.status !== 'Pending' && (
                                    <button className="w-full py-4 border border-dashed border-slate-200 text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-default">
                                        Review Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredRequests.length === 0 && (
                    <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 p-20 text-center text-slate-400">
                        <ClipboardList className="w-16 h-16 mx-auto mb-6 opacity-10" />
                        <p className="font-extrabold text-lg uppercase tracking-widest">No {filter !== 'All' ? filter : ''} requests found.</p>
                    </div>
                )}
            </div>

            {/* YOUR PREMIUM REJECTION MODAL */}
            {showRejectionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm overflow-hidden border border-white/20 scale-in-center">
                        <div className="p-10 border-b border-slate-100 text-center relative">
                            <button
                                onClick={() => setShowRejectionModal(false)}
                                className="absolute right-6 top-6 text-slate-300 hover:text-slate-600 transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <XCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Reject Request</h2>
                            <p className="text-slate-500 text-xs mt-2 font-medium">Explain why <b>{selectedRequest?.user?.name || selectedRequest?.name}</b> is not eligible.</p>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rejection Reason</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="e.g. Identity documentation missing..."
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-rose-500/10 h-32 resize-none transition-all font-medium text-sm text-slate-700"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowRejectionModal(false)}
                                    className="flex-1 py-4.5 font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all text-xs uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAction(selectedRequest._id || selectedRequest.id, selectedRequest.user?.name || selectedRequest.name, 'Rejected', rejectionReason)}
                                    className="flex-[1.5] bg-rose-500 hover:bg-rose-600 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-rose-100 transition-all uppercase tracking-widest text-[10px]"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRequests;