import { createSlice } from '@reduxjs/toolkit';

const flatsSlice = createSlice({
    name: 'flats',
    initialState: {
        items: [] // Initialized empty for backend sync
    },
    reducers: {
        setFlats: (state, action) => {
            state.items = action.payload;
        },
        addFlat: (state, action) => {
            state.items.push(action.payload);
        },
        updateFlat: (state, action) => {
            const index = state.items.findIndex(f => f.id === action.payload.id || f._id === action.payload._id);
            if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
        }
    }
});

export const { setFlats, addFlat, updateFlat } = flatsSlice.actions;
export default flatsSlice.reducer;
