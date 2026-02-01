import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Clock, CheckCircle, XCircle, Layout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    /**
     * BACKEND INTEGRATION:
     * Replace this mock 'requests' array with data fetched from your API.
     * Example: useEffect(() => { fetchRequests(); }, []);
     */
    const requests = [
        {
            id: 1,
            wing: 'A',
            flat: '101',
            block: 'Block 1',
            date: 'Jan 24, 2026',
            status: 'Approved',
            statusColor: 'bg-green-100 text-green-600 border border-green-200',
            icon: <CheckCircle size={16} />
        },
        {
            id: 2,
            wing: 'C',
            flat: '202',
            block: 'Block 2',
            date: 'Jan 27, 2026',
            status: 'Pending',
            statusColor: 'bg-amber-100 text-amber-600',
            icon: <Clock size={16} />
        }
    ];


    return (
        <div className="min-h-screen pt-32 pb-12 bg-gray-50 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* User Profile Card */}
                    <div className="lg:w-1/3">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="w-full h-full bg-primary-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary-200">
                                    {user?.name?.charAt(0) || 'G'}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary-600 border border-gray-50">
                                    <User size={20} />
                                </div>
                            </div>

                            <div className="text-center mb-10">
                                <h3 className="text-3xl font-black text-gray-900 mb-2">{user?.name || 'Guest User'}</h3>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Resident Member</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100/50">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                                        <Mail size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user?.email || 'guest@example.com'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100/50">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Joined On</p>
                                        <p className="text-sm font-bold text-gray-900">January 2026</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Access Requests Section */}
                    <div className="lg:w-2/3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 h-full"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Access Requests</h2>
                                    <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest">Track your flat approval status</p>
                                </div>
                                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                                    <Layout size={28} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {requests.map((req, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        key={req.id}
                                        className="relative group p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-primary-100 hover:bg-white hover:shadow-2xl transition-all duration-500"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm flex flex-col items-center justify-center border border-gray-100">
                                                    <span className="text-[10px] font-black text-primary-400 uppercase leading-none mb-1">Wing</span>
                                                    <span className="text-2xl font-black text-gray-900 leading-none">{req.wing}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900">{req.block} - Flat {req.flat}</h4>
                                                    <div className="flex items-center gap-2 mt-1 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                                                        <Calendar size={12} />
                                                        <span>Requested on {req.date}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${req.statusColor}`}>
                                                    {req.icon}
                                                    {req.status}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
