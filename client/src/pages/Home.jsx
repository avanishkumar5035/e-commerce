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
        "/assets/hero_fashion.png",
        "/assets/hero_electronics.png",
        "/assets/hero_home.png"
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
        <div className="flex justify-center items-center h-screen bg-bg_soft_gray dark:bg-slate-900">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep_blue dark:border-sky_blue"></div>
        </div>
    );

    const categories = [
        { title: "Smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800", link: "/products?category=Mobile" },
        { title: "Shoes Collection", image: "/assets/shoes_banner.png", link: "/products?category=Shoes" },
        { title: "Books Collection", image: "/assets/books_banner.png", link: "/products?category=Books" },
        { title: "Styles for men", image: "/assets/cat_mens_fashion.png", link: "/products?category=Men" },
        { title: "Revamp your home in style", image: "/assets/cat_home_decor.png", link: "/products" }
    ];

    return (
        <div className="bg-bg_soft_gray dark:bg-slate-900 min-h-screen pb-16 font-sans text-dark_charcoal dark:text-gray-100 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative h-[450px] md:h-[650px] overflow-hidden bg-white dark:bg-slate-900">
                <div className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out">
                    <img
                        src={heroImages[currentHero]}
                        alt="Hero"
                        className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_80%,rgba(0,0,0,0)_100%)] opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg_soft_gray dark:from-slate-900 via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Hero Content Overlay */}
                <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 z-20 max-w-sm md:max-w-xl animate-slide-in">
                    <div className="glass-morphism dark:bg-slate-900/40 p-6 md:p-10 rounded-3xl premium-shadow border-white/50 dark:border-slate-800/50">
                        <span className="bg-deep_blue text-white px-3 md:px-4 py-1 mb-2 md:mb-4 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest inline-block">Flash Sale Live</span>
                        <h1 className="text-4xl md:text-6xl font-black text-deep_blue leading-none mb-3 md:mb-4 tracking-tighter">
                            Upgrade Your <br />
                            <span className="text-sky_blue">Lifestyle</span>
                        </h1>
                        <p className="hidden md:block text-gray-600 dark:text-gray-300 mb-8 font-medium leading-relaxed">Discover our premium collection of electronics, fashion, and home decor with exclusive offers.</p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2 md:mt-0">
                            <button className="bg-deep_blue text-white w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold shadow-xl shadow-deep_blue/20 hover:bg-deep_blue_dark transition-all active:scale-95 text-sm md:text-base">Shop Now</button>
                            <button className="bg-white dark:bg-slate-800 text-deep_blue dark:text-sky_blue w-full sm:w-auto border-2 border-deep_blue/10 dark:border-slate-700 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-sm md:text-base">Learn More</button>
                        </div>
                    </div>
                </div>

                {/* Hero Navigation */}
                <button
                    onClick={() => setCurrentHero((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/20 dark:bg-slate-800/50 backdrop-blur-md rounded-full hover:bg-white/40 dark:hover:bg-slate-700/50 border border-white/30 dark:border-slate-700/50 transition-all group z-30"
                >
                    <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                    onClick={() => setCurrentHero((prev) => (prev + 1) % heroImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/20 dark:bg-slate-800/50 backdrop-blur-md rounded-full hover:bg-white/40 dark:hover:bg-slate-700/50 border border-white/30 dark:border-slate-700/50 transition-all group z-30"
                >
                    <ChevronRight className="w-8 h-8 text-white" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-40 left-12 z-30 flex gap-2">
                    {heroImages.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentHero(i)}
                            className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${currentHero === i ? 'w-8 bg-deep_blue dark:bg-sky_blue' : 'w-2 bg-deep_blue/20 dark:bg-slate-700'}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Content Container (Overlapping Hero) */}
            <div className="relative -mt-32 z-30 px-6 max-w-[1600px] mx-auto">
                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-6 flex flex-col justify-between shadow-xl shadow-gray-200/50 dark:shadow-none rounded-3xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-slate-700 group">
                            <h2 className="text-2xl font-bold mb-4 text-dark_charcoal dark:text-gray-100">{cat.title}</h2>
                            <div className="flex-1 overflow-hidden rounded-2xl bg-gray-50 dark:bg-slate-700/50 mb-4 h-64 flex items-center justify-center p-4">
                                <img src={cat.image} alt={cat.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <Link to={cat.link} className="inline-flex items-center gap-2 text-deep_blue dark:text-sky_blue font-extrabold group-hover:gap-3 transition-all">
                                Explore Collection <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Featured Products Scroller */}
                <div className="bg-white dark:bg-slate-800 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none mb-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-dark_charcoal dark:text-gray-100 tracking-tight">Today's Deals</h2>
                            <p className="text-gray-400 font-medium">Limited time offers you can't miss</p>
                        </div>
                        <Link to="/products" className="text-deep_blue dark:text-sky_blue font-bold hover:underline">View All</Link>
                    </div>
                    <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 scrollbar-hide px-2 snap-x snap-mandatory">
                        {products.map((product) => (
                            <div key={product._id} className="min-w-[240px] md:min-w-[280px] relative group transition-all duration-500 hover:scale-[1.02] snap-start">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(product._id);
                                    }}
                                    className={`absolute top-4 right-4 z-20 p-3 rounded-2xl shadow-lg backdrop-blur-md border transition-all hover:scale-110 active:scale-90 ${isInWishlist(product._id) ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/80 dark:bg-slate-700/80 border-white/50 dark:border-slate-600 text-gray-400 opacity-0 group-hover:opacity-100'}`}
                                >
                                    <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                                </button>
                                <Link to={`/products/${product._id}`} className="block">
                                    <div className="h-64 flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-700/50 mb-4 rounded-3xl border border-gray-100 dark:border-slate-600 group-hover:shadow-inner transition-all">
                                        <img src={product.image} alt={product.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="px-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-sky_blue text-white text-[10px] px-2 py-0.5 font-black rounded-lg uppercase tracking-wider">-{Math.floor(Math.random() * 40) + 10}%</span>
                                            <p className="text-rose-500 dark:text-rose-400 font-bold uppercase tracking-tighter text-[10px] bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-lg">Deal of the Day</p>
                                        </div>
                                        <p className="font-black text-2xl text-dark_charcoal dark:text-gray-100 mb-1">₹{product.price.toLocaleString('en-IN')}</p>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium truncate text-sm">{product.name}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promo Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-1 bg-deep_blue rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between group">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-4">Join ShopSphere <br /> Plus Today</h2>
                            <p className="text-blue-100 font-medium mb-8">Get free shipping, early access to sales, and exclusive rewards.</p>
                            {!user && (
                                <Link to="/login" className="inline-block bg-white dark:bg-slate-800 text-deep_blue dark:text-sky_blue px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">Join Now</Link>
                            )}
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky_blue/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                    </div>
                    {products.slice(0, 2).map((p, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2.5rem] relative group border border-gray-100 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-dark_charcoal dark:text-gray-100 tracking-tight">Based on your <br /> interests</h2>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(p._id);
                                    }}
                                    className={`p-3 rounded-2xl border transition-all ${isInWishlist(p._id) ? 'bg-rose-500 text-white border-rose-500' : 'bg-gray-50 dark:bg-slate-700/50 border-gray-100 dark:border-slate-600 text-gray-300 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                                >
                                    <Heart className="w-4 h-4 fill-current" />
                                </button>
                            </div>
                            <Link to={`/products/${p._id}`} className="block h-64 mb-6">
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                            </Link>
                            <Link to={`/products/${p._id}`} className="inline-flex items-center gap-2 text-deep_blue dark:text-sky_blue font-extrabold">
                                Discover More <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
