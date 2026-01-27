import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/layout/Layout';

import Dashboard from './pages/admin/Dashboard';
import ManageFlats from './pages/admin/ManageFlats';
import ManageRequests from './pages/admin/ManageRequests';
import ManageResidents from './pages/admin/ManageResidents';
import Complaints from './pages/admin/Complaints';
import Maintenance from './pages/admin/Maintenance';
import Notices from './pages/admin/Notices';
import Profile from './pages/admin/Profile';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1e293b',
            borderRadius: '1.25rem',
            padding: '1rem 1.5rem',
            fontWeight: 'bold',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      />

      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />

          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/flats" element={<ManageFlats />} />
          <Route path="/admin/requests" element={<ManageRequests />} />
          <Route path="/admin/residents" element={<ManageResidents />} />
          <Route path="/admin/complaints" element={<Complaints />} />
          <Route path="/admin/maintenance" element={<Maintenance />} />
          <Route path="/admin/notices" element={<Notices />} />
          <Route path="/admin/profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
