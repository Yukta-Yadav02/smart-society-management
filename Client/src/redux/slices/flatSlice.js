import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🌐 BACKEND CONFIGURATION: Replace this URL with your actual API endpoint
const API_URL = 'http://localhost:5000/api/flats';

// 🚀 Async Thunk for fetching flats (For future Backend integration)
export const fetchFlats = createAsyncThunk('flats/fetchFlats', async () => {
    // const response = await axios.get(API_URL);
    // return response.data;
    return []; // Returning empty for now, using initial state
});

const flatSlice = createSlice({
    name: 'flats',
    initialState: {
        // 📊 DUMMY DATA: Replace this with an empty array [] once backend is connected
        items: [
            { id: 1, number: '101', wing: 'A Wing', block: 'Block 1', status: 'Occupied' },
            { id: 2, number: '102', wing: 'A Wing', block: 'Block 1', status: 'Vacant' },
            { id: 3, number: '201', wing: 'B Wing', block: 'Block 2', status: 'Occupied' },
            { id: 4, number: '202', wing: 'B Wing', block: 'Block 2', status: 'Vacant' },
            { id: 5, number: '301', wing: 'C Wing', block: 'Block 3', status: 'Occupied' },
            { id: 6, number: '105', wing: 'D Wing', block: 'Block 1', status: 'Vacant' },
            { id: 7, number: '402', wing: 'D Wing', block: 'Block 2', status: 'Occupied' },
        ],
        status: 'idle',
        error: null,
    },
    reducers: {
        // ➕ Add Flat (Frontend Action)
        addFlat: (state, action) => {
            // 🔌 BACKEND SYNC: Once you have a backend, call axios.post(API_URL, action.payload) here
            state.items.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFlats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.items = action.payload; // Uncomment this when using real API
            })
            .addCase(fetchFlats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addFlat } = flatSlice.actions;
export default flatSlice.reducer;
