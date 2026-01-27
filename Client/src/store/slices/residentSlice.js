import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../../services/api';

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'resident/fetchDashboardData',
  async () => {
    const response = await dashboardAPI.getDashboardData();
    return response.data;
  }
);

export const fetchComplaints = createAsyncThunk(
  'resident/fetchComplaints',
  async () => {
    const response = await dashboardAPI.getComplaints();
    return response.data;
  }
);

export const fetchMaintenance = createAsyncThunk(
  'resident/fetchMaintenance',
  async () => {
    const response = await dashboardAPI.getMaintenance();
    return response.data;
  }
);

export const fetchNotices = createAsyncThunk(
  'resident/fetchNotices',
  async () => {
    const response = await dashboardAPI.getNotices();
    return response.data;
  }
);

const initialState = {
  notices: [],
  complaints: [],
  maintenance: [],
  loading: false,
  error: null
};

const residentSlice = createSlice({
  name: 'resident',
  initialState,
  reducers: {
    setNotices: (state, action) => {
      state.notices = action.payload;
    },
    addNotice: (state, action) => {
      state.notices.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload.notices || [];
        state.complaints = action.payload.complaints || [];
        state.maintenance = action.payload.maintenance || [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.complaints = action.payload;
      })
      .addCase(fetchMaintenance.fulfilled, (state, action) => {
        state.maintenance = action.payload;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.notices = action.payload;
      });
  }
});

export const { setNotices, addNotice } = residentSlice.actions;
export default residentSlice.reducer;