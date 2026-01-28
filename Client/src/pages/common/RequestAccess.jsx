import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Send, CheckCircle, Info, User, Mail, Home, ArrowLeft } from 'lucide-react';

const RequestAccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const wing = searchParams.get('wing') || 'A';
    const flat = searchParams.get('flat') || '101';
    const block = searchParams.get('block') || 'Block 1';

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [residentType, setResidentType] = useState('Owner');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        /**
         * BACKEND INTEGRATION:
         * Implement the actual API call to submit the access request here.
         * Example:
         * await axios.post('/api/requests', { wing, flat, block, residentType, message });
         */
        setTimeout(() => {
            setIsSubmitted(true);
        }, 800);
    };


    if (isSubmitted) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Sent!</h2>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        Your request for <span className="font-bold text-gray-900">Wing {wing}, {block}, Flat {flat}</span> has been sent to the society secretary.
                        You will be notified once it is approved.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-12 bg-gray-50 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-bold text-sm uppercase tracking-widest mb-8 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Selection
                </button>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Request Flat Access</h2>
                    <p className="text-gray-600 mt-2">Submit your details for verification by the society management.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Wing</span>
                                    <p className="text-lg font-bold text-gray-900">{wing}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Block</span>
                                    <p className="text-lg font-bold text-gray-900">{block}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Flat</span>
                                    <p className="text-lg font-bold text-gray-900">{flat}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Resident Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setResidentType('Owner')}
                                        className={`py-3 rounded-xl font-bold border-2 transition-all ${residentType === 'Owner'
                                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        Owner
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setResidentType('Tenant')}
                                        className={`py-3 rounded-xl font-bold border-2 transition-all ${residentType === 'Tenant'
                                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        Tenant (Rental)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                                <textarea
                                    rows="4"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                    placeholder="Tell us a bit about yourself or any specific request..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Send size={18} /> Submit Request
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Info size={18} className="text-primary-600" /> My Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Name</p>
                                        <p className="text-sm font-medium text-gray-900 truncate" title={user?.name}>{user?.name || 'Guest User'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{user?.email || 'guest@example.com'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestAccess;
