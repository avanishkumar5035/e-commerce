import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ChevronRight, Heart, SlidersHorizontal, Sparkles } from 'lucide-react';
import AuthContext from '../context/AuthContext.jsx';
import CartContext from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('search') || '';
    const queryCategory = searchParams.get('category');
    const querySort = searchParams.get('sort') || 'Featured';
    const queryFilter = searchParams.get('filter') || '';
    const queryRating = searchParams.get('rating') || '';
    const queryMinPrice = searchParams.get('minPrice') || '';
    const queryMaxPrice = searchParams.get('maxPrice') || '';

    const [selectedSort, setSelectedSort] = useState(querySort);
    const [selectedRating, setSelectedRating] = useState(queryRating);
    const [selectedMinPrice, setSelectedMinPrice] = useState(queryMinPrice);
    const [selectedMaxPrice, setSelectedMaxPrice] = useState(queryMaxPrice);

    useEffect(() => {
        if (queryCategory) setSelectedCategory(queryCategory);
        if (querySort) setSelectedSort(querySort);
        if (queryRating) setSelectedRating(queryRating);
        if (queryMinPrice) setSelectedMinPrice(queryMinPrice);
        if (queryMaxPrice) setSelectedMaxPrice(queryMaxPrice);
    }, [queryCategory, querySort, queryRating, queryMinPrice, queryMaxPrice]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `/api/products?keyword=${keyword}&category=${selectedCategory}&sort=${selectedSort}&rating=${selectedRating}&filter=${queryFilter}`;
                if (selectedMinPrice) url += `&minPrice=${selectedMinPrice}`;
                if (selectedMaxPrice) url += `&maxPrice=${selectedMaxPrice}`;

                const { data } = await axios.get(url);
                const fetchedProducts = data.products || data;

                const cats = ['All', ...new Set(fetchedProducts.map(p => p.category))];
                if (categories.length === 0) setCategories(cats);

                setProducts(fetchedProducts);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, selectedCategory, selectedSort, selectedRating, queryFilter, selectedMinPrice, selectedMaxPrice]);

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-bg_soft_gray dark:bg-[#0E0D12]">
            <div className="w-12 h-12 rounded-full animate-spin border-3 border-orange-500/20 border-t-[#E8630A]"></div>
            <p className="mt-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Loading Products...</p>
        </div>
    );

    return (
        <div className="bg-bg_soft_gray dark:bg-[#0E0D12] min-h-screen text-dark_charcoal dark:text-gray-100 transition-colors duration-300">
            {/* Results Header Bar */}
            <div className="border-b border-gray-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#131117]/80 backdrop-blur-md py-3 px-4 md:px-8 flex flex-wrap justify-between items-center gap-3 sticky top-16 z-30 shadow-xs">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400">Products</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Showing {products.length} items {keyword && <span>for <span className="text-[#E8630A] dark:text-[#F59E0B] font-bold">"{keyword}"</span></span>}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sort by:</label>
                    <select
                        className="text-xs font-semibold bg-white dark:bg-[#1B1822] border border-gray-300 dark:border-white/10 rounded-xl px-3 py-1.5 outline-none text-dark_charcoal dark:text-gray-200 focus:border-[#E8630A] transition cursor-pointer shadow-xs"
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                    >
                        <option value="Featured">Featured</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="rating">Avg. Customer Review</option>
                        <option value="newest">Newest Arrivals</option>
                        <option value="bestsellers">Best Sellers</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col md:flex-row max-w-[1550px] mx-auto px-4 md:px-6 py-6 gap-6">
                {/* Sidebar Filter */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-32 bg-white dark:bg-[#15131B] border border-gray-200/80 dark:border-white/[0.06] rounded-3xl p-5 shadow-sm space-y-6">
                        {/* Category Filter */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-black text-xs uppercase tracking-wider text-gray-400 dark:text-gray-400">
                                    Category
                                </h3>
                                <span className="text-[10px] bg-orange-100 dark:bg-orange-950/60 text-[#E8630A] dark:text-[#F59E0B] px-2 py-0.5 rounded-full font-bold">
                                    {categories.length}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
                                {categories.map((cat) => {
                                    const active = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`text-xs font-bold text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                                                active
                                                    ? 'bg-[#E8630A] text-white shadow-md shadow-orange-500/20'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-white/5 hover:text-[#E8630A] dark:hover:text-[#F59E0B]'
                                            }`}
                                        >
                                            <span>{cat}</span>
                                            {active && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Customer Review Filter */}
                        <div className="border-t border-gray-100 dark:border-white/[0.06] pt-5">
                            <h3 className="font-black text-xs uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-3">
                                Customer Review
                            </h3>
                            <div className="space-y-1.5">
                                {[4, 3, 2, 1].map((rating) => {
                                    const active = selectedRating == rating;
                                    return (
                                        <div
                                            key={rating}
                                            onClick={() => setSelectedRating(rating)}
                                            className={`flex items-center justify-between px-3 py-1.5 rounded-xl cursor-pointer transition ${
                                                active
                                                    ? 'bg-orange-50 dark:bg-orange-950/30 ring-1 ring-[#E8630A]'
                                                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3.5 h-3.5 ${
                                                            i < rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-300 dark:text-gray-700'
                                                        }`}
                                                    />
                                                ))}
                                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 ml-1.5">& Up</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {selectedRating && (
                                    <button
                                        onClick={() => setSelectedRating('')}
                                        className="text-[11px] font-bold text-[#E8630A] hover:underline mt-1 block px-3 cursor-pointer"
                                    >
                                        ✕ Clear Rating
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="border-t border-gray-100 dark:border-white/[0.06] pt-5">
                            <h3 className="font-black text-xs uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-3">
                                Price Range
                            </h3>
                            <div className="space-y-1">
                                {[
                                    { label: 'Under ₹500', min: '', max: '500' },
                                    { label: '₹500 - ₹1,000', min: '500', max: '1000' },
                                    { label: '₹1,000 - ₹2,000', min: '1000', max: '2000' },
                                    { label: '₹2,000 - ₹5,000', min: '2000', max: '5000' },
                                    { label: 'Over ₹5,000', min: '5000', max: '' },
                                ].map((range, index) => {
                                    const isSelected = selectedMinPrice === range.min && selectedMaxPrice === range.max;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedMinPrice(range.min);
                                                setSelectedMaxPrice(range.max);
                                            }}
                                            className={`w-full text-xs font-bold text-left px-3 py-2 rounded-xl transition cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#E8630A]/10 text-[#E8630A] dark:bg-[#E8630A]/20 dark:text-[#F59E0B] ring-1 ring-[#E8630A]/30'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    );
                                })}
                                {(selectedMinPrice || selectedMaxPrice) && (
                                    <button
                                        onClick={() => {
                                            setSelectedMinPrice('');
                                            setSelectedMaxPrice('');
                                        }}
                                        className="text-[11px] font-bold text-[#E8630A] hover:underline mt-1 block px-3 cursor-pointer"
                                    >
                                        ✕ Clear Price
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid Area */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="group bg-white dark:bg-[#17151D] border border-gray-200/80 dark:border-white/[0.07] hover:border-orange-500/40 dark:hover:border-orange-500/50 p-4 flex flex-col rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Wishlist Button */}
                                <button
                                    onClick={() => toggleWishlist(product._id)}
                                    className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 dark:bg-[#201D29]/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/60 dark:border-white/[0.08] hover:text-rose-500 transition-all active:scale-90 cursor-pointer"
                                >
                                    <Heart
                                        className={`w-4 h-4 ${
                                            isInWishlist(product._id)
                                                ? 'fill-rose-500 text-rose-500'
                                                : 'text-gray-400 hover:text-rose-500'
                                        }`}
                                    />
                                </button>

                                <Link to={`/products/${product._id}`} className="flex-1 flex flex-col">
                                    {/* Product Image Frame */}
                                    <div className="h-52 mb-4 bg-gradient-to-b from-gray-50 to-gray-100/60 dark:from-[#211E29] dark:to-[#191721] border border-gray-100 dark:border-white/[0.04] rounded-2xl p-4 flex items-center justify-center overflow-hidden relative">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 filter drop-shadow-md"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800';
                                            }}
                                        />
                                    </div>

                                    {/* Category badge */}
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[#E8630A] dark:text-[#F59E0B] mb-1">
                                        {product.category}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-sm font-bold mb-1.5 line-clamp-2 text-gray-900 dark:text-white group-hover:text-[#E8630A] dark:group-hover:text-[#F59E0B] transition-colors leading-snug">
                                        {product.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${
                                                        i < Math.round(product.rating)
                                                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                                                            : 'text-gray-300 dark:text-gray-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                                            ({product.numReviews})
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="mt-auto pt-2 flex items-baseline gap-1 text-gray-900 dark:text-white">
                                        <span className="text-sm font-bold text-[#E8630A] dark:text-[#F59E0B]">₹</span>
                                        <span className="text-2xl font-black tracking-tight">
                                            {product.price.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </Link>

                                {/* Add to Cart button */}
                                <button
                                    onClick={() => addToCart(product._id, 1)}
                                    className="mt-4 w-full bg-gradient-to-r from-[#E8630A] to-[#F59E0B] hover:from-[#C4500A] hover:to-[#D97706] text-white py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-[#16141D] rounded-3xl border border-gray-200/80 dark:border-white/[0.06] p-8">
                            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">No products found</p>
                            <p className="text-xs text-gray-400 mt-1">Try clearing your filters or search with another keyword.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
