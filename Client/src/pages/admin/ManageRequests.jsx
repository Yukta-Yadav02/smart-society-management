import React, { useState } from 'react';
import {
    ClipboardList,
    CheckCircle2,
    XSquare,
    Mail,
    Phone,
    MessageSquare,
} from 'lucide-react';

const ManageRequests = () => {

    // 🔹 TEMP DATA (Branch-2: no redux, no backend)
    const [requests, setRequests] = useState([
        {
            id: 1,
            name: 'Rahul Sharma',
            email: 'rahul@gmail.com',
            phone: '9876543210',
            wing: 'A Wing',
            flat: '101',
            block: 'Block 1',
            type: 'Owner',
            message: 'I have purchased this flat recently.',
            status: 'Pending',
            reason: ''
        },
        {
            id: 2,
            name: 'Anita Verma',
            email: 'anita@gmail.com',
            phone: '9123456780',
            wing: 'B Wing',
            flat: '305',
            block: 'Block 2',
            type: 'Tenant',
            message: '',
            status: 'Approved',
            reason: ''
        }
    ]);

    const [filter, setFilter] = useState('Pending');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const filteredRequests =
        filter === 'All'
            ? requests
            : requests.filter(r => r.status === filter);

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

    const handleAction = (id, status, reason = '') => {
        setRequests(prev =>
            prev.map(r =>
                r.id === id ? { ...r, status, reason } : r
            )
        );
        setShowRejectionModal(false);
        setRejectionReason('');
    };

    const handleRejectClick = (request) => {
        setSelectedRequest(request);
        setShowRejectionModal(true);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                        Access Requests
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">
                        Review and manage resident registration requests.
                    </p>
                </div>

                <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm w-fit">
                    {['Pending', 'Approved', 'Rejected', 'All'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === tab
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredRequests.map(req => (
                    <div
                        key={req.id}
                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-2 hover:shadow-2xl transition-all"
                    >
                        <div className="p-8 flex flex-col lg:flex-row gap-8 bg-slate-50/50 rounded-[2rem]">
                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-16 h-16 rounded-[1.2rem] bg-indigo-600 flex items-center justify-center text-white font-black text-2xl">
                                        {req.name[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-black text-xl text-slate-800 uppercase">
                                                {req.name}
                                            </h3>
                                            <StatusBadge status={req.status} />
                                        </div>
                                        <div className="flex gap-4 text-xs text-slate-400 font-bold uppercase">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {req.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> {req.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded-[1.5rem] border">
                                    <div>
                                        <p className="text-[9px] uppercase font-black text-slate-300 mb-1">
                                            Wing / Flat
                                        </p>
                                        <p className="font-black text-slate-700 text-sm">
                                            {req.wing} - {req.flat}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black text-slate-300 mb-1">
                                            Block
                                        </p>
                                        <p className="font-black text-slate-700 text-sm">
                                            {req.block}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black text-slate-300 mb-1">
                                            Resident Type
                                        </p>
                                        <p className="font-black text-indigo-600 text-sm">
                                            {req.type}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message + Actions */}
                            <div className="lg:w-1/3 border-t lg:border-l pt-8 lg:pt-0 lg:pl-8">
                                <p className="text-[9px] uppercase font-black text-slate-300 mb-3 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Message
                                </p>
                                <p className="text-sm italic text-slate-500 bg-white p-4 rounded-xl border mb-6">
                                    "{req.message || 'No message provided.'}"
                                </p>

                                {req.status === 'Pending' ? (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleAction(req.id, 'Approved')}
                                            className="flex-1 bg-emerald-500 text-white font-black py-4 rounded-2xl"
                                        >
                                            <CheckCircle2 className="inline w-4 h-4 mr-1" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectClick(req)}
                                            className="flex-1 border border-rose-200 text-rose-500 font-black py-4 rounded-2xl"
                                        >
                                            <XSquare className="inline w-4 h-4 mr-1" />
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <button className="w-full py-4 border border-dashed text-slate-300 rounded-2xl font-black">
                                        Review Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredRequests.length === 0 && (
                    <div className="bg-white rounded-[3rem] border border-dashed p-20 text-center text-slate-400">
                        <ClipboardList className="w-16 h-16 mx-auto mb-6 opacity-10" />
                        <p className="font-extrabold uppercase">
                            No requests found
                        </p>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectionModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                    <div className="bg-white rounded-[3rem] w-full max-w-sm p-10">
                        <h2 className="text-3xl font-black mb-4">
                            Reject Request
                        </h2>
                        <textarea
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            className="w-full h-32 rounded-2xl border p-4 mb-6"
                            placeholder="Reason for rejection..."
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowRejectionModal(false)}
                                className="flex-1 border rounded-2xl py-3 font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleAction(
                                        selectedRequest.id,
                                        'Rejected',
                                        rejectionReason
                                    )
                                }
                                className="flex-1 bg-rose-500 text-white rounded-2xl py-3 font-black"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRequests;
