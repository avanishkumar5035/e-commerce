import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, MapPin, User, Sun, Moon, X, Home, Heart, Package } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import CartContext from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import LogoutButton from './LogoutButton.jsx';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { isDarkMode, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const [deliveryLocation, setDeliveryLocation] = useState(() => {
        return localStorage.getItem('deliveryLocation') || 'India';
    });
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [locationInput, setLocationInput] = useState('');
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLocationSubmit = async (e) => {
        e.preventDefault();
        const input = locationInput.trim();
        if (!input) return;

        if (/^\d{6}$/.test(input)) {
            setIsLocationLoading(true);
            setLocationError('');
            try {
                const response = await axios.get(`https://api.postalpincode.in/pincode/${input}`);
                const data = response.data[0];
                if (data.Status === "Success" && data.PostOffice && data.PostOffice.length > 0) {
                    const postOffice = data.PostOffice[0];
                    const newLocation = `${postOffice.District}, ${postOffice.State}`;
                    setDeliveryLocation(newLocation);
                    localStorage.setItem('deliveryLocation', newLocation);
                    setIsLocationModalOpen(false);
                    setLocationInput('');
                } else {
                    setLocationError('Invalid Pincode or details not found.');
                }
            } catch (err) {
                setLocationError('Failed to fetch pincode details. Please try again.');
            } finally {
                setIsLocationLoading(false);
            }
        } else {
            setDeliveryLocation(input);
            localStorage.setItem('deliveryLocation', input);
            setIsLocationModalOpen(false);
            setLocationInput('');
            setLocationError('');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/products');
                const products = data.products || data;
                const uniqueCats = ['All', ...new Set(products.map(p => p.category))];
                setCategories(uniqueCats);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        let url = `/products?search=${searchQuery}`;
        if (selectedCategory !== 'All') {
            url += `&category=${selectedCategory}`;
        }
        navigate(url);
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* ── Main Header ── */}
            <header
                className="sticky top-0 z-50"
                style={{
                    background: isDarkMode
                        ? 'rgba(26,15,0,0.95)'
                        : 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: isDarkMode
                        ? '1px solid rgba(255,255,255,0.06)'
                        : '1px solid rgba(232,99,10,0.08)',
                    boxShadow: '0 2px 20px rgba(232,99,10,0.08)',
                }}
            >
                {/* Top Row */}
                <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3 md:gap-6">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                        <img
                            src="/logo.png"
                            alt="Marketo Logo"
                            className="h-9 md:h-11 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    {/* Desktop Search */}
                    <div className="flex-1 hidden md:flex max-w-3xl">
                        <form
                            onSubmit={handleSearch}
                            className="flex w-full rounded-2xl overflow-hidden border-2 transition-all"
                            style={{
                                borderColor: 'rgba(232,99,10,0.15)',
                                background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#FFF3E0',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#E8630A'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(232,99,10,0.15)'}
                        >
                            <select
                                className="bg-transparent text-sm font-bold px-4 py-3 border-r outline-none cursor-pointer"
                                style={{
                                    borderColor: 'rgba(232,99,10,0.12)',
                                    color: isDarkMode ? '#F59E0B' : '#E8630A',
                                }}
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Search products, brands and more..."
                                className="flex-1 px-5 py-3 text-sm outline-none bg-transparent font-medium placeholder-gray-400"
                                style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="px-7 py-3 text-white font-bold transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-1 md:gap-2">

                        {/* Location - desktop only */}
                        <button
                            onClick={() => setIsLocationModalOpen(true)}
                            className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-2xl transition-all hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        >
                            <div className="p-1.5 rounded-xl" style={{ background: 'rgba(232,99,10,0.1)' }}>
                                <MapPin className="w-4 h-4" style={{ color: '#E8630A' }} />
                            </div>
                            <div className="text-xs text-left">
                                <p className="text-gray-400 font-bold uppercase tracking-tighter leading-none mb-0.5">Deliver to</p>
                                <p className="font-black leading-none truncate max-w-[100px]" style={{ color: '#E8630A' }}>
                                    {deliveryLocation}
                                </p>
                            </div>
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="hidden sm:flex p-2.5 rounded-2xl transition-all hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        >
                            {isDarkMode
                                ? <Sun className="w-5 h-5 text-amber-400" />
                                : <Moon className="w-5 h-5" style={{ color: '#E8630A' }} />
                            }
                        </button>

                        {/* Account dropdown */}
                        <div className="group relative hidden sm:block">
                            <Link
                                to={user ? '/profile' : '/login'}
                                className="flex items-center gap-2 px-3 py-2 rounded-2xl transition-all hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            >
                                <div className="p-1.5 rounded-xl" style={{ background: 'rgba(232,99,10,0.1)' }}>
                                    <User className="w-4 h-4" style={{ color: '#E8630A' }} />
                                </div>
                                <div className="text-xs hidden md:block">
                                    <p className="text-gray-400 font-bold uppercase tracking-tighter leading-none mb-0.5">Hello, {user ? user.name.split(' ')[0] : 'Sign In'}</p>
                                    <p className="font-black leading-none" style={{ color: '#E8630A' }}>Account</p>
                                </div>
                            </Link>

                            {user && (
                                <div className="absolute top-full right-0 mt-2 w-56 hidden group-hover:block z-50">
                                    <div
                                        className="p-4 rounded-3xl shadow-2xl flex flex-col gap-1 border"
                                        style={{
                                            background: isDarkMode ? 'rgba(26,15,0,0.97)' : '#fff',
                                            borderColor: 'rgba(232,99,10,0.12)',
                                            backdropFilter: 'blur(20px)',
                                        }}
                                    >
                                        {user.role === 'admin' && (
                                            <div className="mb-2">
                                                <p className="px-3 py-1 text-[10px] uppercase font-black mb-1" style={{ color: '#E8630A' }}>Admin Panel</p>
                                                <Link to="/admin/dashboard" className="flex items-center px-3 py-2 rounded-xl transition-colors font-bold text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20" style={{ color: '#E8630A' }}>Dashboard</Link>
                                                <hr className="my-2" style={{ borderColor: 'rgba(232,99,10,0.1)' }} />
                                            </div>
                                        )}
                                        <p className="px-3 py-1 text-[10px] uppercase font-black text-gray-400 mb-1">Your Account</p>
                                        <Link to="/myorders" className="flex items-center px-3 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors text-sm font-bold text-gray-700 dark:text-gray-300">My Orders</Link>
                                        <Link to="/wishlist" className="flex items-center px-3 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors text-sm font-bold text-gray-700 dark:text-gray-300">Wishlist</Link>
                                        <hr className="my-2" style={{ borderColor: 'rgba(232,99,10,0.08)' }} />
                                        <LogoutButton onClick={logout} className="w-full mt-1 justify-between px-4 py-3 !text-sm" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        {user && user.role !== 'admin' && (
                            <Link
                                to="/cart"
                                className="flex items-center gap-2 px-3 py-2 rounded-2xl transition-all relative tap-ripple"
                                style={{ background: 'rgba(232,99,10,0.1)' }}
                            >
                                <div className="relative">
                                    <ShoppingCart className="w-5 h-5" style={{ color: '#E8630A' }} />
                                    <span
                                        className="absolute -top-2.5 -right-2.5 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                                        style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}
                                    >
                                        {cartCount}
                                    </span>
                                </div>
                                <span className="font-black text-sm hidden lg:block" style={{ color: '#E8630A' }}>Cart</span>
                            </Link>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-2xl transition-all"
                            style={{ background: 'rgba(232,99,10,0.1)' }}
                        >
                            {mobileMenuOpen
                                ? <X className="w-5 h-5" style={{ color: '#E8630A' }} />
                                : <Menu className="w-5 h-5" style={{ color: '#E8630A' }} />
                            }
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden px-4 pb-3">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full rounded-2xl overflow-hidden border-2"
                        style={{ borderColor: 'rgba(232,99,10,0.2)', background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#FFF3E0' }}
                    >
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent font-medium placeholder-gray-400"
                            style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="px-5 py-3 text-white flex items-center justify-center transition-all active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {/* Desktop Category Nav Bar */}
                <div
                    className="hidden md:flex px-6 py-2 items-center gap-4 text-[11px] font-black uppercase tracking-wider overflow-x-auto scrollbar-hide border-t"
                    style={{ borderColor: 'rgba(232,99,10,0.08)', background: isDarkMode ? 'rgba(26,15,0,0.8)' : 'rgba(255,243,224,0.6)' }}
                >
                    <div className="group relative">
                        <div
                            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl cursor-pointer transition-all border font-bold"
                            style={{ borderColor: 'rgba(232,99,10,0.2)', color: '#E8630A', background: 'rgba(232,99,10,0.05)' }}
                        >
                            <Menu className="w-4 h-4" />
                            <span>All Categories</span>
                        </div>
                        <div
                            className="absolute top-full left-0 mt-2 w-52 rounded-2xl shadow-2xl hidden group-hover:block z-50 py-2"
                            style={{
                                background: isDarkMode ? 'rgba(26,15,0,0.97)' : '#fff',
                                border: '1px solid rgba(232,99,10,0.12)',
                            }}
                        >
                            {categories.map(cat => (
                                <Link
                                    key={cat}
                                    to={`/products?category=${cat}`}
                                    className="block px-4 py-2.5 text-sm font-semibold transition-all"
                                    style={{ color: isDarkMode ? '#ddd' : '#333' }}
                                    onMouseEnter={e => {
                                        e.target.style.background = 'linear-gradient(135deg, #E8630A, #F59E0B)';
                                        e.target.style.color = '#fff';
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = isDarkMode ? '#ddd' : '#333';
                                    }}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-1" style={{ color: isDarkMode ? '#ccc' : '#555' }}>
                        {[
                            { label: 'Best Sellers', to: '/products?sort=bestsellers' },
                            { label: "Today's Deals", to: '/products?filter=deals' },
                            { label: 'New Releases', to: '/products?sort=newest' },
                            { label: 'Electronics', to: '/products?category=Electronics' },
                            { label: 'Customer Service', to: '/customer-service' },
                        ].map(item => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="py-1.5 px-3 rounded-full cursor-pointer transition-all whitespace-nowrap hover:text-white"
                                onMouseEnter={e => {
                                    e.target.style.background = 'linear-gradient(135deg, #E8630A, #F59E0B)';
                                    e.target.style.color = '#fff';
                                }}
                                onMouseLeave={e => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = isDarkMode ? '#ccc' : '#555';
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mobile Slide-down menu */}
                {mobileMenuOpen && (
                    <div
                        className="md:hidden border-t py-4 px-4 space-y-3 animate-slide-in"
                        style={{
                            borderColor: 'rgba(232,99,10,0.08)',
                            background: isDarkMode ? 'rgba(26,15,0,0.98)' : '#fff',
                        }}
                    >
                        {!user ? (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white font-bold text-sm tap-ripple"
                                    style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}>
                                    Sign In / Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(232,99,10,0.07)' }}>
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg"
                                        style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm"
                                        style={{ background: 'rgba(232,99,10,0.1)', color: '#E8630A' }}>
                                        Admin Dashboard
                                    </Link>
                                )}
                                <Link to="/myorders" onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm"
                                    style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#FFF3E0', color: isDarkMode ? '#fff' : '#1C1C1E' }}>
                                    My Orders
                                </Link>
                                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm"
                                    style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#FFF3E0', color: isDarkMode ? '#fff' : '#1C1C1E' }}>
                                    Wishlist
                                </Link>
                                <LogoutButton onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-center px-4 py-3 !text-sm" />
                            </>
                        )}
                        <button
                            onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                            className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm w-full"
                            style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#FFF3E0', color: isDarkMode ? '#F59E0B' : '#E8630A' }}>
                            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                )}
            </header>

            {/* ── Mobile Bottom Nav Bar (App Style) ── */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
                style={{
                    background: isDarkMode ? 'rgba(26,15,0,0.97)' : 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(232,99,10,0.1)',
                    boxShadow: '0 -4px 20px rgba(232,99,10,0.08)',
                }}
            >
                <div className="flex justify-around items-center px-2 pt-2 pb-2">
                    {[
                        { to: '/', icon: Home, label: 'Home' },
                        { to: '/products', icon: Package, label: 'Shop' },
                        { to: '/wishlist', icon: Heart, label: 'Wishlist' },
                        ...(user && user.role !== 'admin' ? [{ to: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount }] : []),
                        { to: user ? '/myorders' : '/login', icon: User, label: user ? 'Profile' : 'Login' },
                    ].map((item) => {
                        const active = isActive(item.to);
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all tap-ripple relative"
                                style={active ? { background: 'rgba(232,99,10,0.12)' } : {}}
                            >
                                <div className="relative">
                                    <item.icon
                                        className="w-5 h-5 transition-all"
                                        style={active
                                            ? { color: '#E8630A', strokeWidth: 2.5 }
                                            : { color: isDarkMode ? '#888' : '#aaa' }
                                        }
                                    />
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span
                                            className="absolute -top-2 -right-2 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
                                            style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className="text-[10px] font-bold"
                                    style={active ? { color: '#E8630A' } : { color: isDarkMode ? '#888' : '#aaa' }}
                                >
                                    {item.label}
                                </span>
                                {active && (
                                    <div
                                        className="absolute -bottom-1.5 w-5 h-0.5 rounded-full"
                                        style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* ── Location Modal ── */}
            {isLocationModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-safe">
                    <div
                        className="w-full max-w-sm rounded-t-4xl sm:rounded-4xl shadow-2xl overflow-hidden"
                        style={{ background: isDarkMode ? '#1a0f00' : '#fff' }}
                    >
                        <div className="p-6">
                            {/* Handle bar */}
                            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(232,99,10,0.3)' }} />
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-xl font-black" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>
                                    Choose Location
                                </h3>
                                <button
                                    onClick={() => setIsLocationModalOpen(false)}
                                    className="p-2 rounded-full transition-colors"
                                    style={{ background: 'rgba(232,99,10,0.1)', color: '#E8630A' }}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                                Enter your 6-digit pincode or city name to get accurate delivery estimates.
                            </p>
                            <form onSubmit={handleLocationSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="e.g. 110001 or New Delhi"
                                        className="app-input dark:bg-[#2a1800] dark:text-white dark:border-orange-900/30"
                                        value={locationInput}
                                        onChange={(e) => { setLocationInput(e.target.value); setLocationError(''); }}
                                        autoFocus
                                    />
                                    {locationError && <p className="text-red-500 text-xs mt-2 font-bold">{locationError}</p>}
                                </div>
                                <button
                                    disabled={isLocationLoading}
                                    type="submit"
                                    className="btn-orange w-full disabled:opacity-50"
                                >
                                    {isLocationLoading && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-r-2" />}
                                    {isLocationLoading ? 'Fetching...' : 'Apply Location'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
