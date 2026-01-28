import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🌐 BACKEND CONFIGURATION: Replace this URL with your actual API endpoint for maintenance
const API_URL = 'http://localhost:5000/api/maintenance';

// 🚀 Async Thunk for fetching maintenance records
export const fetchMaintenance = createAsyncThunk('maintenance/fetchMaintenance', async () => {
    // const response = await axios.get(API_URL);
    // return response.data;
    return []; // Returning empty for now
});

const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState: {
        // 📊 DUMMY DATA: Initial records for demonstration
        records: [
            { id: 1, flat: '101', wing: 'A', type: 'Common Monthly', amount: 2500, period: 'March 2024', status: 'Paid', description: 'Monthly society charges' },
            { id: 2, flat: '202', wing: 'B', type: 'Special', amount: 500, period: 'March 2024', status: 'Unpaid', description: 'Pipe leakage repair' },
            { id: 3, flat: '301', wing: 'A', type: 'Common Monthly', amount: 2500, period: 'March 2024', status: 'Unpaid', description: 'Monthly society charges' },
        ],
        status: 'idle',
        error: null,
    },
    reducers: {
        // ➕ Generate Common Bill for all (Frontend Action)
        generateCommonMaintenance: (state, action) => {
            const { amount, period, flats, description } = action.payload;
            const newRecords = flats.map(f => ({
                id: Date.now() + Math.random(),
                flat: f.number,
                wing: f.wing,
                type: 'Common Monthly',
                amount,
                period,
                status: 'Unpaid',
                description
            }));
            state.records = [...newRecords, ...state.records];
        },
        // ➕ Add Special Charge (Frontend Action)
        addSpecialMaintenance: (state, action) => {
            state.records.unshift({
                id: Date.now(),
                ...action.payload,
                type: 'Special',
                status: 'Unpaid'
            });
        },
        // ✅ Toggle Status (System Tracking)
        updatePaymentStatus: (state, action) => {
            const record = state.records.find(r => r.id === action.payload.id);
            if (record) {
                record.status = action.payload.status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaintenance.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMaintenance.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(fetchMaintenance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { generateCommonMaintenance, addSpecialMaintenance, updatePaymentStatus } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
