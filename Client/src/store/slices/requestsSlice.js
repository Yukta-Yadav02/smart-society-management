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
            const { id, ...updates } = action.payload;
            const index = state.items.findIndex(r => (r._id === id || r.id === id));
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...updates };
                console.log('Updated request:', state.items[index]);
            } else {
                console.log('Request not found for update:', id);
            }
        }
    }
});

export const { setRequests, addRequest, updateRequest } = requestsSlice.actions;
export default requestsSlice.reducer;
