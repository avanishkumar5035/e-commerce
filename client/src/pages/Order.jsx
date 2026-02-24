import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ChevronRight, Package, Truck, Printer, X, RotateCcw, AlertTriangle } from 'lucide-react';
import TrackingModal from '../components/TrackingModal.jsx';

const Order = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        if (!user) return;
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
    }, [id, user, navigate]); // Added navigate to dependency array

    const payHandler = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/orders/${order._id}/pay`, {}, config);
            setOrder(data);
            addToast('Payment Successful!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Payment Failed. Please try again.', 'error');
        }
    };

    const deliverHandler = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/orders/${order._id}/deliver`, {}, config);
            setOrder({ ...order, isDelivered: true, deliveredAt: new Date().toISOString() });
        } catch (error) {
            console.error(error);
        }
    };

    const returnHandler = async (reason) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/orders/${order._id}/return`, { reason }, config);
            setOrder(data);
            addToast('Return Requested Successfully!', 'success');
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || 'Return Request Failed', 'error');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-deep_blue"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 font-medium">
                {error}
            </div>
            <Link to="/products" className="text-blue-600 hover:underline mt-4 block">Back to products</Link>
        </div>
    );

    return (
        <div className="bg-bg_soft_gray min-h-screen pb-12">
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-6">
                    <Link to="/your-account" className="hover:underline">Your Account</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/your-orders" className="hover:underline">Your Orders</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-sky_blue font-black">Order Details</span>
                </div>

                <div className="flex justify-between items-end mb-4 font-sans">
                    <h1 className="text-3xl font-normal">Order Details</h1>
                </div>

                {/* Order Top Bar */}
                <div className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-t-lg p-4 flex flex-wrap justify-between items-center text-sm text-gray-600 gap-4">
                    <div className="flex gap-10">
                        <div>
                            <p className="uppercase text-[10px] font-bold">Order Placed</p>
                            <p>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div>
                            <p className="uppercase text-[10px] font-bold">Order Total</p>
                            <p className="font-bold text-gray-900">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className="uppercase text-[10px] font-bold">Ship to</p>
                            <p className="text-sky_blue hover:underline cursor-pointer font-black">{user?.name}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="uppercase text-[10px] font-bold">Order # {order._id}</p>
                        <div className="flex gap-2 justify-end mt-1 text-blue-600 text-xs no-print">
                            <button onClick={handlePrint} className="hover:underline">View Invoice</button>
                        </div>
                    </div>
                </div>

                {/* Order Status & Info Boxes */}
                <div className="border-x border-[#d5d9d9] p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Shipping Address */}
                        <div className="flex-1">
                            <h3 className="font-bold text-sm mb-2">Shipping Address</h3>
                            <div className="text-xs text-gray-800 space-y-1">
                                <p className="font-bold">{user?.name}</p>
                                <p>{order.shippingAddress?.address}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                                <p>{order.shippingAddress?.country}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex-1">
                            <h3 className="font-bold text-sm mb-2">Payment Method</h3>
                            <div className="text-xs text-gray-800">
                                <p>{order.paymentMethod}</p>
                                <p className={`mt-2 font-bold ${order.isPaid ? 'text-green-700' : 'text-red-700'}`}>
                                    {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Payment Pending'}
                                </p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="flex-1 flex flex-col items-end">
                            <h3 className="font-bold text-sm mb-2 w-full text-left md:text-right">Order Summary</h3>
                            <div className="text-xs text-gray-800 space-y-1 w-full max-w-[200px]">
                                <div className="flex justify-between">
                                    <span>Item(s) Subtotal:</span>
                                    <span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>₹{order.shippingPrice?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200 text-sm italic">
                                    <span>Grand Total:</span>
                                    <span className="text-sky_blue">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                                </div>
                                {!order.isPaid && (
                                    <button
                                        onClick={payHandler}
                                        className="w-full mt-4 bg-deep_blue text-white py-2 rounded-lg font-black shadow-lg shadow-deep_blue/20 hover:bg-deep_blue_dark transition"
                                    >
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Return Status Section */}
                    {order.isReturned && (
                        <div className="mt-8 p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-start gap-4">
                            <div className="bg-orange-500 text-white p-3 rounded-2xl">
                                <RotateCcw className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-orange-800">Return {order.returnStatus}</h3>
                                <p className="text-orange-700 font-medium text-sm mt-1">
                                    Reason: <span className="font-bold">{order.returnReason}</span>
                                </p>
                                <p className="text-orange-600 text-xs mt-2 italic">Requested on {new Date(order.returnedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Items Section */}
                <div className="border border-[#d5d9d9] rounded-b-lg p-6 bg-white overflow-hidden mt-[-1px]">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className={`text-xl font-black ${order.isDelivered ? 'text-emerald-700' : 'text-sky_blue'}`}>
                            {order.isDelivered ? 'Delivered' : 'Arriving Soon'}
                        </h2>
                        {order.isDelivered && <span className="text-sm text-gray-600 font-normal ml-2">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>}
                    </div>

                    <div className="space-y-6">
                        {order.orderItems?.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-6">
                                <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center p-2 border border-gray-200 rounded">
                                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                                </div>
                                <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-1">
                                        <Link to={`/products/${item.product}`} className="text-sm text-sky_blue font-bold hover:underline line-clamp-2">
                                            {item.name}
                                        </Link>
                                        <p className="text-xs text-gray-600 italic">Sold by: ShopSphere Direct</p>
                                        <p className="text-xs font-bold text-sky_blue">₹{item.price?.toLocaleString('en-IN')}</p>
                                        <div className="flex gap-4 pt-4">
                                            <button className="bg-sky_blue px-4 py-1 rounded-full text-xs font-bold border border-[#a88734] hover:bg-[#f3a847]">Buy it again</button>
                                            <button className="bg-bg_soft_gray px-4 py-1 rounded-full text-xs font-bold border border-[#d5d9d9] hover:bg-gray-200 text-deep_blue">View your item</button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full md:w-32 no-print">
                                        <button
                                            onClick={() => setIsTrackingOpen(true)}
                                            className="w-full bg-white px-4 py-1 rounded-lg text-xs font-medium border border-[#d5d9d9] hover:bg-gray-50 flex items-center justify-center gap-1"
                                        >
                                            <Truck className="w-3 h-3" /> Track package
                                        </button>
                                        <button
                                            onClick={handlePrint}
                                            className="w-full bg-white px-4 py-1 rounded-lg text-xs font-medium border border-[#d5d9d9] hover:bg-gray-50 flex items-center justify-center gap-1"
                                        >
                                            <Printer className="w-3 h-3" /> Get invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {user?.role === 'admin' && !order.isDelivered && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={deliverHandler}
                                className="bg-sky_blue px-6 py-2 rounded-lg text-sm font-bold border border-[#a88734] hover:bg-[#f3a847] text-deep_blue"
                            >
                                Mark As Delivered (Admin Only)
                            </button>
                        </div>
                    )}

                    {order.isDelivered && !order.isReturned && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    const reason = prompt('Please enter a reason for the return:');
                                    if (reason) returnHandler(reason);
                                }}
                                className="bg-white px-6 py-2 rounded-lg text-sm font-bold border border-gray-200 hover:bg-gray-50 text-dark_charcoal flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Return Items
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <TrackingModal
                isOpen={isTrackingOpen}
                onClose={() => setIsTrackingOpen(false)}
                order={order}
            />

            <style>{`
                @media print {
                    .no-print, 
                    header, 
                    footer, 
                    button, 
                    .breadcrumbs,
                    .invoice-hide {
                        display: none !important;
                    }
                    body {
                        background-color: white !important;
                    }
                    .max-w-5xl {
                        max-width: 100% !important;
                        padding: 0 !important;
                    }
                    .bg-bg_soft_gray {
                        background-color: white !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Order;
