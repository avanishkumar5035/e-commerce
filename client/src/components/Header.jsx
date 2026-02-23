import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, MapPin, User } from 'lucide-react';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import CartContext from '../context/CartContext.jsx';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
        }
    };
    return (
        <header className="sticky top-0 z-50">
            {/* Top Header */}
            <div className="bg-primary_navy text-white px-4 py-2 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center p-2 border border-transparent hover:border-white transition-all">
                    <span className="text-2xl font-bold tracking-tighter">Shop<span className="text-accent_gold">Sphere</span></span>
                </Link>

                {/* Deliver To */}
                <div className="hidden lg:flex items-center gap-1 p-2 border border-transparent hover:border-white cursor-pointer transition-all">
                    <MapPin className="w-5 h-5 mt-2" />
                    <div className="text-xs">
                        <p className="text-gray-400">Deliver to</p>
                        <p className="font-bold -mt-1">India</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1 flex max-w-3xl">
                    <form onSubmit={handleSearch} className="flex w-full rounded-md overflow-hidden group focus-within:ring-2 focus-within:ring-accent_gold">
                        <select className="bg-gray-100 text-gray-700 text-sm px-4 py-2 border-r border-gray-300 outline-none hover:bg-gray-200 cursor-pointer">
                            <option>All</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search ShopSphere"
                            className="flex-1 px-4 py-2 text-black outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="bg-accent_gold px-4 py-2 hover:bg-[#f3a847] transition-all">
                            <Search className="w-6 h-6 text-primary_navy" />
                        </button>
                    </form>
                </div>

                {/* Right Sections */}
                <div className="flex items-center gap-4">
                    {/* Account */}
                    <Link to={user ? '#' : '/login'} className="hidden md:block p-2 border border-transparent hover:border-white cursor-pointer transition-all group relative">
                        <div className="text-xs">
                            <p className="text-gray-400">Hello, {user ? user.name : 'sign in'}</p>
                            <p className="font-bold -mt-1 text-sm">Account & Lists</p>
                        </div>
                        {user && (
                            <div className="absolute top-full right-0 mt-0 pt-2 w-32 hidden group-hover:block z-50">
                                <div className="bg-white text-black p-2 rounded shadow-lg border border-gray-200">
                                    <button
                                        onClick={logout}
                                        className="w-full text-left text-xs hover:underline py-1"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </Link>

                    {/* Orders */}
                    <div className="hidden md:block p-2 border border-transparent hover:border-white cursor-pointer transition-all">
                        <p className="text-xs">Returns</p>
                        <p className="text-sm font-bold">& Orders</p>
                    </div>

                    {/* Cart */}
                    <Link to="/cart" className="flex items-end p-2 border border-transparent hover:border-white transition-all relative">
                        <div className="relative">
                            <ShoppingCart className="w-8 h-8" />
                            <span className="absolute -top-1 -right-1 bg-accent_gold text-primary_navy rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{cartCount}</span>
                        </div>
                        <span className="font-bold hidden sm:block">Cart</span>
                    </Link>
                </div>
            </div>

            {/* Bottom Header / Nav Bar */}
            <div className="bg-primary_navy-light text-white px-4 py-1 flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1 p-2 border border-transparent hover:border-white cursor-pointer transition-all">
                    <Menu className="w-5 h-5" />
                    <span>All</span>
                </div>
                <div className="flex items-center gap-4">
                    {['Fresh', "Today's Deals", 'Mobiles', 'Best Sellers', 'Electronics', 'Prime'].map((item) => (
                        <span key={item} className="p-2 border border-transparent hover:border-white cursor-pointer transition-all whitespace-nowrap hidden sm:block">
                            {item}
                        </span>
                    ))}
                    <Link to="/customer-service" className="p-2 border border-transparent hover:border-white cursor-pointer transition-all whitespace-nowrap hidden sm:block">
                        Customer Service
                    </Link>
                </div>
            </div>
        </header >
    );
};

export default Header;
