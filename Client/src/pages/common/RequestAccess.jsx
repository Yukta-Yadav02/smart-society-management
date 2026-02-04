import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Send,
  CheckCircle,
  Info,
  User,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { apiConnector } from '../../services/apiConnector';
import { FLAT_REQUEST_API } from '../../services/apis';
import toast from 'react-hot-toast';

// COMMON UI COMPONENTS
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import ToggleGroup from '../../components/common/ToggleGroup';

const RequestAccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // URL params
  const flatId = searchParams.get("flatId");
  const wing = searchParams.get("wing");
  const flat = searchParams.get("flat");

  // STATES
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [residentType, setResidentType] = useState('OWNER');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // SAFETY CHECK
  if (!flatId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-10 text-center max-w-sm">
          <p className="text-rose-600 font-black uppercase tracking-widest text-sm mb-4">
            Flat information missing
          </p>
          <Button onClick={() => navigate('/')} variant="secondary">
            Back to Selection
          </Button>
        </Card>
      </div>
    );
  }

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // 🔐 LOGIN CHECK
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const payload = {
      flatId,
      ownershipType: residentType,
      remark: message,
    };

    // 🧪 DEBUG (VERY IMPORTANT)
    console.log("FLAT ID =>", flatId);
    console.log("REQUEST PAYLOAD =>", payload);

    try {
      setLoading(true);

      await apiConnector(
        "POST",
        FLAT_REQUEST_API.CREATE,
        payload
      );

      setIsSubmitted(true);
      toast.success("Request submitted successfully!");
    } catch (err) {
      console.error("REQUEST FAILED →", err);

      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUCCESS SCREEN ================= */
  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full p-10 text-center animate-in zoom-in duration-500 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-500" size={40} />
          </div>

          <h2 className="text-3xl font-black text-slate-800 mb-4">
            Request Sent!
          </h2>

          <p className="text-slate-500 leading-relaxed mb-8 font-medium">
            Your request for{' '}
            <span className="font-black text-indigo-600">
              Wing {wing}, Flat {flat}
            </span>{' '}
            has been sent to the society secretary.
            You will be notified once it is approved.
          </p>

          <Button
            onClick={() => navigate('/')}
            fullWidth
            className="py-4"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  /* ================= FORM SCREEN ================= */
  return (
    <div className="min-h-screen pt-32 pb-12 bg-slate-50 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-8 transition-all group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Selection
        </button>

        <div className="mb-8">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Request Flat Access
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Submit your details for verification by the society management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-xl shadow-slate-200/50">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Wing
                    </span>
                    <p className="text-2xl font-black text-slate-800">
                      {wing}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Flat Number
                    </span>
                    <p className="text-2xl font-black text-slate-800">
                      {flat}
                    </p>
                  </div>
                </div>

                <ToggleGroup
                  label="Resident Type"
                  options={[
                    { label: 'Owner', value: 'OWNER' },
                    { label: 'Resident', value: 'RESIDENT' },
                  ]}
                  value={residentType}
                  onChange={setResidentType}
                />

                <TextArea
                  label="Remark (Optional)"
                  rows="4"
                  placeholder="Tell us a bit about yourself..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  fullWidth
                  className="py-4 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </Card>
          </div>

          {/* USER INFO */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight text-sm">
                <Info size={18} className="text-indigo-600" />
                My Details
              </h3>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm font-black">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">
                      Name
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {user?.name || 'Guest User'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm font-black">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">
                      Email
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {user?.email || 'guest@example.com'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
              <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-80">
                Security Note
              </p>
              <p className="text-sm font-medium leading-relaxed">
                Your data is stored securely and only accessible to verified society management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;
