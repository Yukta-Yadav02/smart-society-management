import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Inbox,
  Filter
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { apiConnector } from '../../services/apiConnector';
import { COMPLAINT_API } from '../../services/apis';

import { setComplaints, addComplaint } from '../../store/store';

// COMMON UI COMPONENTS
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import SearchInput from '../../components/common/SearchInput';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

// 🛡️ VALIDATION SCHEMA
const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(5, 'Too short'),
  description: yup.string().required('Description is required').min(10, 'Details too short'),
  category: yup.string().required('Category is required'),
  priority: yup.string().required('Priority is required'),
});

const Complaints = () => {
  const dispatch = useDispatch();
  const complaints = useSelector((state) => state.complaints.items);
  const user = useSelector((state) => state.profile.data);

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

 
  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const res = await apiConnector("GET", COMPLAINT_API.GET_MY);
        if (res.success) {
          dispatch(setComplaints(res.data));
        }
      } catch (err) {
        console.error("Fetch Complaints Error:", err);
        toast.error("Failed to load your complaints");
      }
    };
    fetchMyComplaints();
  }, [dispatch]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category: 'Maintenance',
      priority: 'Medium'
    }
  });

  const onSubmit = async (data) => {
    try {
      const res = await apiConnector("POST", COMPLAINT_API.CREATE, {
        ...data,
        flatId: user?.flat?._id || user?.flat // Ensure ID is passed
      });

      if (res.success) {
        dispatch(addComplaint(res.data));
        toast.success('Complaint filed successfully! 📢');
        setShowModal(false);
        reset();
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit complaint");
    }
  };

  const filteredComplaints = (complaints || []).filter(c => {
    const statusMap = { 'Open': 'Pending', 'In Progress': 'Active', 'Resolved': 'Resolved' };
    const displayStatus = c.status === 'Open' ? 'Pending' : (c.status === 'In Progress' ? 'Active' : c.status);

    const matchesStatus = filterStatus === 'All' || displayStatus === filterStatus;
    const matchesSearch = (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <PageHeader
        title="My Complaints"
        subtitle="Track and manage issues reported for your flat."
        actionLabel="File Complaint"
        onAction={() => setShowModal(true)}
        icon={Plus}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Active"
          value={(complaints || []).filter(c => c.status === 'Open' || c.status === 'In Progress').length}
          icon={Clock}
          colorClass="bg-amber-50 text-amber-600"
          delay={0.1}
        />
        <StatCard
          label="Resolved"
          value={(complaints || []).filter(c => c.status === 'Resolved').length}
          icon={CheckCircle2}
          colorClass="bg-emerald-50 text-emerald-600"
          delay={0.2}
        />
        <StatCard
          label="In Progress"
          value={(complaints || []).filter(c => c.status === 'In Progress').length}
          icon={Inbox}
          colorClass="bg-blue-50 text-blue-600"
          delay={0.3}
        />
        <StatCard
          label="Total Logs"
          value={(complaints || []).length}
          icon={Inbox}
          colorClass="bg-indigo-50 text-indigo-600"
          delay={0.4}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 items-start md:items-center">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your filings..."
          className="flex-1 max-w-xl"
        />
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shrink-0">
          {['All', 'Pending', 'Resolved'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {filteredComplaints.length === 0 ? (
          <div className="py-20 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center flex flex-col items-center">
            <AlertTriangle size={64} className="text-slate-100 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No complaint records found.</p>
          </div>
        ) : (
          filteredComplaints.map((c) => (
            <Card key={c._id || c.id} className="p-8 group overflow-hidden relative">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={c.priority === 'High' || c.priority === 'Urgent' ? 'danger' : 'primary'}>
                      {c.priority || 'Medium'} Priority
                    </Badge>
                    <Badge variant="secondary" className="opacity-60">{c.category || 'Maintenance'}</Badge>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{c.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed italic">"{c.description}"</p>
                  <div className="flex items-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-widest pt-2">
                    <span className="flex items-center gap-2"><Clock size={14} /> Filed on {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</span>
                    <span className="flex items-center gap-2"><MessageCircle size={14} /> Ref: #{c._id?.slice(-6) || c.id?.toString().slice(-6)}</span>
                  </div>
                </div>

                <div className="lg:w-1/4 flex flex-col justify-center items-center lg:items-end border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-8">
                  <Badge
                    variant={c.status === 'Resolved' ? 'success' : c.status === 'Open' ? 'warning' : 'info'}
                    className="mb-4 py-2 px-6 rounded-xl shadow-sm text-sm"
                  >
                    {c.status === 'Open' ? 'Pending' : c.status}
                  </Badge>
                  {c.status === 'Resolved' && <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2 flex items-center gap-1"><CheckCircle2 size={12} /> Verified by Admin</p>}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="File a New Complaint"
        subtitle="Describe the issue accurately so management can resolve it quickly."
        icon={AlertTriangle}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Issue Title"
            placeholder="e.g. Water Leakage in Kitchen"
            register={register('title')}
            error={errors.title?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Category"
              options={[
                { label: 'Maintenance', value: 'Maintenance' },
                { label: 'Security', value: 'Security' },
                { label: 'Amenities', value: 'Amenities' },
                { label: 'Utility', value: 'Utility' },
                { label: 'Other', value: 'Other' },
              ]}
              register={register('category')}
              error={errors.category?.message}
            />
            <Select
              label="Priority Level"
              options={[
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' },
                { label: 'Urgent', value: 'Urgent' },
              ]}
              register={register('priority')}
              error={errors.priority?.message}
            />
          </div>

          <TextArea
            label="Detailed Description"
            placeholder="Provide details like exact location, time since issue started, etc."
            rows={5}
            register={register('description')}
            error={errors.description?.message}
          />

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">Discard</button>
            <Button type="submit" fullWidth className="flex-[1.5] py-4">Register Complaint</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Complaints;