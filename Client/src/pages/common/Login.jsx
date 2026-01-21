import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react';

// Local Assets
import HeroImg from '../../assets/images/hero.jpg';
import Avatar1 from '../../assets/images/avatar1.jpg';
import Avatar2 from '../../assets/images/avatar2.jpg';
import Avatar3 from '../../assets/images/avatar3.jpg';
import Avatar4 from '../../assets/images/avatar4.jpg';

const Login = ({ onLogin, darkMode, toggleDarkMode }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-white  transition-colors duration-300">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-slate-950">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-50  rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 bg-white dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-700">

                {/* Left Side: Visual/Branding */}
                <div className="hidden lg:block relative overflow-hidden bg-primary-900 border-r border-gray-100 dark:border-white/5">
                    <img
                        src={HeroImg}
                        alt="Gokuldham Architecture"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/60 to-transparent"></div>

                    <div className="relative h-full p-16 flex flex-col justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group w-fit"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-widest">Back to Website</span>
                        </button>

                        <div className="space-y-6">
                            <div className="h-1 w-12 bg-white rounded-full"></div>
                            <h2 className="text-5xl font-black text-white leading-tight italic">
                                Welcome back to<br />The Community.
                            </h2>
                            <p className="text-white/60 text-lg font-medium max-w-sm">
                                Access your society dashboard to stay updated with notices, events, and maintenance.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[Avatar1, Avatar2, Avatar3, Avatar4].map((ava, i) => (
                                    <div key={i} className="h-10 w-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center overflow-hidden">
                                        <img src={ava} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Joined by 500+ Residents</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="p-8 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900/80 backdrop-blur-xl transition-colors">
                    <div className="mb-10 lg:hidden flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary-600 rounded-lg text-white">
                                <Building2 size={24} />
                            </div>
                            <span className="text-xl font-black tracking-tight text-primary-900 dark:text-white italic uppercase">Gokuldham</span>
                        </div>
                        <Link to="/" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary-600">Home</Link>
                    </div>

                    <div className="space-y-2 mb-10">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Gateway to Gokuldham</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Residential Management System</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); onLogin(e); }} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Official Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:bg-white dark:focus:bg-white/10 focus:border-primary-600 transition-all font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:bg-white dark:focus:bg-white/10 focus:border-primary-600 transition-all font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer appearance-none h-5 w-5 rounded-lg border-2 border-gray-200 checked:bg-primary-600 checked:border-primary-600 transition-all" />
                                    <ShieldCheck className="absolute h-3 w-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 group-hover:text-primary-600 transition-colors">Remember Session</span>
                            </label>
                            <button type="button" className="text-xs font-black text-primary-600 hover:text-primary-800 uppercase tracking-widest">Forgot Access?</button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 dark:bg-primary-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none hover:bg-primary-600 dark:hover:bg-primary-500 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group"
                        >
                            Enter Dashboard <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center flex flex-col items-center gap-4">
                        <p className="text-sm font-bold text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary-600 hover:text-primary-800 transition-colors font-black uppercase tracking-widest text-xs">Register Here</Link>
                        </p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                            System V.2.0 • Secured by Gokuldham Tech
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
