import React from 'react';
import { Shield, Zap, Trees, MapPin, Heart, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Shield className="w-8 h-8" />,
        title: "3-Tier Security",
        description: "24/7 CCTV surveillance, biometric access, and trained security personnel for your peace of mind.",
        color: "bg-blue-50 text-blue-600"
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Smart Living",
        description: "Integrated society management app for bills, complaints, and visitor management at your fingertips.",
        color: "bg-amber-50 text-amber-600"
    },
    {
        icon: <Trees className="w-8 h-8" />,
        title: "Green Spaces",
        description: "Lush landscaped gardens, jogging tracks, and 40% open area for a healthy lifestyle.",
        color: "bg-emerald-50 text-emerald-600"
    },
    {
        icon: <MapPin className="w-8 h-8" />,
        title: "Prime Location",
        description: "Strategically located with easy access to schools, hospitals, and major transport hubs.",
        color: "bg-purple-50 text-purple-600"
    },
    {
        icon: <Heart className="w-8 h-8" />,
        title: "Modern Amenities",
        description: "State-of-the-art gym, swimming pool, and a luxury clubhouse for all residents.",
        color: "bg-rose-50 text-rose-600"
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Active Community",
        description: "Regular cultural events and celebrations that bring residents together as one big family.",
        color: "bg-sky-50 text-sky-600"
    }
];

const SocietyFeatures = () => {
    return (
        <section className="py-24 bg-gray-50/50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block"
                    >
                        Why Gokuldham?
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-gray-900 tracking-tight mb-6"
                    >
                        Designed for <span className="text-primary-600">Better Living</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
                    >
                        Everything you need to live a modern, comfortable, and secure life in the heart of the city.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-primary-100/30 transition-all border border-gray-100 relative overflow-hidden flex flex-col h-full"
                        >
                            {/* Colorful Top Line */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />

                            <div className={`w-16 h-16 ${feature.color} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner shrink-0`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-500 font-semibold leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocietyFeatures;
