import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, ChevronRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import CartContext from '../context/CartContext.jsx';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(product._id, qty);
        navigate('/cart');
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep_blue"></div>
        </div>
    );

    if (!product) return (
        <div className="flex flex-col items-center justify-center py-24 bg-white">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Link to="/products" className="text-blue-600 hover:underline">Back to products</Link>
        </div>
    );

    return (
        <div className="bg-bg_soft_gray min-h-screen pb-10">
            {/* Breadcrumbs */}
            <div className="px-6 py-2 text-xs text-gray-600 flex items-center gap-1 border-b border-gray-100 mb-4">
                <Link to="/products" className="hover:underline">Products</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:underline cursor-pointer">{product.category}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-400 truncate max-w-xs">{product.name}</span>
            </div>

            <div className="max-w-[1500px] mx-auto px-6 flex flex-col lg:flex-row gap-8">
                {/* Left: Image Section */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                    <div className="h-[450px] border border-gray-100 rounded-lg p-6 flex items-center justify-center bg-gray-50 overflow-hidden sticky top-24">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                        />
                    </div>
                </div>

                {/* Middle: Info Section */}
                <div className="flex-1">
                    <h1 className="text-2xl font-medium leading-tight mb-1">{product.name}</h1>
                    <p className="text-sm text-sky_blue hover:underline cursor-pointer mb-2 font-medium">Brand: {product.brand}</p>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-sky_blue text-sky_blue' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="text-sm text-sky_blue hover:underline cursor-pointer font-medium">{product.numReviews} ratings</span>
                    </div>

                    <hr className="mb-4" />

                    <div className="mb-4">
                        <div className="flex items-baseline gap-1 text-red-700">
                            <span className="text-lg">-15%</span>
                            <span className="text-xs align-top mt-1">₹</span>
                            <span className="text-3xl font-medium">{product.price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-xs text-gray-500">M.R.P.: <span className="line-through">₹{(product.price * 1.15).toLocaleString('en-IN')}</span></p>
                        <p className="text-sm mt-1 font-medium">Inclusive of all taxes</p>
                    </div>

                    {/* Features Row */}
                    <div className="grid grid-cols-4 gap-2 mb-6 border-y border-gray-100 py-4">
                        <div className="flex flex-col items-center text-center">
                            <RotateCcw className="w-6 h-6 text-deep_blue mb-2" />
                            <span className="text-[10px] text-sky_blue font-bold">7 days Replacement</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <Truck className="w-6 h-6 text-deep_blue mb-2" />
                            <span className="text-[10px] text-sky_blue font-bold">Free Delivery</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <ShieldCheck className="w-6 h-6 text-deep_blue mb-2" />
                            <span className="text-[10px] text-sky_blue font-bold">1 Year Warranty</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <MapPin className="w-6 h-6 text-deep_blue mb-2" />
                            <span className="text-[10px] text-sky_blue font-bold">ShopSphere Delivered</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold text-sm mb-2">About this item</h3>
                        <ul className="text-sm space-y-2 list-disc pl-4 text-gray-800">
                            {product.description.split('.').filter(s => s.trim()).map((sentence, idx) => (
                                <li key={idx}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Actions Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="border border-gray-300 rounded-lg p-4 space-y-4 shadow-sm sticky top-24">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs align-top">₹</span>
                            <span className="text-2xl font-medium">{product.price.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="text-sm">
                            <p className="text-sky_blue hover:underline cursor-pointer font-medium">FREE delivery</p>
                            <p className="mt-2 font-bold">Tomorrow, Feb 24</p>
                            <p className="text-xs text-gray-600">Order within 5 hrs 14 mins. <span className="text-sky_blue hover:underline cursor-pointer">Details</span></p>
                        </div>

                        <div className="flex items-center gap-1 text-green-700 font-bold text-lg">
                            In stock
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                                <span className="text-xs px-2">Quantity:</span>
                                <select
                                    className="flex-1 bg-transparent py-2 px-1 text-sm rounded-r-lg outline-none cursor-pointer"
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                >
                                    {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={addToCartHandler}
                                className="w-full bg-deep_blue text-white py-2.5 px-4 rounded-full shadow-md hover:bg-deep_blue_dark text-sm font-bold transition-all active:scale-95"
                            >
                                Add to Cart
                            </button>

                            <button className="w-full bg-deep_blue_dark text-white py-2.5 px-4 rounded-full shadow-md hover:bg-black text-sm font-bold transition-all active:scale-95">
                                Buy Now
                            </button>
                        </div>

                        <div className="text-xs space-y-1 py-4 border-t border-gray-200">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ships from</span>
                                <span>ShopSphere</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sold by</span>
                                <span className="text-sky_blue truncate hover:underline cursor-pointer font-medium">ShopSphere Direct</span>
                            </div>
                        </div>

                        <button className="w-full text-xs bg-gray-100 py-1 border border-gray-300 rounded shadow-sm hover:bg-gray-200 transition">
                            Add to Wish List
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-[1500px] mx-auto px-6 mt-12 pt-10 border-t border-gray-200">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Customer Reviews Summary */}
                    <div className="lg:w-1/3">
                        <h2 className="text-xl font-bold mb-4">Customer reviews</h2>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-sky_blue text-sky_blue' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="font-bold text-lg">{product.rating} out of 5</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">{product.numReviews} global ratings</p>

                        {/* Rating Bars (Mocked for visual) */}
                        <div className="space-y-3 mb-8">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-4 text-sm group cursor-pointer">
                                    <span className="text-sky_blue hover:underline whitespace-nowrap w-8">{star} star</span>
                                    <div className="flex-1 h-5 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                                        <div
                                            className="h-full bg-sky_blue"
                                            style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '2%' }}
                                        ></div>
                                    </div>
                                    <span className="text-gray-600 w-8">{star === 5 ? '85%' : star === 4 ? '10%' : '2%'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-6">Top reviews from India</h3>
                        <div className="space-y-8">
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((review) => (
                                    <div key={review._id} className="space-y-2 last:border-0 pb-6 border-b border-gray-100 italic">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-deep_blue">
                                                {review.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium">{review.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-sky_blue text-sky_blue' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold">Verified Purchase</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Reviewed in India on {new Date(review.createdAt).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-800 leading-relaxed font-black">{review.comment}</p>
                                        <div className="flex items-center gap-4 pt-2">
                                            <button className="text-xs px-6 py-1 border border-gray-300 rounded shadow-sm hover:bg-gray-50 font-medium">Helpful</button>
                                            <span className="text-xs text-gray-400">|</span>
                                            <button className="text-xs text-gray-500 hover:underline">Report</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-600">No reviews yet for this product.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
