import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    CheckCircle2,
    XCircle,
    Mail,
    Phone,
    MessageSquare,
    Home,
    Search
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { FLAT_REQUEST_API } from '../../services/apis';

import { updateRequest, setRequests } from '../../store/store';

// COMMON UI COMPONENTS
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import SearchInput from '../../components/common/SearchInput';

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

    const handleAction = async (id, name, status, reason = '') => {
        try {
            const decision = status === 'Approved' ? 'Approved' : 'Rejected';
            const res = await apiConnector("PUT", FLAT_REQUEST_API.ADMIN_DECISION(id), {
                decision,
                reason // Rejection reason if any
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
            <PageHeader
                title="Access Requests"
                subtitle="Review and manage resident registration requests."
                icon={ClipboardList}
            />

            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by resident or flat..."
                    className="flex-1 max-w-md"
                />

                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit self-start">
                    {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
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

            <div className="grid grid-cols-1 gap-6">
                {filteredRequests.map((req) => (
                    <Card key={req._id || req.id} className="p-2 overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-100/50">
                        <div className="p-8 flex flex-col lg:flex-row gap-8 bg-slate-50/50 rounded-[2rem]">
                            {/* Profile/Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                                        {(req.user?.name || req.name || 'U')[0]}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                            <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">{req.user?.name || req.name}</h3>
                                            <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'danger'}>
                                                {req.status}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {req.user?.email || req.email}</span>
                                            {req.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {req.phone}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 rounded-[1.5rem] border border-slate-100">
                                    <div>
                                        <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-1">Wing / Flat</p>
                                        <p className="font-black text-slate-700 text-sm">
                                            {req.flat?.wing?.name || req.wing || '-'} - {req.flat?.flatNumber || req.flat || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-1">Resident Type</p>
                                        <p className="font-black text-indigo-600 text-sm">{req.userRole || req.type || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-1">Requested Date</p>
                                        <p className="font-black text-slate-700 text-sm">
                                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : (req.date || '-')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message & Actions */}
                            <div className="lg:w-1/3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-8 pt-8 lg:pt-0">
                                <div className="mb-6">
                                    <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Message from Resident
                                    </p>
                                    <p className="text-sm text-slate-500 font-medium italic bg-white/50 p-4 rounded-xl border border-white">"{req.remark || req.message || 'No additional details.'}"</p>
                                    {(req.reason || req.rejectionReason) && (
                                        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-100">
                                            <p className="text-[9px] uppercase font-black text-rose-400 tracking-widest mb-1">Rejection Reason</p>
                                            <p className="text-sm text-rose-600 font-bold">{req.reason || req.rejectionReason}</p>
                                        </div>
                                    )}
                                </div>

                                {req.status === 'Pending' && (
                                    <div className="flex gap-4">
                                        <Button
                                            onClick={() => handleAction(req._id || req.id, req.user?.name || req.name, 'Approved')}
                                            fullWidth
                                            className="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleRejectClick(req)}
                                            fullWidth
                                            variant="secondary"
                                            className="text-rose-500 border-rose-100 hover:bg-rose-50"
                                        >
                                            <XCircle className="w-4 h-4" /> Reject
                                        </Button>
                                    </div>
                                )}

                                {req.status !== 'Pending' && (
                                    <div className="py-4 border border-dashed border-slate-200 text-slate-300 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em]">
                                        Review Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}

                {(filteredRequests || []).length === 0 && (
                    <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 p-20 text-center text-slate-400">
                        <ClipboardList className="w-16 h-16 mx-auto mb-6 opacity-20" />
                        <p className="font-extrabold text-sm uppercase tracking-widest">No {filter !== 'All' ? filter : ''} requests found.</p>
                    </div>
                )}
            </div>

            {/* Rejection Modal */}
            <Modal
                isOpen={showRejectionModal}
                onClose={() => setShowRejectionModal(false)}
                title="Reject Request"
                subtitle={`Explain why ${selectedRequest?.user?.name || selectedRequest?.name}'s request is being rejected.`}
                icon={XCircle}
                maxWidth="max-w-md"
            >
                <div className="space-y-6">
                    <TextArea
                        label="Rejection Reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g. Identity documents missing or flat already booked..."
                        rows={4}
                    />
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowRejectionModal(false)}
                            className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-50 transition-all text-xs uppercase"
                        >
                            Cancel
                        </button>
                        <Button
                            variant="danger"
                            onClick={() => handleAction(selectedRequest._id || selectedRequest.id, selectedRequest.user?.name || selectedRequest.name, 'Rejected', rejectionReason)}
                            className="flex-[1.5]"
                        >
                            Confirm Reject
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageRequests;
