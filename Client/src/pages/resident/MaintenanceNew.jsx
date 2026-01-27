import React, { useState } from 'react';

const MaintenanceNew = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [bills, setBills] = useState([]);

  const totalPending = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const pendingCount = bills.filter(b => b.status === 'pending').length;

  const handlePayment = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    setBills(prev => prev.map(bill => 
      bill.id === selectedBill.id 
        ? { ...bill, status: 'paid' }
        : bill
    ));
    setShowPaymentModal(false);
    setSelectedBill(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <span className="text-white text-xl">💳</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Maintenance Bills</h1>
          </div>
          <p className="text-gray-600 ml-12">Manage your society payments and dues</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Pending</p>
                <p className="text-2xl font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{pendingCount} bills pending</p>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Next Due</p>
                <p className="text-2xl font-bold text-blue-600">--</p>
                <p className="text-xs text-gray-500 mt-1">No due date</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bills List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Bills</h2>
          </div>
          
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <p className="text-lg font-medium mb-2">No bills available</p>
            <p className="text-sm">Your maintenance bills will appear here</p>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
              <div className="text-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Payment</h3>
                <p className="text-gray-600">Review your payment details</p>
              </div>
              
              {selectedBill && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">{selectedBill.title}</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-xl font-bold text-green-600">₹{selectedBill.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{new Date(selectedBill.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmPayment}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceNew;