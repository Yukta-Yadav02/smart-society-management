import { configureStore } from '@reduxjs/toolkit';
import flatReducer from './slices/flatSlice';
import dashboardReducer from './slices/dashboardSlice';
import residentReducer from './slices/residentSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import complaintReducer from './slices/complaintSlice';
import noticeReducer from './slices/noticeSlice';
import requestReducer from './slices/requestSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
    reducer: {
        flats: flatReducer,
        dashboard: dashboardReducer,
        residents: residentReducer,
        maintenance: maintenanceReducer,
        complaints: complaintReducer,
        notices: noticeReducer,
        requests: requestReducer,
        profile: profileReducer,
    },
});
