import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext.jsx';
import { ClipboardList, ExternalLink, CheckCircle, Clock, RotateCcw } from 'lucide-react';

const OrderListAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/orders', config);
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const updateReturnStatus = async (orderId, status) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/orders/${orderId}/return-status`, { status }, config);
            fetchOrders();
            addToast(`Return ${status} Successfully!`, 'success');
        } catch (error) {
            console.error(error);
            addToast('Failed to update return status', 'error');
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        } else {
            fetchOrders();
        }
    }, [user, navigate]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep_blue"></div>
        </div>
    );

    return (
        <div className="text-dark_charcoal">
            <div className="flex items-center gap-4 mb-10 text-dark_charcoal">
                <div>
                    <h1 className="text-3xl font-black text-dark_charcoal tracking-tight">Order Management</h1>
                    <p className="text-text_secondary font-medium">Review and process customer orders</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Return Status</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono bg-gray-50">#{order._id.substring(0, 8)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{order.user && order.user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {order.isPaid ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Not Paid
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {order.isDelivered ? (
                                            <div className="flex items-center text-green-700 font-bold">
                                                <CheckCircle className="w-4 h-4 mr-1.5" /> Delivered
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-sky_blue font-bold">
                                                <Clock className="w-4 h-4 mr-1.5" /> Pending
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {order.isReturned ? (
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${order.returnStatus === 'Approved' ? 'bg-green-100 text-green-800' : order.returnStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                                    {order.returnStatus}
                                                </span>
                                                {order.returnStatus === 'Pending' && (
                                                    <div className="flex gap-1 mt-1">
                                                        <button
                                                            onClick={() => updateReturnStatus(order._id, 'Approved')}
                                                            className="text-[10px] bg-emerald-500 text-white px-2 py-1 rounded hover:bg-emerald-600 font-bold"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => updateReturnStatus(order._id, 'Rejected')}
                                                            className="text-[10px] bg-rose-500 text-white px-2 py-1 rounded hover:bg-rose-600 font-bold"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-300 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/order/${order._id}`} className="inline-flex items-center text-white bg-deep_blue px-4 py-2 rounded-xl hover:bg-deep_blue_dark transition-all font-black shadow-lg shadow-deep_blue/20 active:scale-95 text-xs uppercase tracking-tighter">
                                            View Details <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default OrderListAdmin;
