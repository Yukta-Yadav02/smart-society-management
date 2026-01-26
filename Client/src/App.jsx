import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/flats" element={<ManageFlats />} />
        <Route path="/requests" element={<ManageRequests />} />
        <Route path="/residents" element={<ManageResidents />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
