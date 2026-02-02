import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Home, AlertTriangle, Wrench, Bell, TrendingUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { apiConnector } from '../../services/apiConnector';
import { DASHBOARD_API } from '../../services/apis';

// 🏗️ COMMON UI COMPONENTS
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.profile);

  const [statsData, setStatsData] = useState({
    flatNumber: '-',
    wingName: '-',
    pendingComplaints: 0,
    totalDue: 0,
    newNotices: 0
  });

 
  useEffect(() => {
    const fetchResidentStats = async () => {
      try {
        const res = await apiConnector("GET", DASHBOARD_API.GET_RESIDENT_STATS);
        if (res.success) {
          setStatsData(res.data.stats);
        }
      } catch (err) {
        console.error("Resident Dashboard Fetch Error:", err);
      }
    };
    fetchResidentStats();
  }, []);

  const stats = [
    {
      title: 'My Flat',
      value: statsData.flatNumber || '-',
      subtitle: `Wing ${statsData.wingName || '-'}`,
      icon: Home,
      colorClass: 'bg-blue-50 text-blue-600',
      path: '/resident/profile'
    },
    {
      title: 'Pending Complaints',
      value: statsData.pendingComplaints.toString(),
      subtitle: statsData.pendingComplaints > 0 ? 'Action Required' : 'All Clear',
      icon: AlertTriangle,
      colorClass: 'bg-orange-50 text-orange-600',
      path: '/resident/complaints'
    },
    {
      title: 'Maintenance Due',
      value: `₹${statsData.totalDue}`,
      subtitle: statsData.totalDue > 0 ? 'Pay Now' : 'Fully Paid',
      icon: Wrench,
      colorClass: 'bg-rose-50 text-rose-600',
      path: '/resident/maintenance'
    },
    {
      title: 'New Notices',
      value: statsData.newNotices.toString(),
      subtitle: 'Broadcasts',
      icon: Bell,
      colorClass: 'bg-emerald-50 text-emerald-600',
      path: '/resident/notices'
    },
  ];

  return (
    <div className="animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <PageHeader
        title={`Welcome, ${user?.name || 'Resident'}`}
        subtitle="Here's what's happening in Gokuldham Society today."
        icon={LayoutDashboard}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {stats.map((stat, index) => (
          <div key={index} onClick={() => navigate(stat.path)} className="cursor-pointer group">
            <StatCard
              label={stat.title}
              value={stat.value}
              subStats={[{ label: stat.subtitle, value: '', color: 'text-slate-400' }]}
              icon={stat.icon}
              colorClass={stat.colorClass}
              delay={0.1 * index}
            />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Quick Actions */}
        <Card className="p-8">
          <h2 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'New Complaint', icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-50', path: '/resident/complaints' },
              { label: 'Pay Maintenance', icon: Wrench, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/resident/maintenance' },
              { label: 'View Notices', icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50', path: '/resident/notices' },
              { label: 'My Profile', icon: Home, color: 'text-orange-600', bg: 'bg-orange-50', path: '/resident/profile' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className={`${action.bg} hover:brightness-95 border border-transparent hover:border-slate-100 rounded-[2rem] p-6 text-center transition-all group`}
              >
                <div className={`${action.bg} brightness-95 group-hover:scale-110 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm transition-transform`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <p className="font-black text-slate-700 text-xs uppercase tracking-widest">{action.label}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[3rem] shadow-xl shadow-indigo-100 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md mx-auto">
              <Bell className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Stay Connected</h2>
            <p className="text-indigo-100 text-base font-medium leading-relaxed max-w-sm mx-auto">
              Check the notices section regularly for official updates from the society management.
            </p>
            <button
              onClick={() => navigate('/resident/notices')}
              className="mt-10 px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-colors shadow-lg"
            >
              View Announcements
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Monthly Overview */}
      <Card className="mt-8 p-10 overflow-hidden relative">
        <h2 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">Monthly Health Check</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
          {[
            { label: 'Maintenance', value: statsData.totalDue === 0 ? 'Clear' : 'Pending', icon: TrendingUp, color: statsData.totalDue === 0 ? 'text-emerald-600' : 'text-rose-600', bg: statsData.totalDue === 0 ? 'bg-emerald-50' : 'bg-rose-50' },
            { label: 'Open Issues', value: statsData.pendingComplaints, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Unread Notices', value: statsData.newNotices, icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((item, i) => (
            <div key={i} className="text-center p-8 bg-slate-50/30 border border-slate-100/50 rounded-[3rem]">
              <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <p className={`text-4xl font-black ${item.color} mb-1 tracking-tighter`}>{item.value}</p>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      </Card>
    </div>
  );
};

export default ResidentDashboard;