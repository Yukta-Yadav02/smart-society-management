import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Send,
  CheckCircle,
  Info,
  User,
  Mail,
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Smartphone,
  Users,
  ClipboardCheck,
  ChevronRight,
  Building2
} from 'lucide-react';
import { apiConnector } from '../../services/apiConnector';
import { FLAT_REQUEST_API, FLAT_API } from '../../services/apis';
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
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [residentType, setResidentType] = useState('OWNER');
  const [message, setMessage] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [flatStatus, setFlatStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // CHECK FLAT STATUS
  useEffect(() => {
    const checkFlatStatus = async () => {
      if (!flatId) return;
      try {
        const response = await apiConnector("GET", `${FLAT_API.CREATE}/${flatId}`);
        if (response.success) {
          setFlatStatus(response.data);
        }
      } catch (err) {
        console.error("Failed to check flat status:", err);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkFlatStatus();
  }, [flatId]);

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (!contactNumber || contactNumber.length !== 10) {
      toast.error("Please provide a valid 10-digit contact number");
      setStep(2);
      return;
    }

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
      contactNumber,
      memberCount,
      aadhaarNumber,
    };

    try {
      setLoading(true);
      await apiConnector("POST", FLAT_REQUEST_API.CREATE, payload);
      setIsSubmitted(true);
      toast.success("Request submitted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !residentType) return;
    if (step === 2) {
      if (!contactNumber || !memberCount || !aadhaarNumber) {
        toast.error("Please fill all details");
        return;
      }
      if (contactNumber.length !== 10) {
        toast.error("Contact number must be exactly 10 digits");
        return;
      }
      if (!/^\d{12}$/.test(aadhaarNumber)) {
        toast.error("Aadhaar Number must be 12 digits");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  /* ================= SUCCESS SCREEN ================= */
  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full p-10 text-center animate-in zoom-in duration-500 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-500" size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">Request Sent!</h2>
          <p className="text-slate-500 leading-relaxed mb-8 font-medium">
            Your request for <span className="font-black text-indigo-600">Wing {wing}, Flat {flat}</span> has been sent to the society management.
            You will be notified once it is approved.
          </p>
          <Button onClick={() => navigate('/')} fullWidth className="py-4">Back to Home</Button>
        </Card>
      </div>
    );
  }

  /* ================= FORM SCREEN ================= */
  return (
    <div className="min-h-screen pt-32 pb-12 bg-slate-50 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-8 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </button>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Request Flat Access</h2>
            <p className="text-slate-500 mt-1 font-medium italic">Complete the 3-step verification process</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${step === num ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200' : step > num ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {step > num ? <CheckCircle size={18} /> : num}
                </div>
                {num < 3 && <div className={`w-8 h-1 rounded-full ${step > num ? 'bg-emerald-500' : 'bg-slate-100'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              {/* STEP 1: Basic & Ownership */}
              {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <Building2 size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Flat Information</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block text-center">Wing</span>
                      <p className="text-xl font-black text-slate-800 text-center">{wing}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block text-center">Flat No.</span>
                      <p className="text-xl font-black text-slate-800 text-center">{flat}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block text-center">Status</span>
                      <p className={`text-xs font-black text-center mt-1 uppercase ${flatStatus?.isOccupied ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {flatStatus?.isOccupied ? 'Occupied' : 'Vacant'}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                    <ToggleGroup
                      label="What is your occupancy status?"
                      options={[
                        { label: 'Owner', value: 'OWNER' },
                        { label: 'Tenant', value: 'TENANT' },
                      ]}
                      value={residentType}
                      onChange={setResidentType}
                    />
                  </div>

                  <Button onClick={nextStep} fullWidth size="lg" className="py-5 text-lg font-black" icon={ChevronRight}>Next Step</Button>
                </div>
              )}

              {/* STEP 2: Occupancy Details */}
              {step === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <Users size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Stay Details</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="tel"
                          value={contactNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              setContactNumber(value);
                            }
                          }}
                          maxLength="10"
                          placeholder="Enter 10 digit mobile number"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-700"
                        />
                      </div>
                      {contactNumber && contactNumber.length !== 10 && (
                        <p className="text-xs text-rose-500 font-bold mt-1">Contact number must be exactly 10 digits</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">No. of Members</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="number"
                            min="1"
                            value={memberCount}
                            onChange={(e) => setMemberCount(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none transition-all font-bold text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Aadhaar Number (12 Digits)</label>
                        <div className="relative">
                          <ClipboardCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="text"
                            maxLength="12"
                            value={aadhaarNumber}
                            onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="0000 0000 0000"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none transition-all font-bold text-slate-700 tracking-[0.2em]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={prevStep} variant="secondary" fullWidth size="lg">Previous</Button>
                    <Button onClick={nextStep} fullWidth size="lg" icon={ChevronRight}>Next Step</Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Review & Summary */}
              {step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <ClipboardCheck size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Review & Remarks</h3>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flat</p>
                        <p className="font-bold text-slate-700">{wing} - {flat}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership</p>
                        <p className="font-bold text-slate-700 lowercase capitalize">{residentType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                        <p className="font-bold text-slate-700">{contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aadhaar No.</p>
                        <p className="font-bold text-slate-700">{aadhaarNumber.replace(/(\d{4})/g, '$1 ').trim()}</p>
                      </div>
                    </div>
                  </div>

                  <TextArea
                    label="Additional Remarks"
                    rows="4"
                    placeholder="Tell management about your requirements or family..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <div className="flex gap-4">
                    <Button onClick={prevStep} variant="secondary" fullWidth size="lg">Back</Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      fullWidth
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                      icon={Send}
                    >
                      {loading ? "Processing..." : "Submit Application"}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white/50 backdrop-blur-sm">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight text-sm">
                <Info size={18} className="text-indigo-600" />
                Applicant Details
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 font-black">
                    <User size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Full Name</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{user?.name || 'Guest User'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 font-black">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Email ID</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{user?.email || 'guest@example.com'}</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
              <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-80">Security Note</p>
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
