import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        stats: {
            totalResidents: 0,
            totalFlats: 0,
            occupiedFlats: 0,
            availableFlats: 0,
            vacantFlats: 0,
            pendingRequests: 0,
            activeComplaints: 0,
            pendingComplaints: 0,
            resolvedComplaints: 0,
            totalRequests: 0,
            totalComplaints: 0,
            totalNotices: 0,
            totalMaintenance: 0,
            totalMaintenanceAmount: 0,
            paidMaintenanceAmount: 0,
            unpaidMaintenanceAmount: 0
        },
        recentRequests: [],
        loading: false,
        error: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
            state.loading = false;
            state.error = null;
        },
        setRecentRequests: (state, action) => {
            state.recentRequests = action.payload;
        }
    }
});

export const { updateStats, setRecentRequests, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
