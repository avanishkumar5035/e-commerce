import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { ShoppingBag, ChevronRight, Package, Truck, CheckCircle, Clock, RotateCcw } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const getStatusInfo = (order) => {
        if (order.isReturned) {
            return {
                label: `Return: ${order.returnStatus}`,
                color: order.returnStatus === 'Completed' ? 'text-emerald-600' : 'text-orange-600',
                bg: order.returnStatus === 'Completed' ? 'bg-emerald-50' : 'bg-orange-50',
                icon: RotateCcw
            };
        }
        if (order.isDelivered) {
            return { label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle };
        }
        if (order.isPaid) {
            return { label: 'Processing', color: 'text-sky_blue', bg: 'bg-sky_blue/10', icon: Truck };
        }
        return { label: 'Payment Pending', color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock };
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-deep_blue"></div>
        </div>
    );

    return (
        <div className="bg-bg_soft_gray dark:bg-slate-900 min-h-screen pb-20 font-sans">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-8 ml-1">
                    <Link to="/" className="hover:text-deep_blue dark:hover:text-sky_blue transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-extrabold text-dark_charcoal dark:text-white">Your Orders</span>
                </div>

                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-dark_charcoal dark:text-white tracking-tight mb-2">Your Orders</h1>
                        <p className="text-text_secondary dark:text-gray-400 font-medium">Track, manage and return your orders</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-20 text-center border border-gray-100 dark:border-slate-700 shadow-xl dark:shadow-none">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-black text-dark_charcoal dark:text-white mb-4">No orders yet</h2>
                        <p className="text-text_secondary dark:text-gray-400 mb-8 max-w-sm mx-auto">You haven't placed any orders yet. Start shopping to fill this space!</p>
                        <Link to="/products" className="inline-block px-10 py-4 bg-deep_blue text-white rounded-2xl font-black hover:bg-deep_blue_dark transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-deep_blue/20">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = getStatusInfo(order);
                            return (
                                <div key={order._id} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-xl dark:shadow-none overflow-hidden group hover:border-deep_blue/20 dark:hover:border-sky_blue/50 transition-all">
                                    {/* Order Header */}
                                    <div className="bg-gray-50/50 dark:bg-slate-800/50 px-8 py-6 border-b border-gray-100 dark:border-slate-700 flex flex-wrap justify-between items-center gap-6">
                                        <div className="flex gap-10">
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-widest mb-1">Order Placed</p>
                                                <p className="font-bold text-dark_charcoal dark:text-white">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-widest mb-1">Total</p>
                                                <p className="font-black text-deep_blue dark:text-sky_blue">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div className="hidden md:block">
                                                <p className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-widest mb-1">Ship to</p>
                                                <p className="font-bold text-dark_charcoal dark:text-white">{user.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-widest mb-1">Order ID</p>
                                            <p className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500">{order._id}</p>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-8">
                                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                                            <div className="flex-1 space-y-6">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.color} text-xs font-black uppercase tracking-wider`}>
                                                    <status.icon className="w-4 h-4" />
                                                    {status.label}
                                                </div>

                                                <div className="space-y-4">
                                                    {order.orderItems.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4">
                                                            <div className="w-16 h-16 rounded-xl border border-gray-100 dark:border-slate-700 p-2 flex-shrink-0 bg-white dark:bg-gray-50">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-dark_charcoal dark:text-white truncate">{item.name}</p>
                                                                <p className="text-xs text-text_secondary dark:text-gray-400">Qty: {item.qty} | ₹{item.price.toLocaleString('en-IN')}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 w-full lg:w-48 justify-center">
                                                <Link
                                                    to={`/order/${order._id}`}
                                                    className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-deep_blue/10 dark:border-sky_blue/30 text-deep_blue dark:text-sky_blue rounded-2xl font-black text-xs text-center hover:bg-deep_blue dark:hover:bg-sky_blue hover:text-white hover:border-deep_blue dark:hover:border-sky_blue transition-all"
                                                >
                                                    View Order Details
                                                </Link>
                                                {order.isDelivered && !order.isReturned && (
                                                    <button className="w-full py-4 bg-gray-50 dark:bg-slate-700 text-dark_charcoal dark:text-white rounded-2xl font-black text-xs hover:bg-gray-100 dark:hover:bg-slate-600 transition-all">
                                                        Track Delivery
                                                    </button>
                                                )}
                                                {order.isPaid && (
                                                    <button className="w-full py-4 bg-gray-50 dark:bg-slate-700 text-dark_charcoal dark:text-white rounded-2xl font-black text-xs hover:bg-gray-100 dark:hover:bg-slate-600 transition-all">
                                                        Buy it again
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
