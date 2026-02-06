// Authentication utility functions
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        // Basic JWT structure validation
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        // Check if token is expired (basic check)
        const payload = JSON.parse(atob(parts[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem('token');
            return false;
        }
        
        return true;
    } catch (error) {
        localStorage.removeItem('token');
        return false;
    }
};

export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || null;
    } catch (error) {
        return null;
    }
};

export const isAdmin = () => {
    return getUserRole() === 'admin';
};

export const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return isAuthenticated() ? token : null;
};

export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};