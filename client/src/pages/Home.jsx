import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Star, Heart } from 'lucide-react';
import AuthContext from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentHero, setCurrentHero] = useState(0);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();

    const heroImages = [
        "https://images-eu.ssl-images-amazon.com/images/G/31/img21/MA2024/GW/Aug/Unrec/BAU/PC/1-1._CB566141315_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Softlines/Hobby/Gaming/GW/PC_Hero_3000x1200_1._CB565866162_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devicenext/Feb24/GW/PC_Hero_3000x1200_1._CB581894452_.jpg"
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products');
                setProducts(data.products || data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHero((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-bg_soft_gray">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep_blue"></div>
        </div>
    );

    const categories = [
        { title: "Shoes Collection", image: "/assets/shoes_banner.png", link: "/products?category=Shoes" },
        { title: "Books Collection", image: "/assets/books_banner.png", link: "/products?category=Books" },
        { title: "Styles for men", image: "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Fashion/Gateway/BAU/BTF-Refresh/May/PF_MF/MF-1-186-116._SY116_CB636110853_.jpg", link: "/products?category=Men" },
        { title: "Revamp your home in style", image: "https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/Home_decor_379x304._SY304_CB580970634_.jpg", link: "/products" }
    ];

    return (
        <div className="bg-bg_soft_gray min-h-screen pb-10 font-sans text-dark_charcoal">
            {/* Hero Section */}
            <div className="relative h-[600px] overflow-hidden bg-gradient-to-r from-[#f8f9fa] to-[#eaeDED]">
                <div className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out">
                    <img
                        src={heroImages[currentHero]}
                        alt="Hero"
                        className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]"
                    />
                </div>

                {/* Hero Navigation */}
                <button
                    onClick={() => setCurrentHero((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                    className="absolute left-0 top-0 bottom-0 px-4 hover:border-2 hover:border-white transition-all group z-20"
                >
                    <ChevronLeft className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                    onClick={() => setCurrentHero((prev) => (prev + 1) % heroImages.length)}
                    className="absolute right-0 top-0 bottom-0 px-4 hover:border-2 hover:border-white transition-all group z-20"
                >
                    <ChevronRight className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Content Container (Overlapping Hero) */}
            <div className="relative -mt-80 z-30 px-4 max-w-[1500px] mx-auto">
                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-white p-5 flex flex-col justify-between shadow-md rounded-lg hover:scale-[1.02] transition-transform duration-300">
                            <h2 className="text-xl font-bold mb-3">{cat.title}</h2>
                            <div className="flex-1 overflow-hidden">
                                <img src={cat.image} alt={cat.title} className="w-full h-full object-contain mb-4" />
                            </div>
                            <Link to={cat.link} className="text-sm text-deep_blue hover:text-sky_blue hover:underline mt-4 font-bold transition-all flex items-center gap-1">
                                See all offers <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Featured Products Scroller */}
                <div className="bg-white p-5 shadow-md mb-6 overflow-hidden rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Today's Deals</h2>
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {products.map((product) => (
                            <div key={product._id} className="min-w-[200px] relative group transition-transform duration-300 hover:scale-[1.03]">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(product._id);
                                    }}
                                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:text-rose-500 active:scale-90"
                                >
                                    <Heart className={`w-3.5 h-3.5 ${isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                                </button>
                                <Link to={`/products/${product._id}`}>
                                    <div className="h-48 flex items-center justify-center p-4 bg-gray-50 mb-2 rounded-md">
                                        <img src={product.image} alt={product.name} className="h-full object-contain transition-transform group-hover:scale-105" />
                                    </div>
                                    <div className="text-sm">
                                        <span className="bg-sky_blue/10 text-sky_blue px-2 py-0.5 font-bold mr-2 rounded">Up to {Math.floor(Math.random() * 40) + 10}% off</span>
                                        <p className="text-deep_blue font-black inline-block uppercase tracking-tighter text-[10px]">Deal of the Day</p>
                                        <p className="font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</p>
                                        <p className="text-text_secondary truncate">{product.name}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Second Row of Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-5 shadow-md h-[420px] flex flex-col rounded-lg">
                        <h2 className="text-xl font-bold mb-3">Sign in for your best experience</h2>
                        <button className="w-full bg-deep_blue text-white py-3 rounded-xl shadow-xl shadow-deep_blue/20 hover:bg-deep_blue_dark text-sm font-bold mb-4 transition-all active:scale-95">
                            Sign in securely
                        </button>
                        <div className="bg-[#f3f3f3] -mx-5 -mb-5 mt-auto p-5 overflow-hidden rounded-b-lg">
                            <img src="https://m.media-amazon.com/images/G/31/img19/AMS/Houseads/Laptops-Sept2019._CB436595915_.jpg" alt="Ads" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    {products.slice(0, 3).map((p, i) => (
                        <div key={i} className="bg-white p-5 shadow-md rounded-lg relative group hover:scale-[1.02] transition-transform duration-300">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleWishlist(p._id);
                                }}
                                className={`absolute top-5 right-5 z-10 p-2 rounded-xl shadow-sm border transition-all hover:scale-110 active:scale-90 ${isInWishlist(p._id) ? 'bg-red-500 text-white border-red-500' : 'bg-white/80 backdrop-blur-sm border-gray-100 text-gray-400 opacity-0 group-hover:opacity-100'}`}
                            >
                                <Heart className={`w-4 h-4 ${isInWishlist(p._id) ? 'fill-current' : ''}`} />
                            </button>
                            <h2 className="text-xl font-bold mb-3">Inspired by your browsing</h2>
                            <Link to={`/products/${p._id}`} className="block h-64 mb-4">
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            </Link>
                            <Link to={`/products/${p._id}`} className="text-sm text-deep_blue hover:text-sky_blue hover:underline font-bold transition-all">
                                Check more
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
