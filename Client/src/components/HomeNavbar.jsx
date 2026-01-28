import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Building2, LogIn, UserPlus, LogOut, User, Layout, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HomeNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Reset scroll state on navigation
        setScrolled(window.scrollY > 50);
        setIsProfileOpen(false); // Close dropdown on navigate
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navStyle = (scrolled || !isHomePage)
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-3 border-b border-primary-100'
        : 'bg-transparent py-8';

    const textStyle = (scrolled || !isHomePage)
        ? 'text-primary-600'
        : 'text-white';

    const linkStyle = (scrolled || !isHomePage)
        ? 'text-primary-600 hover:text-primary-700'
        : 'text-white hover:text-white/70';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navStyle}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className={`p-2 rounded-xl transition-all duration-300 shadow-lg ${(scrolled || !isHomePage) ? 'bg-primary-600 shadow-primary-200' : 'bg-white shadow-black/10'
                            }`}>
                            <Building2 className={(scrolled || !isHomePage) ? 'text-white h-6 w-6' : 'text-primary-600 h-6 w-6'} />
                        </div>
                        <span className={`text-2xl font-black tracking-tight transition-colors duration-300 ${textStyle}`}>
                            Gokuldham
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <Link
                            to="/"
                            className={`font-bold text-sm uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 ${linkStyle}`}
                        >
                            <Home size={16} /> Home
                        </Link>
                        <a
                            href="/#wings"
                            className={`font-bold text-sm uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 ${linkStyle}`}
                        >
                            <Building2 size={16} /> Wings
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center gap-3 pl-3 pr-4 py-2 rounded-full cursor-pointer transition-all duration-300 shadow-xl border ${(scrolled || !isHomePage)
                                        ? 'bg-white border-primary-100 shadow-primary-100/20'
                                        : 'bg-white/10 border-white/30 text-white backdrop-blur-md hover:bg-white/20'
                                        }`}
                                >
                                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-widest hidden sm:block ${(scrolled || !isHomePage) ? 'text-gray-900' : 'text-white'}`}>
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${(scrolled || !isHomePage) ? 'text-gray-400' : 'text-white/60'} ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </motion.div>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl shadow-primary-600/10 border border-primary-50 overflow-hidden z-50 p-2"
                                            >
                                                <div className="p-4 mb-2 border-b border-gray-50">
                                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Signed in as</p>
                                                    <p className="text-sm font-black text-gray-900 truncate">{user.email}</p>
                                                </div>
                                                <Link
                                                    to="/dashboard"
                                                    className="flex items-center gap-3 px-4 py-4 text-sm font-bold text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary-100">
                                                        <Layout size={18} />
                                                    </div>
                                                    My Dashboard
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all text-left"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                                                        <LogOut size={18} />
                                                    </div>
                                                    Logout
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link
                                    to="/login"
                                    className={`font-bold text-sm uppercase tracking-widest transition-colors duration-300 ${linkStyle}`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className={`px-6 py-3 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 ${(scrolled || !isHomePage)
                                        ? 'bg-primary-600 text-white shadow-primary-200 hover:bg-primary-700'
                                        : 'bg-white text-primary-600 shadow-black/10 hover:bg-gray-50'
                                        }`}
                                >
                                    Join Us
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default HomeNavbar;
