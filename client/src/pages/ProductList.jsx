import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Star, ShoppingCart } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword') || '';
    const queryCategory = searchParams.get('category');

    useEffect(() => {
        if (queryCategory) {
            setSelectedCategory(queryCategory);
        }
    }, [queryCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `/api/products?keyword=${keyword}`;
                const { data } = await axios.get(url);
                const fetchedProducts = data.products || data;

                // Extract unique categories
                const cats = ['All', ...new Set(fetchedProducts.map(p => p.category))];
                setCategories(cats);

                // Filter locally
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
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Filter */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-gray-800 border-b border-gray-100 pb-4">
                            <Filter className="w-5 h-5 text-indigo-600" />
                            <h2 className="font-bold text-lg">Filters</h2>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                            <ul className="space-y-2">
                                {categories.map((cat, idx) => (
                                    <li key={idx}>
                                        <button
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${selectedCategory === cat
                                                    ? 'bg-indigo-50 text-indigo-700'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {keyword ? `Results for "${keyword}"` : selectedCategory === 'All' ? 'All Products' : selectedCategory}
                        </h1>
                        <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                            {products.length} Products
                        </span>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 dashboard-shadow">
                            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700">No products found</h2>
                            <p className="text-gray-500 mt-2 line-clamp-2 max-w-sm mx-auto">Try adjusting your category filter or search term</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link key={product._id} to={`/products/${product._id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                                    <div className="relative aspect-[4/3] p-6 bg-gray-50 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-2">{product.brand}</div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                            ))}
                                            <span className="text-xs font-medium text-gray-500 ml-1">({product.numReviews})</span>
                                        </div>
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                                            <span className="text-xl font-extrabold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                                            <button className="text-indigo-600 bg-indigo-50 p-2.5 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
