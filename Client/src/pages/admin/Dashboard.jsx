import React, { useEffect } from 'react';
import {
    Building2,
    Users,
    ClipboardList,
    AlertCircle,
    TrendingUp,
    Video,
    ExternalLink,
    ChevronRight,
    Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { DASHBOARD_API } from '../../services/apis';

import { updateStats, setRecentRequests } from '../../store/store';

// COMMON UI COMPONENTS
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { stats, recentRequests } = useSelector((state) => state.dashboard);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await apiConnector("GET", DASHBOARD_API.GET_STATS);
                if (res.success) {
                    dispatch(updateStats(res.data.stats));
                    if (res.data.recentRequests) {
                        dispatch(setRecentRequests(res.data.recentRequests));
                    }
                }
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                // Silence toast unless it's a critical auth error
            }
        };
        fetchDashboardData();
    }, [dispatch]);

    const statsConfig = [
        {
            label: 'Total Flats',
            value: stats.totalFlats || 0,
            icon: Building2,
            path: '/admin/flats',
            colorClass: 'bg-blue-50 text-blue-600',
            subStats: [
                { label: 'Occupied', value: stats.occupiedFlats || 0, color: 'text-blue-500' },
                { label: 'Vacant', value: stats.vacantFlats || 0, color: 'text-slate-400' },
                { label: 'Wings', value: '4', color: 'text-indigo-400' }
            ]
        },
        {
            label: 'Total Residents',
            value: stats.totalResidents || 0,
            icon: Users,
            path: '/admin/residents',
            colorClass: 'bg-emerald-50 text-emerald-600',
            subStats: [
                { label: 'Owners', value: stats.totalResidents || 0, color: 'text-emerald-500' },
                { label: 'Verified', value: stats.totalResidents || 0, color: 'text-teal-400' },
                { label: 'New', value: '0', color: 'text-slate-400' }
            ]
        },
        {
            label: 'Total Requests',
            value: stats.totalRequests || 0,
            icon: ClipboardList,
            path: '/admin/requests',
            colorClass: 'bg-amber-50 text-amber-600',
            subStats: [
                { label: 'Pending', value: stats.pendingRequests || 0, color: 'text-amber-500' },
                { label: 'Urgent', value: '0', color: 'text-emerald-500' },
                { label: 'Inbox', value: '0', color: 'text-rose-500' }
            ]
        },
        {
            label: 'Complaints',
            value: stats.totalComplaints || 0,
            icon: AlertCircle,
            path: '/admin/complaints',
            colorClass: 'bg-rose-50 text-rose-600',
            subStats: [
                { label: 'Pending', value: stats.pendingComplaints || 0, color: 'text-rose-500' },
                { label: 'Active', value: '0', color: 'text-amber-500' },
                { label: 'Fixed', value: '0', color: 'text-emerald-500' }
            ]
        }
    ];

    return (
        <div className="animate-in fade-in duration-700 pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome, Secretary</h1>
                <p className="text-slate-500 mt-1 flex items-center gap-2 font-medium">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Everything looks good in Gokuldham today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat, index) => (
                    <StatCard
                        key={index}
                        {...stat}
                        onClick={() => navigate(stat.path)}
                        delay={0.1 * index}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                {/* Recent Access Requests */}
                <Card className="lg:col-span-2 p-8 relative transition-all hover:shadow-indigo-100/50">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            Recent Access Requests
                            {stats.pendingRequests > 0 && (
                                <span className="text-[10px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-100 font-black">Review Required</span>
                            )}
                        </h2>
                        <button
                            onClick={() => navigate('/admin/requests')}
                            className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1 group"
                        >
                            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {(recentRequests || []).slice(0, 3).map((req) => (
                            <div key={req._id || req.id} className="group flex items-center gap-5 p-4 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {(req.user?.name || req.name || 'U')[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{req.user?.name || req.name}</h4>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${req.ownershipType === 'Owner' || req.type === 'Owner' ? 'bg-indigo-100 text-indigo-500' : 'bg-amber-100 text-amber-500'
                                            }`}>
                                            {req.userRole || req.type || 'Resident'}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 mt-1">
                                        <p className="text-xs text-slate-400 font-black flex items-center gap-1.5 uppercase tracking-tighter">
                                            <Home className="w-3.5 h-3.5" /> Wing {req.flat?.wing?.name || req.wing || '-'} - {req.flat?.flatNumber || req.flat || '-'}
                                        </p>
                                        <p className="text-xs text-slate-300 font-black flex items-center gap-1.5 uppercase tracking-tighter">
                                            <AlertCircle className="w-3.5 h-3.5" /> {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : (req.date || '-')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate('/admin/requests')}
                                        className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:bg-emerald-50 transition-all shadow-sm"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(recentRequests || []).length === 0 && (
                        <div className="py-20 text-center">
                            <ClipboardList className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No new requests to review.</p>
                        </div>
                    )}
                </Card>

                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                <Video className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-black mb-2 uppercase tracking-tight">Society Broadcast</h2>
                            <p className="text-indigo-100 text-sm mb-6 font-medium leading-relaxed">Instantly reach every resident's mobile app with important news.</p>
                            <textarea
                                placeholder="Type your notice description here..."
                                className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-white placeholder:text-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-white/40 h-32 resize-none transition-all text-sm font-medium shadow-inner"
                            />
                        </div>
                        <Button
                            variant="secondary"
                            fullWidth
                            className="mt-8 py-4"
                            onClick={() => navigate('/admin/notices')}
                        >
                            Send Alert Now
                        </Button>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
