import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setWishlist([]);
            return;
        }
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/auth/wishlist', config);
            setWishlist(data);
        } catch (error) {
            console.error('Fetch Wishlist Error:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const toggleWishlist = async (productId) => {
        if (!user) {
            addToast('Please login to manage wishlist', 'info');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/auth/wishlist/${productId}`, {}, config);

            // Refresh to get full objects for the wishlist page
            await fetchWishlist();

            addToast(data.message, 'success');
        } catch (error) {
            console.error('Toggle Wishlist Error:', error);
            addToast(error.response?.data?.message || 'Failed to update wishlist', 'error');
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => (item._id || item) === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            toggleWishlist,
            isInWishlist,
            fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export default WishlistContext;
