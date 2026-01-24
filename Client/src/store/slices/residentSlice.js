import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notices: [
    {
      id: 1,
      title: "Water Supply Maintenance",
      content: "Water supply will be temporarily suspended on Sunday from 10 AM to 2 PM for maintenance work.",
      priority: "high",
      author: "Society Management",
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "Monthly Society Meeting",
      content: "Monthly society meeting scheduled for next Saturday at 6 PM in the community hall.",
      priority: "medium",
      author: "Secretary",
      createdAt: "2024-01-14T15:30:00Z"
    },
    {
      id: 3,
      title: "Parking Guidelines",
      content: "Please ensure vehicles are parked only in designated areas. Violators will be fined.",
      priority: "low",
      author: "Security Team",
      createdAt: "2024-01-13T09:00:00Z"
    }
  ]
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
  }
});

export const { setNotices, addNotice } = residentSlice.actions;
export default residentSlice.reducer;