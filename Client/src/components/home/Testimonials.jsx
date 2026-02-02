import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import testimonial1 from '../../assets/images/testimonial-1.jpg';
import testimonial2 from '../../assets/images/testimonial-2.jpg';
import testimonial3 from '../../assets/images/testimonial-3.jpg';
import testimonial4 from '../../assets/images/testimonial-4.jpg';
import testimonial5 from '../../assets/images/testimonial-5.jpg';
import testimonial6 from '../../assets/images/testimonial-6.jpg';

const testimonials = [
    {
        name: "Jethalal Gada",
        role: "Resident",
        comment: "This is not just a society, it's a family. The management is excellent, and the security makes me feel safe even when I'm away at Gada Electronics.",
        image: testimonial1,
        rating: 5
    },
    {
        name: "Aatmaram Bhide",
        role: "Secretary",
        comment: "Maintenance is our top priority. With the new smart management system, collecting funds and managing wings has become 10x easier.",
        image: testimonial2,
        rating: 5
    },
    {
        name: "Dr. Hansraj Hathi",
        role: "Resident",
        comment: "The greenery and the playground are perfect for my family. Sahi hai! Life here is truly comfortable and full of happiness.",
        image: testimonial3,
        rating: 5
    },
    {
        name: "Taarak Mehta",
        role: "Resident",
        comment: "A peaceful environment that helps me write my columns. The community here is vibrant and intellectually stimulating.",
        image: testimonial4,
        rating: 5
    },
    {
        name: "Roshan Singh Sodhi",
        role: "Resident",
        comment: "Oye hoye! The celebrations here are grand. Be it Diwali or Holi, we celebrate everything with full 'Josh'!",
        image: testimonial5,
        rating: 5
    },
    {
        name: "Popatlal Pandey",
        role: "Resident",
        comment: "I am still looking for my life partner, but at least I have found the perfect home here. Cancel the complaints, this place is great!",
        image: testimonial6,
        rating: 5
    }
];

// Combine the list multiple times to create the infinite effect
const infiniteList = [...testimonials, ...testimonials, ...testimonials];

const Testimonials = () => {
    // Start at the middle set of testimonials
    const [currentIndex, setCurrentIndex] = useState(testimonials.length);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [cardsToShow, setCardsToShow] = useState(3);
    const gap = 32;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setCardsToShow(1);
            else if (window.innerWidth < 1024) setCardsToShow(2);
            else setCardsToShow(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle the "jump" for seamless looping
    useEffect(() => {
        if (currentIndex >= testimonials.length * 2) {
            // If we hit or pass the end of the second set, jump back to the first set after transition
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(currentIndex - testimonials.length);
            }, 500);
            return () => clearTimeout(timer);
        }
        if (currentIndex <= testimonials.length - cardsToShow) {
            // If we go pichhe (backward) too far, jump to the end of the second set
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(currentIndex + testimonials.length);
            }, 500);
            return () => clearTimeout(timer);
        }
        setIsTransitioning(true);
    }, [currentIndex, cardsToShow, testimonials.length]);

    const nextSlide = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        setCurrentIndex(prev => prev - 1);
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block"
                        >
                            Residents' Voice
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black text-gray-900 tracking-tight"
                        >
                            Hear from our <span className="text-primary-600">Happy Residents</span>
                        </motion.h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={prevSlide}
                            className="p-4 rounded-2xl border-2 border-gray-100 text-gray-400 hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm active:scale-95"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-4 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="relative overflow-visible">
                    <div className="overflow-hidden py-4">
                        <motion.div
                            className="flex gap-8"
                            animate={{ x: `calc(-${currentIndex} * (100% + ${gap}px) / ${cardsToShow})` }}
                            transition={isTransitioning ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0 }}
                        >
                            {infiniteList.map((t, index) => (
                                <div
                                    key={index}
                                    style={{
                                        minWidth: `calc((100% - ${(cardsToShow - 1) * gap}px) / ${cardsToShow})`,
                                        maxWidth: `calc((100% - ${(cardsToShow - 1) * gap}px) / ${cardsToShow})`
                                    }}
                                    className="flex-shrink-0"
                                >
                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 flex flex-col h-full hover:border-primary-200 transition-all group">
                                        <div className="mb-6 relative w-fit">
                                            <div className="absolute -top-3 -right-3 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                                <Quote size={12} />
                                            </div>
                                            <img
                                                src={t.image}
                                                className="w-16 h-16 rounded-[1.5rem] object-cover ring-3 ring-primary-50 group-hover:scale-110 transition-transform duration-500"
                                                alt={t.name}
                                            />
                                        </div>

                                        <p className="text-gray-500 text-sm font-semibold leading-relaxed mb-6 flex-1 italic">
                                            "{t.comment}"
                                        </p>

                                        <div className="pt-6 border-t border-gray-50">
                                            <h4 className="font-black text-gray-900 text-lg">{t.name}</h4>
                                            <p className="text-primary-600 font-bold text-xs uppercase tracking-widest">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Simplified Indicators */}
                <div className="mt-12 flex justify-center gap-2">
                    {testimonials.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${(currentIndex % testimonials.length) === i ? 'w-8 bg-primary-600' : 'w-2 bg-gray-200'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
