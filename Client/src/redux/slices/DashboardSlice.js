import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        // 📊 DUMMY DATA: Replace these values with data fetched from your Backend
        stats: {
            totalFlats: 248,
            totalResidents: 1120,
            totalRequests: 42,
            totalComplaints: 18,
            occupiedFlats: 210,
            vacantFlats: 38,
            pendingRequests: 14,
            pendingComplaints: 6
        },
        // 📩 UPDATED: Recent Access Requests for Dashboard Preview
        recentRequests: [
            { id: 1, name: 'Anjali Bhide', wing: 'A', flat: '101', type: 'Owner', date: 'Just now' },
            { id: 2, name: 'Tapu Sena', wing: 'B', flat: '202', type: 'Owner', date: '2 hours ago' },
            { id: 3, name: 'Abdul Soda', wing: 'C', flat: '105', type: 'Tenant', date: '5 hours ago' },
            { id: 4, name: 'Rita Reporter', wing: 'A', flat: '404', type: 'Tenant', date: 'Yesterday' },
        ]
    },
    reducers: {
        // 🌐 BACKEND INTEGRATION: Create Async Thunks to fetch this data from an API
        updateStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        }
    }
});

export const { updateStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
