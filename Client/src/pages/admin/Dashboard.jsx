import React from 'react';
import {
    Building2,
    Users,
    ClipboardList,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    Video,
    ExternalLink,
    ChevronRight,
    Mail,
    Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StatCard = ({ title, value, icon: Icon, color, subStats, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${color.bg} ${color.text}`}>
                    <Icon className="w-6 h-6" />
                    <h1>Sawariya Dixit</h1>
                </div>
                <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            </div>

            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
            </div>

            {subStats && (
                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-50">
                    {subStats.map((sub, idx) => (
                        <div key={idx} className="text-center">
                            <p className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${sub.color}`}>
                                {sub.label}
                            </p>
                            <p className="text-sm font-semibold text-slate-700">{sub.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { stats, recentRequests } = useSelector((state) => state.dashboard);

    const statsConfig = [
        {
            title: 'Total Flats',
            value: stats.totalFlats,
            icon: Building2,
            path: '/flats',
            color: { bg: 'bg-blue-50', text: 'text-blue-600' },
            subStats: [
                { label: 'Occupied', value: stats.occupiedFlats, color: 'text-blue-500' },
                { label: 'Vacant', value: stats.vacantFlats, color: 'text-slate-400' },
                { label: 'Wings', value: '4', color: 'text-indigo-400' }
            ]
        },
        {
            title: 'Total Residents',
            value: stats.totalResidents,
            icon: Users,
            path: '/residents',
            color: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
            subStats: [
                { label: 'Owners', value: '840', color: 'text-emerald-500' },
                { label: 'Tenants', value: '280', color: 'text-teal-400' },
                { label: 'Staff', value: '12', color: 'text-slate-400' }
            ]
        },
        {
            title: 'Total Requests',
            value: stats.totalRequests,
            icon: ClipboardList,
            path: '/requests',
            color: { bg: 'bg-amber-50', text: 'text-amber-600' },
            subStats: [
                { label: 'Pending', value: stats.pendingRequests, color: 'text-amber-500' },
                { label: 'Approved', value: '25', color: 'text-emerald-500' },
                { label: 'Rejected', value: '3', color: 'text-rose-500' }
            ]
        },
        {
            title: 'Complaints',
            value: stats.totalComplaints,
            icon: AlertCircle,
            path: '/complaints',
            color: { bg: 'bg-rose-50', text: 'text-rose-600' },
            subStats: [
                { label: 'Pending', value: stats.pendingComplaints, color: 'text-rose-500' },
                { label: 'In Progress', value: stats.pendingComplaints, color: 'text-amber-500' },
                { label: 'Resolved', value: '8', color: 'text-emerald-500' }
            ]
        }
    ];

    return (
        <div className="animate-in fade-in duration-700">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome, Secretary</h1>
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
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                {/* UPDATED SECTION: Recent Access Requests */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative transition-all hover:shadow-indigo-100/50">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            Recent Access Requests
                            <span className="text-[10px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-100">Review Required</span>
                        </h2>
                        <button
                            onClick={() => navigate('/requests')}
                            className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1 group"
                        >
                            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentRequests.slice(0, 3).map((req) => (
                            <div key={req.id} className="group flex items-center gap-5 p-4 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {req.name[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{req.name}</h4>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${req.type === 'Owner' ? 'bg-indigo-50 text-indigo-500' : 'bg-amber-50 text-amber-500'
                                            }`}>
                                            {req.type}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 mt-1">
                                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                                            <Home className="w-3.5 h-3.5" /> Wing {req.wing} - {req.flat}
                                        </p>
                                        <p className="text-xs text-slate-300 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                                            <AlertCircle className="w-3.5 h-3.5" /> {req.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate('/requests')}
                                        className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:bg-emerald-50 transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {recentRequests.length === 0 && (
                        <div className="py-20 text-center">
                            <ClipboardList className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">No new requests to review.</p>
                        </div>
                    )}
                </div>

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
                        <button className="mt-8 bg-white text-indigo-600 font-black py-4 rounded-2xl hover:bg-indigo-50 transition-all w-full shadow-lg shadow-black/10 uppercase tracking-widest text-xs">
                            Send Alert Now
                        </button>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <h1>Dashbooard</h1>
      <p className="text-slate-500 mt-2">Admin overview page</p>
    </div>
  );
}
