import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { CheckCircle, Truck, Package, CreditCard } from 'lucide-react';

const Order = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, user]);

    const deliverHandler = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/orders/${order._id}/deliver`, {}, config);

            // Refresh order logic locally for quick feedback
            setOrder({ ...order, isDelivered: true, deliveredAt: new Date().toISOString() });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return <div className="text-red-500 text-center py-10 font-bold bg-red-50 rounded-xl mx-4">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order #{order._id?.substring(0, 8)}...</h1>
                <p className="text-gray-500 mt-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-8">
                    {/* Status Box */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4 text-indigo-600">
                                <Truck className="w-6 h-6" />
                                <h2 className="text-xl font-bold text-gray-900">Shipping</h2>
                            </div>
                            <div className="pl-9 space-y-2 mb-4">
                                <p className="text-gray-800 font-semibold">{order.user?.name}</p>
                                <p className="text-gray-600 text-sm">{order.user?.email}</p>
                                <p className="text-gray-600 text-sm">
                                    {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                                </p>
                            </div>
                            <div className="pl-9">
                                {order.isDelivered ? (
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg text-sm font-bold border border-green-100">
                                        <CheckCircle className="w-4 h-4" /> Delivered on {new Date(order.deliveredAt).toLocaleString()}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-4 py-2 rounded-lg text-sm font-bold border border-amber-100">
                                        <Package className="w-4 h-4" /> Processing for Delivery
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="hidden md:block w-px bg-gray-100"></div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4 text-indigo-600">
                                <CreditCard className="w-6 h-6" />
                                <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                            </div>
                            <div className="pl-9 space-y-2 mb-4">
                                <p className="text-gray-800 font-semibold">Method: {order.paymentMethod}</p>
                            </div>
                            <div className="pl-9">
                                {order.isPaid ? (
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg text-sm font-bold border border-green-100">
                                        <CheckCircle className="w-4 h-4" /> Paid on {new Date(order.paidAt).toLocaleDateString()}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-2 rounded-lg text-sm font-bold border border-red-100">
                                        Not Paid (Demo / COD)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Items Delivered</h2>
                        <div className="space-y-4">
                            {order.orderItems?.map((item, index) => (
                                <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1" />
                                        <Link to={`/products/${item.product}`} className="font-semibold text-gray-800 hover:text-indigo-600 transition">
                                            {item.name}
                                        </Link>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-500 text-sm">{item.qty} x ₹{item.price?.toLocaleString('en-IN')}</div>
                                        <div className="font-bold text-gray-900">₹{(item.qty * item.price)?.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-indigo-50 p-8 sticky top-24">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-900">₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="font-semibold text-gray-900">₹{order.shippingPrice?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 pb-4 border-b border-gray-100">
                                <span>Tax</span>
                                <span className="font-semibold text-gray-900">₹{order.taxPrice?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-extrabold text-gray-900 pt-2">
                                <span>Total</span>
                                <span className="text-indigo-600">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {user?.role === 'admin' && !order.isDelivered && (
                            <button
                                onClick={deliverHandler}
                                className="w-full mt-4 flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
                            >
                                Mark As Delivered (Admin)
                            </button>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <Link to="/products" className="text-indigo-600 font-semibold hover:underline flex items-center justify-center gap-1">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
