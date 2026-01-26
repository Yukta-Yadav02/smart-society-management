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
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, subStats, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color.bg} ${color.text}`}>
          <Icon className="w-6 h-6" />
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
      </div>

      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>

      {subStats && (
        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-50">
          {subStats.map((sub, idx) => (
            <div key={idx} className="text-center">
              <p className={`text-[10px] font-bold uppercase ${sub.color}`}>
                {sub.label}
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {sub.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  /* 🔐 TEMP DATA — future me API / Redux se aayega */
  const stats = {
    totalFlats: 1120,
    occupiedFlats: 980,
    vacantFlats: 140,
    totalResidents: 1120,
    totalRequests: 48,
    pendingRequests: 12,
    totalComplaints: 34,
    pendingComplaints: 9
  };

  const recentRequests = [
    { id: 1, name: 'Ramesh Mehta', wing: 'A', flat: '101', type: 'Owner', date: '2 days ago' },
    { id: 2, name: 'Sunita Sharma', wing: 'B', flat: '305', type: 'Tenant', date: '1 day ago' },
    { id: 3, name: 'Amit Patel', wing: 'C', flat: '210', type: 'Owner', date: 'Today' }
  ];

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
      color: { bg: 'bg-emerald-50', text: 'text-emerald-600' }
    },
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: ClipboardList,
      path: '/requests',
      color: { bg: 'bg-amber-50', text: 'text-amber-600' }
    },
    {
      title: 'Complaints',
      value: stats.totalComplaints,
      icon: AlertCircle,
      path: '/complaints',
      color: { bg: 'bg-rose-50', text: 'text-rose-600' }
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Welcome, Secretary
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, i) => (
          <StatCard key={i} {...stat} onClick={() => navigate(stat.path)} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
