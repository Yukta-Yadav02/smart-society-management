import { createSlice } from '@reduxjs/toolkit';

const complaintsSlice = createSlice({
    name: 'complaints',
    initialState: {
        items: [] // Initialized empty for backend sync
    },
    reducers: {
        setComplaints: (state, action) => {
            state.items = action.payload;
        },
        addComplaint: (state, action) => {
            state.items.unshift(action.payload);
        },
        updateComplaint: (state, action) => {
            const index = state.items.findIndex(c => c.id === action.payload.id || c._id === action.payload._id);
            if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
        },
        deleteComplaint: (state, action) => {
            state.items = state.items.filter(c => c.id !== action.payload && c._id !== action.payload);
        }
    }
});

export const { setComplaints, addComplaint, updateComplaint, deleteComplaint } = complaintsSlice.actions;
export default complaintsSlice.reducer;
