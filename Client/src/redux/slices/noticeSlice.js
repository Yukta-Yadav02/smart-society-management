import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🌐 BACKEND CONFIGURATION: Replace this URL with your actual API endpoint for notices
const API_URL = 'http://localhost:5000/api/notices';

// 🚀 Async Thunk for fetching notices
export const fetchNotices = createAsyncThunk('notices/fetchNotices', async () => {
    // const response = await axios.get(API_URL);
    // return response.data;
    return []; // Returning empty for now
});

const noticeSlice = createSlice({
    name: 'notices',
    initialState: {
        // 📊 DUMMY DATA: Initial records for demonstration
        items: [
            { id: 1, title: 'Annual General Meeting', description: 'Mandatory AGM for all residents next Sunday at 10 AM in the clubhouse.', date: '2024-03-25', pinned: true },
            { id: 2, title: 'Water Tank Cleaning', description: 'Water supply will be suspended on March 28th from 9 AM to 2 PM.', date: '2024-03-22', pinned: false },
            { id: 3, title: 'Holi Celebration', description: 'Join us for रंगों का त्योहार at society compound. Snacks will be provided.', date: '2024-03-20', pinned: false },
            { id: 4, title: 'Security Protocol Change', description: 'Mandatory RFID tags for all domestic helpers from April 1st.', date: '2024-03-15', pinned: false },
        ],
        status: 'idle',
        error: null,
    },
    reducers: {
        // ➕ Add Notice
        addNotice: (state, action) => {
            state.items.unshift({
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                ...action.payload
            });
            // 🔌 BACKEND SYNC: axios.post(API_URL, action.payload)
        },
        // 🗑️ Remove Notice
        removeNotice: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            // 🔌 BACKEND SYNC: axios.delete(`${API_URL}/${action.payload}`)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotices.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.items = action.payload; 
            })
            .addCase(fetchNotices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addNotice, removeNotice } = noticeSlice.actions;
export default noticeSlice.reducer;
