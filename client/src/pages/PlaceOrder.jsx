import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { MapPin, CreditCard, ShoppingBag } from 'lucide-react';

const PlaceOrder = () => {
    const { cartItems, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 5000 ? 0 : 500;
    const taxPrice = addDecimals(Number((0.18 * itemsPrice).toFixed(2)));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        } else if (!paymentMethod) {
            navigate('/payment');
        }
    }, [shippingAddress, paymentMethod, navigate]);

    const placeOrderHandler = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                config
            );

            clearCart();
            navigate(`/order/${data._id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to place order. Please try again.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-center mb-12">
                <div className="flex flex-row items-center w-full max-w-md">
                    <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold text-sm shadow-md">✓</div>
                    <div className="flex-1 border-b-2 border-indigo-600 mx-2"></div>
                    <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold text-sm shadow-md">✓</div>
                    <div className="flex-1 border-b-2 border-indigo-600 mx-2"></div>
                    <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold text-sm shadow-md ring-4 ring-indigo-50">3</div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Shipping Box */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-indigo-600">
                            <MapPin className="w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed pl-9">
                            <strong>Address:</strong><br />
                            {shippingAddress.address},<br />
                            {shippingAddress.city}, {shippingAddress.postalCode},<br />
                            {shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment Box */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-indigo-600">
                            <CreditCard className="w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                        </div>
                        <p className="text-gray-600 font-medium pl-9 text-lg">
                            {paymentMethod}
                        </p>
                    </div>

                    {/* Order Items Box */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 text-indigo-600">
                            <ShoppingBag className="w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                        </div>

                        {cartItems.length === 0 ? (
                            <p className="pl-9 text-gray-500">Your cart is empty.</p>
                        ) : (
                            <div className="space-y-4 pl-9">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1" />
                                            <Link to={`/products/${item.product}`} className="font-semibold text-gray-800 hover:text-indigo-600 transition">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-500 text-sm">{item.qty} x ₹{item.price.toLocaleString('en-IN')}</div>
                                            <div className="font-bold text-gray-900">₹{(item.qty * item.price).toLocaleString('en-IN')}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-indigo-50 p-8 sticky top-24">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>Items Subtotal</span>
                                <span className="font-semibold text-gray-900">₹{Number(itemsPrice).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="font-semibold text-gray-900">₹{Number(shippingPrice).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 pb-4 border-b border-gray-100">
                                <span>Tax (18% GST)</span>
                                <span className="font-semibold text-gray-900">₹{Number(taxPrice).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-extrabold text-gray-900 pt-2">
                                <span>Total</span>
                                <span className="text-indigo-600">₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button
                            onClick={placeOrderHandler}
                            className="w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg shadow-indigo-200 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 transition transform"
                            disabled={cartItems.length === 0}
                        >
                            Place Order Complete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
