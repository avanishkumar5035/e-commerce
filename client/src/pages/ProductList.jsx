import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ChevronRight, Heart } from 'lucide-react';
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

    // Removed duplicate declarations that were causing lint errors

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

    const [selectedSort, setSelectedSort] = useState(querySort);
    const [selectedRating, setSelectedRating] = useState(queryRating);

    useEffect(() => {
        if (queryCategory) setSelectedCategory(queryCategory);
        if (querySort) setSelectedSort(querySort);
        if (queryRating) setSelectedRating(queryRating);
    }, [queryCategory, querySort, queryRating]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `/api/products?keyword=${keyword}&category=${selectedCategory}&sort=${selectedSort}&rating=${selectedRating}&filter=${queryFilter}`;
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
    }, [keyword, selectedCategory, selectedSort, selectedRating, queryFilter]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-bg_soft_gray">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep_blue"></div>
        </div>
    );

    return (
        <div className="bg-bg_soft_gray min-h-screen text-dark_charcoal">
            {/* Results Header */}
            <div className="border-b border-gray-200 py-2 px-6 flex justify-between items-center shadow-sm">
                <p className="text-sm font-medium">
                    1-{products.length} of {products.length} results for <span className="text-deep_blue font-black underline decoration-sky_blue decoration-2">"{keyword || selectedCategory}"</span>
                </p>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">Sort by:</label>
                    <select
                        className="text-xs bg-gray-100 border border-gray-300 rounded px-2 py-1 outline-none"
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

            <div className="flex flex-col md:flex-row max-w-[1500px] mx-auto px-4 py-4 gap-6">
                {/* Sidebar Filter */}
                <div className="w-full md:w-60 flex-shrink-0">
                    <div className="sticky top-24">
                        <h3 className="font-bold text-sm mb-2">Category</h3>
                        <ul className="space-y-1 mb-6">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-sm hover:text-deep_blue hover:underline transition-all ${selectedCategory === cat ? 'font-black text-deep_blue underline decoration-sky_blue decoration-2' : 'text-gray-600 font-medium'}`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <h3 className="font-bold text-sm mb-2">Customer Review</h3>
                        <div className="space-y-1 mb-6">
                            {[4, 3, 2, 1].map((rating) => (
                                <div
                                    key={rating}
                                    onClick={() => setSelectedRating(rating)}
                                    className={`flex items-center gap-1 cursor-pointer group ${selectedRating == rating ? 'font-black text-deep_blue' : ''}`}
                                >
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-sky_blue text-sky_blue' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm group-hover:text-deep_blue font-medium transition-colors">& Up</span>
                                </div>
                            ))}
                            <button
                                onClick={() => setSelectedRating('')}
                                className="text-[10px] text-gray-400 hover:text-deep_blue underline mt-2"
                            >
                                Clear Rating
                            </button>
                        </div>

                        <h3 className="font-bold text-sm mb-2">Price</h3>
                        <ul className="text-sm space-y-1">
                            <li className="hover:text-sky_blue cursor-pointer transition-colors">Under ₹500</li>
                            <li className="hover:text-sky_blue cursor-pointer">₹500 - ₹1,000</li>
                            <li className="hover:text-sky_blue cursor-pointer">₹1,000 - ₹2,000</li>
                            <li className="hover:text-sky_blue cursor-pointer">₹2,000 - ₹5,000</li>
                            <li className="hover:text-sky_blue cursor-pointer">Over ₹5,000</li>
                        </ul>
                    </div>
                </div>

                {/* Product Area */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Results</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <div key={product._id} className="border border-gray-200 bg-white p-4 flex flex-col group rounded-[2rem] shadow-md hover:scale-[1.03] transition-all duration-300 relative">
                                <button
                                    onClick={() => toggleWishlist(product._id)}
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:text-rose-500 transition-all active:scale-90"
                                >
                                    <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                                </button>
                                <Link to={`/products/${product._id}`} className="flex-1">
                                    <div className="h-48 mb-4">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                    </div>
                                    <h3 className="text-sm font-black mb-1 line-clamp-2 group-hover:text-deep_blue transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-sky_blue text-sky_blue' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-deep_blue font-bold">({product.numReviews})</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs align-top">₹</span>
                                        <span className="text-2xl font-black">{product.price.toLocaleString('en-IN')}</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => addToCart(product._id, 1)}
                                    className="mt-4 w-full bg-deep_blue text-white py-3 rounded-xl text-[10px] uppercase tracking-widest font-black shadow-lg shadow-deep_blue/20 hover:bg-deep_blue_dark transition-all active:scale-95"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
