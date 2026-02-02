import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        data: {
            societyName: 'Gokuldham Society',
            regNumber: '-',
            address: '-',
            email: '-',
            phone: '-',
            secretaryName: '-',
            secretaryEmail: '-',
            secretaryPhone: '-',
            storageUsedGb: 0,
            storageTotalGb: 50
        }
    },
    reducers: {
        updateProfile: (state, action) => {
            state.data = { ...state.data, ...action.payload };
        }
    }
});

export const { updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
