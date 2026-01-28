import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import RootLayout from './layouts/RootLayout'
import ProtectedLayout from './layouts/ProtectedLayout'
import Layout from './components/layout/Layout'
import ResidentLayout from './components/layout/ResidentLayout'

// Common Pages
import Home from './pages/common/Home'
import Login from './pages/common/Login'
import SignUp from './pages/common/SignUp'
import RequestAccess from './pages/common/RequestAccess'
import Dashboard from './pages/common/Dashboard'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageFlats from './pages/admin/ManageFlats'
import ManageResidents from './pages/admin/ManageResidents'
import ManageRequests from './pages/admin/ManageRequests'
import AdminComplaints from './pages/admin/Complaints'
import AdminMaintenance from './pages/admin/Maintenance'
import AdminNotices from './pages/admin/Notices'
import AdminProfile from './pages/admin/Profile'

// Resident Pages
import ResidentDashboard from './pages/resident/ResidentDashboard'
import ResidentComplaints from './pages/resident/Complaints'
import ResidentMaintenance from './pages/resident/Maintenance'
import ResidentNotices from './pages/resident/Notices'
import ResidentProfile from './pages/resident/Profile'

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <SignUp /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/request-access', element: <RequestAccess /> },
        ],
    },
    {
        path: '/admin',
        element: <Layout />,
        children: [
            { path: 'dashboard', element: <AdminDashboard /> },
            { path: 'flats', element: <ManageFlats /> },
            { path: 'residents', element: <ManageResidents /> },
            { path: 'requests', element: <ManageRequests /> },
            { path: 'complaints', element: <AdminComplaints /> },
            { path: 'maintenance', element: <AdminMaintenance /> },
            { path: 'notices', element: <AdminNotices /> },
            { path: 'profile', element: <AdminProfile /> },
        ],
    },
    {
        path: '/resident',
        element: <ResidentLayout />,
        children: [
            { path: 'dashboard', element: <ResidentDashboard /> },
            { path: 'complaints', element: <ResidentComplaints /> },
            { path: 'maintenance', element: <ResidentMaintenance /> },
            { path: 'notices', element: <ResidentNotices /> },
            { path: 'profile', element: <ResidentProfile /> },
        ],
    },
]);

function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    )
}

export default App
