import { createSlice } from '@reduxjs/toolkit';

const requestsSlice = createSlice({
    name: 'requests',
    initialState: {
        items: [] // Initialized empty for backend sync
    },
    reducers: {
        setRequests: (state, action) => {
            state.items = action.payload;
        },
        addRequest: (state, action) => {
            state.items.unshift(action.payload);
        },
        updateRequest: (state, action) => {
            const index = state.items.findIndex(r => r.id === action.payload.id || r._id === action.payload._id);
            if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
        }
    }
});

export const { setRequests, addRequest, updateRequest } = requestsSlice.actions;
export default requestsSlice.reducer;
