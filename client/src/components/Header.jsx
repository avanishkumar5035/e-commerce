import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, MapPin, User } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import CartContext from '../context/CartContext.jsx';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
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
        <header className="sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            {/* Top Header */}
            <div className="bg-white text-dark_charcoal px-4 py-3 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center p-2 border border-transparent hover:border-deep_blue/10 transition-all rounded-md">
                    <span className="text-2xl font-extrabold tracking-tighter text-deep_blue">Shop<span className="text-sky_blue">Sphere</span></span>
                </Link>

                {/* Deliver To */}
                <div className="hidden lg:flex items-center gap-1 p-2 border border-transparent hover:border-gray-100 cursor-pointer transition-all rounded-md">
                    <MapPin className="w-5 h-5 text-deep_blue" />
                    <div className="text-xs">
                        <p className="text-gray-500">Deliver to</p>
                        <p className="font-bold -mt-1">India</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1 flex max-w-3xl">
                    <form onSubmit={handleSearch} className="flex w-full rounded-full overflow-hidden group border border-gray-300 focus-within:border-deep_blue focus-within:ring-4 focus-within:ring-deep_blue/10 transition-all">
                        <select
                            className="bg-gray-100 text-dark_charcoal text-xs font-bold px-4 py-2 border-r border-gray-200 outline-none hover:bg-gray-200 cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Search ShopSphere..."
                            className="flex-1 px-4 py-2 text-dark_charcoal outline-none bg-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="bg-deep_blue px-6 py-2 hover:bg-deep_blue_dark transition-all text-white">
                            <Search className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* Right Sections */}
                <div className="flex items-center gap-2">
                    {/* Account */}
                    <Link to={user ? '#' : '/login'} className="hidden md:block p-2 border border-transparent hover:bg-gray-50 cursor-pointer transition-all group relative rounded-md">
                        <div className="text-xs">
                            <p className="text-gray-500">Hello, {user ? user.name : 'sign in'}</p>
                            <p className="font-bold -mt-1 text-sm">Account & Lists</p>
                        </div>
                        {user && (
                            <div className="absolute top-full right-0 mt-0 pt-2 w-40 hidden group-hover:block z-50">
                                <div className="bg-white text-black p-2 rounded-lg shadow-xl border border-gray-100 flex flex-col gap-1 min-w-[150px]">
                                    {user.role === 'admin' && (
                                        <>
                                            <p className="px-2 py-1 text-[10px] uppercase font-bold text-gray-400">Admin</p>
                                            <Link to="/admin/dashboard" className="text-sm hover:bg-gray-50 rounded px-2 py-1.5 transition-colors font-bold text-deep_blue">Dashboard</Link>
                                            <Link to="/admin/products" className="text-sm hover:bg-gray-50 rounded px-2 py-1.5 transition-colors">Products</Link>
                                            <Link to="/admin/orders" className="text-sm hover:bg-gray-50 rounded px-2 py-1.5 transition-colors">Orders</Link>
                                            <Link to="/admin/users" className="text-sm hover:bg-gray-50 rounded px-2 py-1.5 transition-colors">Customers</Link>
                                            <Link to="/admin/activities" className="text-sm hover:bg-gray-50 rounded px-2 py-1.5 transition-colors">Activity Logs</Link>
                                            <hr className="my-1 border-gray-50" />
                                        </>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full text-left text-sm hover:bg-deep_blue hover:text-white rounded px-2 py-1.5 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </Link>

                    {/* Orders */}
                    <div className="hidden md:block p-2 border border-transparent hover:bg-gray-50 cursor-pointer transition-all rounded-md">
                        <p className="text-xs text-gray-500">Returns</p>
                        <p className="text-sm font-bold">& Orders</p>
                    </div>

                    {/* Cart */}
                    {user && (
                        <Link to="/cart" className="flex items-end p-2 border border-transparent hover:bg-gray-50 transition-all relative rounded-md">
                            <div className="relative">
                                <ShoppingCart className="w-7 h-7 text-deep_blue" />
                                <span className="absolute -top-2 -right-2 bg-deep_blue text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] font-bold ring-2 ring-white">{cartCount}</span>
                            </div>
                            <span className="font-bold hidden sm:block ml-2 text-sm">Cart</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Bottom Header / Nav Bar */}
            <div className="bg-gray-50 text-dark_charcoal px-4 py-2 flex items-center gap-4 text-xs font-bold overflow-x-auto scrollbar-hide border-b border-gray-100 shadow-inner">
                <div className="group relative">
                    <div className="flex items-center gap-1.5 p-1.5 px-3 bg-white border border-gray-200 hover:border-deep_blue rounded cursor-pointer transition-all whitespace-nowrap shadow-sm">
                        <Menu className="w-4 h-4 text-deep_blue" />
                        <span>All Categories</span>
                    </div>
                    {/* Categories Dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl hidden group-hover:block z-50 py-2">
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                to={`/products?category=${cat}`}
                                className="block px-4 py-2 hover:bg-deep_blue hover:text-white transition-colors text-sm font-semibold"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {['Best Sellers', "Today's Deals", 'New Releases', 'Prime', 'Mobiles'].map((item) => (
                        <span key={item} className="p-1.5 px-3 hover:bg-deep_blue/5 rounded-full cursor-pointer transition-all whitespace-nowrap">
                            {item}
                        </span>
                    ))}
                    <Link to="/customer-service" className="p-1.5 px-3 hover:bg-deep_blue/5 rounded-full cursor-pointer transition-all whitespace-nowrap">
                        Customer Service
                    </Link>
                </div>
            </div>
        </header >
    );
};

export default Header;
