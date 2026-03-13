import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, user: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, mobileNumber) => {
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password, mobileNumber });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, user: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const updateProfile = async (userData) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('/api/auth/profile', userData, config);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, user: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const logout = async () => {
        const currentUser = user;
        // Synchronously clear user
        setUser(null);
        localStorage.removeItem('user');

        try {
            await axios.post('/api/activity', {
                action: 'LOGOUT',
                details: `User ${currentUser?.name || 'Unknown'} logged out`,
                payload: { userId: currentUser?._id }
            });
        } catch (error) {
            console.error('Failed to log logout activity');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
