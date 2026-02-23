import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentHero, setCurrentHero] = useState(0);

    const heroImages = [
        "https://images-eu.ssl-images-amazon.com/images/G/31/img21/MA2024/GW/Aug/Unrec/BAU/PC/1-1._CB566141315_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Softlines/Hobby/Gaming/GW/PC_Hero_3000x1200_1._CB565866162_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devicenext/Feb24/GW/PC_Hero_3000x1200_1._CB581894452_.jpg"
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

        const timer = setInterval(() => {
            setCurrentHero((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary_navy"></div>
        </div>
    );

    const categories = [
        { title: "Up to 70% off | Styles for men", image: "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Fashion/Gateway/BAU/BTF-Refresh/May/PF_MF/MF-1-186-116._SY116_CB636110853_.jpg", link: "/products?category=Men" },
        { title: "Appliances for your home", image: "https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/IFA/PC_Dash_Default_1x._SY304_CB636110853_.jpg", link: "/products" },
        { title: "Revamp your home in style", image: "https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/Home_decor_379x304._SY304_CB580970634_.jpg", link: "/products" },
        { title: "Latest Smartwatches", image: "https://images-eu.ssl-images-amazon.com/images/G/31/img21/Smartwatches/CE/Nov24/GW/BTW/Unrec/379x304._SY304_CB541819777_.jpg", link: "/products" }
    ];

    return (
        <div className="bg-bg_light min-h-screen pb-10 font-sans">
            {/* Hero Section */}
            <div className="relative h-[600px] overflow-hidden bg-gradient-to-r from-[#f8f9fa] to-[#eaeDED]">
                <div className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out">
                    <img
                        src={heroImages[currentHero]}
                        alt="Hero"
                        className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]"
                    />
                </div>

                {/* Hero Navigation */}
                <button
                    onClick={() => setCurrentHero((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                    className="absolute left-0 top-0 bottom-0 px-4 hover:border-2 hover:border-white transition-all group z-20"
                >
                    <ChevronLeft className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                    onClick={() => setCurrentHero((prev) => (prev + 1) % heroImages.length)}
                    className="absolute right-0 top-0 bottom-0 px-4 hover:border-2 hover:border-white transition-all group z-20"
                >
                    <ChevronRight className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Content Container (Overlapping Hero) */}
            <div className="relative -mt-80 z-30 px-4 max-w-[1500px] mx-auto">
                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-white p-5 flex flex-col justify-between shadow-md rounded-lg hover:scale-[1.02] transition-transform duration-300">
                            <h2 className="text-xl font-bold mb-3">{cat.title}</h2>
                            <div className="flex-1 overflow-hidden">
                                <img src={cat.image} alt={cat.title} className="w-full h-full object-contain mb-4" />
                            </div>
                            <Link to={cat.link} className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-4 font-medium">
                                See all offers
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Featured Products Scroller */}
                <div className="bg-white p-5 shadow-md mb-6 overflow-hidden rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Today's Deals</h2>
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {products.map((product) => (
                            <Link key={product._id} to={`/products/${product._id}`} className="min-w-[200px] group transition-transform duration-300 hover:scale-[1.03]">
                                <div className="h-48 flex items-center justify-center p-4 bg-gray-50 mb-2 rounded-md">
                                    <img src={product.image} alt={product.name} className="h-full object-contain transition-transform group-hover:scale-105" />
                                </div>
                                <div className="text-sm">
                                    <span className="bg-btn_add_to_cart text-text_main px-2 py-0.5 font-bold mr-2 rounded">Up to {Math.floor(Math.random() * 40) + 10}% off</span>
                                    <p className="text-accent_teal font-bold inline-block">Deal of the Day</p>
                                    <p className="font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</p>
                                    <p className="text-text_secondary truncate">{product.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Second Row of Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-5 shadow-md h-[420px] flex flex-col rounded-lg">
                        <h2 className="text-xl font-bold mb-3">Sign in for your best experience</h2>
                        <button className="w-full bg-btn_add_to_cart py-2 rounded-md shadow-sm border border-[#D5B921] hover:bg-[#F7CA00] text-sm font-bold mb-4 transition-colors">
                            Sign in securely
                        </button>
                        <div className="bg-[#f3f3f3] -mx-5 -mb-5 mt-auto p-5 overflow-hidden rounded-b-lg">
                            <img src="https://m.media-amazon.com/images/G/31/img19/AMS/Houseads/Laptops-Sept2019._CB436595915_.jpg" alt="Ads" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    {products.slice(0, 3).map((p, i) => (
                        <div key={i} className="bg-white p-5 shadow-md rounded-lg hover:scale-[1.02] transition-transform duration-300">
                            <h2 className="text-xl font-bold mb-3">Inspired by your browsing</h2>
                            <Link to={`/products/${p._id}`} className="block h-64 mb-4">
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            </Link>
                            <Link to={`/products/${p._id}`} className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline font-medium">
                                Check more
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
