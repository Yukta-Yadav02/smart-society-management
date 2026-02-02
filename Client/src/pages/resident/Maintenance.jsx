import React, { useState, useEffect } from 'react';
import {
  Receipt,
  CreditCard,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  IndianRupee,
  Calendar,
  Building2
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { MAINTENANCE_API } from '../../services/apis';

import { setMaintenance, updateMaintenance } from '../../store/store';

//  COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchInput from '../../components/common/SearchInput';
import Modal from '../../components/common/Modal';

const Maintenance = () => {
  const dispatch = useDispatch();
  const records = useSelector((state) => state.maintenance.records);
  const user = useSelector((state) => state.profile.data);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

 
  useEffect(() => {
    const fetchMyMaintenance = async () => {
      try {
        const res = await apiConnector("GET", MAINTENANCE_API.GET_MY);
        if (res.success) {
          dispatch(setMaintenance(res.data));
        }
      } catch (err) {
        console.error("Fetch Maintenance Error:", err);
        toast.error("Failed to load maintenance records");
      }
    };
    fetchMyMaintenance();
  }, [dispatch]);

  const handlePaymentClick = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    try {
      const id = selectedBill._id || selectedBill.id;
      const res = await apiConnector("PUT", MAINTENANCE_API.PAY(id));

      if (res.success) {
        // Update local state
        dispatch(updateMaintenance({ id, status: 'PAID', paidAt: new Date().toISOString() }));
        toast.success(`Payment of ₹${selectedBill.amount} successful!`, { icon: '💰' });
        setShowPaymentModal(false);
        setSelectedBill(null);
      }
    } catch (err) {
      toast.error(err.message || "Payment failed");
    }
  };

  const filteredRecords = (records || []).filter(r => {
    const displayStatus = r.status === 'PAID' ? 'Paid' : 'Unpaid';
    const matchesStatus = filterStatus === 'All' || displayStatus === filterStatus;
    const period = `${r.month} ${r.year}`;
    const matchesSearch = (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      period.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingAmount = (records || []).filter(r => r.status === 'PENDING').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title="Maintenance & Dues"
        subtitle="View and pay your society maintenance bills online."
        icon={Receipt}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          label="Outstanding Balance"
          value={`₹${pendingAmount}`}
          icon={IndianRupee}
          colorClass="bg-rose-50 text-rose-600"
          delay={0.1}
        />
        <StatCard
          label="Pending Bills"
          value={(records || []).filter(r => r.status === 'PENDING').length}
          icon={Clock}
          colorClass="bg-amber-50 text-amber-600"
          delay={0.2}
        />
        <StatCard
          label="Paid (Total)"
          value={(records || []).filter(r => r.status === 'PAID').length}
          icon={CheckCircle2}
          colorClass="bg-emerald-50 text-emerald-600"
          delay={0.3}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by month or charge type..."
          className="flex-1 w-full max-w-xl"
        />
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shrink-0">
          {['All', 'Paid', 'Unpaid'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full py-20 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center flex flex-col items-center">
            <CreditCard size={64} className="text-slate-100 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No billing records assigned to your flat.</p>
          </div>
        ) : (
          filteredRecords.map((bill) => (
            <Card key={bill._id || bill.id} className="p-2 overflow-hidden flex flex-col group">
              <div className={`rounded-[2rem] p-8 flex-1 ${bill.status === 'PAID' ? 'bg-emerald-50/20' : 'bg-rose-50/20'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <Receipt size={24} />
                  </div>
                  <Badge variant={bill.status === 'PAID' ? 'success' : 'warning'}>
                    {bill.status === 'PAID' ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Billing Period</p>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{bill.month} {bill.year}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 p-3 rounded-xl border border-white/50">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                      <p className="text-xs font-bold text-slate-700">{bill.type || 'Common'}</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-white/50">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Flat No</p>
                      <p className="text-xs font-bold text-slate-700">{user?.flat?.flatNumber || bill.flat?.flatNumber || '-'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount Due</p>
                    <p className="text-4xl font-black text-slate-800 tracking-tighter tabular-nums flex items-baseline gap-1">
                      <span className="text-base opacity-40">₹</span>{bill.amount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {bill.status === 'PENDING' ? (
                  <Button
                    fullWidth
                    className="py-4.5 shadow-xl shadow-indigo-100"
                    onClick={() => handlePaymentClick(bill)}
                    icon={CreditCard}
                  >
                    Pay & Clear Due
                  </Button>
                ) : (
                  <button className="w-full py-4.5 rounded-2xl border border-dashed border-emerald-200 text-emerald-600 font-bold text-[10px] uppercase tracking-widest cursor-default flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Paid on {bill.paidAt ? new Date(bill.paidAt).toLocaleDateString() : 'Record'}
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Payment Confirmation Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Confirm Payment"
        subtitle="You are about to pay your maintenance bill securely."
        icon={CreditCard}
        maxWidth="max-w-md"
      >
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 border-dashed">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bill Period</span>
              <span className="font-black text-slate-800 uppercase">{selectedBill?.month} {selectedBill?.year}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
              <span className="text-2xl font-black text-indigo-600">₹{selectedBill?.amount}</span>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl flex gap-3 items-start border border-amber-100">
            <Clock className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase">By clicking confirm, you will be redirected to the secure payment processing page.</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 py-4 font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
            >
              Cancel
            </button>
            <Button fullWidth onClick={confirmPayment} className="flex-[2] py-4">Proceed to Pay</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Maintenance;