import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';


// Resident Pages
import ResidentDashboard from './pages/resident/ResidentDashboard';
import Complaints from './pages/resident/Complaints';
import Maintenance from './pages/resident/Maintenance';
import Notices from './pages/resident/Notices';
import Profile from './pages/resident/Profile';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          
          {/* Resident Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<ResidentDashboard />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="notices" element={<Notices />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
