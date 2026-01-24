import { configureStore } from '@reduxjs/toolkit';
import residentReducer from './slices/residentSlice';

export const store = configureStore({
  reducer: {
    resident: residentReducer,
  },
});