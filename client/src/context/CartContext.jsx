import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    // Load user-specific cart when user changes
    useEffect(() => {
        if (user) {
            const cartKey = `cartItems_${user._id}`;
            const storedCart = localStorage.getItem(cartKey);
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            } else {
                setCartItems([]);
            }

            const storedAddress = localStorage.getItem(`shippingAddress_${user._id}`);
            if (storedAddress) {
                setShippingAddress(JSON.parse(storedAddress));
            } else {
                setShippingAddress({});
            }

            const storedPayment = localStorage.getItem(`paymentMethod_${user._id}`);
            if (storedPayment) {
                setPaymentMethod(JSON.parse(storedPayment));
            }
        } else {
            // Clear cart state on logout
            setCartItems([]);
            setShippingAddress({});
            setPaymentMethod('PayPal');
        }
    }, [user]);

    const addToCart = async (id, qty, priceOverride = null) => {
        const { data } = await axios.get(`/api/products/${id}`);
        const newItem = {
            product: data._id,
            name: data.name,
            image: data.image,
            price: priceOverride !== null ? priceOverride : data.price,
            countInStock: data.countInStock,
            qty,
        };

        const existItem = cartItems.find((x) => x.product === newItem.product);

        let updatedItems;
        if (existItem) {
            updatedItems = cartItems.map((x) =>
                x.product === existItem.product ? newItem : x
            );
        } else {
            updatedItems = [...cartItems, newItem];
        }

        setCartItems(updatedItems);
        if (user) {
            localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(updatedItems));
        }

        // Log Activity
        try {
            await axios.post('/api/activity', {
                action: 'ADD_TO_CART',
                details: `Added ${newItem.name} to cart`,
                payload: { productId: id, qty, name: newItem.name }
            });
        } catch (error) {
            console.error('Failed to log cart activity');
        }
    };

    const removeFromCart = async (id) => {
        const itemToRemove = cartItems.find(x => x.product === id);
        const updatedItems = cartItems.filter((x) => x.product !== id);
        setCartItems(updatedItems);
        if (user) {
            localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(updatedItems));
        }

        // Log Activity
        try {
            await axios.post('/api/activity', {
                action: 'REMOVE_FROM_CART',
                details: `Removed ${itemToRemove?.name || id} from cart`,
                payload: { productId: id }
            });
        } catch (error) {
            console.error('Failed to log cart activity');
        }
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
        if (user) {
            localStorage.setItem(`shippingAddress_${user._id}`, JSON.stringify(data));
        }
    };

    const savePaymentMethod = (data) => {
        setPaymentMethod(data);
        if (user) {
            localStorage.setItem(`paymentMethod_${user._id}`, JSON.stringify(data));
        }
    };

    const clearCart = () => {
        setCartItems([]);
        if (user) {
            localStorage.removeItem(`cartItems_${user._id}`);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            shippingAddress,
            paymentMethod,
            addToCart,
            removeFromCart,
            saveShippingAddress,
            savePaymentMethod,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
