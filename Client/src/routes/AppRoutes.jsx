import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts
import RootLayout from '../layouts/RootLayout';
import DashboardLayout from '../layouts/DashboardLayout';


// Common Pages
import Home from '../pages/common/Home';
import Login from '../pages/common/Login';
import SignUp from '../pages/common/SignUp';
import RequestAccess from '../pages/common/RequestAccess';
import Dashboard from '../pages/common/Dashboard';
import ProfilePage from '../pages/common/ProfilePage'; // New Common Profile (Security)

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageFlats from '../pages/admin/ManageFlats';
import ManageResidents from '../pages/admin/ManageResidents';
import ManageRequests from '../pages/admin/ManageRequests';
import AdminComplaints from '../pages/admin/Complaints';
import AdminMaintenance from '../pages/admin/Maintenance';
import AdminNotices from '../pages/admin/Notices';
import AdminProfile from '../pages/admin/Profile'; // Original Rich Admin Profile

// Security Pages
import VisitorManagement from '../pages/security/VisitorManagement';
import VisitorHistory from '../pages/security/VisitorHistory';
import SecurityProfile from '../pages/security/Profile';

// Resident Pages
import ResidentDashboard from '../pages/resident/ResidentDashboard';
import ResidentComplaints from '../pages/resident/Complaints';
import ResidentMaintenance from '../pages/resident/Maintenance';
import ResidentNotices from '../pages/resident/Notices';
import ResidentProfile from '../pages/resident/Profile'; // Original Rich Resident Profile

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <SignUp /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/request-access', element: <RequestAccess /> },
        ],
    },
    {
        path: '/admin',
        element: <DashboardLayout />,
        children: [
            { index: true, element: <Navigate to="/admin/dashboard" replace /> },
            { path: 'dashboard', element: <AdminDashboard /> },
            { path: 'flats', element: <ManageFlats /> },
            { path: 'residents', element: <ManageResidents /> },
            { path: 'requests', element: <ManageRequests /> },
            { path: 'complaints', element: <AdminComplaints /> },
            { path: 'maintenance', element: <AdminMaintenance /> },
            { path: 'notices', element: <AdminNotices /> },
            { path: 'profile', element: <AdminProfile /> }, // Restored Original Admin UI
        ],
    },
    {
        path: '/security',
        element: <DashboardLayout />,
        children: [
            { index: true, element: <Navigate to="/security/visitors" replace /> },
            { path: 'dashboard', element: <Navigate to="/security/visitors" replace /> },
            { path: 'visitors', element: <VisitorManagement /> },
            { path: 'visitor-history', element: <VisitorHistory /> },
            { path: 'profile', element: <SecurityProfile /> },
        ],
    },
    {
        path: '/resident',
        element: <DashboardLayout />,
        children: [
            { path: 'dashboard', element: <ResidentDashboard /> },
            { path: 'complaints', element: <ResidentComplaints /> },
            { path: 'maintenance', element: <ResidentMaintenance /> },
            { path: 'notices', element: <ResidentNotices /> },
            { path: 'profile', element: <ResidentProfile /> }, // Restored Original Resident UI
        ],
    },
]);

export default function AppRoutes() {
    return <RouterProvider router={router} />;
}
