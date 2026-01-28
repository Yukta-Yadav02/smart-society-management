import { createSlice } from '@reduxjs/toolkit';

const residentDashboardSlice = createSlice({
    name: 'residentDashboard',
    initialState: {
        profile: {
            name: 'Rajesh Kumar',
            flat: 'A-101',
            wing: 'A',
            phone: '9876543210',
            email: 'rajesh.kumar@email.com',
            memberSince: '2020-01-15'
        },
        stats: {
            pendingComplaints: 1,
            pendingMaintenance: 2,
            unreadNotices: 2,
            totalPaid: 25000
        },
        complaints: [
            { id: 1, title: 'Water leakage', status: 'pending', date: '2024-03-20' },
        ],
        maintenance: [
            { id: 1, month: 'March 2024', amount: 2500, paid: false, dueDate: '2024-03-31' },
            { id: 2, month: 'April 2024', amount: 2500, paid: false, dueDate: '2024-04-30' },
        ],
        notices: [
            { id: 1, title: 'Society Meeting', date: '2024-03-25', content: 'Monthly society meeting' },
            { id: 2, title: 'Water Supply', date: '2024-03-22', content: 'Water supply will be interrupted' },
        ],
        loading: false,
        error: null,
        recentActivity: [
            { id: 1, type: 'payment', description: 'Maintenance payment completed', date: '2024-03-15', amount: 2500 },
            { id: 2, type: 'complaint', description: 'New complaint submitted', date: '2024-03-20' },
            { id: 3, type: 'notice', description: 'New notice received', date: '2024-03-20' },
        ]
    },
    reducers: {
        updateProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
        },
        updateStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        },
        addActivity: (state, action) => {
            state.recentActivity.unshift({
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                ...action.payload
            });
            // Keep only last 10 activities
            if (state.recentActivity.length > 10) {
                state.recentActivity = state.recentActivity.slice(0, 10);
            }
        }
    }
});

export const { updateProfile, updateStats, addActivity } = residentDashboardSlice.actions;
export default residentDashboardSlice.reducer;