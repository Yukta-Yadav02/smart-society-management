import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Building2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
    ChevronRight
} from 'lucide-react';

// 🔹 API BASE
import { API_BASE_URL } from '../../constants';

// Local Assets (UNCHANGED)
import HeroImg from '../../assets/images/hero.jpg';
import Avatar1 from '../../assets/images/avatar1.jpg';
import Avatar2 from '../../assets/images/avatar2.jpg';
import Avatar3 from '../../assets/images/avatar3.jpg';
import Avatar4 from '../../assets/images/avatar4.jpg';

const Login = ({ darkMode, toggleDarkMode, onLogin }) => {
    const navigate = useNavigate();

    // 🔹 UI STATES (SAME)
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // 🔹 LOGIN HANDLER (backend ready)
    const handleLogin = async (e) => {
        e.preventDefault();

        // ⛔ abhi dummy remove
        // onLogin(e);

        try {
            setLoading(true);

            /*
            🔌 BACKEND LOGIN API
            axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password
            })
            */

            // ✅ TEMP SUCCESS (remove when backend ready)
            console.log('Login Data:', { email, password });

            // Example role based redirect (future)
            // res.data.role === 'admin' ? navigate('/admin') : navigate('/resident');

            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            alert('Invalid credentials');
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

            <div className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 bg-white dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">

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
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-white/60 hover:text-white"
                        >
                            <ArrowLeft size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Back to Website</span>
                        </button>

                        <div>
                            <h2 className="text-5xl font-black text-white italic">
                                Welcome back to<br />The Community.
                            </h2>
                            <p className="text-white/60 text-lg mt-4">
                                Access your society dashboard securely.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[Avatar1, Avatar2, Avatar3, Avatar4].map((a, i) => (
                                    <img key={i} src={a} className="h-10 w-10 rounded-full border-2 border-slate-900" />
                                ))}
                            </div>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                                Joined by 500+ Residents
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="p-8 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900/80">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white">
                            Gateway to Gokuldham
                        </h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            Residential Management System
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* EMAIL */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Official Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 dark:bg-primary-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest"
                        >
                            {loading ? 'Verifying...' : 'Enter Dashboard'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-bold text-gray-500">
                            Don’t have an account?{' '}
                            <Link to="/signup" className="text-primary-600 font-black uppercase text-xs">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
