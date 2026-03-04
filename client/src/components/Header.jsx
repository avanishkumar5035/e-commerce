import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, MapPin, User, Sun, Moon } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import CartContext from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { isDarkMode, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

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
    };
    return (
        <>
            <header className="sticky top-0 z-50 glass-morphism border-b border-white/20 dark:border-slate-800/50 premium-shadow">
                {/* Top Header */}
                <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <span className="text-2xl md:text-3xl font-black tracking-tighter text-deep_blue group-hover:scale-105 transition-transform duration-300">Shop<span className="text-sky_blue">Sphere</span></span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 hidden md:flex max-w-4xl">
                        <form onSubmit={handleSearch} className="flex w-full rounded-2xl overflow-hidden group border-2 border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 focus-within:border-deep_blue dark:focus-within:border-sky_blue focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-8 focus-within:ring-deep_blue/5 dark:focus-within:ring-sky_blue/10 transition-all">
                            <select
                                className="bg-transparent text-dark_charcoal dark:text-gray-300 text-xs font-bold px-5 py-3 border-r border-gray-100 dark:border-slate-700 outline-none hover:bg-gray-100/50 dark:hover:bg-slate-800 cursor-pointer"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Search everything you need..."
                                className="flex-1 px-5 py-3 text-dark_charcoal dark:text-gray-100 outline-none bg-transparent font-medium placeholder-gray-400 dark:placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="bg-deep_blue px-8 py-3 hover:bg-deep_blue_dark transition-all text-white flex items-center justify-center">
                                <Search className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Right Sections */}
                    <div className="flex items-center gap-4">
                        {/* Deliver To (Optional/Hidden for cleaner look) */}
                        <div className="hidden xl:flex items-center gap-2 p-2 px-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all">
                            <MapPin className="w-4 h-4 text-sky_blue" />
                            <div className="text-xs">
                                <p className="text-gray-400 font-bold uppercase tracking-tighter">Deliver to</p>
                                <p className="font-black text-deep_blue -mt-0.5">India</p>
                            </div>
                        </div>

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="hidden sm:flex items-center justify-center p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                            <div className="bg-deep_blue/5 dark:bg-slate-700 p-2 rounded-xl">
                                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-deep_blue" />}
                            </div>
                        </button>

                        {/* Account */}
                        <div className="group relative">
                            <Link to={user ? '#' : '/login'} className="flex items-center gap-3 p-2 px-4 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                                <div className="bg-deep_blue/5 dark:bg-slate-700 p-2 rounded-xl">
                                    <User className="w-5 h-5 text-deep_blue" />
                                </div>
                                <div className="text-xs hidden sm:block">
                                    <p className="text-gray-400 font-bold uppercase tracking-tighter">Hello, {user ? user.name.split(' ')[0] : 'Sign In'}</p>
                                    <p className="font-black text-deep_blue -mt-0.5">Account & Lists</p>
                                </div>
                            </Link>
                            {user && (
                                <div className="absolute top-full right-0 mt-2 w-56 hidden group-hover:block z-50 animate-slide-in">
                                    <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col gap-1 premium-shadow">
                                        {user.role === 'admin' && (
                                            <div className="mb-2">
                                                <p className="px-3 py-1 text-[10px] uppercase font-black text-sky_blue mb-1">Admin Panel</p>
                                                <Link to="/admin/dashboard" className="flex items-center px-3 py-2 hover:bg-deep_blue/5 rounded-xl transition-colors font-bold text-deep_blue text-sm">Dashboard</Link>
                                                <hr className="my-2 border-gray-50" />
                                            </div>
                                        )}

                                        <p className="px-3 py-1 text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 mb-1">Your Account</p>
                                        <Link to="/myorders" className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-sm font-bold text-gray-700 dark:text-gray-300">My Orders</Link>
                                        <Link to="/wishlist" className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-sm font-bold text-gray-700 dark:text-gray-300">Wishlist</Link>
                                        <hr className="my-2 border-gray-50 dark:border-slate-800" />
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-3 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white rounded-xl transition-all font-bold text-sm"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        {user && (
                            <Link to="/cart" className="flex items-center p-2 px-4 bg-deep_blue/5 hover:bg-deep_blue/10 transition-all relative rounded-2xl group">
                                <div className="relative">
                                    <ShoppingCart className="w-6 h-6 text-deep_blue" />
                                    <span className="absolute -top-3 -right-3 bg-deep_blue text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] font-black ring-4 ring-white group-hover:scale-110 transition-transform">{cartCount}</span>
                                </div>
                                <span className="font-black hidden lg:block ml-3 text-sm text-deep_blue">Cart</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Bottom Header / Nav Bar */}
                <div className="hidden md:flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-6 py-2 items-center gap-6 text-[11px] font-black uppercase tracking-wider overflow-x-auto scrollbar-hide border-t border-white/20 dark:border-slate-800/50">
                    <div className="group relative">
                        <div className="flex items-center gap-1.5 p-1.5 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-deep_blue dark:hover:border-sky_blue rounded cursor-pointer transition-all whitespace-nowrap shadow-sm">
                            <Menu className="w-4 h-4 text-deep_blue dark:text-sky_blue" />
                            <span className="dark:text-gray-300">All Categories</span>
                        </div>
                        {/* Categories Dropdown */}
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-2xl hidden group-hover:block z-50 py-2">
                            {categories.map(cat => (
                                <Link
                                    key={cat}
                                    to={`/products?category=${cat}`}
                                    className="block px-4 py-2 hover:bg-deep_blue hover:text-white transition-colors text-sm font-semibold dark:text-gray-300"
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 dark:text-gray-400">
                        <Link to="/products?sort=bestsellers" className="p-1.5 px-3 hover:bg-deep_blue/5 dark:hover:bg-slate-800 dark:hover:text-gray-200 rounded-full cursor-pointer transition-all whitespace-nowrap">Best Sellers</Link>
                        <Link to="/products?filter=deals" className="p-1.5 px-3 hover:bg-deep_blue/5 dark:hover:bg-slate-800 dark:hover:text-gray-200 rounded-full cursor-pointer transition-all whitespace-nowrap">Today's Deals</Link>
                        <Link to="/products?sort=newest" className="p-1.5 px-3 hover:bg-deep_blue/5 dark:hover:bg-slate-800 dark:hover:text-gray-200 rounded-full cursor-pointer transition-all whitespace-nowrap">New Releases</Link>
                        <span className="p-1.5 px-3 hover:bg-deep_blue/5 dark:hover:bg-slate-800 dark:hover:text-gray-200 rounded-full cursor-pointer transition-all whitespace-nowrap">Prime</span>
                        <Link to="/products?category=Electronics" className="p-1.5 px-3 hover:bg-deep_blue/5 dark:hover:bg-slate-800 dark:hover:text-gray-200 rounded-full cursor-pointer transition-all whitespace-nowrap">Electronics</Link>
                        <Link to="/customer-service" className="p-1.5 px-3 hover:bg-deep_blue/5 dark:hover:bg-slate-800 dark:hover:text-gray-200 rounded-full cursor-pointer transition-all whitespace-nowrap">
                            Customer Service
                        </Link>
                    </div>
                </div>
            </header >

            {/* Mobile Bottom Navigation Bar outside the sticky header context */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-6 py-3 flex justify-between items-center pb-safe">
                <Link to="/" className="flex flex-col items-center gap-1 text-gray-500 hover:text-deep_blue dark:text-gray-400 dark:hover:text-sky_blue transition-colors">
                    <MapPin className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Home</span>
                </Link>
                <Link to="/products" className="flex flex-col items-center gap-1 text-gray-500 hover:text-deep_blue dark:text-gray-400 dark:hover:text-sky_blue transition-colors">
                    <Menu className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Shop</span>
                </Link>
                <Link to="/cart" className="flex flex-col items-center gap-1 text-gray-500 hover:text-deep_blue dark:text-gray-400 dark:hover:text-sky_blue transition-colors relative">
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-1 -right-2 bg-deep_blue text-white rounded-full min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center text-[10px] font-black">{cartCount}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase">Cart</span>
                </Link>
                <Link to={user ? "/myorders" : "/login"} className="flex flex-col items-center gap-1 text-gray-500 hover:text-deep_blue dark:text-gray-400 dark:hover:text-sky_blue transition-colors">
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">{user ? "Profile" : "Login"}</span>
                </Link>
            </div>
        </>
    );
};

export default Header;
