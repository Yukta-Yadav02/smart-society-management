import React from 'react';
import { Outlet } from 'react-router-dom';
import HomeNavbar from '../components/HomeNavbar';

const RootLayout = () => {
    return (
        <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-700">
            <HomeNavbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;
