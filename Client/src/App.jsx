import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResidentDashboard from './components/resident/ResidentDashboard';
import Complaints from './components/resident/Complaints';
import Maintenance from './components/resident/Maintenance';
import Notices from './components/resident/Notices';
import Profile from './components/resident/Profile';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ResidentDashboard />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="notices" element={<Notices />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;