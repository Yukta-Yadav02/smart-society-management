import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🌐 BACKEND CONFIGURATION: Replace this URL with your actual API endpoint for access requests
const API_URL = 'http://localhost:5000/api/requests';

// 🚀 Async Thunk for fetching requests
export const fetchRequests = createAsyncThunk('requests/fetchRequests', async () => {
    // const response = await axios.get(API_URL);
    // return response.data;
    return []; // Returning empty for now
});

const requestSlice = createSlice({
    name: 'requests',
    initialState: {
        // 📊 DUMMY DATA: Initial records for demonstration
        items: [
            { id: 1, name: 'Anjali Bhide', email: 'anjali.b@gmail.com', phone: '9876543210', wing: 'A', flat: '101', block: '1', type: 'Owner', status: 'Pending', message: 'Bought this flat last week.' },
            { id: 2, name: 'Tapu Sena', email: 'tapu@gokuldham.com', phone: '9988776655', wing: 'B', flat: '202', block: '2', type: 'Owner', status: 'Pending', message: 'Need access for renovation.' },
            { id: 3, name: 'Abdul Soda', email: 'abdul@gokuldham.com', phone: '9123456789', wing: 'C', flat: '105', block: '1', type: 'Tenant', status: 'Approved', message: 'Rental agreement attached.' },
            { id: 4, name: 'Rita Reporter', email: 'rita@kal-tak.com', phone: '9888888888', wing: 'A', flat: '404', block: '1', type: 'Tenant', status: 'Rejected', message: 'I stay here often.', reason: 'No proper documents found.' },
        ],
        status: 'idle',
        error: null,
    },
    reducers: {
        // ✅ Update Request Status
        updateRequestStatus: (state, action) => {
            const { id, status, reason } = action.payload;
            const request = state.items.find(r => r.id === id);
            if (request) {
                request.status = status;
                if (reason) request.reason = reason;
                // 🔌 BACKEND SYNC: axios.patch(`${API_URL}/${id}`, { status, reason })
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.items = action.payload; 
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { updateRequestStatus } = requestSlice.actions;
export default requestSlice.reducer;
