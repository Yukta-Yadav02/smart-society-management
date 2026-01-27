import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Change this to your actual backend URL (e.g., http://localhost:5000/api)
const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('gokuldham_token');
            if (token) {
                try {
                    // This endpoint should return the current user based on the token
                    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Auth verification failed:', error);
                    localStorage.removeItem('gokuldham_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            const { user, token } = response.data;

            setUser(user);
            localStorage.setItem('gokuldham_token', token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    const signup = async (userData) => {
        try {
            // Mapping frontend fullName to backend name
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
                name: userData.fullName,
                email: userData.email,
                password: userData.password
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed. Please try again.'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gokuldham_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
