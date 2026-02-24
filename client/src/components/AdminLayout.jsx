import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Search, Bell, User } from 'lucide-react';

const AdminLayout = () => {
    const { user } = useContext(AuthContext);

    // Protection: only admins can access
    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Admin Top Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative max-w-md w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-deep_blue transition-colors" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-deep_blue/20 focus:ring-4 focus:ring-deep_blue/5 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-3 text-gray-400 hover:text-deep_blue hover:bg-gray-50 rounded-2xl transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-dark_charcoal leading-none mb-1">{user.name}</p>
                                <p className="text-[10px] font-bold text-sky_blue uppercase tracking-widest leading-none">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-deep_blue flex items-center justify-center text-white font-black shadow-lg shadow-deep_blue/20">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
