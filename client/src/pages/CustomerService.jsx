import { Search, Package, RotateCcw, ShieldCheck, User, CreditCard, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerService = () => {
    const categories = [
        { icon: <Package className="w-8 h-8 text-sky_blue" />, title: "Your Orders", desc: "Track, return, or buy things again" },
        { icon: <RotateCcw className="w-8 h-8 text-sky_blue" />, title: "Returns & Refunds", desc: "Return or exchange items" },
        { icon: <ShieldCheck className="w-8 h-8 text-sky_blue" />, title: "Manage Prime", desc: "View benefits or cancel membership" },
        { icon: <CreditCard className="w-8 h-8 text-sky_blue" />, title: "Payment Settings", desc: "Add or edit payment methods" },
        { icon: <User className="w-8 h-8 text-sky_blue" />, title: "Account Settings", desc: "Change your email or password" },
        { icon: <MessageSquare className="w-8 h-8 text-sky_blue" />, title: "Digital Services", desc: "Troubleshoot device issues" },
    ];

    return (
        <div className="bg-bg_soft_gray dark:bg-slate-900 min-h-screen">
            {/* Hero Section */}
            <div className="bg-bg_soft_gray dark:bg-slate-900 py-10 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Hello. What can we help you with?</h1>
                    <div className="relative max-w-2xl mx-auto flex items-center">
                        <input
                            type="text"
                            placeholder="Search our help topics"
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-dark_charcoal dark:text-white focus:border-sky_blue focus:ring-1 focus:ring-sky_blue outline-none shadow-sm transition-colors"
                        />
                        <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Main Categories */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-6 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition cursor-pointer group">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:shadow-md dark:shadow-none transition border border-transparent dark:border-slate-700">
                                {cat.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{cat.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{cat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 dark:bg-slate-800/30 py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">Quick solutions</h2>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 divide-y divide-gray-100 dark:divide-slate-700 overflow-hidden">
                        {[
                            "How do I track my package?",
                            "How do I return an item?",
                            "Change my shipping address",
                            "Can I cancel my order?",
                            "Manage your Prime membership",
                            "Troubleshoot login issues"
                        ].map((q, idx) => (
                            <div key={idx} className="p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition">
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{q}</span>
                                <span className="text-sky_blue text-sm font-bold">Details</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="bg-deep_blue text-white p-10 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">Our support team is available 24/7 to assist you with any inquiries about your orders or account.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-sky_blue text-deep_blue px-8 py-3 rounded-full font-bold hover:bg-[#f3a847] transition shadow-lg">
                            Chat Now
                        </button>
                        <button className="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">
                            Call Us
                        </button>
                    </div>
                </div>
            </div>

            {/* Back Link */}
            <div className="text-center pb-12">
                <Link to="/" className="text-sky_blue font-bold hover:underline">
                    ← Back to ShopSphere Home
                </Link>
            </div>
        </div>
    );
};

export default CustomerService;
