import React from 'react';
import Hero from '../../components/Hero';
import SocietyFeatures from '../../components/SocietyFeatures';
import SocietyOverview from '../../components/SocietyOverview';
import WingsLayout from '../../components/WingsLayout';
import Testimonials from '../../components/Testimonials';

const Home = () => {
    return (
        <div className="animate-in fade-in duration-700">
            <Hero />
            <SocietyFeatures />
            <SocietyOverview />
            <WingsLayout />
            <Testimonials />

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-2">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Gokuldham Society</h3>
                            <p className="text-gray-500 max-w-sm">
                                Creating a safe, happy, and connected community for all our residents.
                                Experience the best in modern society living.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-500">
                                <li><a href="#" className="hover:text-primary-600">About Us</a></li>
                                <li><a href="#wings" className="hover:text-primary-600">Wings & Flats</a></li>
                                <li><a href="#" className="hover:text-primary-600">Facilities</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-500">
                                <li>Powai, Mumbai</li>
                                <li>contact@gokuldham.com</li>
                                <li>+91 98765 43210</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-8 flex justify-between items-center text-sm text-gray-400">
                        <p>© 2026 Gokuldham Society Management System. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-600">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
