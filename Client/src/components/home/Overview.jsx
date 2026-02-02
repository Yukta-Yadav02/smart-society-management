import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Car, Dumbbell, Flower2, Waves, ChevronLeft, ChevronRight } from 'lucide-react';
import facilitySecurity from '../../assets/images/facility-security.jpg';
import facilityParking from '../../assets/images/facility-parking.jpg';
import facilityGym from '../../assets/images/facility-gym.jpg';
import facilityGarden from '../../assets/images/facility-garden.jpg';
import facilityPool from '../../assets/images/facility-pool.jpg';

const facilities = [
    {
        icon: Shield,
        name: '24/7 Security',
        desc: 'Advanced CCTV and manual patrolling for resident safety.',
        image: facilitySecurity,
        color: 'bg-indigo-600'
    },
    {
        icon: Car,
        name: 'Ample Parking',
        desc: 'Spacious multi-level resident parking with security.',
        image: facilityParking,
        color: 'bg-blue-600'
    },
    {
        icon: Dumbbell,
        name: 'Fitness Center',
        desc: 'Modern gym with professional trainers and equipment.',
        image: facilityGym,
        color: 'bg-sky-600'
    },
    {
        icon: Flower2,
        name: 'Green Spaces',
        desc: 'Lush landscaped gardens and children play zones.',
        image: facilityGarden,
        color: 'bg-emerald-600'
    },
    {
        icon: Waves,
        name: 'Infinity Pool',
        desc: 'Temperature-controlled pool with a dedicated kids zone.',
        image: facilityPool,
        color: 'bg-cyan-600'
    }
];

const SocietyOverview = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-16 gap-8 text-left">
                    <div className="max-w-2xl">
                        <span className="text-primary-600 font-black text-xs uppercase tracking-[0.2em] mb-2 block">
                            Society Facilities
                        </span>
                        <h2 className="text-5xl font-black text-gray-900 tracking-tight">
                            Lifestyle Amenities
                        </h2>
                    </div>
                    <div className="md:w-1/3">
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Premium facilities designed for the modern lifestyle of Gokuldham residents.
                        </p>
                    </div>
                </div>

                <div className="relative group/slider overflow-hidden -mx-4 px-4">
                    {/* Continuous Auto-scrolling Wrapper */}
                    <div className="flex gap-6 w-max animate-infinite-scroll hover:[animation-play-state:paused] py-4">
                        {[...facilities, ...facilities, ...facilities, ...facilities].map((item, index) => (
                            <div
                                key={index}
                                className="w-[300px] flex-shrink-0"
                            >
                                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-100/50 border border-gray-100 flex flex-col h-[420px] relative group/card transition-all duration-500 hover:border-primary-100">
                                    {/* Colorful Top Line */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 z-10" />

                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={item.image}
                                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                                            alt={item.name}
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover/card:bg-transparent transition-colors duration-500" />

                                        <div className={`absolute top-4 left-4 w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                            <item.icon size={18} />
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col justify-center">
                                        <h3 className="text-xl font-black text-gray-900 mb-2">{item.name}</h3>
                                        <p className="text-gray-400 font-semibold text-sm leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocietyOverview;
