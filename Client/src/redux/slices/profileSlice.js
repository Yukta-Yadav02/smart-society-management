import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🌐 BACKEND CONFIGURATION: Replace this URL with your actual API endpoint for society profile
const API_URL = 'http://localhost:5000/api/profile';

// 🚀 Async Thunk for fetching profile
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
    // const response = await axios.get(API_URL);
    // return response.data;
    return {};
});

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        // 📊 DUMMY DATA: Initial society profile for demonstration
        data: {
            societyName: 'Gokuldham Co-operative Housing Society',
            regNumber: 'MH-MUM-12345/2024',
            address: 'Powai, Mumbai, Maharashtra - 400076',
            email: 'admin@gokuldham.com',
            phone: '+91 22 2345 6789',
            secretaryName: 'Yukta Yadav',
            secretaryPhone: '+91 98765 43210',
            secretaryEmail: 'yadav.secretary@gokuldham.com',
            storageUsedGb: 8.4,
            storageTotalGb: 12
        },
        status: 'idle',
        error: null,
    },
    reducers: {
        // ✅ Update Profile Data
        updateProfile: (state, action) => {
            state.data = { ...state.data, ...action.payload };
            // 🔌 BACKEND SYNC: axios.put(API_URL, action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.data = action.payload; 
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
