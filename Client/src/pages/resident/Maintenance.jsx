import React, { useState } from 'react';

const Maintenance = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const [maintenance, setMaintenance] = useState([
    {
      id: 1,
      title: "Monthly Society Maintenance",
      description: "Regular monthly maintenance charges for common areas, security, and utilities",
      amount: 3500,
      type: "monthly",
      period: "December 2024",
      dueDate: "2024-12-31",
      paid: false,
      urgent: false
    },
    {
      id: 2,
      title: "Elevator Repair Fund",
      description: "Special collection for elevator maintenance and repair work",
      amount: 1200,
      type: "special",
      period: "One-time",
      dueDate: "2024-12-25",
      paid: false,
      urgent: true
    },
    {
      id: 3,
      title: "Emergency Maintenance",
      description: "Urgent repairs for water pump and electrical issues",
      amount: 800,
      type: "emergency",
      period: "Immediate",
      dueDate: "2024-12-20",
      paid: false,
      urgent: true
    }
  ]);

  const filteredMaintenance = maintenance.filter(item => {
    if (filter === 'monthly') return item.type === 'monthly';
    if (filter === 'special') return item.type === 'special';
    if (filter === 'emergency') return item.type === 'emergency';
    return true;
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

  const totalDue = maintenance.filter(m => !m.paid).reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="p-4 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="w-full">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-6 lg:mb-8 flex items-center mt-12 lg:mt-0">
          <span className="mr-2 lg:mr-3">💰</span>
          Maintenance Bills
        </h1>
        
        {/* Summary */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 lg:p-8 rounded-2xl shadow-xl mb-6 lg:mb-8 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-2xl lg:text-3xl font-bold mb-2">₹{totalDue.toLocaleString()}</h3>
              <p className="text-orange-100 text-base lg:text-lg">Total Amount Due</p>
              <p className="text-orange-200 text-sm mt-1">{maintenance.filter(m => !m.paid).length} unpaid bills</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 lg:p-4 rounded-full">
              <span className="text-3xl lg:text-4xl">💳</span>
            </div>
          </div>
        </div>

        {/* Bills List */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Bills
            </button>
            <button 
              onClick={() => setFilter('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📅 Monthly
            </button>
            <button 
              onClick={() => setFilter('special')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'special' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔧 Special Charges
            </button>
            <button 
              onClick={() => setFilter('emergency')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'emergency' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🚨 Emergency
            </button>
          </div>
        </div>

        <div className="space-y-4 lg:space-y-6">
          {filteredMaintenance.map((item) => (
            <div key={item.id} className={`bg-white p-4 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${
              item.type === 'special' ? 'border-l-4 border-orange-500' : 
              item.type === 'emergency' ? 'border-l-4 border-red-500' :
              'border-l-4 border-blue-500'
            }`}>
              <div className="flex flex-col lg:flex-row justify-between items-start mb-4 lg:mb-6">
                <div className="mb-4 lg:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg lg:text-xl font-bold text-gray-800">{item.title}</h4>
                    {item.type === 'monthly' && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                        📅 MONTHLY
                      </span>
                    )}
                    {item.type === 'special' && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold">
                        🔧 SPECIAL
                      </span>
                    )}
                    {item.type === 'emergency' && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        🚨 EMERGENCY
                      </span>
                    )}
                    {item.urgent && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        ⚡ URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm lg:text-base">{item.description}</p>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-xl lg:text-2xl font-bold text-gray-800">₹{item.amount.toLocaleString()}</p>
                  <span className={`inline-block px-3 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-bold ${
                    item.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.paid ? '✅ PAID' : '⏰ UNPAID'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div className="bg-gray-50 p-3 lg:p-4 rounded-xl">
                  <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">💰 Amount</p>
                  <p className="text-base lg:text-lg font-bold text-gray-800">₹{item.amount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 lg:p-4 rounded-xl">
                  <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">📅 Due Date</p>
                  <p className="text-base lg:text-lg font-bold text-gray-800">{new Date(item.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-3 lg:p-4 rounded-xl">
                  <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">📊 Period</p>
                  <p className="text-base lg:text-lg font-bold text-gray-800">{item.period}</p>
                </div>
              </div>
              
              {item.paid ? (
                <div className="bg-green-50 p-3 lg:p-4 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <span className="text-xl lg:text-2xl mr-2 lg:mr-3">✅</span>
                    <div>
                      <p className="font-bold text-green-800 text-sm lg:text-base">Payment Completed</p>
                      <p className="text-green-600 text-xs lg:text-sm">Paid on: {new Date(item.paidDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handlePaymentClick(item)}
                  className="w-full lg:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 lg:px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-bold text-sm lg:text-base"
                >
                  💳 Pay Now
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="text-center mb-4 lg:mb-6">
                <div className="bg-green-100 p-3 lg:p-4 rounded-full w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4">
                  <span className="text-2xl lg:text-3xl">💳</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Confirm Payment</h3>
                <p className="text-gray-600 text-sm lg:text-base">Are you sure you want to pay this bill?</p>
              </div>
              
              {selectedBill && (
                <div className="bg-gray-50 p-3 lg:p-4 rounded-xl mb-4 lg:mb-6">
                  <h4 className="font-bold text-gray-800 mb-2 text-sm lg:text-base">{selectedBill.title}</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm lg:text-base">Amount:</span>
                    <span className="text-xl lg:text-2xl font-bold text-green-600">₹{selectedBill.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm lg:text-base">Due Date:</span>
                    <span className="font-semibold text-sm lg:text-base">{new Date(selectedBill.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:bg-gray-400 transition-colors font-bold text-sm lg:text-base"
                >
                  ❌ Cancel
                </button>
                <button 
                  onClick={confirmPayment}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-bold text-sm lg:text-base"
                >
                  ✅ Pay Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
              <div className="mb-4 lg:mb-6">
                <div className="bg-green-100 p-4 lg:p-6 rounded-full w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 animate-bounce">
                  <span className="text-3xl lg:text-4xl">✅</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 text-base lg:text-lg">Your payment has been processed successfully</p>
              </div>
              
              {selectedBill && (
                <div className="bg-green-50 p-3 lg:p-4 rounded-xl mb-4 lg:mb-6">
                  <p className="text-green-800 font-semibold text-sm lg:text-base">₹{selectedBill.amount.toLocaleString()} paid for</p>
                  <p className="text-green-700 text-sm lg:text-base">{selectedBill.title}</p>
                </div>
              )}
              
              <div className="text-xs lg:text-sm text-gray-500">
                <p>🎉 Thank you for your payment!</p>
                <p>This popup will close automatically...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;