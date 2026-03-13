import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, ChevronRight, ShieldCheck, Truck, RotateCcw, Heart, MessageSquare, Send, Cpu, Camera, HardDrive, Package, CheckCircle, Tag, CreditCard, X } from 'lucide-react';
import AuthContext from '../context/AuthContext.jsx';
import CartContext from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const { addToast } = useToast();
    const { toggleWishlist, isInWishlist: checkWishlist } = useWishlist();

    const [deliveryPincode, setDeliveryPincode] = useState(() => {
        const stored = localStorage.getItem('deliveryLocation');
        return (stored && /^\d{6}$/.test(stored)) ? stored : '281406';
    });
    const [deliveryPlaceName, setDeliveryPlaceName] = useState(() => {
        return localStorage.getItem('deliveryPlaceName') || 'Mathura, Uttar Pradesh';
    });
    const [isCheckingPincode, setIsCheckingPincode] = useState(false);
    const [showPincodeInput, setShowPincodeInput] = useState(false);
    const [pincodeInput, setPincodeInput] = useState(deliveryPincode);
    const [deliveryMessage, setDeliveryMessage] = useState('Usually delivered in 3-5 days');

    // Bank Offer State
    const [appliedOffer, setAppliedOffer] = useState(null);
    const [showBankModal, setShowBankModal] = useState(false);
    const [selectedBankOffer, setSelectedBankOffer] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);

    const handleApplyOfferClick = (offerId, offerName) => {
        if (appliedOffer === offerId) {
            setAppliedOffer(null);
            addToast(`Removed ${offerName}`, 'info');
        } else {
            setSelectedBankOffer({ id: offerId, name: offerName });
            setShowBankModal(true);
        }
    };

    const submitBankDetails = (e) => {
        e.preventDefault();
        // Basic validation
        if (cardNumber.replace(/\s/g, '').length < 16 || !expiryDate || cvv.length < 3) {
            addToast('Please enter valid card details to apply this offer', 'error');
            return;
        }
        setAppliedOffer(selectedBankOffer.id);
        addToast(`${selectedBankOffer.name} applied successfully!`, 'success');
        setShowBankModal(false);
        // Reset form
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
    };

    const checkDelivery = async () => {
        if (!pincodeInput || !/^\d{6}$/.test(pincodeInput)) {
            addToast('Please enter a valid 6-digit pincode', 'error');
            return;
        }
        setIsCheckingPincode(true);
        try {
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pincodeInput}`);
            const data = response.data[0];
            if (data.Status === "Success" && data.PostOffice && data.PostOffice.length > 0) {
                const po = data.PostOffice[0];
                const place = `${po.District}, ${po.State}`;
                setDeliveryPincode(pincodeInput);
                setDeliveryPlaceName(place);
                localStorage.setItem('deliveryLocation', pincodeInput);
                localStorage.setItem('deliveryPlaceName', place);
                setDeliveryMessage(`Delivering to ${place} in 3-5 days`);
                setShowPincodeInput(false);
                addToast(`Delivery updated to ${place}`, 'success');
            } else {
                addToast('Invalid Pincode. Using estimated delivery.', 'info');
                // Fallback if API says invalid but user typed 6 digits
                setDeliveryPincode(pincodeInput);
                setDeliveryPlaceName('India');
                localStorage.setItem('deliveryLocation', pincodeInput);
                localStorage.setItem('deliveryPlaceName', 'India');
                setDeliveryMessage('Usually delivered in 3-5 days');
                setShowPincodeInput(false);
            }
        } catch (error) {
            // Error handling if API fails (e.g. CORS or network)
            setDeliveryPincode(pincodeInput);
            setDeliveryPlaceName('India');
            localStorage.setItem('deliveryLocation', pincodeInput);
            setDeliveryMessage('Usually delivered in 3-5 days');
            setShowPincodeInput(false);
            addToast('Location updated', 'success');
        } finally {
            setIsCheckingPincode(false);
        }
    };

    const handleApplyOffer = (offerId, offerName) => {
        if (appliedOffer === offerId) {
            setAppliedOffer(null);
            addToast(`Removed ${offerName}`, 'info');
        } else {
            setAppliedOffer(offerId);
            addToast(`${offerName} applied successfully!`, 'success');
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setSelectedImage(data.image);
                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0].name);
                }

                // Fetch related products
                const relatedRes = await axios.get('/api/products');
                const allP = relatedRes.data.products || relatedRes.data;
                const filtered = allP.filter(p => p.category === data.category && p._id !== data._id).slice(0, 4);
                setRelatedProducts(filtered);

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const toggleWishlistHandler = () => {
        toggleWishlist(product._id);
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            addToast('Please select a rating', 'info');
            return;
        }
        setSubmittingReview(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
            addToast('Review Submitted Successfully!', 'success');
            setRating(0);
            setComment('');
            // Refresh product data
            const { data } = await axios.get(`/api/products/${id}`);
            setProduct(data);
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to submit review', 'error');
        } finally {
            setSubmittingReview(false);
        }
    };

    const addToCartHandler = () => {
        addToCart(product._id, qty, getDiscountedPrice());
        navigate('/cart');
    };

    const buyNowHandler = () => {
        addToCart(product._id, qty, getDiscountedPrice());
        navigate('/shipping');
    };

    const getDiscountedPrice = () => {
        if (!product || !product.price) return 0;
        if (appliedOffer === 'axis') return product.price - Math.floor(product.price * 0.05); // 5%
        if (appliedOffer === 'sbi') return product.price - Math.floor(product.price * 0.10);  // 10%
        return product.price;
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep_blue dark:border-sky_blue"></div>
        </div>
    );

    if (!product) return (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 text-dark_charcoal dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Link to="/products" className="text-blue-600 dark:text-sky_blue hover:underline">Back to products</Link>
        </div>
    );

    return (
        <div className="bg-bg_soft_gray dark:bg-slate-900 min-h-screen pb-10 text-dark_charcoal dark:text-gray-100">
            {/* Breadcrumbs */}
            <div className="px-6 py-2 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 border-b border-gray-100 dark:border-slate-800 mb-4">
                <Link to="/products" className="hover:underline">Products</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:underline cursor-pointer">{product.category}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-400 dark:text-gray-500 truncate max-w-xs">{product.name}</span>
            </div>

            <div className="max-w-[1500px] mx-auto px-6 flex flex-col lg:flex-row gap-8">
                {/* Left: Image Section */}
                <div className="lg:w-1/3 flex flex-col gap-4 sticky top-24 h-fit">
                    <div className="h-[450px] border border-gray-100 dark:border-slate-800 rounded-lg p-6 flex items-center justify-center bg-white dark:bg-gray-50 overflow-hidden shadow-sm">
                        <img
                            src={selectedImage || product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                        />
                    </div>

                    {/* Gallery Thumbnails */}
                    {product.images && product.images.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-1">
                            {/* Main Image Thumbnail */}
                            <div
                                onClick={() => setSelectedImage(product.image)}
                                className={`w-16 h-16 flex-shrink-0 border-2 rounded-lg p-1 cursor-pointer transition-all bg-white dark:bg-gray-50 ${selectedImage === product.image ? 'border-deep_blue shadow-md' : 'border-gray-200 dark:border-slate-300 hover:border-deep_blue/50'}`}
                            >
                                <img src={product.image} alt="Main" className="w-full h-full object-contain mix-blend-multiply rounded-md" />
                            </div>
                            {/* Additional Images */}
                            {product.images.map((imgUrl, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedImage(imgUrl)}
                                    className={`w-16 h-16 flex-shrink-0 border-2 rounded-lg p-1 cursor-pointer transition-all bg-white dark:bg-gray-50 ${selectedImage === imgUrl ? 'border-deep_blue shadow-md' : 'border-gray-200 dark:border-slate-300 hover:border-deep_blue/50'}`}
                                >
                                    <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply rounded-md" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Middle: Info Section */}
                <div className="flex-1">
                    <h1 className="text-2xl font-medium leading-tight mb-1">{product.name}</h1>
                    <p className="text-sm text-sky_blue hover:underline cursor-pointer mb-2 font-medium">Brand: {product.brand}</p>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-sky_blue text-sky_blue' : 'text-gray-300 dark:text-gray-600'}`} />
                            ))}
                        </div>
                        <span className="text-sm text-sky_blue hover:underline cursor-pointer font-medium">{product.numReviews} ratings</span>
                    </div>

                    <hr className="mb-4 border-gray-200 dark:border-slate-800" />

                    <div className="mb-6">
                        <div className="flex items-baseline gap-1 text-red-700 dark:text-red-400">
                            <span className="text-lg">-15%</span>
                            <span className="text-xs align-top mt-1">₹</span>
                            <span className="text-3xl font-medium text-dark_charcoal dark:text-white">{getDiscountedPrice().toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">M.R.P.: <span className="line-through">₹{(product.price * 1.15).toLocaleString('en-IN')}</span></p>
                        <p className="text-sm mt-1 font-medium text-dark_charcoal dark:text-gray-300">Inclusive of all taxes</p>
                    </div>

                    {/* Offers & EMI */}
                    <div className="mb-6 space-y-4">
                        {/* Bank Offers */}
                        <div className="border border-sky_blue/20 bg-[#f4f8fc] dark:bg-sky_blue/10 rounded-xl p-4">
                            <h4 className="text-[15px] font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-sky_blue" />
                                Bank offers
                            </h4>
                            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
                                <div className={`min-w-[240px] border relative rounded-xl p-3 shadow-sm transition-all ${appliedOffer === 'axis' ? 'border-green-500 bg-green-50/30 dark:bg-green-500/10' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                                    <div className="absolute -top-3 left-3 text-[11px] font-bold bg-[#fdf3c6] text-yellow-900 px-2.5 py-1 rounded">Best value for you</div>
                                    <div className="flex justify-between items-start mb-2 mt-2">
                                        <div>
                                            <p className="font-bold text-[15px] text-gray-900 dark:text-white">₹{Math.floor(product.price * 0.05).toLocaleString('en-IN')} off</p>
                                            <p className="text-[13px] text-gray-500 dark:text-gray-400">Flipkart Axis</p>
                                        </div>
                                        {appliedOffer === 'axis' ? (
                                            <span onClick={() => handleApplyOfferClick('axis', 'Flipkart Axis Offer')} className="text-green-600 text-[13px] font-bold cursor-pointer hover:underline flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Applied</span>
                                        ) : (
                                            <span onClick={() => handleApplyOfferClick('axis', 'Flipkart Axis Offer')} className="text-sky_blue text-[13px] font-bold cursor-pointer hover:underline">Apply</span>
                                        )}
                                    </div>
                                    <p className="text-[13px] text-gray-600 dark:text-gray-400 border-t mt-3 pt-2 border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                        Credit Card • Cashback <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </p>
                                </div>
                                <div className={`min-w-[240px] border rounded-xl p-3 shadow-sm pt-5 transition-all ${appliedOffer === 'sbi' ? 'border-green-500 bg-green-50/30 dark:bg-green-500/10' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-[15px] text-gray-900 dark:text-white">₹{Math.floor(product.price * 0.10).toLocaleString('en-IN')} off</p>
                                            <p className="text-[13px] text-gray-500 dark:text-gray-400">Flipkart SBI</p>
                                        </div>
                                        {appliedOffer === 'sbi' ? (
                                            <span onClick={() => handleApplyOfferClick('sbi', 'Flipkart SBI Offer')} className="text-green-600 text-[13px] font-bold cursor-pointer hover:underline flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Applied</span>
                                        ) : (
                                            <span onClick={() => handleApplyOfferClick('sbi', 'Flipkart SBI Offer')} className="text-sky_blue text-[13px] font-bold cursor-pointer hover:underline">Apply</span>
                                        )}
                                    </div>
                                    <p className="text-[13px] text-gray-600 dark:text-gray-400 border-t mt-3 pt-2 border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                        Credit Card • Cashback <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* EMI Banner */}
                        <div onClick={() => addToast('Redirecting to secure Partner Portal for Card EMI Application...', 'info')} className="border border-gray-200 dark:border-slate-800 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[15px] font-bold text-gray-900 dark:text-white">Apply for Card and Instant EMI</h4>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex gap-3 focus:outline-none">
                                <div className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl p-3.5 flex gap-4 items-center">
                                    <div className="w-10 h-8 border border-deep_blue rounded flex items-center justify-center bg-white flex-shrink-0">
                                        <div className="w-full h-1 bg-deep_blue mb-3"></div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-gray-900 dark:text-white">Get ₹1250 Voucher | 5% Cash...</p>
                                        <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-1">Flipkart Axis Bank Credit Card</p>
                                        <span className="text-sky_blue text-[13px] font-bold hover:underline">Apply Now</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="mb-6">
                        <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-4">Delivery details</h3>
                        <div className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                            <div className="bg-[#f8f9fa] dark:bg-slate-800/50 p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border-b border-gray-200 dark:border-slate-800 gap-y-3">
                                <div className="flex items-center gap-2.5">
                                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-bold text-gray-900 dark:text-white">
                                            {deliveryPlaceName} - {deliveryPincode}
                                        </span>
                                    </div>
                                </div>
                                {showPincodeInput ? (
                                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                        <input
                                            type="text"
                                            placeholder="Enter Pincode"
                                            value={pincodeInput}
                                            onChange={(e) => setPincodeInput(e.target.value)}
                                            className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-dark_charcoal dark:text-white rounded px-3 py-1 text-sm outline-none focus:border-sky_blue w-full sm:w-32"
                                            maxLength={6}
                                        />
                                        <button
                                            onClick={checkDelivery}
                                            disabled={isCheckingPincode}
                                            className="bg-deep_blue text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-deep_blue_dark disabled:opacity-50"
                                        >
                                            {isCheckingPincode ? '...' : 'Check'}
                                        </button>
                                        <button onClick={() => setShowPincodeInput(false)} className="text-gray-400 hover:text-gray-600 ml-1">
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <span onClick={() => setShowPincodeInput(true)} className="text-sky_blue text-[14px] font-bold cursor-pointer flex items-center hover:underline">
                                        Select delivery location <ChevronRight className="w-4 h-4 ml-0.5" />
                                    </span>
                                )}
                            </div>
                            <div className="p-4 flex items-center gap-2.5 border-b border-gray-200 dark:border-slate-800 bg-[#fefefe] dark:bg-slate-800/80">
                                <Truck className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                                <span className="text-[15px] font-bold text-gray-900 dark:text-white">{deliveryMessage}</span>
                            </div>
                            <div className="p-4 flex items-start gap-2.5 bg-[#fefefe] dark:bg-slate-800/80">
                                <Package className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-[15px] text-gray-700 dark:text-gray-300">Fulfilled by Vision Star</p>
                                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">4.7 ★ • 8 years positive rating</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm text-gray-700 dark:text-gray-300 font-bold mb-3">
                                Color: <span className="text-deep_blue dark:text-sky_blue font-black">{selectedColor}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map(color => (
                                    <div
                                        key={color.name}
                                        onClick={() => {
                                            setSelectedImage(color.image);
                                            setSelectedColor(color.name);
                                        }}
                                        className={`w-16 h-16 border-2 rounded-lg p-1 cursor-pointer transition-all bg-white dark:bg-gray-50 ${selectedColor === color.name ? 'border-sky_blue shadow-[0_0_0_1px_rgba(2,132,199,1)]' : 'border-gray-200 dark:border-slate-300 hover:border-gray-400'}`}
                                    >
                                        <img src={color.image} alt={color.name} className="w-full h-full object-contain mix-blend-multiply rounded-md" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features Row */}
                    <div className="grid grid-cols-4 gap-2 mb-6 border-y border-gray-100 dark:border-slate-800 py-4">
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

                    {/* Product Highlights */}
                    {product.highlights && product.highlights.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-bold text-lg text-dark_charcoal dark:text-white mb-4">Product Highlights</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.highlights.map((highlight, idx) => {
                                    let Icon = CheckCircle;
                                    const text = (highlight.title + highlight.description).toLowerCase();
                                    if (text.includes('rom') || text.includes('ram') || text.includes('storage') || text.includes('memory') || text.includes('gb')) Icon = HardDrive;
                                    else if (text.includes('chip') || text.includes('processor') || text.includes('core')) Icon = Cpu;
                                    else if (text.includes('camera') || text.includes('lens') || text.includes('zoom')) Icon = Camera;
                                    else if (text.includes('box') || text.includes('cable') || text.includes('charger')) Icon = Package;

                                    return (
                                        <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md hover:border-sky_blue/30 group">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:bg-sky_blue/5 transition-colors">
                                                <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-deep_blue dark:group-hover:text-sky_blue" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight mb-1">{highlight.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{highlight.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="font-bold text-sm mb-2 text-dark_charcoal dark:text-white">About this item</h3>
                        <ul className="text-sm space-y-2 list-disc pl-4 text-gray-800 dark:text-gray-300">
                            {product.description.split('.').filter(s => s.trim()).map((sentence, idx) => (
                                <li key={idx}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Actions Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-4 space-y-4 shadow-sm sticky top-24">
                        <div className="flex flex-col gap-1">
                            {appliedOffer && (
                                <div className="flex items-center">
                                    <span className="text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-bold px-2 py-0.5 rounded tracking-wide uppercase">Bank Offer Applied</span>
                                </div>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs align-top">₹</span>
                                <span className="text-2xl font-medium text-dark_charcoal dark:text-white">{getDiscountedPrice().toLocaleString('en-IN')}</span>
                                {appliedOffer && (
                                    <span className="text-sm line-through text-gray-500 dark:text-gray-400 ml-1">₹{product.price.toLocaleString('en-IN')}</span>
                                )}
                            </div>
                        </div>

                        <div className="text-sm">
                            <p className="text-sky_blue hover:underline cursor-pointer font-medium">FREE delivery</p>
                            <p className="mt-2 font-bold text-dark_charcoal dark:text-white">Tomorrow, Feb 24</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Order within 5 hrs 14 mins. <span className="text-sky_blue hover:underline cursor-pointer">Details</span></p>
                        </div>

                        <div className="flex items-center gap-1 text-green-700 font-bold text-lg">
                            In stock
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm text-dark_charcoal dark:text-white">
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

                            <button
                                onClick={buyNowHandler}
                                className="w-full bg-deep_blue_dark text-white py-2.5 px-4 rounded-full shadow-md hover:bg-black text-sm font-bold transition-all active:scale-95"
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="text-xs space-y-1 py-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Ships from</span>
                                <span className="text-dark_charcoal dark:text-white">ShopSphere</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Sold by</span>
                                <span className="text-sky_blue truncate hover:underline cursor-pointer font-medium">ShopSphere Direct</span>
                            </div>
                        </div>

                        <button
                            onClick={toggleWishlistHandler}
                            className={`w-full text-xs py-2 border rounded shadow-sm transition-all flex items-center justify-center gap-2 font-bold ${checkWishlist(product._id) ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-500 dark:text-rose-400' : 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 text-dark_charcoal dark:text-white'}`}
                        >
                            <Heart className={`w-4 h-4 ${checkWishlist(product._id) ? 'fill-rose-500' : ''}`} />
                            {checkWishlist(product._id) ? 'In Wish List' : 'Add to Wish List'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-[1500px] mx-auto px-6 mt-12 pt-10 border-t border-gray-200 dark:border-slate-800">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Customer Reviews Summary */}
                    <div className="lg:w-1/3">
                        <h2 className="text-xl font-bold mb-4 text-dark_charcoal dark:text-white">Customer reviews</h2>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-sky_blue text-sky_blue' : 'text-gray-300 dark:text-gray-600'}`} />
                                ))}
                            </div>
                            <span className="font-bold text-lg text-dark_charcoal dark:text-white">{product.rating} out of 5</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{product.numReviews} global ratings</p>

                        {/* Rating Bars (Mocked for visual) */}
                        <div className="space-y-3 mb-8">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-4 text-sm group cursor-pointer">
                                    <span className="text-sky_blue hover:underline whitespace-nowrap w-8">{star} star</span>
                                    <div className="flex-1 h-5 bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 overflow-hidden">
                                        <div
                                            className="h-full bg-sky_blue"
                                            style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '2%' }}
                                        ></div>
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-400 w-8">{star === 5 ? '85%' : star === 4 ? '10%' : '2%'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="flex-1">
                        {/* Write a review */}
                        {user ? (
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-xl dark:shadow-none mb-12">
                                <h3 className="text-xl font-black text-dark_charcoal dark:text-white mb-6 flex items-center gap-2">
                                    <MessageSquare className="w-6 h-6 text-deep_blue dark:text-sky_blue" />
                                    Write a Customer Review
                                </h3>
                                <form onSubmit={submitReviewHandler} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Overall Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="transition-transform active:scale-90"
                                                >
                                                    <Star className={`w-8 h-8 ${star <= rating ? 'fill-sky_blue text-sky_blue' : 'text-gray-200 dark:text-slate-600'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Add a written review</label>
                                        <textarea
                                            rows="4"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="What did you like or dislike? What should other customers know?"
                                            className="w-full p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-deep_blue/5 dark:focus:ring-sky_blue/10 focus:border-deep_blue/20 dark:focus:border-sky_blue/30 transition-all text-sm text-dark_charcoal dark:text-white"
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="bg-deep_blue text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-deep_blue_dark transition-all shadow-lg shadow-deep_blue/20 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-gray-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-700 text-center mb-12">
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Please <Link to="/login" className="text-deep_blue dark:text-sky_blue font-black hover:underline">sign in</Link> to write a review</p>
                            </div>
                        )}

                        <h3 className="text-xl font-bold mb-6 text-dark_charcoal dark:text-white">Top reviews from India</h3>
                        <div className="space-y-8">
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((review) => (
                                    <div key={review._id} className="space-y-2 last:border-0 pb-6 border-b border-gray-100 dark:border-slate-800 italic">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-sky_blue/10 flex items-center justify-center text-xs font-bold text-deep_blue dark:text-sky_blue">
                                                {review.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium">{review.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-sky_blue text-sky_blue' : 'text-gray-300 dark:text-slate-600'}`} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-dark_charcoal dark:text-gray-200">Verified Purchase</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Reviewed in India on {new Date(review.createdAt).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-black">{review.comment}</p>
                                        <div className="flex items-center gap-4 pt-2">
                                            <button className="text-xs px-6 py-1 border border-gray-300 dark:border-slate-700 text-dark_charcoal dark:text-gray-300 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 font-medium">Helpful</button>
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

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="max-w-[1500px] mx-auto px-6 mt-12 pt-10 border-t border-gray-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Similar Products You Might Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(item => (
                            <Link to={`/product/${item._id}`} key={item._id} className="group bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:shadow-none hover:border-sky_blue/30 transition-all duration-300">
                                <div className="aspect-square mb-4 bg-gray-50 dark:bg-gray-50 rounded-xl overflow-hidden relative p-4 flex items-center justify-center">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="font-bold text-gray-800 dark:text-white truncate mb-1">{item.name}</h3>
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className="w-4 h-4 fill-sky_blue text-sky_blue" />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.rating}</span>
                                    <span className="text-xs text-gray-400">({item.numReviews})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black text-gray-900 dark:text-white">₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Bank details modal */}
            {showBankModal && selectedBankOffer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBankModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm overflow-hidden premium-shadow dark:shadow-none border dark:border-slate-800 transform transition-all scale-100 relative" onClick={(e) => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-sky_blue/5 dark:bg-sky_blue/10 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                                <CreditCard className="w-5 h-5 text-deep_blue dark:text-sky_blue" />
                                {selectedBankOffer.name}
                            </h3>
                            <button onClick={() => setShowBankModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={submitBankDetails} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    maxLength={19}
                                    className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-dark_charcoal dark:text-white rounded-lg px-3 py-2.5 outline-none focus:border-deep_blue dark:focus:border-sky_blue focus:ring-1 focus:ring-deep_blue dark:focus:ring-sky_blue transition-all"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-dark_charcoal dark:text-white rounded-lg px-3 py-2.5 outline-none focus:border-deep_blue dark:focus:border-sky_blue focus:ring-1 focus:ring-deep_blue dark:focus:ring-sky_blue transition-all"
                                        value={expiryDate}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/\D/g, '');
                                            if (val.length >= 2) {
                                                val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                            }
                                            setExpiryDate(val);
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                                    <input
                                        type="password"
                                        placeholder="XXX"
                                        maxLength={3}
                                        className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-dark_charcoal dark:text-white rounded-lg px-3 py-2.5 outline-none focus:border-deep_blue dark:focus:border-sky_blue focus:ring-1 focus:ring-deep_blue dark:focus:ring-sky_blue transition-all"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure 256-bit encryption. No money will be deducted.</p>
                            <button type="submit" className="w-full bg-deep_blue hover:bg-deep_blue_dark text-white font-bold py-3 mt-4 rounded-xl shadow-md transition-all active:scale-[0.98]">
                                Verify Card & Apply Offer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
