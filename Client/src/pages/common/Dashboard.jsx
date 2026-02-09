import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  Layout,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { FLAT_REQUEST_API } from '../../services/apis';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  //if no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Redirect based on role and status
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'SECURITY') return <Navigate to="/security/dashboard" replace />;
  if (user.role === 'RESIDENT' && user.status === 'ACTIVE') {
    return <Navigate to="/resident/dashboard" replace />;
  }

  // FETCH REQUESTS FROM BACKEND
 useEffect(() => {
  // console.log("API RESPONSE =>", res);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await apiConnector(
        "GET",
        FLAT_REQUEST_API.GET_MY_REQUESTS 
      );

      console.log("API Response:", res);
      console.log("Full response structure:", JSON.stringify(res, null, 2));

      const formatted = (res?.data || []).map((item) => {
        console.log("Raw item:", item);
        console.log("Current user ID:", user?.id);
        console.log("Request user ID:", item.user?._id || item.user);
        
        let statusInfo = {
          status: 'Pending',
          statusColor: 'bg-amber-100 text-amber-600 border border-amber-200',
          icon: <Clock size={16} />
        };

        if (item.status === 'Approved') {
          statusInfo = {
            status: 'Approved',
            statusColor: 'bg-emerald-100 text-emerald-600 border border-emerald-200',
            icon: <CheckCircle size={16} />
          };
        } else if (item.status === 'Rejected') {
          statusInfo = {
            status: 'Rejected',
            statusColor: 'bg-rose-100 text-rose-600 border border-rose-200',
            icon: <XCircle size={16} />
          };
        }

        return {
          id: item._id,
          wing: item.flat?.wing?.name || '-',
          flat: item.flat?.flatNumber || '-',
          block: item.flat?.block || 'Block',
          date: new Date(item.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          adminMessage: item.adminMessage || null,
          ...statusInfo
        };
      });

      console.log("Formatted requests:", formatted);
      setRequests(formatted);
    } catch (err) {
      console.error("DASHBOARD ERROR →", err);
      toast.error("Failed to load access requests");
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, []);


  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* USER PROFILE CARD (UNCHANGED UI) */}
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
                <h3 className="text-3xl font-black text-gray-900 mb-2">
                  {user?.name || 'Guest User'}
                </h3>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                  Resident Member
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100/50">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
                      Email Address
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.email || 'guest@example.com'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100/50">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
                      Joined On
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      January 2026
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ACCESS REQUESTS (SAME UI) */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 h-full"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    Access Requests
                  </h2>
                  <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest">
                    Track your flat approval status
                  </p>
                </div>
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                  <Layout size={28} />
                </div>
              </div>

              {loading ? (
                <p className="text-gray-400 font-bold">Loading requests...</p>
              ) : requests.length === 0 ? (
                <p className="text-gray-400 font-bold">No access requests found</p>
              ) : (
                <div className="space-y-6">
                  {requests.map((req, index) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-primary-100 hover:bg-white hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm flex flex-col items-center justify-center border border-gray-100">
                            <span className="text-[10px] font-black text-primary-400 uppercase mb-1">
                              Wing
                            </span>
                            <span className="text-2xl font-black text-gray-900">
                              {req.wing}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900">
                              {req.block} - Flat {req.flat}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-gray-400 font-bold text-xs uppercase">
                              <Calendar size={12} />
                              <span>Requested on {req.date}</span>
                            </div>
                            {req.adminMessage && (
                              <div className={`mt-3 p-3 rounded-xl ${
                                req.status === 'Rejected' ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'
                              }`}>
                                <div className="flex items-start gap-2">
                                  <AlertCircle className={`w-4 h-4 mt-0.5 ${
                                    req.status === 'Rejected' ? 'text-rose-500' : 'text-emerald-500'
                                  }`} />
                                  <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Admin Response:</p>
                                    <p className={`text-sm font-bold ${
                                      req.status === 'Rejected' ? 'text-rose-700' : 'text-emerald-700'
                                    }`}>"{req.adminMessage}"</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shrink-0 ${req.statusColor}`}>
                          {req.icon}
                          {req.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
