import React, { useState } from 'react';
import {
    Receipt,
    Plus,
    Users,
    Search,
    CheckCircle2,
    Clock,
    X,
    AlertCircle,
    IndianRupee
} from 'lucide-react';

const Maintenance = () => {

    /* 🔹 TEMP DATA (Branch-2) */
    const [records, setRecords] = useState([
        {
            id: 1,
            flat: '101',
            wing: 'A',
            amount: 2500,
            period: 'March 2024',
            type: 'Common',
            description: 'Monthly Society Maintenance',
            status: 'Unpaid'
        },
        {
            id: 2,
            flat: '305',
            wing: 'B',
            amount: 1200,
            period: 'March 2024',
            type: 'Special',
            description: 'Lift Repair',
            status: 'Paid'
        }
    ]);

    const flats = [
        { id: 1, wing: 'A', number: '101' },
        { id: 2, wing: 'B', number: '305' },
        { id: 3, wing: 'C', number: '210' },
        { id: 4, wing: 'D', number: '404' }
    ];

    const [showCommonModal, setShowCommonModal] = useState(false);
    const [showSpecialModal, setShowSpecialModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    /* 🔹 FORMS */
    const [commonForm, setCommonForm] = useState({ amount: '', period: '' });
    const [specialForm, setSpecialForm] = useState({
        flatId: '',
        amount: '',
        description: '',
        period: ''
    });

    /* 🔹 CALCULATIONS */
    const filteredRecords = records.filter(r => {
        const statusMatch = filterStatus === 'All' || r.status === filterStatus;
        const searchMatch =
            r.flat.includes(searchQuery) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
    });

    const totalCollected = records
        .filter(r => r.status === 'Paid')
        .reduce((s, r) => s + r.amount, 0);

    const totalPending = records
        .filter(r => r.status === 'Unpaid')
        .reduce((s, r) => s + r.amount, 0);

    /* 🔹 ACTIONS */
    const toggleStatus = (id) => {
        setRecords(prev =>
            prev.map(r =>
                r.id === id
                    ? { ...r, status: r.status === 'Paid' ? 'Unpaid' : 'Paid' }
                    : r
            )
        );
    };

    const generateCommonBill = () => {
        const newBills = flats.map(f => ({
            id: Date.now() + Math.random(),
            flat: f.number,
            wing: f.wing,
            amount: Number(commonForm.amount),
            period: commonForm.period,
            type: 'Common',
            description: 'Common Society Maintenance',
            status: 'Unpaid'
        }));

        setRecords(prev => [...prev, ...newBills]);
        setShowCommonModal(false);
        setCommonForm({ amount: '', period: '' });
    };

    const addSpecialBill = () => {
        const flat = flats.find(f => f.id.toString() === specialForm.flatId);
        if (!flat) return;

        setRecords(prev => [
            ...prev,
            {
                id: Date.now(),
                flat: flat.number,
                wing: flat.wing,
                amount: Number(specialForm.amount),
                period: specialForm.period,
                type: 'Special',
                description: specialForm.description,
                status: 'Unpaid'
            }
        ]);

        setShowSpecialModal(false);
        setSpecialForm({ flatId: '', amount: '', description: '', period: '' });
    };

    return (
        <div className="pb-10">

            {/* HEADER */}
            <div className="flex justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Maintenance Management</h1>
                    <p className="text-slate-500 mt-1">Generate bills and track payments.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCommonModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex gap-2"
                    >
                        <Users className="w-4 h-4" /> Generate Common Bill
                    </button>
                    <button
                        onClick={() => setShowSpecialModal(true)}
                        className="bg-white border px-6 py-3 rounded-2xl font-bold text-indigo-600"
                    >
                        <Plus className="w-4 h-4" /> Special Charge
                    </button>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Stat title="Total Due" value={totalCollected + totalPending} icon={IndianRupee} />
                <Stat title="Collected" value={totalCollected} icon={CheckCircle2} green />
                <Stat title="Pending" value={totalPending} icon={Clock} amber />
            </div>

            {/* SEARCH + FILTER */}
            <div className="bg-white p-2 rounded-2xl border mb-8 flex gap-2">
                <input
                    placeholder="Search by flat or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-4 rounded-xl bg-slate-50"
                />
                {['All', 'Paid', 'Unpaid'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-6 py-4 rounded-xl font-bold text-xs ${
                            filterStatus === s
                                ? 'bg-white shadow text-indigo-600'
                                : 'text-slate-400'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecords.map(r => (
                    <div key={r.id} className="bg-white rounded-3xl border p-2">
                        <div className="p-6 bg-slate-50 rounded-2xl">
                            <div className="flex justify-between mb-4">
                                <div className="font-black text-xl">{r.flat}</div>
                                <span className={`text-xs font-bold ${
                                    r.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                                }`}>
                                    {r.status}
                                </span>
                            </div>

                            <p className="text-sm font-bold">{r.wing} Wing</p>
                            <p className="text-xs">{r.period}</p>
                            <p className="text-xs mt-1">{r.description}</p>

                            <p className="text-2xl font-black mt-4">₹{r.amount}</p>
                        </div>

                        <button
                            onClick={() => toggleStatus(r.id)}
                            className={`w-full mt-2 py-4 rounded-2xl font-black text-xs ${
                                r.status === 'Paid'
                                    ? 'bg-slate-100 text-slate-400'
                                    : 'bg-emerald-600 text-white'
                            }`}
                        >
                            {r.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}
                        </button>
                    </div>
                ))}
            </div>

            {filteredRecords.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                    <Receipt className="w-14 h-14 mx-auto mb-4 opacity-20" />
                    No maintenance records found.
                </div>
            )}

            {/* COMMON MODAL */}
            {showCommonModal && (
                <Modal title="Generate Common Bill" close={() => setShowCommonModal(false)}>
                    <input
                        placeholder="Amount"
                        value={commonForm.amount}
                        onChange={e => setCommonForm({ ...commonForm, amount: e.target.value })}
                        className="input"
                    />
                    <input
                        placeholder="Period"
                        value={commonForm.period}
                        onChange={e => setCommonForm({ ...commonForm, period: e.target.value })}
                        className="input"
                    />
                    <button onClick={generateCommonBill} className="primary-btn">
                        Generate Bills
                    </button>
                </Modal>
            )}

            {/* SPECIAL MODAL */}
            {showSpecialModal && (
                <Modal title="Special Charge" close={() => setShowSpecialModal(false)}>
                    <select
                        value={specialForm.flatId}
                        onChange={e => setSpecialForm({ ...specialForm, flatId: e.target.value })}
                        className="input"
                    >
                        <option value="">Select Flat</option>
                        {flats.map(f => (
                            <option key={f.id} value={f.id}>
                                Wing {f.wing} - {f.number}
                            </option>
                        ))}
                    </select>
                    <input
                        placeholder="Amount"
                        value={specialForm.amount}
                        onChange={e => setSpecialForm({ ...specialForm, amount: e.target.value })}
                        className="input"
                    />
                    <input
                        placeholder="Period"
                        value={specialForm.period}
                        onChange={e => setSpecialForm({ ...specialForm, period: e.target.value })}
                        className="input"
                    />
                    <textarea
                        placeholder="Description"
                        value={specialForm.description}
                        onChange={e => setSpecialForm({ ...specialForm, description: e.target.value })}
                        className="input h-24"
                    />
                    <button onClick={addSpecialBill} className="amber-btn">
                        Create Special Bill
                    </button>
                </Modal>
            )}
        </div>
    );
};

/* 🔹 SMALL COMPONENTS */
const Stat = ({ title, value, icon: Icon, green, amber }) => (
    <div className={`p-7 rounded-3xl border bg-white flex gap-4 items-center`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            green ? 'bg-emerald-500 text-white'
            : amber ? 'bg-amber-500 text-white'
            : 'bg-indigo-50 text-indigo-600'
        }`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-xs font-black uppercase text-slate-400">{title}</p>
            <p className="text-3xl font-black">₹{value}</p>
        </div>
    </div>
);

const Modal = ({ title, children, close }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl w-full max-w-md">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">{title}</h2>
                <button onClick={close}><X /></button>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    </div>
);

export default Maintenance;
