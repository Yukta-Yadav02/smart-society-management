import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Calendar,
  ChevronRight,
  Pin,
  AlertTriangle,
  Info,
  Inbox
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';

import { apiConnector } from '../../services/apiConnector';
import { NOTICE_API } from '../../services/apis';

import { setNotices } from '../../store/store';

// COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import SearchInput from '../../components/common/SearchInput';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const Notices = () => {
  const dispatch = useDispatch();
  const notices = useSelector((state) => state.notices.items);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

 
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await apiConnector("GET", NOTICE_API.GET_MY);
        if (res.success) {
          dispatch(setNotices(res.data));
        }
      } catch (err) {
        console.error("Fetch Notices Error:", err);
      }
    };
    fetchNotices();
  }, [dispatch]);

  const filteredNotices = (notices || []).filter(n => {
    const matchesSearch = (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title="Society Notices"
        subtitle="Official announcements and updates from the society management."
        icon={Bell}
      />

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search announcements..."
          className="flex-1 w-full max-w-xl"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredNotices.length === 0 ? (
          <div className="col-span-full py-20 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center flex flex-col items-center">
            <Inbox size={64} className="text-slate-100 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No notices broadcasted yet.</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <Card key={notice._id || notice.id} className="p-8 relative overflow-hidden group flex flex-col hover:shadow-2xl hover:shadow-indigo-100 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 border border-indigo-100 shadow-sm">
                  <Bell size={20} />
                </div>
                <div>
                  <Badge variant="secondary" className="rounded-md scale-90 origin-left">
                    General Notice
                  </Badge>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-black text-slate-800 leading-tight uppercase group-hover:text-indigo-600 transition-colors">
                  {notice.title}
                </h3>
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-50 relative overflow-hidden">
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {notice.message}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50/80 to-transparent" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6 mt-auto">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  <Calendar size={14} />
                  {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : (notice.date || '-')}
                </div>
                <button className="text-indigo-600 font-black text-[10px] flex items-center gap-2 hover:translate-x-1 transition-all uppercase tracking-[0.2em] group/btn">
                  Read Article
                  <ChevronRight size={14} className="bg-indigo-50 rounded-full p-0.5" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Help Note */}
      <div className="mt-12 bg-white/50 border border-slate-100 p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl shrink-0 flex items-center justify-center shadow-sm">
          <AlertTriangle size={32} className="text-amber-400" />
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">Missed an announcement?</p>
          <p className="text-xs text-slate-500 font-medium">Archived notices older than 6 months are moved to the building records. Contact the secretary for older archives.</p>
        </div>
        <button className="md:ml-auto px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all">
          Contact Secretary
        </button>
      </div>
    </div>
  );
};

export default Notices;