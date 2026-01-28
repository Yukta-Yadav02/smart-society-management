import { createSlice } from '@reduxjs/toolkit';

const residentNoticeSlice = createSlice({
    name: 'residentNotices',
    initialState: {
        notices: [
            { id: 1, title: 'Holi Celebration 2024', content: 'Join us for Holi celebration on March 25th at the society garden. Colors and refreshments will be provided.', createdAt: '2024-03-20', author: 'Society Committee', priority: 'high', category: 'Event' },
            { id: 2, title: 'Water Supply Maintenance', content: 'Water supply will be interrupted on March 22nd from 10 AM to 2 PM for maintenance work.', createdAt: '2024-03-19', author: 'Maintenance Team', priority: 'medium', category: 'Maintenance' },
            { id: 3, title: 'Monthly Society Meeting', content: 'Monthly society meeting scheduled for March 30th at 7 PM in the community hall.', createdAt: '2024-03-18', author: 'Secretary', priority: 'low', category: 'Meeting' },
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