import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronRight, Building2, MapPin, Star } from 'lucide-react';
import heroBg from '../../assets/images/hero-bg.jpg';
import avatar1 from '../../assets/images/avatar-1.jpg';
import avatar2 from '../../assets/images/avatar-2.jpg';
import avatar3 from '../../assets/images/avatar-3.jpg';
import avatar4 from '../../assets/images/avatar-4.jpg';

const Hero = () => {
    const { user } = useAuth();
    const avatars = [avatar1, avatar2, avatar3, avatar4];

    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Full Page Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroBg}
                    alt="Gokuldham Society facade"
                    className="w-full h-full object-cover scale-105"
                />
                {/* Dark Overlay for text readability with a slight blue tint for premium feel */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

                {/* Bottom Gradient Fade */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-8 uppercase tracking-widest"
                    >
                        <Star size={16} className="text-yellow-400" fill="currentColor" />
                        <span>The Heart of Powai, Mumbai</span>
                    </motion.div>

                    {/* Main Animated Title */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black text-white tracking-tight leading-[0.9] mb-8 px-4">
                        <span className="block">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="block"
                            >
                                Gokuldham
                            </motion.span>
                        </span>
                        <span className="block">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="block text-primary-400"
                            >
                                Society.
                            </motion.span>
                        </span>
                    </h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-xl md:text-2xl text-white/80 max-w-2xl mb-12 font-medium leading-relaxed"
                    >
                        Experience a sanctuary where modern luxury meets community spirit.
                        Your dream home in the most vibrant neighborhood.
                    </motion.p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-16">
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="#wings"
                            className="px-10 py-5 bg-primary-600 text-white text-lg font-black rounded-2xl shadow-2xl shadow-primary-600/30 transition-all flex items-center justify-center gap-2"
                        >
                            Explore Wings <ChevronRight size={24} />
                        </motion.a>

                        {!user && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/signup"
                                    className="px-10 py-5 bg-white text-gray-900 text-lg font-black rounded-2xl transition-all block"
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    {/* Stat Card sitting below buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="hidden lg:flex bg-white/95 backdrop-blur-md p-8 rounded-[3rem] shadow-2xl border border-white/20 items-center gap-12"
                    >
                        <div className="flex flex-col">
                            <span className="text-4xl font-black text-gray-900">12+</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wings Installed</span>
                        </div>
                        <div className="h-12 w-px bg-gray-100" />
                        <div className="flex flex-col">
                            <span className="text-4xl font-black text-gray-900">500+</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Happy Families</span>
                        </div>
                        <div className="h-12 w-px bg-gray-100" />
                        <div className="flex flex-col items-center">
                            <div className="flex -space-x-3 mb-2">
                                {avatars.map((img, i) => (
                                    <img key={i} src={img} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="resident" />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-primary-600 uppercase">Verified Community</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
                    <div className="w-1 h-2 bg-white/50 rounded-full" />
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
