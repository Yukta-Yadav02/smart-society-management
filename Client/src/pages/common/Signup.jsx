import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";

// 🔹 API BASE
import { API_BASE_URL } from "../../constants";

// Local Assets (UNCHANGED)
import HeroImg from "../../assets/images/hero.jpg";
import Avatar1 from "../../assets/images/avatar1.jpg";
import Avatar2 from "../../assets/images/avatar2.jpg";
import Avatar3 from "../../assets/images/avatar3.jpg";
import Avatar4 from "../../assets/images/avatar4.jpg";

const Signup = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  // 🔹 UI STATES (SAME)
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 🔹 SIGNUP HANDLER (backend ready)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      /*
            🔌 BACKEND SIGNUP API
            axios.post(`${API_BASE_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
            */

      // ✅ TEMP (remove when backend connected)
      console.log("Signup data:", formData);

      toast.success("Registration Successful! Please login to continue.", {
        duration: 4000,
        style: {
          borderRadius: "16px",
          background: "#0f172a",
          color: "#fff",
          fontWeight: "bold",
        },
      });

      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-50 dark:bg-primary-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 dark:bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] grid lg:grid-cols-2 bg-white dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden lg:block relative bg-primary-900">
          <img
            src={HeroImg}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/60 to-transparent" />

          <div className="relative h-full p-16 flex flex-col justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/60 hover:text-white"
            >
              <ArrowLeft size={18} />
              <span className="text-xs font-black uppercase tracking-widest">
                Back to Website
              </span>
            </button>

            <div>
              <h2 className="text-5xl font-black text-white italic">
                Join the Elite
                <br />
                Community.
              </h2>
              <p className="text-white/60 text-lg mt-4 max-w-sm">
                Register your account and become part of a secure, connected
                society.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[Avatar1, Avatar2, Avatar3, Avatar4].map((a, i) => (
                  <img
                    key={i}
                    src={a}
                    className="h-10 w-10 rounded-full border-2 border-slate-900"
                    alt=""
                  />
                ))}
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                Join 500+ Active Members
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-primary-600 italic">
              Apply for Residency
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              Create your secure digital access profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className=" w-full
  pl-12 pr-4 py-4
  bg-gray-50 dark:bg-white/5
  border border-gray-100 dark:border-white/5
  rounded-2xl
  focus:outline-none
  focus:ring-4 focus:ring-primary-500/5
  focus:bg-white dark:focus:bg-white/10
  focus:border-primary-600
  transition-all
  font-bold
  text-gray-700 dark:text-gray-200
  placeholder:text-gray-300 dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className=" w-full
  pl-12 pr-4 py-4
  bg-gray-50 dark:bg-white/5
  border border-gray-100 dark:border-white/5
  rounded-2xl
  focus:outline-none
  focus:ring-4 focus:ring-primary-500/5
  focus:bg-white dark:focus:bg-white/10
  focus:border-primary-600
  transition-all
  font-bold
  text-gray-700 dark:text-gray-200
  placeholder:text-gray-300 dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className=" w-full
  pl-12 pr-4 py-4
  bg-gray-50 dark:bg-white/5
  border border-gray-100 dark:border-white/5
  rounded-2xl
  focus:outline-none
  focus:ring-4 focus:ring-primary-500/5
  focus:bg-white dark:focus:bg-white/10
  focus:border-primary-600
  transition-all
  font-bold
  text-gray-700 dark:text-gray-200
  placeholder:text-gray-300 dark:placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-primary-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em]"
            >
              {loading ? "Creating Account..." : "Register Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-sm font-bold text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 font-black uppercase text-xs"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
