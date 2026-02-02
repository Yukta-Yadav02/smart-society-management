import { Provider } from 'react-redux'
import { store } from './store/store'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Provider>
    )
}

export default App
