import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext.jsx';
import AuthContext from '../context/AuthContext.jsx';
import axios from 'axios';
import { useToast } from '../context/ToastContext.jsx';

const PlaceOrder = () => {
    const { cartItems, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { addToast } = useToast();

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
            addToast('Failed to place order. Please try again.', 'error');
        }
    };

    return (
        <div className="bg-bg_soft_gray min-h-screen">
            {/* Simple Checkout Header */}
            <div className="bg-bg_soft_gray border-b border-[#d5d9d9] py-4 px-6 mb-6">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tighter text-deep_blue">
                        Shop<span className="text-sky_blue">Sphere</span>
                    </Link>
                    <h1 className="text-2xl font-normal text-gray-800">Checkout</h1>
                    <div className="w-8"></div> {/* Spacer */}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 flex flex-col lg:flex-row gap-6 pb-12">
                {/* Steps Section */}
                <div className="flex-1 space-y-4">
                    {/* Shipping */}
                    <div className="flex border-b border-gray-200 pb-4">
                        <span className="text-lg font-bold mr-4">1</span>
                        <div className="flex-1 flex justify-between">
                            <div>
                                <h3 className="font-bold text-lg">Shipping address</h3>
                                <p className="text-sm mt-1">
                                    {user?.name}<br />
                                    {shippingAddress.address}<br />
                                    {shippingAddress.city}, {shippingAddress.postalCode}<br />
                                    {shippingAddress.country}
                                </p>
                            </div>
                            <Link to="/shipping" className="text-xs text-sky_blue hover:underline h-fit font-bold">Change</Link>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="flex border-b border-gray-200 pb-4">
                        <span className="text-lg font-bold mr-4">2</span>
                        <div className="flex-1 flex justify-between">
                            <div>
                                <h3 className="font-bold text-lg">Payment method</h3>
                                <p className="text-sm mt-1">{paymentMethod}</p>
                            </div>
                            <Link to="/payment" className="text-xs text-sky_blue hover:underline h-fit font-bold">Change</Link>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="flex">
                        <span className="text-lg font-bold mr-4">3</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-4">Review items and shipping</h3>
                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                <p className="text-green-700 text-sm font-bold mb-4">Guaranteed delivery: Tomorrow</p>
                                <div className="space-y-6">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="w-20 h-20 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                                                <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                                                <p className="text-xs text-gray-600 mt-1">Sold by: Cloudtail India</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm font-bold text-sky_blue">₹{item.price.toLocaleString('en-IN')}</span>
                                                    <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="border border-gray-300 rounded-lg p-4 sticky top-6 bg-white shadow-sm">
                        <button
                            onClick={placeOrderHandler}
                            className="w-full bg-sky_blue py-2 px-4 rounded-lg shadow-sm border border-[#a88734] hover:bg-[#f3a847] text-sm font-bold transition mb-4"
                            disabled={cartItems.length === 0}
                        >
                            Place your order
                        </button>
                        <p className="text-[10px] text-gray-600 text-center mb-4 leading-tight">
                            By placing your order, you agree to ShopSphere's <span className="text-sky_blue hover:underline cursor-pointer font-bold">privacy notice</span> and <span className="text-sky_blue hover:underline cursor-pointer font-bold">conditions of use</span>.
                        </p>

                        <hr className="mb-4" />

                        <h3 className="font-bold text-base mb-3">Order Summary</h3>
                        <div className="text-xs space-y-1.5 mb-4">
                            <div className="flex justify-between">
                                <span>Items:</span>
                                <span>₹{Number(itemsPrice).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span>₹{Number(shippingPrice).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (18% GST):</span>
                                <span>₹{Number(taxPrice).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <hr className="mb-4" />

                        <div className="flex justify-between text-lg font-bold text-sky_blue mb-4">
                            <span>Order Total:</span>
                            <span>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                        </div>

                        <div className="bg-bg_soft_gray -mx-4 -mb-4 p-4 rounded-b-lg border-t border-gray-300">
                            <Link to="/how-to-pay" className="text-xs text-sky_blue hover:underline font-bold">How are delivery costs calculated?</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
