import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import ProtectedLayout from './layouts/ProtectedLayout'
import Home from './pages/common/Home'
import Login from './pages/common/Login'
import SignUp from './pages/common/SignUp'
import RequestAccess from './pages/common/RequestAccess'
import Dashboard from './pages/common/Dashboard'

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
]);

function App() {
    return <RouterProvider router={router} />
}

export default App
