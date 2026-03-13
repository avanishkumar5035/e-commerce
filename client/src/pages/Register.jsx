import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [user, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const result = await register(name, email, password, mobileNumber);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="flex flex-col items-center pt-8 bg-bg_soft_gray dark:bg-slate-900 min-h-screen">
            <Link to="/" className="flex items-center mb-8">
                <span className="text-4xl font-extrabold tracking-tighter text-deep_blue dark:text-sky_blue">Shop<span className="text-deep_blue_dark dark:text-gray-100">Sphere</span></span>
            </Link>

            <div className="w-full max-w-[450px] bg-white dark:bg-slate-800 shadow-2xl dark:shadow-none rounded-2xl p-8 mb-8 border border-gray-100 dark:border-slate-700">
                <h1 className="text-3xl font-bold mb-6 text-dark_charcoal dark:text-white text-center">Create Account</h1>

                {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 p-4 text-sm mb-6 rounded-xl flex items-center gap-3">
                        <div className="bg-red-600 dark:bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs italic">!</div>
                        <div>
                            <p className="font-bold">Registration failed</p>
                            <p className="text-xs opacity-90">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-5">
                    <div className="flex flex-col gap-1.5 focus-within:text-deep_blue dark:focus-within:text-sky_blue transition-colors text-gray-700 dark:text-gray-300">
                        <label className="text-sm font-semibold ml-1">Your Name</label>
                        <input
                            type="text"
                            placeholder="First and last name"
                            className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm focus:border-deep_blue dark:focus:border-sky_blue focus:ring-4 focus:ring-deep_blue/10 dark:focus:ring-sky_blue/10 outline-none transition-all placeholder:text-gray-400 dark:text-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 focus-within:text-deep_blue dark:focus-within:text-sky_blue transition-colors text-gray-700 dark:text-gray-300">
                            <label className="text-sm font-semibold ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm focus:border-deep_blue dark:focus:border-sky_blue focus:ring-4 focus:ring-deep_blue/10 dark:focus:ring-sky_blue/10 outline-none transition-all placeholder:text-gray-400 dark:text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 focus-within:text-deep_blue dark:focus-within:text-sky_blue transition-colors text-gray-700 dark:text-gray-300">
                            <label className="text-sm font-semibold ml-1">Mobile Number</label>
                            <input
                                type="tel"
                                placeholder="10-digit number"
                                className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm focus:border-deep_blue dark:focus:border-sky_blue focus:ring-4 focus:ring-deep_blue/10 dark:focus:ring-sky_blue/10 outline-none transition-all placeholder:text-gray-400 dark:text-white"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 focus-within:text-deep_blue dark:focus-within:text-sky_blue transition-colors text-gray-700 dark:text-gray-300">
                        <label className="text-sm font-semibold ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="At least 6 characters"
                            className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm focus:border-deep_blue dark:focus:border-sky_blue focus:ring-4 focus:ring-deep_blue/10 dark:focus:ring-sky_blue/10 outline-none transition-all placeholder:text-gray-400 dark:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 focus-within:text-deep_blue dark:focus-within:text-sky_blue transition-colors text-gray-700 dark:text-gray-300">
                        <label className="text-sm font-semibold ml-1">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter password"
                            className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm focus:border-deep_blue dark:focus:border-sky_blue focus:ring-4 focus:ring-deep_blue/10 dark:focus:ring-sky_blue/10 outline-none transition-all placeholder:text-gray-400 dark:text-white"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-deep_blue text-white py-4 rounded-xl shadow-xl shadow-deep_blue/20 hover:bg-deep_blue_dark text-sm font-bold transition-all active:scale-95 mt-2"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-8 text-center leading-relaxed">
                    By creating an account, you agree to ShopSphere's <span className="text-deep_blue dark:text-sky_blue font-semibold hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-deep_blue dark:text-sky_blue font-semibold hover:underline cursor-pointer">Privacy Notice</span>.
                </p>

                <div className="mt-8 border-t border-gray-50 dark:border-slate-700 pt-6 flex flex-col items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account? <Link to={`/login?redirect=${redirect}`} className="text-deep_blue dark:text-sky_blue font-bold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 text-xs pb-10">
                <div className="flex gap-8 text-gray-400 font-medium">
                    <span className="hover:text-deep_blue dark:hover:text-sky_blue transition-colors cursor-pointer">Conditions of Use</span>
                    <span className="hover:text-deep_blue dark:hover:text-sky_blue transition-colors cursor-pointer">Privacy Notice</span>
                    <span className="hover:text-deep_blue dark:hover:text-sky_blue transition-colors cursor-pointer">Help</span>
                </div>
                <p className="text-gray-400 dark:text-gray-600">© 2026 ShopSphere E-Commerce. Premium Collection.</p>
            </div>
        </div>
    );
};

export default Register;
