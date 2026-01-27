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
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="text-left mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <span className="text-xl text-white">💰</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Maintenance Bills
              </h1>
              <p className="text-gray-600">Manage your society payments</p>
            </div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Due</p>
                <p className="text-2xl font-bold text-gray-800">₹{totalDue.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-xl">💳</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Unpaid Bills</p>
                <p className="text-2xl font-bold text-gray-800">{maintenance.filter(m => !m.paid).length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-xl">📋</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Paid Bills</p>
                <p className="text-2xl font-bold text-gray-800">{maintenance.filter(m => m.paid).length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white p-1 rounded-lg shadow-sm mb-6 inline-flex border border-gray-200">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            All Bills
          </button>
          <button 
            onClick={() => setFilter('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'monthly' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📅 Monthly
          </button>
          <button 
            onClick={() => setFilter('special')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'special' 
                ? 'bg-orange-600 text-white' 
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            🔧 Special
          </button>
          <button 
            onClick={() => setFilter('emergency')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'emergency' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            🚨 Emergency
          </button>
        </div>

        <div className="space-y-4">
          {filteredMaintenance.map((item) => (
            <div key={item.id} className={`bg-white p-6 rounded-lg shadow-md border-l-4 hover:shadow-lg transition-shadow ${
              item.type === 'special' ? 'border-orange-500' : 
              item.type === 'emergency' ? 'border-red-500' :
              'border-blue-500'
            }`}>
              <div className="flex flex-col lg:flex-row justify-between items-start mb-4">
                <div className="mb-4 lg:mb-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold text-gray-800">{item.title}</h4>
                    {item.type === 'monthly' && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        📅 MONTHLY
                      </span>
                    )}
                    {item.type === 'special' && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                        🔧 SPECIAL
                      </span>
                    )}
                    {item.type === 'emergency' && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        🚨 EMERGENCY
                      </span>
                    )}
                    {item.urgent && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                        ⚡ URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    ₹{item.amount.toLocaleString()}
                  </p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    item.paid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.paid ? '✅ PAID' : '⏰ UNPAID'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-1">💰 Amount</p>
                  <p className="text-lg font-bold text-gray-800">₹{item.amount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-1">📅 Due Date</p>
                  <p className="text-lg font-bold text-gray-800">{new Date(item.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-600 mb-1">📊 Period</p>
                  <p className="text-lg font-bold text-gray-800">{item.period}</p>
                </div>
              </div>
              
              {item.paid ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="bg-green-500 p-2 rounded-full mr-3">
                      <span className="text-white">✅</span>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Payment Completed</p>
                      <p className="text-green-600 text-sm">Paid on: {new Date(item.paidDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handlePaymentClick(item)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>💳</span>
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="text-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Confirm Payment
                </h3>
                <p className="text-gray-600">Review your payment details</p>
              </div>
              
              {selectedBill && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                  <h4 className="font-bold text-gray-800 mb-3">{selectedBill.title}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="text-xl font-bold text-green-600">
                        ₹{selectedBill.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium text-gray-800">{new Date(selectedBill.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmPayment}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
              <div className="mb-6">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600">Your payment has been processed</p>
              </div>
              
              {selectedBill && (
                <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                  <p className="text-2xl font-bold text-green-600 mb-1">
                    ₹{selectedBill.amount.toLocaleString()}
                  </p>
                  <p className="text-green-800 font-medium">{selectedBill.title}</p>
                  <p className="text-green-600 text-sm mt-1">Transaction completed successfully</p>
                </div>
              )}
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-blue-600 font-medium mb-1">🎉 Thank you for your payment!</p>
                <p className="text-gray-500 text-sm">This popup will close automatically...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;