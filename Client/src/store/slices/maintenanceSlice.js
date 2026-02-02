import { createSlice } from '@reduxjs/toolkit';

const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState: {
        records: [] // Initialized empty for backend sync
    },
    reducers: {
        setMaintenance: (state, action) => {
            state.records = action.payload;
        },
        addMaintenance: (state, action) => {
            state.records.unshift(action.payload);
        },
        updateMaintenance: (state, action) => {
            const index = state.records.findIndex(r => r.id === action.payload.id || r._id === action.payload._id);
            if (index !== -1) state.records[index] = { ...state.records[index], ...action.payload };
        }
    }
});

export const { setMaintenance, addMaintenance, updateMaintenance } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
