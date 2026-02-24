import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Activity,
    Monitor,
    LogOut,
    ChevronRight,
    ShoppingBag
} from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { title: 'Products', icon: Package, path: '/admin/products' },
        { title: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
        { title: 'Customers', icon: Users, path: '/admin/users' },
        { title: 'Activity Logs', icon: Activity, path: '/admin/activities' },
        { title: 'Live Monitor', icon: Monitor, path: '/admin/monitor' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 transition-all duration-300">
            {/* Sidebar Header */}
            <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <div className="bg-deep_blue p-2 rounded-xl shadow-lg shadow-deep_blue/20 rotate-3">
                    <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-dark_charcoal tracking-tight">Admin<span className="text-sky_blue">Portal</span></h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ShopSphere Pro</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${isActive(item.path)
                                ? 'bg-deep_blue text-white shadow-xl shadow-deep_blue/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-deep_blue'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                                }`} />
                            <span className="font-bold text-sm tracking-tight">{item.title}</span>
                        </div>
                        {isActive(item.path) && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        )}
                        {!isActive(item.path) && (
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-6 border-t border-gray-50 space-y-4">
                <Link to="/" className="flex items-center gap-3 p-4 text-sm font-bold text-gray-500 hover:text-deep_blue transition-colors rounded-2xl border border-transparent hover:border-deep_blue/10">
                    <Activity className="w-4 h-4" />
                    Back to Store
                </Link>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all group"
                >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
