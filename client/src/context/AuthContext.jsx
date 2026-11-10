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

    const sendOtp = async (email, mobileNumber, type = 'register') => {
        try {
            const { data } = await axios.post('/api/auth/send-otp', { email, mobileNumber, type });
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send OTP'
            };
        }
    };

    const verifyOtp = async (email, otp, type = 'register') => {
        try {
            const { data } = await axios.post('/api/auth/verify-otp', { email, otp, type });
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'OTP verification failed'
            };
        }
    };

    const registerWithOtp = async (name, email, password, mobileNumber, otp) => {
        try {
            const { data } = await axios.post('/api/auth/register-with-otp', {
                name,
                email,
                password,
                mobileNumber,
                otp,
            });
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

    const loginWithOtp = async (email, otp) => {
        try {
            const { data } = await axios.post('/api/auth/login-otp', { email, otp });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, user: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'OTP Login failed'
            };
        }
    };

    const googleAuth = async (email, name, googleId) => {
        try {
            const { data } = await axios.post('/api/auth/google', { email, name, googleId });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, user: data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Google sign-in failed'
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
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                sendOtp,
                verifyOtp,
                registerWithOtp,
                loginWithOtp,
                googleAuth,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
