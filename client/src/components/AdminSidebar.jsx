import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Activity,
    Monitor,
    MessageSquare,
    ChevronRight,
    ShoppingBag,
    ArrowLeft,
} from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import LogoutButton from './LogoutButton.jsx';
import { useTheme } from '../context/ThemeContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const { isDarkMode } = useTheme();

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', color: '#0ea5e9' },
        { title: 'Products', icon: Package, path: '/admin/products', color: '#10b981' },
        { title: 'Orders', icon: ShoppingCart, path: '/admin/orders', color: '#f59e0b' },
        { title: 'Customers', icon: Users, path: '/admin/users', color: '#8b5cf6' },
        { title: 'User Comments', icon: MessageSquare, path: '/admin/comments', color: '#ec4899' },
        { title: 'Activity Logs', icon: Activity, path: '/admin/activities', color: '#f97316' },
        { title: 'Live Monitor', icon: Monitor, path: '/admin/monitor', color: '#06b6d4' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className="w-72 flex flex-col h-screen sticky top-0 transition-all duration-300"
            style={{
                background: isDarkMode ? 'rgba(20, 9, 0, 0.95)' : 'rgba(255, 248, 240, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(232,99,10,0.1)',
            }}
        >
            {/* Sidebar Header */}
            <div
                className="p-7 flex items-center gap-3 transition-colors duration-300"
                style={{ borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(232,99,10,0.1)' }}
            >
                <div
                    className="p-2.5 rounded-xl rotate-3 flex-shrink-0"
                    style={{
                        background: 'linear-gradient(135deg, #E8630A, #F59E0B)',
                        boxShadow: '0 0 20px rgba(245,158,11,0.3)',
                    }}
                >
                    <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tight" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>
                        Admin<span style={{ color: '#F59E0B' }}>Portal</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(28,28,30,0.4)' }}>
                        Marketo Pro
                    </p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <p
                    className="text-[9px] font-black uppercase tracking-widest px-4 mb-3"
                    style={{ color: isDarkMode ? 'rgba(255,255,255,0.25)' : 'rgba(28,28,30,0.4)' }}
                >
                    Main Navigation
                </p>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center justify-between p-3.5 rounded-2xl transition-all group relative overflow-hidden"
                        style={
                            isActive(item.path)
                                ? {
                                    background: isDarkMode ? `linear-gradient(135deg, rgba(232,99,10,0.4), rgba(245,158,11,0.1))` : `linear-gradient(135deg, rgba(232,99,10,0.1), rgba(245,158,11,0.05))`,
                                    border: isDarkMode ? '1px solid rgba(232,99,10,0.3)' : '1px solid rgba(232,99,10,0.2)',
                                    boxShadow: '0 4px 20px rgba(232,99,10,0.15)',
                                }
                                : {
                                    background: 'transparent',
                                    border: '1px solid transparent',
                                }
                        }
                    >
                        {isActive(item.path) && (
                            <div
                                className="absolute inset-0 opacity-5"
                                style={{ background: `radial-gradient(circle at 30% 50%, ${item.color}, transparent)` }}
                            />
                        )}
                        <div className="flex items-center gap-3.5 relative z-10">
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                                style={
                                    isActive(item.path)
                                        ? { background: item.color, boxShadow: `0 0 12px ${item.color}50` }
                                        : { background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(232,99,10,0.06)' }
                                }
                            >
                                <item.icon
                                    className="w-4 h-4 transition-transform duration-300"
                                    style={{ color: isActive(item.path) ? '#fff' : (isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(28,28,30,0.5)') }}
                                />
                            </div>
                            <span
                                className="font-bold text-sm tracking-tight"
                                style={{ color: isActive(item.path) ? (isDarkMode ? '#fff' : '#E8630A') : (isDarkMode ? 'rgba(255,255,255,0.55)' : 'rgba(28,28,30,0.6)') }}
                            >
                                {item.title}
                            </span>
                        </div>
                        {isActive(item.path) ? (
                            <div
                                className="w-1.5 h-1.5 rounded-full relative z-10"
                                style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                            />
                        ) : (
                            <ChevronRight
                                className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-all transform translate-x-[-10px] group-hover:translate-x-0"
                                style={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(28,28,30,0.5)' }}
                            />
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom Section */}
            <div
                className="p-5 space-y-3"
                style={{ borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(232,99,10,0.1)' }}
            >
                <Link
                    to="/"
                    className="flex items-center gap-3 p-3.5 text-sm font-bold rounded-2xl transition-all"
                    style={{
                        color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(28,28,30,0.5)',
                        border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(232,99,10,0.1)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = isDarkMode ? 'rgba(255,255,255,0.8)' : '#E8630A';
                        e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(232,99,10,0.05)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(28,28,30,0.5)';
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </Link>
                <LogoutButton
                    onClick={logout}
                    className="w-full justify-between p-4"
                />
            </div>
        </aside>
    );
};

export default AdminSidebar;
