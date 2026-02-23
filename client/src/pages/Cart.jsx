import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext.jsx';
import { Trash2, ShoppingBag, CheckCircle } from 'lucide-react';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping');
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-bg_light min-h-screen">
                <div className="p-6 mb-6">
                    <ShoppingBag className="w-24 h-24 text-gray-200" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your ShopSphere Cart is empty</h2>
                <p className="text-sm text-gray-600 mb-8">Your shopping cart lives to serve. Give it purpose — fill it with electronics, clothes, and more.</p>
                <div className="flex gap-4">
                    <Link to="/products" className="bg-accent_gold px-8 py-2 rounded-lg font-bold shadow-sm border border-[#a88734] hover:bg-[#f3a847] transition">
                        Shop latest offers
                    </Link>
                </div>
                <div className="mt-8 flex gap-4 text-xs text-blue-600">
                    <button className="hover:underline">Sign in to your account</button>
                    <button className="hover:underline">Sign up now</button>
                </div>
            </div>
        );
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <div className="bg-bg_light min-h-screen py-6 px-4">
            <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6">

                {/* Left Section: Cart Items */}
                <div className="flex-1 bg-white p-6 shadow-sm">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-2 mb-4">
                        <h1 className="text-3xl font-normal">Shopping Cart</h1>
                        <p className="text-sm text-gray-600 hidden sm:block">Price</p>
                    </div>

                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product} className="flex gap-6 py-4 border-b border-gray-200 last:border-0">
                                {/* Image */}
                                <div className="w-44 h-44 flex-shrink-0 flex items-center justify-center bg-gray-50 p-4">
                                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between">
                                        <Link to={`/products/${item.product}`} className="text-lg font-medium text-gray-900 hover:text-accent_teal hover:underline line-clamp-2">
                                            {item.name}
                                        </Link>
                                        <div className="text-lg font-bold text-gray-900">
                                            ₹{item.price.toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-700 font-bold mt-1">In stock</p>
                                    <p className="text-gray-600 text-xs mt-1 italic font-medium">Eligible for FREE Shipping by ShopSphere</p>

                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="flex items-center bg-[#f0f2f2] border border-[#d5d9d9] rounded-lg shadow-sm">
                                            <span className="text-xs px-2 text-gray-600">Qty:</span>
                                            <select
                                                className="bg-transparent text-sm py-1.5 pr-8 pl-1 outline-none cursor-pointer"
                                                value={item.qty}
                                                onChange={(e) => addToCart(item.product, Number(e.target.value))}
                                            >
                                                {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            onClick={() => removeFromCart(item.product)}
                                            className="text-xs text-accent_teal hover:underline font-bold"
                                        >
                                            Delete
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button className="text-xs text-accent_teal hover:underline font-bold">Save for later</button>
                                        <span className="text-gray-300">|</span>
                                        <button className="text-xs text-accent_teal hover:underline font-bold">See more like this</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Subtotal bottom */}
                    <div className="text-right py-4">
                        <p className="text-lg">
                            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}): <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                        </p>
                    </div>
                </div>

                {/* Right Section: Subtotal & Ad */}
                <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-2 text-xs text-green-700 mb-4">
                            <CheckCircle className="w-4 h-4 mt-0.5" />
                            <div>
                                <p>Your order is eligible for FREE Delivery.</p>
                                <p className="text-gray-600 mt-1">Select this option at checkout. Details</p>
                            </div>
                        </div>
                        <p className="text-lg mb-4">
                            Subtotal ({totalItems} items): <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                        </p>
                        <button
                            onClick={checkoutHandler}
                            className="w-full bg-accent_gold py-2 px-4 rounded-lg shadow-sm border border-[#a88734] hover:bg-[#f3a847] text-sm font-bold transition"
                        >
                            Proceed to Buy
                        </button>
                    </div>

                    <div className="bg-white p-4 shadow-sm">
                        <h3 className="text-sm font-bold mb-2">EMI available</h3>
                        <p className="text-xs text-gray-600">No Cost EMI available on select cards. <span className="text-blue-600 hover:underline cursor-pointer">Learn more</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
