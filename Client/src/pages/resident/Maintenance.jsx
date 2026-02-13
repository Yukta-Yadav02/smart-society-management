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

import { setMaintenance, updateMaintenance, clearMaintenance } from '../../store/store';

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
    // Force clear maintenance data first
    dispatch(clearMaintenance());

    const fetchMyMaintenance = async () => {
      try {
        const res = await apiConnector("GET", MAINTENANCE_API.MY);
        console.log("My Maintenance API Response:", res);

        if (res.success && res.data && res.data.length > 0) {
          dispatch(setMaintenance(res.data));
        } else {
          dispatch(clearMaintenance());
          console.log("No maintenance data found for user");
        }
      } catch (err) {
        console.error("Fetch Maintenance Error:", err);
        dispatch(clearMaintenance());
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
    if (!selectedBill) {
      toast.error('No bill selected');
      return;
    }

    try {
      const id = selectedBill._id || selectedBill.id;
      console.log('Payment attempt:', {
        billId: id,
        amount: selectedBill.amount,
        period: selectedBill.period
      });

      const response = await apiConnector("PUT", MAINTENANCE_API.PAY(id), {});
      console.log('Payment API response:', response);

      if (response && response.success) {
        dispatch(updateMaintenance({
          id,
          status: 'PAID',
          paidAt: new Date().toISOString()
        }));

        toast.success(
          `🎉 Payment Successful!\n₹${selectedBill.amount} paid for ${selectedBill.period}\nAdmin has been notified!`,
          {
            duration: 4000,
            style: {
              background: '#10B981',
              color: 'white',
              fontWeight: 'bold'
            }
          }
        );

        setShowPaymentModal(false);
        setSelectedBill(null);
      } else {
        throw new Error(response?.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error details:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const filteredRecords = (records || []).filter(r => {
    const displayStatus = r.status === 'PAID' ? 'Paid' : 'Unpaid';
    const matchesStatus = filterStatus === 'All' || displayStatus === filterStatus;
    const matchesSearch = (r.description || r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.period || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingAmount = (records || []).filter(r => r.status === 'UNPAID').reduce((sum, r) => sum + r.amount, 0);

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
          value={(records || []).filter(r => r.status === 'UNPAID').length}
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
                    {bill.status === 'PAID' ? `PAID (${bill.paymentMode || 'ONLINE'})` : 'Unpaid'}
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Billing Period</p>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{bill.period || `${bill.month || ''} ${bill.year || ''}`}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 p-3 rounded-xl border border-white/50">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                      <p className="text-xs font-bold text-slate-700">{bill.type || 'Common'}</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-white/50">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Title</p>
                      <p className="text-xs font-bold text-slate-700">{bill.title || 'Maintenance'}</p>
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
                {bill.status === 'UNPAID' ? (
                  <Button
                    fullWidth
                    className="py-4.5 shadow-xl shadow-indigo-100"
                    onClick={() => handlePaymentClick(bill)}
                    icon={CreditCard}
                  >
                    Pay & Clear Due
                  </Button>
                ) : (
                  <button className="w-full py-4.5 rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-widest cursor-default flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Payment Received via {bill.paymentMode || 'ONLINE'}
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
        title="⚠️ Confirm Payment"
        subtitle="Please review your payment details carefully before proceeding."
        icon={CreditCard}
        maxWidth="max-w-lg"
      >
        <div className="space-y-6">
          {/* Bill Details Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border-2 border-indigo-100 shadow-lg">
            <div className="text-center mb-6">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">You are paying for</p>
              <h3 className="text-3xl font-black text-indigo-900 uppercase tracking-tight">{selectedBill?.period || `${selectedBill?.month || ''} ${selectedBill?.year || ''}`}</h3>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-200/50">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Amount</span>
                <div className="text-right">
                  <span className="text-5xl font-black text-indigo-600 tracking-tighter">₹{selectedBill?.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-amber-50 p-5 rounded-2xl flex gap-4 items-start border-2 border-amber-200">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
              <Clock className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-amber-900 mb-1">Important Notice</p>
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                By clicking "Confirm Payment", your payment will be processed instantly and the admin will be notified automatically. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 py-4 px-6 font-black text-slate-500 hover:bg-slate-100 rounded-2xl transition-all uppercase tracking-widest text-xs border-2 border-slate-200"
            >
              ✕ Cancel
            </button>
            <button
              onClick={confirmPayment}
              disabled={!selectedBill}
              className="flex-[2] py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-2xl transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✓ Confirm Payment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Maintenance;