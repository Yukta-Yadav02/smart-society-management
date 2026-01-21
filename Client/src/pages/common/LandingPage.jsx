import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ALL_WINGS, ALL_FLATS, API_BASE_URL } from '../../constants';

import {
    Building2,
    MapPin,
    ChevronRight,
    CheckCircle2,
    ShieldCheck,
    Trees,
    Dumbbell,
    Waves,
    ArrowRight,
    Home,
    X,
    Send,
    Moon,
    Sun,
    Menu
} from 'lucide-react';

// Local Assets (SAME)
import HeroImg from '../../assets/images/hero.jpg';
import Flat1 from '../../assets/images/flat1.jpg';
import Flat2 from '../../assets/images/flat2.jpg';
import Flat3 from '../../assets/images/flat3.jpg';
import Flat4 from '../../assets/images/flat4.jpg';
import Community1 from '../../assets/images/community1.jpg';
import Community2 from '../../assets/images/community2.jpg';
import ZenImg from '../../assets/images/zen.jpg';
import PoolImg from '../../assets/images/pool.jpg';
import GymImg from '../../assets/images/gym.jpg';
import ClubhouseImg from '../../assets/images/clubhouse.jpg';
import SecurityImg from '../../assets/images/security.jpg';
import KidsImg from '../../assets/images/kids.jpg';
import WingA from '../../assets/images/wing_a.png';
import WingB from '../../assets/images/wing_b.png';
import WingC from '../../assets/images/wing_c.png';
import WingD from '../../assets/images/wing_d.png';

const LandingPage = ({ darkMode, toggleDarkMode }) => {
    const navigate = useNavigate();

    // 🔹 UI STATES (SAME)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [selectedWing, setSelectedWing] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedFlatDetails, setSelectedFlatDetails] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFullListOpen, setIsFullListOpen] = useState(false);

    // 🔹 DATA STATE (backend ready)
    const [wings, setWings] = useState(ALL_WINGS);
    const [flats, setFlats] = useState(ALL_FLATS);

    /*
    // 🔌 FUTURE BACKEND CONNECTION (DON'T TOUCH NOW)
    useEffect(() => {
        axios.get(`${API_BASE_URL}/wings`)
            .then(res => setWings(res.data))
            .catch(err => console.log(err));

        axios.get(`${API_BASE_URL}/flats`)
            .then(res => setFlats(res.data))
            .catch(err => console.log(err));
    }, []);
    */

    const handleInquiry = (flat) => {
        setSelectedFlat(flat);
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        /*
        axios.post(`${API_BASE_URL}/inquiries`, formData)
        */

        setIsModalOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    const wingsWithImages = wings.map(w => ({
        ...w,
        img:
            w.id === 'A' ? WingA :
            w.id === 'B' ? WingB :
            w.id === 'C' ? WingC : WingD
    }));

    const currentFlats = selectedWing
        ? flats.filter(f => f.wing === selectedWing)
        : [];

    /* ============================= */
    /* ====== UI BELOW UNCHANGED ==== */
    /* ============================= */

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">

            {/* ⚠️ FROM HERE ONWARDS = 100% SAME UI ⚠️ */}
            {/* (no className, no text, no layout touched) */}

            {/* 👉 EVERYTHING BELOW IS EXACTLY YOUR CODE */}
            {/* 👉 I DID NOT MODIFY A SINGLE TAILWIND CLASS */}

            {/* 👉 paste rest of your JSX here AS IS */}
            {/* 👉 literally the same code you sent above */}

 {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-600 rounded-lg text-white">
                            <Building2 size={24} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-primary-900 dark:text-white italic transition-colors">GOKULDHAM</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#about" className="text-sm font-bold text-gray-500 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors uppercase tracking-widest">About</a>
                        <a href="#flats" className="text-sm font-bold text-gray-500 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors uppercase tracking-widest">Available Flats</a>
                        <a href="#amenities" className="text-sm font-bold text-gray-500 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors uppercase tracking-widest">Amenities</a>

                        <button
                            onClick={toggleDarkMode}
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:text-primary-600 transition-all border border-gray-100 dark:border-white/10"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="flex items-center bg-gray-50 dark:bg-white/10 p-1 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2.5 text-xs font-black text-gray-500 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-all uppercase tracking-widest"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-6 py-2.5 bg-primary-600 text-white rounded-[14px] text-xs font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none uppercase tracking-widest"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl bg-gray-50 dark:bg-white/10 text-gray-500 transition-all"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-xl text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-white/5 p-6 animate-in slide-in-from-top-5 duration-300">
                        <div className="flex flex-col gap-6">
                            <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">About</a>
                            <a href="#flats" onClick={() => setIsMenuOpen(false)} className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Available Flats</a>
                            <a href="#amenities" onClick={() => setIsMenuOpen(false)} className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Amenities</a>
                            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-4 text-sm font-black text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl uppercase tracking-widest"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                                </span>
                                <span className="text-xs font-black uppercase tracking-widest leading-none">Vibrant Living Awaits</span>
                            </div>
                            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1]">
                                Experience <span className="text-primary-600 italic">Elite</span> Life in Gokuldham
                            </h1>
                            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                                Discover a community where luxury meets harmony. Join 300+ happy families in the most premium residential society.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a href="#flats" className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all text-center flex items-center justify-center gap-2">
                                    BROWSE FLATS <ArrowRight size={20} />
                                </a>
                                <button
                                    onClick={() => setIsTourOpen(true)}
                                    className="px-10 py-5 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl font-black text-lg border border-gray-100 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:border-primary-200 transition-all flex items-center justify-center gap-2 group"
                                >
                                    VIRTUAL TOUR <Waves size={20} className="text-primary-600 transition-transform group-hover:rotate-12" />
                                </button>
                            </div>
                        </div>

                        <div className="relative animate-in fade-in slide-in-from-right-10 duration-1000">
                            <div className="absolute -inset-4 bg-primary-600/5 rounded-[40px] blur-3xl"></div>
                            <img
                                src={HeroImg}
                                alt="Gokuldham Architecture"
                                className="relative rounded-[40px] shadow-2xl border-8 border-white object-cover aspect-[4/5] lg:aspect-auto"
                            />
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-50 flex items-center gap-4 hidden lg:flex">
                                <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900">100% Secure</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gated Community</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="relative z-10 grid grid-cols-2 gap-4">
                                <img
                                    src={Community1}
                                    alt="Community Life"
                                    className="rounded-3xl shadow-2xl mt-12 hover:scale-105 transition-transform duration-500"
                                />
                                <img
                                    src={Community2}
                                    alt="Modern Architecture"
                                    className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -top-6 -left-6 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
                        </div>

                        <div className="space-y-8 order-1 lg:order-2">
                            <div className="space-y-4">
                                <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.5em]">The Legacy of Harmony</h2>
                                <h3 className="text-5xl font-black text-gray-900 dark:text-white leading-tight">Where Every Neighbor is <span className="text-primary-600 italic">Family</span></h3>
                                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                    Established in 2010, Gokuldham Residential Society has grown from a simple building to a thriving ecosystem of culture, peace, and modernity. We believe in "Unity in Diversity," providing a safe haven for over 500+ members from all walks of life.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pb-4">
                                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                    <p className="text-3xl font-black text-primary-600 mb-1">15+</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Awards for Design</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                    <p className="text-3xl font-black text-primary-600 mb-1">98%</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Satisfaction Rate</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-500/10 rounded-2xl border border-primary-100 dark:border-primary-500/20">
                                <CheckCircle2 className="text-primary-600 dark:text-primary-400 flex-shrink-0" size={24} />
                                <p className="text-sm font-bold text-primary-900 dark:text-primary-100 leading-snug">
                                    Recognized as the "Best Residential Community" in the region for 3 consecutive years.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Available Wings/Flats */}
            <section id="flats" className="py-24 bg-gray-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.4em]">Available Units</h2>
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-4xl font-black text-gray-900 dark:text-white">
                                {selectedWing ? `Available Flats in Wing ${selectedWing}` : 'Explore Our Premium Wings'}
                            </p>
                            {selectedWing && (
                                <button
                                    onClick={() => setSelectedWing(null)}
                                    className="text-xs font-black text-primary-600 hover:text-primary-800 uppercase tracking-widest flex items-center gap-2 border-b-2 border-primary-600 pb-1 transition-all"
                                >
                                    <ChevronRight size={14} className="rotate-180" /> Back to Wings
                                </button>
                            )}
                        </div>
                    </div>

                    {!selectedWing ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {wingsWithImages.map((wing, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                    <div className="relative h-64 overflow-hidden">
                                        <img src={wing.img} alt={wing.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                            WING {wing.id}
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">{wing.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                            {wing.description}
                                        </p>
                                        <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex justify-end">
                                            <button
                                                onClick={() => setSelectedWing(wing.id)}
                                                className="p-4 bg-primary-900 dark:bg-primary-600 text-white rounded-2xl hover:bg-primary-800 dark:hover:bg-primary-500 transition-all shadow-lg shadow-primary-200 dark:shadow-none"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {currentFlats.map((flat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={flat.img || [Flat1, Flat2, Flat3, Flat4][i % 4]}
                                            alt=""
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-widest text-primary-600">
                                            {flat.id}
                                        </div>
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            VACANT
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white italic underline decoration-primary-200 dark:decoration-primary-600/30">Luxury Unit {flat.id}</h3>
                                        <div className="flex items-center gap-2 pt-4 border-t border-gray-50 dark:border-white/5">
                                            <button
                                                onClick={() => handleInquiry(flat)}
                                                className="flex-1 px-4 py-3 bg-primary-900 dark:bg-primary-600 text-white rounded-xl text-[10px] font-black hover:bg-primary-800 transition-all uppercase tracking-widest"
                                            >
                                                Enquire
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedFlatDetails(flat);
                                                    setIsDetailsOpen(true);
                                                }}
                                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl text-[10px] font-black hover:bg-white dark:hover:bg-white/10 transition-all uppercase tracking-widest"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-16 text-center">
                        <button
                            onClick={() => setIsFullListOpen(true)}
                            className="inline-flex items-center gap-2 text-sm font-black text-primary-600 hover:text-primary-800 transition-colors uppercase tracking-[0.2em]"
                        >
                            View All Units Across Wings <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Amenities Section */}
            <section id="amenities" className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.5em]">The Elite Experience</h2>
                        <p className="text-5xl font-black text-gray-900 dark:text-white leading-tight">World Class Amenities for a Modern Life</p>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Every corner of Gokuldham is designed to provide you with an unparalleled lifestyle and absolute comfort.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Zen Gardens',
                                desc: 'Lush greenery and meditative spaces for your peace of mind.',
                                img: ZenImg,
                                icon: <Trees size={24} />
                            },
                            {
                                title: 'Olympic Pool',
                                desc: 'Temperature controlled swimming pool with a dedicated kids zone.',
                                img: PoolImg,
                                icon: <Waves size={24} />
                            },
                            {
                                title: 'Elite Fitness',
                                desc: 'Fully equipped modern gym with personal training facilities.',
                                img: GymImg,
                                icon: <Dumbbell size={24} />
                            },
                            {
                                title: 'Grand Clubhouse',
                                desc: 'A massive 20,000 sq.ft space for events and community bonding.',
                                img: ClubhouseImg,
                                icon: <Building2 size={24} />
                            },
                            {
                                title: '24/7 Security',
                                desc: 'Multi-tier smart surveillance and trained security personnel.',
                                img: SecurityImg,
                                icon: <ShieldCheck size={24} />
                            },
                            {
                                title: 'Kids Paradise',
                                desc: 'Safe and engaging play areas with international safety standards.',
                                img: KidsImg,
                                icon: <Home size={24} />
                            }
                        ].map((item, i) => (
                            <div key={i} className="group relative h-[450px] rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="mb-6 transform transition-all duration-500 group-hover:-translate-y-2">
                                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl w-fit border border-white/30 text-white shadow-lg">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight transform transition-all duration-500 group-hover:-translate-y-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-300 font-medium leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / Call to Action */}
            <footer className="bg-primary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12 items-center text-center lg:text-left">
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-4xl font-black">Ready to join the family?</h2>
                            <p className="text-primary-300 font-medium">Contact the Secretary office today for site visit and documentation.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="p-6 bg-primary-800 rounded-3xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-primary-400" />
                                    <p className="text-sm font-bold uppercase tracking-widest">Main Office, Sector 42</p>
                                </div>
                            </div>
                            <div className="p-6 bg-primary-500 rounded-3xl flex items-center justify-between shadow-xl shadow-primary-900/50">
                                <div className="flex items-center gap-3">
                                    <Home className="text-white" />
                                    <p className="text-sm font-black uppercase tracking-widest">Office: +91 9988 7766</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-primary-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">
                        <p>© 2026 Gokuldham Residential Society. All rights reserved.</p>
                        <div className="flex gap-8">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Terms of Living</span>
                        </div>
                    </div>
                </div>
            </footer>
            {/* Inquiry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-primary-600 text-white relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-3xl font-black mb-2">Request This Flat</h2>
                            <p className="text-primary-100 font-bold uppercase tracking-widest text-xs">
                                Flat {selectedFlat?.id} | {selectedFlat?.type}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-white/10 focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900 dark:text-gray-100"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-white/10 focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900 dark:text-gray-100"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Phone</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-white/10 focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900 dark:text-gray-100"
                                        placeholder="+91 0000 0000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Message (Optional)</label>
                                <textarea
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-white/10 focus:border-primary-600 focus:outline-none transition-all font-bold text-gray-900 dark:text-gray-100 h-32 resize-none"
                                    placeholder="Why are you interested in this flat?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                            >
                                SEND REQUEST <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Flat Details Modal */}
            {isDetailsOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-slate-900 dark:bg-primary-900 text-white relative">
                            <button
                                onClick={() => setIsDetailsOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-3xl font-black mb-2 italic">Unit Specifications</h2>
                            <p className="text-primary-400 font-bold uppercase tracking-widest text-xs">
                                Gokuldham Residency | Wing {selectedFlatDetails?.wing}
                            </p>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Flat Number</p>
                                        <p className="text-2xl font-black text-primary-600">{selectedFlatDetails?.id}</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Building Block</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white italic">{selectedFlatDetails?.block}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Unit Configuration</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white uppercase mb-4">{selectedFlatDetails?.type}</p>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed italic">
                                        {selectedFlatDetails?.specs}
                                    </p>
                                </div>

                                <div className="p-6 bg-primary-50 dark:bg-white/5 rounded-3xl border border-primary-100 dark:border-white/5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Premium Price</p>
                                    <p className="text-3xl font-black text-primary-600">{selectedFlatDetails?.price}</p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setIsDetailsOpen(false);
                                            handleInquiry(selectedFlatDetails);
                                        }}
                                        className="flex-1 py-5 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        Proceed to Inquiry <ArrowRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => setIsDetailsOpen(false)}
                                        className="px-8 py-5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Full List Modal */}
            {isFullListOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-primary-900 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black mb-1">Available Units</h2>
                                <p className="text-primary-400 text-xs font-bold uppercase tracking-widest">Find your perfect home in Gokuldham</p>
                            </div>
                            <button
                                onClick={() => setIsFullListOpen(false)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 bg-gray-50 dark:bg-slate-950">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {allFlats.map((flat, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all duration-500">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={flat.img || [Flat1, Flat2, Flat3, Flat4][i % 4]}
                                                alt=""
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-widest text-primary-600">
                                                {flat.id}
                                            </div>
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-primary-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                Wing {flat.wing}
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Luxury Unit {flat.id}</h3>
                                            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                                                <button
                                                    onClick={() => {
                                                        setIsFullListOpen(false);
                                                        handleInquiry(flat);
                                                    }}
                                                    className="px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black hover:bg-primary-700 transition-colors uppercase tracking-widest"
                                                >
                                                    Enquire
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedFlatDetails(flat);
                                                        setIsDetailsOpen(true);
                                                    }}
                                                    className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl text-[10px] font-black hover:bg-gray-200 dark:hover:bg-white/10 transition-colors uppercase tracking-widest"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Virtual Tour Modal */}
            {isTourOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-5xl aspect-video rounded-[48px] shadow-2xl overflow-hidden relative group animate-in zoom-in-95 duration-500">
                        {/* Tour Background */}
                        <div className="absolute inset-0">
                            <img
                                src={HeroImg}
                                alt="Society Tour"
                                className="w-full h-full object-cover brightness-50"
                            />
                            {/* Scanning Animation */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent animate-pulse"></div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary-500/30 blur-md animate-scan"></div>
                        </div>

                        {/* Top Controls */}
                        <div className="relative z-10 p-10 flex justify-between items-start">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10 text-white backdrop-blur-md">
                                    <span className="h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                                    LIVE VR MODE
                                </div>
                                <h2 className="text-4xl font-black text-white mt-4 italic">Gokuldham Heights</h2>
                                <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Panoramic Infrastructure Preview</p>
                            </div>
                            <button
                                onClick={() => setIsTourOpen(false)}
                                className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-[24px] transition-all backdrop-blur-md border border-white/10"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Center HUD */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-8 z-10 w-full px-20">
                            <div className="flex justify-between items-center opacity-40">
                                <div className="h-20 w-1 border-l-2 border-white/20"></div>
                                <div className="h-20 w-1 border-r-2 border-white/20"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 inline-block px-10">
                                    <p className="text-white text-xl font-bold tracking-tight">Initializing Society Core Telemetry...</p>
                                </div>
                                <div className="h-1 w-64 bg-white/10 mx-auto rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500 w-2/3 animate-progress transition-all"></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center opacity-40">
                                <div className="h-20 w-1 border-l-2 border-white/20"></div>
                                <div className="h-20 w-1 border-r-2 border-white/20"></div>
                            </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="absolute bottom-0 left-0 w-full p-12 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end justify-between">
                            <div className="flex gap-8">
                                <div className="text-white">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">FPS</p>
                                    <p className="text-xl font-black">60.0</p>
                                </div>
                                <div className="text-white">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Resolution</p>
                                    <p className="text-xl font-black">4K ULTRA</p>
                                </div>
                                <div className="text-white">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Signal</p>
                                    <p className="text-xl font-black text-green-400">STABLE</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="p-5 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-primary-500 transition-all">Enter Interactive Mode</button>
                                <button className="p-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10">Skip Intro</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-10 duration-500">
                    <div className="bg-primary-900 border border-white/10 text-white px-8 py-5 rounded-[24px] shadow-2xl flex items-center gap-4 backdrop-blur-md">
                        <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                            <CheckCircle2 size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-widest mb-0.5">Request Received!</p>
                            <p className="text-primary-200 text-xs font-bold">The Secretary will contact you with login details shortly.</p>
                        </div>
                        <button onClick={() => setShowSuccess(false)} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={16} className="text-primary-300" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
