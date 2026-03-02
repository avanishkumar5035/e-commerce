import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <CartProvider>
                <ToastProvider>
                    <WishlistProvider>
                        <ThemeProvider>
                            <App />
                        </ThemeProvider>
                    </WishlistProvider>
                </ToastProvider>
            </CartProvider>
        </AuthProvider>
    </React.StrictMode>,
)
