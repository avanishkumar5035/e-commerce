import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Star, Heart, Zap, Tag, TrendingUp, Package } from 'lucide-react';
import AuthContext from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentHero, setCurrentHero] = useState(0);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const heroSlides = [
        {
            title: "Everything",
            highlight: "You Love",
            sub: "Shop the best products at the best prices.",
            cta: "Shop Now →",
            bg: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
            darkBg: "linear-gradient(135deg, #3d1a00 0%, #5c2900 100%)",
            img: "/assets/hero_electronics.png",
        },
        {
            title: "Trending",
            highlight: "Fashion",
            sub: "Discover styles that define your personality.",
            cta: "Explore →",
            bg: "linear-gradient(135deg, #FFF8F0 0%, #FDEBD0 100%)",
            darkBg: "linear-gradient(135deg, #2d1500 0%, #4a2200 100%)",
            img: "/assets/hero_fashion.png",
        },
        {
            title: "Premium",
            highlight: "Home Decor",
            sub: "Transform your space with modern style.",
            cta: "Discover →",
            bg: "linear-gradient(135deg, #FFF3E0 0%, #FFE5CC 100%)",
            darkBg: "linear-gradient(135deg, #2a1000 0%, #442000 100%)",
            img: "/assets/hero_home.png",
        },
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
            setCurrentHero((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen" style={{ background: isDarkMode ? '#1a0f00' : '#FFF8F0' }}>
            <div
                className="w-14 h-14 rounded-full animate-spin mb-4"
                style={{ border: '3px solid rgba(232,99,10,0.15)', borderTop: '3px solid #E8630A' }}
            />
            <p className="font-bold text-sm" style={{ color: '#E8630A' }}>Loading Marketo...</p>
        </div>
    );

    const categoryCards = [
        { title: "Smartphones", emoji: "📱", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800", link: "/products?category=Mobile", color: "#E8630A" },
        { title: "Shoes", emoji: "👟", image: "/assets/shoes_banner.png", link: "/products?category=Shoes", color: "#F59E0B" },
        { title: "Books", emoji: "📚", image: "/assets/books_banner.png", link: "/products?category=Books", color: "#D97706" },
        { title: "Men's Fashion", emoji: "👔", image: "/assets/cat_mens_fashion.png", link: "/products?category=Men", color: "#B45309" },
        { title: "Home Decor", emoji: "🏠", image: "/assets/cat_home_decor.png", link: "/products", color: "#92400E" },
    ];

    const slide = heroSlides[currentHero];

    return (
        <div
            className="min-h-screen pb-20 md:pb-8 font-sans transition-colors duration-300"
            style={{ background: isDarkMode ? '#1a0f00' : '#FFF8F0' }}
        >
            {/* ══ Hero Banner — App Style ══ */}
            <div
                className="mx-4 mt-4 md:mx-6 md:mt-5 rounded-3xl overflow-hidden relative"
                style={{
                    background: isDarkMode ? slide.darkBg : slide.bg,
                    minHeight: '200px',
                }}
            >
                <div className="flex items-center justify-between p-6 md:p-10 min-h-[200px] md:min-h-[320px]">
                    {/* Text */}
                    <div className="flex-1 z-10">
                        <span
                            className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                            style={{ background: 'rgba(232,99,10,0.15)', color: '#E8630A' }}
                        >
                            🔥 Flash Sale Live
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black leading-none tracking-tight mb-1" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>
                            {slide.title}
                        </h1>
                        <h1 className="text-3xl md:text-5xl font-black leading-none tracking-tight mb-3" style={{ color: '#E8630A' }}>
                            {slide.highlight}
                        </h1>
                        <p className="text-sm font-medium mb-5 max-w-xs" style={{ color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>
                            {slide.sub}
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="btn-orange tap-ripple"
                            style={{ fontSize: '13px', padding: '10px 22px', borderRadius: '12px' }}
                        >
                            {slide.cta}
                        </button>
                    </div>
                    {/* Hero Image */}
                    <div className="flex-1 flex items-center justify-end">
                        <img
                            src={slide.img}
                            alt="Hero"
                            className="h-36 md:h-64 object-contain drop-shadow-2xl transition-all duration-700"
                            style={{ transform: 'scale(1.05)' }}
                        />
                    </div>
                </div>

                {/* Slide indicators */}
                <div className="absolute bottom-4 left-6 flex gap-1.5">
                    {heroSlides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentHero(i)}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: currentHero === i ? '24px' : '8px',
                                height: '8px',
                                background: currentHero === i ? '#E8630A' : 'rgba(232,99,10,0.3)',
                            }}
                        />
                    ))}
                </div>

                {/* Prev / Next */}
                <button
                    onClick={() => setCurrentHero((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(232,99,10,0.15)' }}
                >
                    <ChevronLeft className="w-4 h-4" style={{ color: '#E8630A' }} />
                </button>
                <button
                    onClick={() => setCurrentHero((prev) => (prev + 1) % heroSlides.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(232,99,10,0.15)' }}
                >
                    <ChevronRight className="w-4 h-4" style={{ color: '#E8630A' }} />
                </button>
            </div>

            {/* ══ Quick Stats Strip ══ */}
            <div className="px-4 md:px-6 mt-5">
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { icon: Zap, label: 'Flash Deals', color: '#E8630A' },
                        { icon: Tag, label: 'Best Price', color: '#F59E0B' },
                        { icon: TrendingUp, label: 'Trending', color: '#D97706' },
                        { icon: Package, label: 'Free Ship', color: '#B45309' },
                    ].map((item, i) => (
                        <Link
                            key={i}
                            to="/products"
                            className="flex flex-col items-center gap-2 py-4 rounded-2xl tap-ripple orange-card-hover"
                            style={{
                                background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                                border: '1.5px solid rgba(232,99,10,0.1)',
                            }}
                        >
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${item.color}15` }}>
                                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tight" style={{ color: isDarkMode ? '#ccc' : '#555' }}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ══ Category Grid ══ */}
            <div className="px-4 md:px-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-black" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>Shop by Category</h2>
                        <p className="text-xs font-medium text-gray-400">Find exactly what you need</p>
                    </div>
                    <Link to="/products" className="text-xs font-black px-3 py-1.5 rounded-full" style={{ background: 'rgba(232,99,10,0.1)', color: '#E8630A' }}>
                        See All
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categoryCards.map((cat, i) => (
                        <Link
                            key={i}
                            to={cat.link}
                            className="rounded-3xl overflow-hidden relative group tap-ripple orange-card-hover"
                            style={{
                                background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                                border: '1.5px solid rgba(232,99,10,0.1)',
                                minHeight: '170px',
                            }}
                        >
                            <div className="p-4">
                                <span className="text-2xl">{cat.emoji}</span>
                                <h3 className="font-black text-sm mt-2 mb-3 leading-tight" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>
                                    {cat.title}
                                </h3>
                                <span
                                    className="text-[10px] font-black px-2 py-1 rounded-full"
                                    style={{ background: `${cat.color}15`, color: cat.color }}
                                >
                                    Explore →
                                </span>
                            </div>
                            <div className="absolute bottom-0 right-0 w-20 h-20 flex items-end justify-end p-1">
                                <img src={cat.image} alt={cat.title} className="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ══ Today's Deals ══ */}
            <div className="px-4 md:px-6 mt-8">
                <div
                    className="rounded-3xl overflow-hidden"
                    style={{
                        background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                        border: '1.5px solid rgba(232,99,10,0.1)',
                    }}
                >
                    <div className="p-5 pb-0 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">🔥</span>
                                <h2 className="text-xl font-black" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>Today's Deals</h2>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Limited time offers you can't miss</p>
                        </div>
                        <Link
                            to="/products"
                            className="text-xs font-black px-3 py-1.5 rounded-full"
                            style={{ background: 'rgba(232,99,10,0.1)', color: '#E8630A' }}
                        >
                            View All
                        </Link>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-5 px-5 pt-4 scrollbar-hide snap-x snap-mandatory">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="min-w-[160px] md:min-w-[200px] relative group snap-start"
                                style={{
                                    background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#FFF8F0',
                                    border: '1.5px solid rgba(232,99,10,0.08)',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                }}
                            >
                                {/* Wishlist button */}
                                <button
                                    onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
                                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-90"
                                    style={{
                                        background: isInWishlist(product._id) ? '#E8630A' : 'rgba(255,255,255,0.9)',
                                    }}
                                >
                                    <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-white text-white' : 'text-gray-400'}`} />
                                </button>

                                {/* Discount badge */}
                                <div className="absolute top-3 left-3 z-20">
                                    <span
                                        className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                                        style={{ background: 'linear-gradient(135deg, #E8630A, #F59E0B)' }}
                                    >
                                        -{Math.floor(Math.random() * 40) + 10}%
                                    </span>
                                </div>

                                <Link to={`/products/${product._id}`} className="block p-4 pt-10">
                                    <div className="h-32 flex items-center justify-center mb-3">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <p className="font-black text-lg" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-gray-400 font-medium truncate text-xs mt-0.5">{product.name}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-bold text-gray-400">{product.rating?.toFixed(1)}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ Promo Banner ══ */}
            <div className="px-4 md:px-6 mt-6 mb-4">
                <div
                    className="rounded-3xl p-7 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #E8630A 0%, #F59E0B 60%, #FBBF24 100%)',
                    }}
                >
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <span className="text-white/70 text-xs font-black uppercase tracking-widest">Marketo Plus</span>
                            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 mb-2 leading-tight">
                                Join Today &<br />Save More!
                            </h2>
                            <p className="text-white/80 text-sm font-medium mb-4">
                                Free shipping, early access & exclusive rewards.
                            </p>
                            {!user && (
                                <Link
                                    to="/register"
                                    className="inline-block bg-white font-black text-sm px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95"
                                    style={{ color: '#E8630A' }}
                                >
                                    Join Now →
                                </Link>
                            )}
                        </div>
                        <div className="text-6xl md:text-8xl hidden sm:block select-none">🛍️</div>
                    </div>
                </div>
            </div>

            {/* ══ More Products Grid ══ */}
            <div className="px-4 md:px-6 mt-2 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>Recommended for You</h2>
                    <Link to="/products" className="text-xs font-black px-3 py-1.5 rounded-full" style={{ background: 'rgba(232,99,10,0.1)', color: '#E8630A' }}>
                        View All
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.slice(0, 10).map((product) => (
                        <Link
                            key={product._id}
                            to={`/products/${product._id}`}
                            className="rounded-3xl overflow-hidden group tap-ripple orange-card-hover"
                            style={{
                                background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                                border: '1.5px solid rgba(232,99,10,0.08)',
                            }}
                        >
                            <div className="relative">
                                <div
                                    className="h-40 flex items-center justify-center p-4"
                                    style={{ background: isDarkMode ? 'rgba(255,255,255,0.03)' : '#FFF8F0' }}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <button
                                    onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-90"
                                    style={{ background: isInWishlist(product._id) ? '#E8630A' : 'rgba(255,255,255,0.9)' }}
                                >
                                    <Heart className={`w-3.5 h-3.5 ${isInWishlist(product._id) ? 'fill-white text-white' : 'text-gray-400'}`} />
                                </button>
                            </div>
                            <div className="p-3">
                                <p className="text-xs text-gray-400 truncate mb-1">{product.name}</p>
                                <p className="font-black text-base" style={{ color: isDarkMode ? '#fff' : '#1C1C1E' }}>
                                    ₹{product.price.toLocaleString('en-IN')}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-xs font-bold text-gray-400">{product.rating?.toFixed(1)}</span>
                                    <span className="text-[10px] text-gray-300">({product.numReviews})</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
