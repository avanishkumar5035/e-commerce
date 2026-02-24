import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Star, ChevronRight } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('search') || '';
    const queryCategory = searchParams.get('category');

    useEffect(() => {
        if (queryCategory) {
            setSelectedCategory(queryCategory);
        }
    }, [queryCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `/api/products?keyword=${keyword}`; // The backend still uses 'keyword'
                const { data } = await axios.get(url);
                const fetchedProducts = data.products || data;

                const cats = ['All', ...new Set(fetchedProducts.map(p => p.category))];
                setCategories(cats);

                if (selectedCategory !== 'All') {
                    setProducts(fetchedProducts.filter(p => p.category === selectedCategory));
                } else {
                    setProducts(fetchedProducts);
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, selectedCategory]);

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
                    <select className="text-xs bg-gray-100 border border-gray-300 rounded px-2 py-1 outline-none">
                        <option>Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Avg. Customer Review</option>
                        <option>Newest Arrivals</option>
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
                                <div key={rating} className="flex items-center gap-1 cursor-pointer group">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-sky_blue text-sky_blue' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm group-hover:text-deep_blue font-medium transition-colors">& Up</span>
                                </div>
                            ))}
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
                            <div key={product._id} className="border border-gray-200 bg-white p-4 flex flex-col group rounded-lg shadow-md hover:scale-[1.03] transition-all duration-300">
                                <Link to={`/products/${product._id}`} className="flex-1">
                                    <div className="h-48 mb-4">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                    </div>
                                    <h3 className="text-sm font-black mb-1 line-clamp-2 group-hover:text-sky_blue transition-colors">
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
                                        <span className="text-2xl font-bold">{product.price.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        <p>Save extra with no cost EMI</p>
                                        <p className="mt-1">Get it by <span className="font-bold text-gray-900">Tomorrow</span></p>
                                        <p>FREE Delivery by ShopSphere</p>
                                    </div>
                                </Link>
                                <button className="mt-4 w-full bg-deep_blue text-white py-2.5 rounded-xl text-xs font-black shadow-lg shadow-deep_blue/20 hover:bg-deep_blue_dark transition-all active:scale-95">
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
