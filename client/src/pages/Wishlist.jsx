import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Heart, Trash2, ChevronRight, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';

const Wishlist = () => {
    const { wishlist, loading, toggleWishlist } = useWishlist();
    const { addToCart } = useContext(CartContext);
    const { addToast } = useToast();

    const removeFromWishlist = (id) => {
        toggleWishlist(id);
    };

    const moveToCart = (product) => {
        addToCart(product._id, 1);
        toggleWishlist(product._id);
        addToast(`${product.name} moved to cart`, 'success');
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-deep_blue"></div>
        </div>
    );

    return (
        <div className="bg-bg_soft_gray dark:bg-slate-900 min-h-screen pb-20 font-sans">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-8 ml-1">
                    <Link to="/" className="hover:text-deep_blue dark:hover:text-sky_blue transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-extrabold text-dark_charcoal dark:text-white">Wishlist</span>
                </div>

                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-dark_charcoal dark:text-white tracking-tight mb-2">My Wishlist</h1>
                        <p className="text-text_secondary dark:text-gray-400 font-medium">Items you've saved for later</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm dark:shadow-none flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                        <span className="font-black text-dark_charcoal dark:text-white">{wishlist.length} Items</span>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-20 text-center border border-gray-100 dark:border-slate-700 shadow-xl dark:shadow-none">
                        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-rose-200 dark:text-rose-400" />
                        </div>
                        <h2 className="text-2xl font-black text-dark_charcoal dark:text-white mb-4">Your wishlist is empty</h2>
                        <p className="text-text_secondary dark:text-gray-400 mb-8 max-w-sm mx-auto">Save items you love to your wishlist. They will show up here so you can buy them later!</p>
                        <Link to="/products" className="inline-block px-10 py-4 bg-deep_blue text-white rounded-2xl font-black hover:bg-deep_blue_dark transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-deep_blue/20">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlist.map((product) => (
                            <div key={product._id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-xl dark:shadow-none overflow-hidden group hover:shadow-2xl transition-all flex flex-col h-full">
                                <div className="relative aspect-square p-8 bg-gray-50/50 dark:bg-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="absolute top-6 right-6 p-3 bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 rounded-2xl shadow-lg border border-gray-50 dark:border-slate-700 transition-all active:scale-90"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-deep_blue dark:text-sky_blue tracking-widest mb-1">{product.category}</p>
                                            <h3 className="text-lg font-black text-dark_charcoal dark:text-white line-clamp-2 leading-tight group-hover:text-deep_blue dark:group-hover:text-sky_blue transition-colors">{product.name}</h3>
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="text-2xl font-black text-dark_charcoal dark:text-white">₹{product.price?.toLocaleString()}</span>
                                            {product.countInStock > 0 ? (
                                                <span className="text-[10px] uppercase font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md tracking-wider">In Stock</span>
                                            ) : (
                                                <span className="text-[10px] uppercase font-bold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md tracking-wider">Out of Stock</span>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => moveToCart(product)}
                                                disabled={product.countInStock === 0}
                                                className="flex-1 bg-deep_blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-deep_blue/20 hover:bg-deep_blue_dark transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart className="w-4 h-4" /> Move to Cart
                                            </button>
                                            <Link
                                                to={`/products/${product._id}`}
                                                className="p-4 bg-gray-50 dark:bg-slate-700 text-dark_charcoal dark:text-white rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-all active:scale-95"
                                            >
                                                <ShoppingBag className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
