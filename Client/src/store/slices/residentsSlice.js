import { createSlice } from '@reduxjs/toolkit';

const residentsSlice = createSlice({
    name: 'residents',
    initialState: {
        items: [] // Initialized empty for backend sync
    },
    reducers: {
        setResidents: (state, action) => {
            state.items = action.payload;
        },
        addResident: (state, action) => {
            state.items.push(action.payload);
        },
        updateResident: (state, action) => {
            const index = state.items.findIndex(r => r.id === action.payload.id || r._id === action.payload._id);
            if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
        },
        deleteResident: (state, action) => {
            state.items = state.items.filter(r => r.id !== action.payload && r._id !== action.payload);
        }
    }
});

export const { setResidents, addResident, updateResident, deleteResident } = residentsSlice.actions;
export default residentsSlice.reducer;
