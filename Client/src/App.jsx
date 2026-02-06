import { Provider } from 'react-redux'
import { store } from './store/store'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <AppRoutes />
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{
                        top: 20,
                        right: 20,
                        zIndex: 9999,
                    }}
                    toastOptions={{
                        duration: 4000,
                        style: {
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '14px',
                            maxWidth: '400px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#ffffff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#ffffff',
                            },
                        },
                    }}
                />
            </AuthProvider>
        </Provider>
    )
}

export default App
