import { configureStore } from '@reduxjs/toolkit';

// Import Reducers
import complaintsReducer from './slices/complaintsSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import requestsReducer from './slices/requestsSlice';
import flatsReducer from './slices/flatsSlice';
import noticesReducer from './slices/noticesSlice';
import residentsReducer from './slices/residentsSlice';
import dashboardReducer from './slices/dashboardSlice';
import profileReducer from './slices/profileSlice';

// Import Actions for re-export (Maintains backward compatibility)
import { setComplaints, addComplaint, updateComplaint, deleteComplaint } from './slices/complaintsSlice';
import { setMaintenance, addMaintenance, updateMaintenance } from './slices/maintenanceSlice';
import { setRequests, addRequest, updateRequest } from './slices/requestsSlice';
import { setFlats, addFlat, updateFlat } from './slices/flatsSlice';
import { setNotices, addNotice, deleteNotice } from './slices/noticesSlice';
import { setResidents, addResident, updateResident, deleteResident } from './slices/residentsSlice';
import { updateStats, setRecentRequests } from './slices/dashboardSlice';
import { updateProfile } from './slices/profileSlice';

// Re-export Actions
export {
  setComplaints, addComplaint, updateComplaint, deleteComplaint,
  setMaintenance, addMaintenance, updateMaintenance,
  setRequests, addRequest, updateRequest,
  setFlats, addFlat, updateFlat,
  setNotices, addNotice, deleteNotice,
  setResidents, addResident, updateResident, deleteResident,
  updateStats, setRecentRequests,
  updateProfile
};

// Create Redux Store
export const store = configureStore({
  reducer: {
    complaints: complaintsReducer,
    maintenance: maintenanceReducer,
    requests: requestsReducer,
    flats: flatsReducer,
    notices: noticesReducer,
    residents: residentsReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
  },
});
