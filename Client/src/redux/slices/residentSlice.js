import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🌐 BACKEND CONFIGURATION: Replace this URL with your actual API endpoint for residents
const API_URL = 'http://localhost:5000/api/residents';

// 🚀 Async Thunk for fetching residents (For future Backend integration)
export const fetchResidents = createAsyncThunk('residents/fetchResidents', async () => {
    // const response = await axios.get(API_URL);
    // return response.data;
    return []; // Returning empty for now
});

const residentSlice = createSlice({
    name: 'residents',
    initialState: {
        // 📊 DUMMY DATA: Replace this with [] once backend is connected
        items: [
            { id: 1, name: 'Jethalal Gada', email: 'jetha@gada-electronics.com', phone: '9820098200', wing: 'A', flat: '301', block: '1', type: 'Owner', status: 'Active' },
            { id: 2, name: 'Daya Gada', email: 'daya@garba.com', phone: '9820098201', wing: 'A', flat: '301', block: '1', type: 'Owner', status: 'Active' },
            { id: 3, name: 'Taarak Mehta', email: 'taarak@mehta.com', phone: '9833398333', wing: 'B', flat: '101', block: '1', type: 'Owner', status: 'Active' },
            { id: 4, name: 'Popatlal', email: 'popat@toofani.com', phone: '9999999999', wing: 'C', flat: '202', block: '2', type: 'Owner', status: 'Active' },
            { id: 5, name: 'Bagha', email: 'bagha@bawri.com', phone: '9777777777', wing: 'D', flat: '105', block: '1', type: 'Tenant', status: 'Active' },
        ],
        status: 'idle',
        error: null,
    },
    reducers: {
        // ➕ Add Resident (Frontend Action)
        addResident: (state, action) => {
            // 🔌 BACKEND SYNC: Once you have a backend, call axios.post(API_URL, action.payload) here
            state.items.push(action.payload);
        },
        // 🗑️ Remove Resident
        removeResident: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        // 🔄 Update Resident
        updateResident: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchResidents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchResidents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.items = action.payload; // Uncomment when API is ready
            })
            .addCase(fetchResidents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addResident, removeResident, updateResident } = residentSlice.actions;
export default residentSlice.reducer;
