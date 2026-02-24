import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    TrendingUp,
    Activity as ActivityIcon,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    ShoppingCart
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const DashboardAdmin = () => {
    const [stats, setStats] = useState({
        orders: 0,
        products: 0,
        users: 0,
        activities: 0,
        totalSales: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };

                const [ordersRes, productsRes, usersRes, activitiesRes] = await Promise.all([
                    axios.get('/api/orders', config),
                    axios.get('/api/products', config),
                    axios.get('/api/auth/users', config),
                    axios.get('/api/activity', config)
                ]);

                const totalSales = ordersRes.data.reduce((acc, order) => acc + order.totalPrice, 0);

                setStats({
                    orders: ordersRes.data.length,
                    products: productsRes.data.length,
                    users: usersRes.data.length,
                    activities: activitiesRes.data.length,
                    totalSales: totalSales
                });

                setRecentActivities(activitiesRes.data.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep_blue"></div>
        </div>
    );

    const statCards = [
        { title: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%', isUp: true },
        { title: 'New Orders', value: stats.orders, icon: ShoppingCart, color: 'text-deep_blue', bg: 'bg-deep_blue/10', trend: '+5.4%', isUp: true },
        { title: 'Total Users', value: stats.users, icon: Users, color: 'text-sky_blue', bg: 'bg-sky_blue/10', trend: '+2.1%', isUp: true },
        { title: 'Live Events', value: stats.activities, icon: ActivityIcon, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Live', isUp: true },
    ];

    return (
        <div className="max-w-[1400px] mx-auto p-8 text-dark_charcoal">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="bg-deep_blue p-4 rounded-2xl shadow-xl shadow-deep_blue/20 rotate-3">
                        <LayoutDashboard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-dark_charcoal tracking-tight">Admin Dashboard</h1>
                        <p className="text-text_secondary font-medium">Overview of your store's performance</p>
                    </div>
                </div>
                <div className="flex gap-3 text-sm font-bold">
                    <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">Export Data</button>
                    <Link to="/admin/monitor" className="px-6 py-2.5 bg-sky_blue text-white rounded-xl hover:bg-sky_blue_dark shadow-lg shadow-sky_blue/20 transition-all active:scale-95 flex items-center gap-2">
                        <ActivityIcon className="w-4 h-4" />
                        Live Monitor
                    </Link>
                    <button className="px-6 py-2.5 bg-deep_blue text-white rounded-xl hover:bg-deep_blue_dark shadow-lg shadow-deep_blue/20 transition-all active:scale-95">Reports</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 p-2 ${card.bg} rounded-bl-2xl opacity-50 group-hover:opacity-100 transition-opacity`}>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                        <h3 className="text-3xl font-black text-dark_charcoal mb-4 tracking-tight">{card.value}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`flex items-center text-xs font-black ${card.isUp ? 'text-emerald-600' : 'text-red-600'} bg-gray-50 px-2 py-1 rounded-lg`}>
                                {card.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {card.trend}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">vs yesterday</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <h2 className="text-xl font-black text-dark_charcoal flex items-center gap-3">
                            <ActivityIcon className="w-6 h-6 text-deep_blue" />
                            Recent Activities
                        </h2>
                        <Link to="/admin/activities" className="text-deep_blue text-sm font-bold hover:underline bg-deep_blue/5 px-4 py-1.5 rounded-full transition-all tracking-tight">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentActivities.map((activity) => (
                            <div key={activity._id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-deep_blue/10 flex items-center justify-center text-deep_blue font-black shadow-sm group-hover:scale-110 transition-transform">
                                        {activity.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-dark_charcoal">{activity.userName}</p>
                                        <p className="text-xs text-text_secondary font-medium">{activity.details}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter bg-gray-100 text-gray-600 block mb-1">
                                        {activity.action}
                                    </span>
                                    <p className="text-[10px] text-gray-400 font-bold">{new Date(activity.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-deep_blue rounded-3xl p-8 text-white shadow-2xl shadow-deep_blue/30 overflow-hidden relative group">
                        <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700 font-black text-9xl">Inv</div>
                        <h3 className="text-2xl font-black mb-4 tracking-tight">Manage Stock</h3>
                        <p className="text-white/70 mb-6 text-sm font-bold leading-relaxed">Add or edit products and track stock levels in real-time.</p>
                        <Link to="/admin/products" className="inline-block px-6 py-3 bg-white text-deep_blue rounded-2xl font-black shadow-lg hover:shadow-white/20 transition-all transform hover:-rotate-2 active:scale-95">
                            Go to Products
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-black mb-4 text-dark_charcoal tracking-tight">Admin Resources</h3>
                        <div className="space-y-3">
                            {[
                                { title: 'Order Shipments', icon: Package, link: '/admin/orders', color: 'text-emerald-500' },
                                { title: 'Customer Base', icon: Users, link: '/admin/users', color: 'text-sky_blue' },
                                { title: 'Analytics', icon: TrendingUp, link: '#', color: 'text-orange-500' },
                            ].map((item, idx) => (
                                <Link key={idx} to={item.link} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-deep_blue/20 hover:bg-deep_blue/5 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                                            <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                                        </div>
                                        <span className="text-sm font-bold text-dark_charcoal">{item.title}</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-deep_blue transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
