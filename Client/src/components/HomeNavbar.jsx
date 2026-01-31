import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Building2, LogIn, UserPlus, LogOut, User, Layout, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HomeNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const roleBgClass = (role) => {
        switch ((role || '').toUpperCase()) {
            case 'ADMIN':
                return 'bg-gradient-to-br from-purple-500 to-indigo-500';
            case 'SECURITY':
                return 'bg-gradient-to-br from-orange-400 to-red-400';
            case 'RESIDENT':
            default:
                return 'bg-gradient-to-br from-green-400 to-teal-500';
        }
    };

    const isHomePage = location.pathname === '/';
    const isWingsSection = location.hash === '#wings' || window.location.hash === '#wings';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#wings') {
                setActiveSection('wings');
            } else {
                setActiveSection('home');
            }
        };
        
        // Set initial state
        handleHashChange();
        
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        // Reset scroll state on navigation
        setScrolled(window.scrollY > 50);
        setIsProfileOpen(false); // Close dropdown on navigate
        setIsMobileMenuOpen(false); // Close mobile menu on navigate
        
        // Set active section based on current path
        if (location.pathname === '/') {
            if (window.location.hash === '#wings') {
                setActiveSection('wings');
            } else {
                setActiveSection('home');
            }
        } else {
            setActiveSection(''); // No active section for other pages
        }
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        setActiveSection('home');
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.location.hash = '';
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
                        <span className={`text-xl sm:text-2xl font-black tracking-tight transition-colors duration-300 ${textStyle}`}>
                            Gokuldham
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link
                            to="/"
                            onClick={(e) => {
                                setActiveSection('home');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`font-bold text-sm uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 relative ${linkStyle} ${
                                activeSection === 'home' ? 'after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full' : ''
                            }`}
                        >
                            <Home size={16} /> Home
                        </Link>
                        <a
                            href="/#wings"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveSection('wings');
                                if (location.pathname !== '/') {
                                    navigate('/');
                                    setTimeout(() => {
                                        const wingsElement = document.getElementById('wings');
                                        if (wingsElement) {
                                            wingsElement.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }, 100);
                                } else {
                                    const wingsElement = document.getElementById('wings');
                                    if (wingsElement) {
                                        wingsElement.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }
                            }}
                            className={`font-bold text-sm uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 relative ${linkStyle} ${
                                activeSection === 'wings' ? 'after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full' : ''
                            }`}
                        >
                            <Building2 size={16} /> Wings
                        </a>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
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
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg ${roleBgClass(user.role)}`}>
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start ml-2">
                                        <span className={`text-xs font-black tracking-tight ${ (scrolled || !isHomePage) ? 'text-gray-900' : 'text-white'}`}>
                                            {user.name.split(' ')[0]}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${ (scrolled || !isHomePage) ? 'text-primary-400' : 'text-white/70'}`}>
                                            {user.role ? (user.role.charAt(0) + user.role.slice(1).toLowerCase()) : ''}
                                        </span>
                                    </div>
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
                                                <div className="p-4 mb-2 border-b border-gray-50 flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg ${roleBgClass(user.role)}`}>
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-black text-gray-900 truncate">{user.name}</p>
                                                        <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mt-1">{user.role ? (user.role.charAt(0) + user.role.slice(1).toLowerCase()) : ''}</p>
                                                        <p className="text-[12px] text-gray-500 truncate mt-2">{user.email}</p>
                                                    </div>
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

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-xl transition-all duration-300 ${(scrolled || !isHomePage)
                                ? 'text-primary-600 hover:bg-primary-50'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-4"
                        >
                            <div className={`rounded-2xl p-4 space-y-4 ${(scrolled || !isHomePage)
                                ? 'bg-white/95 backdrop-blur-md border border-primary-100'
                                : 'bg-white/10 backdrop-blur-md border border-white/20'
                                }`}>
                                <Link
                                    to="/"
                                    onClick={(e) => {
                                        setActiveSection('home');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all relative ${
                                        activeSection === 'home' 
                                            ? 'bg-primary-600 text-white border-l-4 border-primary-700' 
                                            : (scrolled || !isHomePage)
                                                ? 'text-primary-600 hover:bg-primary-50'
                                                : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    <Home size={20} />
                                    <span className="font-bold">Home</span>
                                </Link>
                                <a
                                    href="/#wings"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveSection('wings');
                                        setIsMobileMenuOpen(false);
                                        if (location.pathname !== '/') {
                                            navigate('/');
                                            setTimeout(() => {
                                                const wingsElement = document.getElementById('wings');
                                                if (wingsElement) {
                                                    wingsElement.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }, 100);
                                        } else {
                                            const wingsElement = document.getElementById('wings');
                                            if (wingsElement) {
                                                wingsElement.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all relative ${
                                        activeSection === 'wings' 
                                            ? 'bg-primary-600 text-white border-l-4 border-primary-700' 
                                            : (scrolled || !isHomePage)
                                                ? 'text-primary-600 hover:bg-primary-50'
                                                : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    <Building2 size={20} />
                                    <span className="font-bold">Wings</span>
                                </a>
                                
                                {user ? (
                                    <div className="space-y-2 pt-2 border-t border-white/20">
                                        <Link
                                            to="/dashboard"
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${(scrolled || !isHomePage)
                                                ? 'text-primary-600 hover:bg-primary-50'
                                                : 'text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <Layout size={20} />
                                            <span className="font-bold">Dashboard</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${(scrolled || !isHomePage)
                                                ? 'text-red-600 hover:bg-red-50'
                                                : 'text-red-300 hover:bg-white/10'
                                                }`}
                                        >
                                            <LogOut size={20} />
                                            <span className="font-bold">Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2 pt-2 border-t border-white/20">
                                        <Link
                                            to="/login"
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${(scrolled || !isHomePage)
                                                ? 'text-primary-600 hover:bg-primary-50'
                                                : 'text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <LogIn size={20} />
                                            <span className="font-bold">Login</span>
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${(scrolled || !isHomePage)
                                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                                : 'bg-white text-primary-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <UserPlus size={20} />
                                            <span className="font-bold">Join Us</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default HomeNavbar;
