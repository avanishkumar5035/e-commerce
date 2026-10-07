import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Search, Bell, Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useTheme();

    // Protection: only admins can access
    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div
            className="flex min-h-screen"
            style={{
                background: isDarkMode 
                    ? 'linear-gradient(135deg, #1f1105 0%, #3a1a00 40%, #170900 100%)'
                    : 'linear-gradient(135deg, #FFF8F0 0%, #FDEBD0 40%, #FFF3E0 100%)',
            }}
        >
            {/* Animated background orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div
                    className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, #E8630A 0%, transparent 70%)',
                        top: '-100px',
                        left: '-100px',
                        animation: 'pulse 8s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
                        bottom: '-100px',
                        right: '10%',
                        animation: 'pulse 10s ease-in-out infinite 2s',
                    }}
                />
                <div
                    className="absolute w-[400px] h-[400px] rounded-full opacity-8 blur-3xl"
                    style={{
                        background: isDarkMode ? 'radial-gradient(circle, #B45309 0%, transparent 70%)' : 'radial-gradient(circle, #D97706 0%, transparent 70%)',
                        top: '40%',
                        right: '-50px',
                        animation: 'pulse 12s ease-in-out infinite 4s',
                    }}
                />
            </div>

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Admin Top Header */}
                <header
                    className="h-20 border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300"
                    style={{
                        background: isDarkMode ? 'rgba(25, 11, 2, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(232,99,10,0.1)',
                    }}
                >
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative max-w-md w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-sky-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className={`w-full pl-11 pr-4 py-2.5 rounded-2xl outline-none text-sm font-medium transition-all ${isDarkMode ? 'text-gray-300 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'}`}
                                style={{
                                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(232,99,10,0.05)',
                                    border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(232,99,10,0.1)',
                                }}
                                onFocus={e => {
                                    e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(232,99,10,0.08)';
                                    e.target.style.borderColor = 'rgba(245,158,11,0.4)';
                                }}
                                onBlur={e => {
                                    e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(232,99,10,0.05)';
                                    e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(232,99,10,0.1)';
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-2xl transition-all relative group hover:bg-orange-50 dark:hover:bg-transparent"
                            style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(232,99,10,0.05)' }}
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
                            ) : (
                                <Moon className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
                            )}
                        </button>
                        <button
                            className="p-3 rounded-2xl transition-all relative hover:bg-orange-50 dark:hover:bg-transparent"
                            style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(232,99,10,0.05)' }}
                        >
                            <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-orange-600'}`} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-transparent animate-pulse"></span>
                        </button>
                        <div className="h-8 w-[1px] mx-1" style={{ background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(232,99,10,0.1)' }}></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className={`text-sm font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                                <div className="flex items-center justify-end gap-1">
                                    <Shield className={`w-3 h-3 ${isDarkMode ? 'text-sky-400' : 'text-orange-500'}`} />
                                    <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isDarkMode ? 'text-sky-400' : 'text-orange-500'}`}>Super Admin</p>
                                </div>
                            </div>
                            <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #E8630A, #F59E0B)',
                                    boxShadow: '0 0 20px rgba(245,158,11,0.3)',
                                }}
                            >
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
