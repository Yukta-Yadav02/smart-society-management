import { createSlice } from '@reduxjs/toolkit';

const noticesSlice = createSlice({
    name: 'notices',
    initialState: {
        items: [] // Initialized empty for backend sync
    },
    reducers: {
        setNotices: (state, action) => {
            state.items = action.payload;
        },
        addNotice: (state, action) => {
            state.items.unshift(action.payload);
        },
        deleteNotice: (state, action) => {
            state.items = state.items.filter(n => n.id !== action.payload && n._id !== action.payload);
        }
    }
});

export const { setNotices, addNotice, deleteNotice } = noticesSlice.actions;
export default noticesSlice.reducer;
