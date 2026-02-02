import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const RootLayout = () => {
    return (
        <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-700">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;
