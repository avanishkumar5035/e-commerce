import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
        const storedAddress = localStorage.getItem('shippingAddress');
        if (storedAddress) {
            setShippingAddress(JSON.parse(storedAddress));
        }
        const storedPayment = localStorage.getItem('paymentMethod');
        if (storedPayment) {
            setPaymentMethod(JSON.parse(storedPayment));
        }
    }, []);

    const addToCart = async (id, qty) => {
        const { data } = await axios.get(`/api/products/${id}`);
        const newItem = {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
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
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    };

    const removeFromCart = (id) => {
        const updatedItems = cartItems.filter((x) => x.product !== id);
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
        localStorage.setItem('shippingAddress', JSON.stringify(data));
    };

    const savePaymentMethod = (data) => {
        setPaymentMethod(data);
        localStorage.setItem('paymentMethod', JSON.stringify(data));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
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
