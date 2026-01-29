import React, { useState } from 'react';
import { Wrench, CreditCard, Clock, CheckCircle, Filter, Search } from 'lucide-react';

const Maintenance = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data will come from backend API
  const [maintenance, setMaintenance] = useState([]);

  const filteredMaintenance = maintenance.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'paid' && item.paid) || 
                         (filter === 'unpaid' && !item.paid) ||
                         item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handlePaymentClick = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    setMaintenance(prev => prev.map(item =>
      item.id === selectedBill.id
        ? { ...item, paid: true, paidDate: new Date().toISOString() }
        : item
    ));
    setShowPaymentModal(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setSelectedBill(null);
    }, 3000);
  };

  const totalDue = maintenance.filter(m => !m.paid).reduce((sum, m) => sum + (m.amount || 0), 0);
  const paidCount = maintenance.filter(m => m.paid).length;
  const unpaidCount = maintenance.filter(m => !m.paid).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
            <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Maintenance Bills</h1>
        </div>
        <p className="text-sm sm:text-base text-slate-600">Manage your society maintenance payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-red-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600">Total Due</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-800">₹{totalDue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-orange-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600">Unpaid Bills</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-800">{unpaidCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-600">Paid Bills</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-800">{paidCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search maintenance bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm sm:text-base"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 sm:pl-12 pr-6 sm:pr-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all appearance-none bg-white min-w-[120px] sm:min-w-[150px] text-sm sm:text-base"
            >
              <option value="all">All Bills</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="monthly">Monthly</option>
              <option value="special">Special</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredMaintenance.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-8 sm:p-12 text-center">
            <div className="bg-slate-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">No maintenance bills found</h3>
            <p className="text-sm sm:text-base text-slate-600">Bills will appear here when available from the backend</p>
          </div>
        ) : (
          filteredMaintenance.map((item) => (
            <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
              {/* Bill content will be rendered here */}
            </div>
          ))
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
            <div className="text-center mb-4 sm:mb-6">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Confirm Payment</h3>
              <p className="text-sm sm:text-base text-slate-600">Review your payment details</p>
            </div>
            
            {selectedBill && (
              <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6">
                <h4 className="font-bold text-slate-800 mb-2 sm:mb-3 text-sm sm:text-base">{selectedBill.title}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-bold text-green-600">₹{selectedBill.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-slate-600">Due Date:</span>
                    <span className="font-medium">{selectedBill.dueDate ? new Date(selectedBill.dueDate).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:bg-slate-300 transition-colors font-semibold text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPayment}
                className="flex-1 bg-green-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md text-center">
            <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">Your payment has been processed successfully</p>
            
            {selectedBill && (
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                <p className="text-xl sm:text-2xl font-bold text-green-600 mb-1">₹{selectedBill.amount?.toLocaleString()}</p>
                <p className="text-green-800 font-medium text-sm sm:text-base">{selectedBill.title}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;