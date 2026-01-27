import { createSlice } from '@reduxjs/toolkit';

const residentComplaintSlice = createSlice({
    name: 'residentComplaints',
    initialState: {
        complaints: [
            { id: 1, title: 'Water Leakage in Bathroom', description: 'There is continuous water leakage from the bathroom ceiling', status: 'Pending', date: '2024-03-20', category: 'Plumbing' },
            { id: 2, title: 'Lift Not Working', description: 'The main lift has been out of order for 3 days', status: 'In Progress', date: '2024-03-18', category: 'Maintenance' },
            { id: 3, title: 'Parking Issue', description: 'Unauthorized vehicles are parking in my designated spot', status: 'Resolved', date: '2024-03-15', category: 'Security' },
        ]
    },
    reducers: {
        addComplaint: (state, action) => {
            state.complaints.unshift({
                id: Date.now(),
                ...action.payload,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            });
        },
        updateComplaintStatus: (state, action) => {
            const complaint = state.complaints.find(c => c.id === action.payload.id);
            if (complaint) {
                complaint.status = action.payload.status;
            }
        }
    }
});

export const { addComplaint, updateComplaintStatus } = residentComplaintSlice.actions;
export default residentComplaintSlice.reducer;