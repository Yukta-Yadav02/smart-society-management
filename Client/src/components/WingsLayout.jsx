import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, ArrowRight, UserCheck, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import wingA from '../assets/images/wing-a.jpg';
import wingB from '../assets/images/wing-b.jpg';
import wingC from '../assets/images/wing-c.jpg';
import wingD from '../assets/images/wing-d.jpg';

/**
 * BACKEND INTEGRATION:
 * The 'societyData' object below (wings and flats) is currently static.
 * For a production app, you should fetch this data from your backend API
 * so that flat availability and details can be managed dynamically.
 */
const societyData = {
    wings: [
        { id: 'A', name: 'A Wing', description: 'Main Entrance Hub - East Facing Pride', image: wingA },
        { id: 'B', name: 'B Wing', description: 'Clubhouse Premium - Heart of Society', image: wingB },
        { id: 'C', name: 'C Wing', description: 'Garden Side Tranquility - Peaceful Living', image: wingC },
        { id: 'D', name: 'D Wing', description: 'Skyline View Towers - Reach for the Stars', image: wingD },
    ],
    flats: {
        A: [
            { id: 'A101', number: '101', block: 'Block 1', status: 'Occupied' },
            { id: 'A102', number: '102', block: 'Block 1', status: 'Vacant' },
            { id: 'A201', number: '201', block: 'Block 2', status: 'Occupied' },
            { id: 'A202', number: '202', block: 'Block 2', status: 'Vacant' },
        ],
        B: [
            { id: 'B101', number: '101', block: 'Block 1', status: 'Occupied' },
            { id: 'B102', number: '102', block: 'Block 1', status: 'Occupied' },
            { id: 'B201', number: '201', block: 'Block 2', status: 'Vacant' },
            { id: 'B202', number: '202', block: 'Block 2', status: 'Occupied' },
        ],
        C: [
            { id: 'C101', number: '101', block: 'Block 1', status: 'Vacant' },
            { id: 'C102', number: '102', block: 'Block 1', status: 'Occupied' },
            { id: 'C201', number: '201', block: 'Block 2', status: 'Occupied' },
        ],
        D: [
            { id: 'D101', number: '101', block: 'Block 1', status: 'Occupied' },
            { id: 'D102', number: '102', block: 'Block 1', status: 'Vacant' },
            { id: 'D201', number: '201', block: 'Block 2', status: 'Vacant' },
            { id: 'D202', number: '202', block: 'Block 2', status: 'Occupied' },
        ],
    }
};

const WingsLayout = () => {
    const [selectedWing, setSelectedWing] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleRequestAccess = (wing, flat) => {
        if (!user) {
            navigate('/signup');
        } else {
            navigate(`/request-access?wing=${wing}&flat=${flat}&block=${societyData.flats[wing].find(f => f.number === flat)?.block || ''}`);
        }
    };

    return (
        <section id="wings" className="py-24 bg-white relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-0 right-0 -translate-y-1/2 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 z-0" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Explore Our Wings</h2>
                        <p className="text-gray-500 text-lg font-medium max-w-lg">Discover the architectural layout of Gokuldham Society and find your block.</p>
                    </motion.div>
                    {selectedWing && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setSelectedWing(null)}
                            className="text-primary-600 font-bold hover:text-primary-700 flex items-center gap-3 group transition-all"
                        >
                            <div className="w-10 h-10 rounded-2xl border-2 border-primary-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors shadow-sm shadow-primary-50">
                                <ArrowRight className="rotate-180" size={18} />
                            </div>
                            <span className="text-sm uppercase tracking-widest">Back to Directory</span>
                        </motion.button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!selectedWing ? (
                        <motion.div
                            key="wings-grid"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {societyData.wings.map((wing, index) => (
                                <motion.div
                                    key={wing.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -12, transition: { duration: 0.2 } }}
                                    onClick={() => setSelectedWing(wing.id)}
                                    className="group cursor-pointer relative overflow-hidden bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(14,165,233,0.15)] hover:border-primary-100 transition-all text-center"
                                >
                                    {/* Colorful Top Line */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />
                                    <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden mb-8 mx-auto transition-all duration-500 shadow-lg group-hover:scale-110 ring-4 ring-primary-50">
                                        <img
                                            src={wing.image}
                                            alt={wing.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-3">{wing.name}</h3>
                                    <p className="text-gray-400 mb-8 font-semibold text-sm leading-relaxed">{wing.description}</p>
                                    <div className="inline-flex items-center text-primary-600 font-black text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                        View Units <ArrowRight size={18} className="ml-2" />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="flats-grid"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl shadow-gray-200">
                                <Building size={20} className="text-primary-400" />
                                <span className="uppercase tracking-widest text-sm">Wing {selectedWing}</span>
                                <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                                <span className="text-gray-400 font-medium text-xs">Residence Directory</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {societyData.flats[selectedWing].map((flat, idx) => (
                                    <motion.div
                                        key={flat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative group bg-white rounded-[2rem] p-1 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                                    >
                                        {/* Colorful Top Line */}
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />
                                        <div className="absolute top-0 right-0 p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${flat.status === 'Vacant'
                                                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {flat.status}
                                            </span>
                                        </div>

                                        <div className="p-8">
                                            <div className="mb-6">
                                                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em]">{flat.block}</span>
                                                <h4 className="text-5xl font-black text-gray-900 mt-1">
                                                    <span className="text-2xl text-gray-300 font-medium mr-1">#</span>
                                                    {flat.number}
                                                </h4>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleRequestAccess(selectedWing, flat.number)}
                                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${user
                                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-700'
                                                    : 'bg-gray-900 text-white hover:bg-black'
                                                    }`}
                                            >
                                                {user ? <UserCheck size={16} /> : <Lock size={16} />}
                                                {user ? 'Request Access' : 'Sign Up to Access'}
                                            </motion.button>

                                            {!user && (
                                                <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                    <div className="w-1 h-1 bg-primary-400 rounded-full animate-pulse" />
                                                    Resident Area Only
                                                </div>
                                            )}
                                        </div>

                                        {/* Decorative background element on hover */}
                                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default WingsLayout;
