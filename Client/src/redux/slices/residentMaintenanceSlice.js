import { createSlice } from '@reduxjs/toolkit';

const residentMaintenanceSlice = createSlice({
    name: 'residentMaintenance',
    initialState: {
        records: [
            { id: 1, flat: '101', wing: 'A', type: 'Common Monthly', amount: 2500, period: 'March 2024', status: 'Paid', description: 'Monthly society charges', dueDate: '2024-03-31' },
            { id: 2, flat: '101', wing: 'A', type: 'Special', amount: 500, period: 'March 2024', status: 'Unpaid', description: 'Pipe leakage repair', dueDate: '2024-04-15' },
            { id: 3, flat: '101', wing: 'A', type: 'Common Monthly', amount: 2500, period: 'April 2024', status: 'Unpaid', description: 'Monthly society charges', dueDate: '2024-04-30' },
        ],
        paymentHistory: [
            { id: 1, amount: 2500, date: '2024-03-15', method: 'UPI', transactionId: 'TXN123456789' },
            { id: 2, amount: 2500, date: '2024-02-15', method: 'Bank Transfer', transactionId: 'TXN987654321' },
        ]
    },
    reducers: {
        makePayment: (state, action) => {
            const { recordId, paymentData } = action.payload;
            const record = state.records.find(r => r.id === recordId);
            if (record) {
                record.status = 'Paid';
                state.paymentHistory.unshift({
                    id: Date.now(),
                    amount: record.amount,
                    date: new Date().toISOString().split('T')[0],
                    ...paymentData
                });
            }
        }
    }
});

export const { makePayment } = residentMaintenanceSlice.actions;
export default residentMaintenanceSlice.reducer;