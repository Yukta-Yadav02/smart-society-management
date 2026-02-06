import { createSlice } from '@reduxjs/toolkit';

const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState: {
        records: [], // Always start with empty array
        loading: false,
        error: null
    },
    reducers: {
        setMaintenance: (state, action) => {
            console.log('Setting maintenance data:', action.payload);
            const data = Array.isArray(action.payload) ? action.payload : [];
            console.log('Final maintenance records count:', data.length);
            state.records = data;
            state.loading = false;
            state.error = null;
        },
        addMaintenance: (state, action) => {
            if (action.payload) {
                state.records.unshift(action.payload);
            }
        },
        updateMaintenance: (state, action) => {
            const { id, ...updates } = action.payload;
            const index = state.records.findIndex(r => (r._id === id || r.id === id));
            if (index !== -1) {
                state.records[index] = { ...state.records[index], ...updates };
                console.log('Updated maintenance record:', state.records[index]);
            } else {
                console.log('Maintenance record not found for update:', id);
            }
        },
        clearMaintenance: (state) => {
            console.log('Clearing maintenance data');
            state.records = [];
            state.loading = false;
            state.error = null;
        },
        deleteMaintenance: (state, action) => {
            state.records = state.records.filter(r => r._id !== action.payload && r.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setMaintenance, addMaintenance, updateMaintenance, clearMaintenance, deleteMaintenance, setLoading } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
