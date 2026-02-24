import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-dark_charcoal text-white pt-10">
            <div
                onClick={scrollToTop}
                className="bg-deep_blue hover:bg-deep_blue_dark text-center py-4 cursor-pointer text-sm font-black transition-all uppercase tracking-widest opacity-90 hover:opacity-100"
            >
                Back to top
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-white/10">
                <div>
                    <h3 className="font-bold text-base mb-4">Get to Know Us</h3>
                    <ul className="text-sm space-y-2 text-gray-300">
                        <li className="hover:underline cursor-pointer">About ShopSphere</li>
                        <li className="hover:underline cursor-pointer">Careers</li>
                        <li className="hover:underline cursor-pointer">Press Releases</li>
                        <li className="hover:underline cursor-pointer">ShopSphere Science</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-base mb-4">Connect with Us</h3>
                    <ul className="text-sm space-y-2 text-gray-300">
                        <li className="hover:underline cursor-pointer">Facebook</li>
                        <li className="hover:underline cursor-pointer">Twitter</li>
                        <li className="hover:underline cursor-pointer">Instagram</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-base mb-4">Make Money with Us</h3>
                    <ul className="text-sm space-y-2 text-gray-300">
                        <li className="hover:underline cursor-pointer">Sell on ShopSphere</li>
                        <li className="hover:underline cursor-pointer">Supply to ShopSphere</li>
                        <li className="hover:underline cursor-pointer">Become an Affiliate</li>
                        <li className="hover:underline cursor-pointer">Fulfillment by ShopSphere</li>
                        <li className="hover:underline cursor-pointer">Advertise Your Products</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-base mb-4">Let Us Help You</h3>
                    <ul className="text-sm space-y-2 text-gray-300">
                        <Link to="/customer-service" className="hover:underline cursor-pointer block">Customer Service</Link>
                        <li className="hover:underline cursor-pointer">Your Account</li>
                        <li className="hover:underline cursor-pointer">Your Orders</li>
                        <li className="hover:underline cursor-pointer">Shipping Rates & Policies</li>
                        <li className="hover:underline cursor-pointer">Returns & Replacements</li>
                    </ul>
                </div>
            </div>

            <div className="py-8 flex flex-col items-center gap-6">
                <Link to="/" className="flex items-center">
                    <span className="text-3xl font-extrabold tracking-tighter text-white">Shop<span className="text-sky_blue">Sphere</span></span>
                </Link>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-300 px-4">
                    {['Australia', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'Poland', 'Singapore', 'Spain', 'Turkey', 'United Arab Emirates', 'United Kingdom', 'United States'].map(country => (
                        <span key={country} className="hover:underline cursor-pointer">{country}</span>
                    ))}
                </div>
            </div>

            <div className="bg-black/20 py-10 text-center px-4">
                <div className="flex justify-center gap-6 text-xs mb-4">
                    <span className="hover:underline cursor-pointer">Conditions of Use</span>
                    <span className="hover:underline cursor-pointer">Privacy Notice</span>
                    <span className="hover:underline cursor-pointer">Interest-Based Ads</span>
                </div>
                <p className="text-[10px] text-gray-400">© 1996-2026, ShopSphere.com, Inc. or its affiliates</p>
            </div>
        </footer>
    );
};

export default Footer;
