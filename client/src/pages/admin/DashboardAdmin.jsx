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
    Package,
    ShoppingCart,
    MessageSquare,
    Star,
    DollarSign,
    Zap,
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const DashboardAdmin = () => {
    const [stats, setStats] = useState({
        orders: 0,
        products: 0,
        users: 0,
        activities: 0,
        totalSales: 0,
        totalReviews: 0,
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };

                const [ordersRes, productsRes, usersRes, activitiesRes, reviewsRes] = await Promise.all([
                    axios.get('/api/orders', config),
                    axios.get('/api/products', config),
                    axios.get('/api/auth/users', config),
                    axios.get('/api/activity', config),
                    axios.get('/api/products/reviews/all', config),
                ]);

                const totalSales = ordersRes.data.reduce((acc, order) => acc + order.totalPrice, 0);
                const products = productsRes.data.products || productsRes.data;

                setStats({
                    orders: ordersRes.data.length,
                    products: products.length,
                    users: usersRes.data.length,
                    activities: activitiesRes.data.length,
                    totalSales: totalSales,
                    totalReviews: reviewsRes.data.length,
                });

                setRecentActivities(activitiesRes.data.slice(0, 5));
                setRecentReviews(reviewsRes.data.slice(0, 4));
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
            <div
                className="w-12 h-12 rounded-full animate-spin"
                style={{
                    border: '3px solid rgba(14,165,233,0.1)',
                    borderTop: '3px solid #0ea5e9',
                }}
            />
        </div>
    );

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalSales.toLocaleString()}`,
            icon: DollarSign,
            gradient: 'linear-gradient(135deg, #10b981, #059669)',
            glow: 'rgba(16,185,129,0.3)',
            trend: '+12.5%',
            link: '/admin/orders',
        },
        {
            title: 'Total Orders',
            value: stats.orders,
            icon: ShoppingCart,
            gradient: 'linear-gradient(135deg, #0ea5e9, #1e3a8a)',
            glow: 'rgba(14,165,233,0.3)',
            trend: '+5.4%',
            link: '/admin/orders',
        },
        {
            title: 'Total Users',
            value: stats.users,
            icon: Users,
            gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            glow: 'rgba(139,92,246,0.3)',
            trend: '+2.1%',
            link: '/admin/users',
        },
        {
            title: 'User Reviews',
            value: stats.totalReviews,
            icon: MessageSquare,
            gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
            glow: 'rgba(236,72,153,0.3)',
            trend: 'View All',
            link: '/admin/comments',
        },
        {
            title: 'Products',
            value: stats.products,
            icon: Package,
            gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
            glow: 'rgba(245,158,11,0.3)',
            trend: 'In Stock',
            link: '/admin/products',
        },
        {
            title: 'Live Events',
            value: stats.activities,
            icon: Zap,
            gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
            glow: 'rgba(249,115,22,0.3)',
            trend: 'Live',
            link: '/admin/activities',
        },
    ];

    const actionBadgeColor = (action) => {
        switch (action) {
            case 'PURCHASE': return { bg: 'rgba(16,185,129,0.15)', color: '#10b981' };
            case 'PAYMENT': return { bg: 'rgba(14,165,233,0.15)', color: '#0ea5e9' };
            case 'RETURN_REQUEST': return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' };
            default: return { bg: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(232,99,10,0.1)', color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#E8630A' };
        }
    };

    return (
        <div className={`transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
                            style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}
                        >
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System Overview</h1>
                    </div>
                    <p className={`font-medium ml-13 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Real-time performance metrics</p>
                </div>
                <div className="flex gap-3 text-sm font-bold">
                    <Link
                        to="/admin/monitor"
                        className="px-6 py-2.5 rounded-xl flex items-center gap-2 text-white transition-all shadow-md"
                        style={{
                            background: 'linear-gradient(135deg, #E8630A, #F59E0B)',
                            boxShadow: isDarkMode ? '0 4px 20px rgba(245,158,11,0.3)' : '0 4px 15px rgba(232,99,10,0.2)',
                        }}
                    >
                        <ActivityIcon className="w-4 h-4" />
                        Live Monitor
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {statCards.map((card, idx) => (
                    <Link
                        key={idx}
                        to={card.link}
                        className="p-6 rounded-3xl group relative overflow-hidden transition-all block"
                        style={{
                            background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                            border: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(232,99,10,0.1)',
                            boxShadow: isDarkMode ? 'none' : '0 4px 15px rgba(232,99,10,0.05)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.07)' : '#fff';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = `0 8px 30px ${card.glow}`;
                            e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(232,99,10,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = isDarkMode ? 'none' : '0 4px 15px rgba(232,99,10,0.05)';
                            e.currentTarget.style.borderColor = isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(232,99,10,0.1)';
                        }}
                    >
                        {/* Icon */}
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                            style={{
                                background: card.gradient,
                                boxShadow: `0 4px 15px ${card.glow}`,
                            }}
                        >
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.title}</p>
                        <h3 className={`text-3xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</h3>
                        <div className="flex items-center justify-between">
                            <span
                                className="text-xs font-black px-2.5 py-1 rounded-lg"
                                style={{ background: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(232,99,10,0.08)', color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#E8630A' }}
                            >
                                {card.trend}
                            </span>
                            <ArrowUpRight
                                className={`w-4 h-4 transition-all transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${isDarkMode ? 'text-gray-500 group-hover:text-white' : 'text-gray-400 group-hover:text-orange-600'}`}
                            />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Recent Activity */}
                <div
                    className="lg:col-span-3 rounded-3xl overflow-hidden"
                    style={{
                        background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                        border: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(232,99,10,0.1)',
                        boxShadow: isDarkMode ? 'none' : '0 4px 15px rgba(232,99,10,0.05)',
                    }}
                >
                    <div
                        className="p-6 flex items-center justify-between"
                        style={{ borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(232,99,10,0.1)' }}
                    >
                        <h2 className={`text-lg font-black flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.2)' }}
                            >
                                <ActivityIcon className="w-4 h-4 text-orange-400" />
                            </div>
                            Recent Activities
                        </h2>
                        <Link
                            to="/admin/activities"
                            className="text-xs font-black px-4 py-1.5 rounded-full transition-all"
                            style={{
                                background: 'rgba(14,165,233,0.1)',
                                border: '1px solid rgba(14,165,233,0.2)',
                                color: '#0ea5e9',
                            }}
                        >
                            View All
                        </Link>
                    </div>
                    <div className="divide-y" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(232,99,10,0.08)' }}>
                        {recentActivities.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 font-bold">No recent activity</div>
                        ) : (
                            recentActivities.map((activity) => {
                                const badge = actionBadgeColor(activity.action);
                                return (
                                    <div
                                        key={activity._id}
                                        className="p-5 flex items-center justify-between transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white shadow-sm"
                                                style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}
                                            >
                                                {activity.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activity.userName}</p>
                                                <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.details}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter block mb-1"
                                                style={{ background: badge.bg, color: badge.color }}
                                            >
                                                {activity.action}
                                            </span>
                                            <p className="text-[10px] text-gray-600 font-bold">
                                                {new Date(activity.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Recent Reviews Preview */}
                    <div
                        className="rounded-3xl overflow-hidden"
                        style={{
                            background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                            border: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(232,99,10,0.1)',
                            boxShadow: isDarkMode ? 'none' : '0 4px 15px rgba(232,99,10,0.05)',
                        }}
                    >
                        <div
                            className="p-5 flex items-center justify-between"
                            style={{ borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(232,99,10,0.1)' }}
                        >
                            <h3 className={`text-sm font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                <div
                                    className="w-7 h-7 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(236,72,153,0.15)' }}
                                >
                                    <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                                </div>
                                Latest Reviews
                            </h3>
                            <Link
                                to="/admin/comments"
                                className="text-xs font-black px-3 py-1 rounded-full"
                                style={{
                                    background: 'rgba(236,72,153,0.1)',
                                    color: '#ec4899',
                                    border: '1px solid rgba(236,72,153,0.2)',
                                }}
                            >
                                See All
                            </Link>
                        </div>
                        <div className="p-4 space-y-3">
                            {recentReviews.length === 0 ? (
                                <p className="text-xs text-gray-500 font-bold text-center py-4">No reviews yet</p>
                            ) : (
                                recentReviews.map((rev) => (
                                    <div
                                        key={rev._id}
                                        className="p-3 rounded-2xl"
                                        style={{ background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(232,99,10,0.03)' }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{rev.reviewerName}</span>
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className={`text-[11px] font-bold line-clamp-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>"{rev.comment}"</p>
                                        <p className={`text-[10px] mt-1 truncate font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{rev.productName}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div
                        className="p-6 rounded-3xl"
                        style={{
                            background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                            border: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(232,99,10,0.1)',
                            boxShadow: isDarkMode ? 'none' : '0 4px 15px rgba(232,99,10,0.05)',
                        }}
                    >
                        <h3 className={`text-sm font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Access</h3>
                        <div className="space-y-2">
                            {[
                                { title: 'Manage Products', icon: Package, link: '/admin/products', color: '#f59e0b' },
                                { title: 'Order Shipments', icon: ShoppingCart, link: '/admin/orders', color: '#10b981' },
                                { title: 'Customer Base', icon: Users, link: '/admin/users', color: '#8b5cf6' },
                                { title: 'User Comments', icon: MessageSquare, link: '/admin/comments', color: '#ec4899' },
                            ].map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.link}
                                    className="flex items-center justify-between p-3.5 rounded-2xl transition-all group"
                                    style={{ border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(232,99,10,0.1)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(232,99,10,0.03)';
                                        e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(232,99,10,0.15)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(232,99,10,0.1)';
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="p-2 rounded-xl transition-transform group-hover:scale-110"
                                            style={{ background: `${item.color}15` }}
                                        >
                                            <item.icon className="w-4 h-4" style={{ color: item.color }} />
                                        </div>
                                        <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>{item.title}</span>
                                    </div>
                                    <ArrowUpRight className={`w-4 h-4 transition-all ${isDarkMode ? 'text-gray-600 group-hover:text-white' : 'text-gray-400 group-hover:text-orange-600'}`} />
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
