import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🌐 BACKEND CONFIGURATION: Replace this URL with your actual API endpoint for complaints
const API_URL = 'http://localhost:5000/api/complaints';

// 🚀 Async Thunk for fetching complaints
export const fetchComplaints = createAsyncThunk('complaints/fetchComplaints', async () => {
    // const response = await axios.get(API_URL);
    // return response.data;
    return []; // Returning empty for now
});

const complaintSlice = createSlice({
    name: 'complaints',
    initialState: {
        // 📊 DUMMY DATA: Initial records for demonstration
        items: [
            { id: 1, resident: 'Jethalal Gada', flat: 'A-301', title: 'Water Leakage', description: 'Major leakage in the kitchen sink area since morning.', status: 'Pending', date: '2024-03-20' },
            { id: 2, resident: 'Bhide', flat: 'B-101', title: 'Lift Not Working', description: 'B-Wing lift is stuck on the 4th floor.', status: 'Pending', date: '2024-03-21' },
            { id: 3, resident: 'Iyer', flat: 'D-202', title: 'Street Light Issue', description: 'Light near D-wing entrance is flickering.', status: 'Resolved', date: '2024-03-18' },
            { id: 4, resident: 'Roshan Singh', flat: 'C-404', title: 'Noisy Neighbors', description: 'Late night party noise from flat 405.', status: 'Rejected', date: '2024-03-15' },
        ],
        status: 'idle',
        error: null,
    },
    reducers: {
        // ✅ Update Complaint Status
        updateComplaintStatus: (state, action) => {
            const { id, status } = action.payload;
            const complaint = state.items.find(c => c.id === id);
            if (complaint) {
                complaint.status = status;
                // 🔌 BACKEND SYNC: axios.patch(`${API_URL}/${id}`, { status })
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComplaints.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchComplaints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.items = action.payload; // Uncomment when API is ready
            })
            .addCase(fetchComplaints.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { updateComplaintStatus } = complaintSlice.actions;
export default complaintSlice.reducer;
