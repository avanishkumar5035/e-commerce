import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MessageSquare, Star, Trash2, Search, Filter, ChevronDown, Package } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext.jsx';
import { useTheme } from '../../context/ThemeContext';

const CommentsAdmin = () => {
    const [reviews, setReviews] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [deletingId, setDeletingId] = useState(null);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const { isDarkMode } = useTheme();

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get('/api/products/reviews/all', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setReviews(data);
            setFiltered(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            addToast('Failed to load reviews', 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchReviews();
        }
    }, [user]);

    useEffect(() => {
        let result = [...reviews];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (r) =>
                    r.reviewerName.toLowerCase().includes(q) ||
                    r.productName.toLowerCase().includes(q) ||
                    r.comment.toLowerCase().includes(q)
            );
        }
        if (ratingFilter !== 'all') {
            result = result.filter((r) => r.rating === Number(ratingFilter));
        }
        setFiltered(result);
    }, [search, ratingFilter, reviews]);

    const handleDelete = async (productId, reviewId, reviewerName) => {
        if (!window.confirm(`Delete review by "${reviewerName}"?`)) return;
        setDeletingId(reviewId);
        try {
            await axios.delete(`/api/products/${productId}/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            addToast('Review deleted successfully', 'success');
            fetchReviews();
        } catch (error) {
            addToast('Failed to delete review', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const avgRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
    }));

    const StarRow = ({ rating, size = 'w-4 h-4' }) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`${size} ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-400 dark:text-gray-600'}`}
                />
            ))}
        </div>
    );

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <div
                className="w-12 h-12 rounded-full animate-spin"
                style={{
                    border: '3px solid rgba(14,165,233,0.1)',
                    borderTop: '3px solid #0ea5e9',
                }}
            />
        </div>
    );

    return (
        <div className={`transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
                            style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
                        >
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        User Comments
                    </h1>
                    <p className={`font-medium mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Monitor and manage all product reviews</p>
                </div>
                <div
                    className="px-5 py-2.5 rounded-2xl text-sm font-black"
                    style={{
                        background: 'rgba(236,72,153,0.1)',
                        border: '1px solid rgba(236,72,153,0.2)',
                        color: '#ec4899',
                    }}
                >
                    {reviews.length} Total Reviews
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {/* Avg Rating Card */}
                <div
                    className="col-span-2 p-6 rounded-3xl relative overflow-hidden shadow-sm"
                    style={{
                        background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.1))',
                        border: '1px solid rgba(236,72,153,0.2)',
                    }}
                >
                    <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}`}>Average Rating</p>
                    <div className="flex items-end gap-3">
                        <span className={`text-5xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{avgRating}</span>
                        <div className="pb-2">
                            <StarRow rating={Math.round(avgRating)} size="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Rating distribution */}
                {ratingCounts.map(({ star, count }) => (
                    <button
                        key={star}
                        onClick={() => setRatingFilter(ratingFilter === String(star) ? 'all' : String(star))}
                        className="p-4 rounded-3xl text-left transition-all"
                        style={
                            ratingFilter === String(star)
                                ? {
                                    background: isDarkMode ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.2)',
                                    border: isDarkMode ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(251,191,36,0.4)',
                                }
                                : {
                                    background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                                    border: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(232,99,10,0.1)',
                                }
                        }
                    >
                        <div className="flex items-center gap-1 mb-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className={`text-xs font-black ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{star} Star</span>
                        </div>
                        <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{count}</p>
                        <p className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                            {reviews.length ? Math.round((count / reviews.length) * 100) : 0}%
                        </p>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div
                className="p-5 rounded-3xl mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shadow-sm"
                style={{
                    background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                    border: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(232,99,10,0.1)',
                }}
            >
                <div className="relative flex-1">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <input
                        type="text"
                        placeholder="Search by user, product, or comment..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all ${isDarkMode ? 'text-gray-300 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                        style={{
                            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(232,99,10,0.03)',
                            border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(232,99,10,0.1)',
                        }}
                    />
                </div>
                <div className="relative">
                    <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className={`pl-9 pr-10 py-3 rounded-2xl text-sm font-bold outline-none cursor-pointer appearance-none ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        style={{
                            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(232,99,10,0.03)',
                            border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(232,99,10,0.1)',
                        }}
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
                        <option value="4">4 Stars ⭐⭐⭐⭐</option>
                        <option value="3">3 Stars ⭐⭐⭐</option>
                        <option value="2">2 Stars ⭐⭐</option>
                        <option value="1">1 Star ⭐</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className={`text-sm font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Showing <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{filtered.length}</span> of {reviews.length}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filtered.length === 0 ? (
                    <div
                        className="text-center py-20 rounded-3xl"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold">No reviews found</p>
                        <p className="text-gray-700 text-sm mt-1">Try adjusting your search filters</p>
                    </div>
                ) : (
                    filtered.map((review) => (
                        <div
                            key={review._id}
                            className="p-6 rounded-3xl transition-all group"
                            style={{
                                background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff',
                                border: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(232,99,10,0.1)',
                                boxShadow: isDarkMode ? 'none' : '0 4px 15px rgba(232,99,10,0.05)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.06)' : '#fff';
                                e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(232,99,10,0.2)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.04)' : '#fff';
                                e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(232,99,10,0.1)';
                            }}
                        >
                            <div className="flex items-start gap-5">
                                {/* Reviewer Avatar */}
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                                    style={{
                                        background: `linear-gradient(135deg, hsl(${review.reviewerName.charCodeAt(0) * 5 % 360}, 60%, 40%), hsl(${review.reviewerName.charCodeAt(0) * 5 % 360 + 60}, 60%, 50%))`,
                                    }}
                                >
                                    {review.reviewerName.charAt(0).toUpperCase()}
                                </div>

                                {/* Review Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{review.reviewerName}</span>
                                                <StarRow rating={review.rating} size="w-3.5 h-3.5" />
                                                <span
                                                    className="text-[10px] font-black px-2 py-0.5 rounded-full"
                                                    style={{
                                                        background: review.rating >= 4
                                                            ? 'rgba(16,185,129,0.15)'
                                                            : review.rating === 3
                                                                ? 'rgba(245,158,11,0.15)'
                                                                : 'rgba(239,68,68,0.15)',
                                                        color: review.rating >= 4
                                                            ? '#10b981'
                                                            : review.rating === 3
                                                                ? '#f59e0b'
                                                                : '#ef4444',
                                                    }}
                                                >
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                            <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                                                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(review.productId, review._id, review.reviewerName)}
                                            disabled={deletingId === review._id}
                                            className="p-2.5 rounded-xl transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
                                            title="Delete Review"
                                        >
                                            <Trash2 className={`w-4 h-4 ${deletingId === review._id ? 'animate-spin' : ''}`} />
                                        </button>
                                    </div>

                                    {/* Comment */}
                                    <p className={`text-sm leading-relaxed mt-3 font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        "{review.comment}"
                                    </p>

                                    {/* Product Info */}
                                    <div
                                        className="flex items-center gap-3 mt-4 p-3 rounded-2xl"
                                        style={{
                                            background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(232,99,10,0.03)',
                                            border: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(232,99,10,0.1)',
                                        }}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'rgba(14,165,233,0.1)' }}
                                        >
                                            <Package className="w-4 h-4 text-sky-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>Product</p>
                                            <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`}>{review.productName}</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                                {review.productRating?.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsAdmin;
