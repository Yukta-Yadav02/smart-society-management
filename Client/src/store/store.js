import { createSlice, configureStore } from '@reduxjs/toolkit';

/* 
 * ============================================================================
 * REDUX TOOLKIT - COMPLETE STATE MANAGEMENT
 * ============================================================================
 * 
 * Yeh file mein poora Redux setup hai:
 * - 8 feature slices (complaints, maintenance, requests, etc.)
 * - Initial sample data har slice mein
 * - All CRUD operations (Create, Read, Update, Delete)
 * - Centralized store configuration
 * 
 * Benefits:
 * ✅ Single file - easy to manage
 * ✅ No prop drilling
 * ✅ Global state accessible from any component
 * ✅ Predictable state updates
 * ============================================================================
 */

/* ==================== 1. COMPLAINTS SLICE ==================== */
/**
 * Purpose: Society complaints management
 * Features: Add, Update, Delete complaints
 * Used in: Admin Complaints Page, Resident Complaints Page
 */
const complaintsSlice = createSlice({
  name: 'complaints',
  initialState: {
    items: [
      { 
        id: 1, 
        title: 'Water Leakage in Basement', 
        description: 'Continuous water leakage near pillar B-12',
        resident: 'Rajesh Kumar', 
        flat: 'A-301', 
        status: 'Pending', 
        date: '2024-01-28',
        category: 'Maintenance'
      },
      { 
        id: 2, 
        title: 'Broken Street Light', 
        description: 'Street light near gate 2 not working',
        resident: 'Priya Sharma', 
        flat: 'B-205', 
        status: 'Resolved', 
        date: '2024-01-25',
        category: 'Electrical'
      },
      { 
        id: 3, 
        title: 'Garbage Collection Issue', 
        description: 'Garbage not collected for 3 days',
        resident: 'Amit Patel', 
        flat: 'C-102', 
        status: 'Pending', 
        date: '2024-01-29',
        category: 'Cleanliness'
      }
    ]
  },
  reducers: {
    // Add new complaint
    addComplaint: (state, action) => { 
      state.items.unshift(action.payload); 
    },
    // Update existing complaint (status change, etc.)
    updateComplaint: (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
    },
    // Delete complaint
    deleteComplaint: (state, action) => { 
      state.items = state.items.filter(c => c.id !== action.payload); 
    }
  }
});

/* ==================== 2. MAINTENANCE SLICE ==================== */
/**
 * Purpose: Monthly maintenance billing and tracking
 * Features: Generate bills, Update payment status
 * Used in: Admin Maintenance Page, Resident Payment Page
 */
const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: {
    records: [
      { 
        id: 1, 
        flat: 'A-101', 
        wing: 'A', 
        amount: 2500, 
        period: 'January 2024', 
        status: 'Paid', 
        type: 'Common',
        description: 'Monthly Maintenance'
      },
      { 
        id: 2, 
        flat: 'A-102', 
        wing: 'A', 
        amount: 2500, 
        period: 'January 2024', 
        status: 'Unpaid', 
        type: 'Common',
        description: 'Monthly Maintenance'
      },
      { 
        id: 3, 
        flat: 'B-201', 
        wing: 'B', 
        amount: 1500, 
        period: 'January 2024', 
        status: 'Unpaid', 
        type: 'Special',
        description: 'Plumbing Repair'
      }
    ]
  },
  reducers: {
    // Add new maintenance record (common or special)
    addMaintenance: (state, action) => { 
      state.records.unshift(action.payload); 
    },
    // Update maintenance record (payment status, etc.)
    updateMaintenance: (state, action) => {
      const index = state.records.findIndex(r => r.id === action.payload.id);
      if (index !== -1) state.records[index] = { ...state.records[index], ...action.payload };
    }
  }
});

/* ==================== 3. REQUESTS SLICE ==================== */
/**
 * Purpose: Resident access requests management
 * Features: Approve/Reject new resident requests
 * Used in: Admin Manage Requests Page
 */
const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    items: [
      { 
        id: 1, 
        name: 'Rajesh Kumar', 
        email: 'rajesh@email.com', 
        phone: '+91 98765 43210', 
        wing: 'A', 
        flat: '301', 
        block: 'Tower 1',
        type: 'Owner', 
        status: 'Approved', 
        message: 'I am the owner of this flat',
        date: '2024-01-15' 
      },
      { 
        id: 2, 
        name: 'Priya Sharma', 
        email: 'priya@email.com', 
        phone: '+91 98765 43211', 
        wing: 'B', 
        flat: '205', 
        block: 'Tower 2',
        type: 'Tenant', 
        status: 'Pending', 
        message: 'I am a tenant, moved in last week',
        date: '2024-01-28' 
      }
    ]
  },
  reducers: {
    // Add new access request
    addRequest: (state, action) => { 
      state.items.unshift(action.payload); 
    },
    // Update request (approve/reject)
    updateRequest: (state, action) => {
      const index = state.items.findIndex(r => r.id === action.payload.id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
    }
  }
});

/* ==================== 4. FLATS SLICE ==================== */
/**
 * Purpose: Flat/Apartment management
 * Features: Add flats, Assign residents, Track occupancy
 * Used in: Admin Manage Flats Page
 */
const flatsSlice = createSlice({
  name: 'flats',
  initialState: {
    items: [
      { 
        id: 1, 
        flatNumber: '101', 
        wing: 'A', 
        block: 'Tower 1',
        currentResident: 'Rajesh Kumar', 
        residentType: 'Owner',
        status: 'Occupied' 
      },
      { 
        id: 2, 
        flatNumber: '102', 
        wing: 'A', 
        block: 'Tower 1',
        currentResident: null, 
        residentType: null,
        status: 'Vacant' 
      },
      { 
        id: 3, 
        flatNumber: '201', 
        wing: 'B', 
        block: 'Tower 2',
        currentResident: 'Priya Sharma', 
        residentType: 'Tenant',
        status: 'Occupied' 
      }
    ]
  },
  reducers: {
    // Add new flat
    addFlat: (state, action) => { 
      state.items.push(action.payload); 
    },
    // Update flat details
    updateFlat: (state, action) => {
      const index = state.items.findIndex(f => f.id === action.payload.id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
    }
  }
});

/* ==================== 5. NOTICES SLICE ==================== */
/**
 * Purpose: Society announcements and notices
 * Features: Create, Delete, Pin notices
 * Used in: Admin Notices Page, Resident Dashboard
 */
const noticesSlice = createSlice({
  name: 'notices',
  initialState: {
    items: [
      { 
        id: 1, 
        title: 'Holi Celebration 2024', 
        description: 'Join us for grand Holi celebration on March 25th at the society ground. Snacks and colors will be provided.', 
        date: '2024-01-20', 
        pinned: true 
      },
      { 
        id: 2, 
        title: 'Water Supply Maintenance', 
        description: 'Water supply will be interrupted on Feb 5th from 10 AM to 2 PM for tank cleaning.', 
        date: '2024-01-25', 
        pinned: false 
      },
      { 
        id: 3, 
        title: 'Society Meeting', 
        description: 'Monthly society meeting scheduled for Feb 10th at 6 PM in the clubhouse.', 
        date: '2024-01-28', 
        pinned: false 
      }
    ]
  },
  reducers: {
    // Add new notice
    addNotice: (state, action) => { 
      state.items.unshift(action.payload); 
    },
    // Delete notice
    deleteNotice: (state, action) => { 
      state.items = state.items.filter(n => n.id !== action.payload); 
    }
  }
});

/* ==================== 6. RESIDENTS SLICE ==================== */
/**
 * Purpose: Resident information management
 * Features: Add, Update, Delete resident data
 * Used in: Admin Manage Residents Page
 */
const residentsSlice = createSlice({
  name: 'residents',
  initialState: {
    items: [
      { 
        id: 1, 
        name: 'Rajesh Kumar', 
        email: 'rajesh@email.com', 
        phone: '+91 98765 43210', 
        wing: 'A', 
        flat: '301', 
        type: 'Owner', 
        status: 'Active',
        joinedDate: '2023-06-15'
      },
      { 
        id: 2, 
        name: 'Priya Sharma', 
        email: 'priya@email.com', 
        phone: '+91 98765 43211', 
        wing: 'B', 
        flat: '205', 
        type: 'Tenant', 
        status: 'Active',
        joinedDate: '2024-01-10'
      },
      { 
        id: 3, 
        name: 'Amit Patel', 
        email: 'amit@email.com', 
        phone: '+91 98765 43212', 
        wing: 'C', 
        flat: '102', 
        type: 'Owner', 
        status: 'Active',
        joinedDate: '2022-03-20'
      }
    ]
  },
  reducers: {
    // Add new resident
    addResident: (state, action) => { 
      state.items.push(action.payload); 
    },
    // Update resident information
    updateResident: (state, action) => {
      const index = state.items.findIndex(r => r.id === action.payload.id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
    },
    // Delete resident
    deleteResident: (state, action) => { 
      state.items = state.items.filter(r => r.id !== action.payload); 
    }
  }
});

/* ==================== 7. DASHBOARD SLICE ==================== */
/**
 * Purpose: Dashboard statistics and metrics
 * Features: Track society stats, recent activities
 * Used in: Admin Dashboard, Analytics
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalResidents: 156,
      totalFlats: 200,
      occupancyRate: 78,
      pendingRequests: 5,
      activeComplaints: 8,
      pendingMaintenance: 12,
      collectedAmount: 385000,
      pendingAmount: 115000
    },
    recentRequests: [
      { id: 1, name: 'Neha Gupta', flat: 'C-405', status: 'Pending', date: '2024-01-29' },
      { id: 2, name: 'Vikram Singh', flat: 'A-201', status: 'Pending', date: '2024-01-28' }
    ]
  },
  reducers: {
    // Update dashboard statistics
    updateStats: (state, action) => { 
      state.stats = { ...state.stats, ...action.payload }; 
    }
  }
});

/* ==================== 8. PROFILE SLICE ==================== */
/**
 * Purpose: Society profile and settings
 * Features: Update society information
 * Used in: Admin Profile Page
 */
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: {
      societyName: 'Gokuldham Society',
      regNumber: 'SOC/2020/12345',
      address: 'Powder Gali, Goregaon East, Mumbai - 400063, Maharashtra',
      email: 'admin@gokuldham.com',
      phone: '+91 22 1234 5678',
      secretaryName: 'Atmaram Tukaram Bhide',
      secretaryEmail: 'secretary@gokuldham.com',
      secretaryPhone: '+91 98765 12345',
      storageUsedGb: 12.5,
      storageTotalGb: 50
    }
  },
  reducers: {
    // Update society profile
    updateProfile: (state, action) => { 
      state.data = { ...state.data, ...action.payload }; 
    }
  }
});

/* ==================== EXPORT ALL ACTIONS ==================== */
/**
 * Export all action creators for use in components
 * Usage: import { addComplaint, updateMaintenance } from '../store/store'
 */
export const { addComplaint, updateComplaint, deleteComplaint } = complaintsSlice.actions;
export const { addMaintenance, updateMaintenance } = maintenanceSlice.actions;
export const { addRequest, updateRequest } = requestsSlice.actions;
export const { addFlat, updateFlat } = flatsSlice.actions;
export const { addNotice, deleteNotice } = noticesSlice.actions;
export const { addResident, updateResident, deleteResident } = residentsSlice.actions;
export const { updateStats } = dashboardSlice.actions;
export const { updateProfile } = profileSlice.actions;

/* ==================== CREATE REDUX STORE ==================== */
/**
 * Configure and create the Redux store with all slices
 * This store is imported in main.jsx and wrapped around the app
 */
export const store = configureStore({
  reducer: {
    complaints: complaintsSlice.reducer,
    maintenance: maintenanceSlice.reducer,
    requests: requestsSlice.reducer,
    flats: flatsSlice.reducer,
    notices: noticesSlice.reducer,
    residents: residentsSlice.reducer,
    dashboard: dashboardSlice.reducer,
    profile: profileSlice.reducer,
  },
});

/* 
 * ============================================================================
 * HOW TO USE IN COMPONENTS:
 * ============================================================================
 * 
 * 1. READ DATA (useSelector):
 *    const complaints = useSelector(state => state.complaints.items);
 * 
 * 2. WRITE DATA (useDispatch):
 *    const dispatch = useDispatch();
 *    dispatch(addComplaint({ id: 1, title: 'Test' }));
 * 
 * 3. IMPORT:
 *    import { useSelector, useDispatch } from 'react-redux';
 *    import { addComplaint } from '../store/store';
 * 
 * ============================================================================
 */
