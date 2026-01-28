import { configureStore } from '@reduxjs/toolkit';
import flatReducer from './slices/flatSlice';
import dashboardReducer from './slices/dashboardSlice';
import residentReducer from './slices/residentSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import complaintReducer from './slices/complaintSlice';
import noticeReducer from './slices/noticeSlice';
import requestReducer from './slices/requestSlice';
import profileReducer from './slices/profileSlice';

// Resident-specific slices
import residentDashboardReducer from './slices/residentDashboardSlice';
import residentMaintenanceReducer from './slices/residentMaintenanceSlice';
import residentComplaintReducer from './slices/residentComplaintSlice';
import residentNoticeReducer from './slices/residentNoticeSlice';

export const store = configureStore({
    reducer: {
        // Admin slices
        flats: flatReducer,
        dashboard: dashboardReducer,
        residents: residentReducer,
        maintenance: maintenanceReducer,
        complaints: complaintReducer,
        notices: noticeReducer,
        requests: requestReducer,
        profile: profileReducer,
        
        // Resident slices
        residentDashboard: residentDashboardReducer,
        residentMaintenance: residentMaintenanceReducer,
        residentComplaints: residentComplaintReducer,
        residentNotices: residentNoticeReducer,
    },
});
