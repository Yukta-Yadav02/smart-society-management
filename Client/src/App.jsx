import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'react-hot-toast';

import Layout from './components/layout/Layout';

// Admin Pages
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
      {/* Toast */}
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

      <Routes>
        {/* root redirect */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* admin layout with sidebar */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="flats" element={<ManageFlats />} />
          <Route path="requests" element={<ManageRequests />} />
          <Route path="residents" element={<ManageResidents />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="notices" element={<Notices />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;