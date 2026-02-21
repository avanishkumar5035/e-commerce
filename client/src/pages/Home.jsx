import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, ChevronRight, Zap, Shield, Truck } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const features = [
        { icon: <Truck className="w-8 h-8 text-indigo-500" />, title: 'Free Delivery', desc: 'On orders above ₹5000' },
        { icon: <Shield className="w-8 h-8 text-indigo-500" />, title: 'Secure Payment', desc: '100% secure payment' },
        { icon: <Zap className="w-8 h-8 text-indigo-500" />, title: 'Fast Support', desc: 'Dedicated 24/7 support' },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    const featuredProducts = products.slice(0, 4);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white mb-16 shadow-2xl">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
                <div className="relative z-10 px-8 py-20 lg:py-32 max-w-4xl mx-auto text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-800/50 backdrop-blur-sm border border-indigo-500/30 text-indigo-200 text-sm font-semibold tracking-wider mb-6">STUDENT PROJECT 2026</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Commerce.</span>
                    </h1>
                    <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto opacity-90">
                        Discover premium products with lightning-fast delivery and top-notch quality. Handpicked electronics, gaming, and lifestyle essentials.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/products" className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition transform hover:-translate-y-1 shadow-lg flex items-center gap-2">
                            Shop Now <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="bg-indigo-50 p-4 rounded-xl">{f.icon}</div>
                        <div>
                            <h3 className="font-bold text-gray-900">{f.title}</h3>
                            <p className="text-gray-500 text-sm">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Featured Products */}
            <div className="mb-20">
                <div className="flex justify-between items-end mb-10 px-2">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                        <p className="text-gray-500 mt-2">Latest additions to our premium collection</p>
                    </div>
                    <Link to="/products" className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <Link key={product._id} to={`/products/${product._id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                            <div className="relative aspect-square p-6 bg-gray-50 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                />
                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-gray-200">
                                    {product.category}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                    ))}
                                    <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                                    {product.name}
                                </h3>
                                <div className="mt-auto flex justify-between items-center">
                                    <span className="text-xl font-extrabold text-indigo-700">₹{product.price.toLocaleString('en-IN')}</span>
                                    <button className="bg-gray-900 text-white p-3 rounded-full hover:bg-indigo-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200 transition-all">
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
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
