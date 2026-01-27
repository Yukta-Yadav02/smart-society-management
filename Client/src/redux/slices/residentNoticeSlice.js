import { createSlice } from '@reduxjs/toolkit';

const residentNoticeSlice = createSlice({
    name: 'residentNotices',
    initialState: {
        notices: [
            { id: 1, title: 'Holi Celebration 2024', description: 'Join us for Holi celebration on March 25th at the society garden. Colors and refreshments will be provided.', date: '2024-03-20', pinned: true, category: 'Event' },
            { id: 2, title: 'Water Supply Maintenance', description: 'Water supply will be interrupted on March 22nd from 10 AM to 2 PM for maintenance work.', date: '2024-03-19', pinned: false, category: 'Maintenance' },
            { id: 3, title: 'Monthly Society Meeting', description: 'Monthly society meeting scheduled for March 30th at 7 PM in the community hall.', date: '2024-03-18', pinned: false, category: 'Meeting' },
        ],
        readNotices: [1, 3] // IDs of notices that have been read
    },
    reducers: {
        markAsRead: (state, action) => {
            const noticeId = action.payload;
            if (!state.readNotices.includes(noticeId)) {
                state.readNotices.push(noticeId);
            }
        },
        markAllAsRead: (state) => {
            state.readNotices = state.notices.map(n => n.id);
        }
    }
});

export const { markAsRead, markAllAsRead } = residentNoticeSlice.actions;
export default residentNoticeSlice.reducer;