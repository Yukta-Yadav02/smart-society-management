import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        stats: {
            totalResidents: 0,
            totalFlats: 0,
            occupiedFlats: 0,
            vacantFlats: 0,
            pendingRequests: 0,
            activeComplaints: 0,
            pendingComplaints: 0,
            totalRequests: 0,
            totalComplaints: 0
        },
        recentRequests: [] // Initialized empty
    },
    reducers: {
        updateStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        },
        setRecentRequests: (state, action) => {
            state.recentRequests = action.payload;
        }
    }
});

export const { updateStats, setRecentRequests } = dashboardSlice.actions;
export default dashboardSlice.reducer;
