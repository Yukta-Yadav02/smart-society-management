import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

// Common Pages
import Login from './pages/common/Login';
import Signup from './pages/common/Signup';

// Layout
import Layout from './components/layout/Layout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import ManageFlats from './pages/ManageFlats';
import ManageRequests from './pages/ManageRequests';
import ManageResidents from './pages/ManageResidents';
import Complaints from './pages/Complaints';
import Maintenance from './pages/Maintenance';
import Notices from './pages/Notices';
import Profile from './pages/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

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

      <Routes>
        {/* ================= AUTH ROUTES ================= */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />
          }
        />

        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/admin" /> : <Signup />}
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/*"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Routes>
                  <Route path="" element={<Dashboard />} />
                  <Route path="flats" element={<ManageFlats />} />
                  <Route path="requests" element={<ManageRequests />} />
                  <Route path="residents" element={<ManageResidents />} />
                  <Route path="complaints" element={<Complaints />} />
                  <Route path="maintenance" element={<Maintenance />} />
                  <Route path="notices" element={<Notices />} />
                  <Route path="profile" element={<Profile />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ================= DEFAULT ================= */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
