import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping');
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-indigo-50 p-6 rounded-full mb-6">
                    <ShoppingBag className="w-16 h-16 text-indigo-300" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">Looks like you haven't added anything to your cart yet. Let's get you back to the shop to find something great!</p>
                <Link to="/products" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 transition transform flex items-center gap-2">
                    Browse Products <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Cart Items */}
                <div className="flex-1 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.product} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
                            <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                                <Link to={`/products/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition">
                                    {item.name}
                                </Link>
                                <div className="text-gray-500 text-sm mt-1">₹{item.price.toLocaleString('en-IN')} each</div>
                            </div>
                            <div className="flex items-center gap-6">
                                <select
                                    className="block p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-semibold"
                                    value={item.qty}
                                    onChange={(e) => addToCart(item.product, Number(e.target.value))}
                                >
                                    {[...Array(item.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-lg font-bold text-gray-900 min-w-[100px] text-right">
                                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                </div>
                                <button
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    onClick={() => removeFromCart(item.product)}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-indigo-50 p-8 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping estimate</span>
                                <span className="font-semibold text-green-600">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between text-gray-600 pb-4 border-b border-gray-100">
                                <span>Tax estimate</span>
                                <span className="font-semibold text-gray-900">₹{(subtotal * 0.18).toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-400">(18% GST)</span></span>
                            </div>
                            <div className="flex justify-between text-2xl font-extrabold text-gray-900 pt-2">
                                <span>Total</span>
                                <span className="text-indigo-600">₹{Math.round(subtotal * 1.18).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                        <button
                            onClick={checkoutHandler}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 transition transform"
                        >
                            Proceed to Checkout
                        </button>
                        <div className="mt-4 text-center">
                            <Link to="/products" className="text-indigo-600 font-semibold text-sm hover:underline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
