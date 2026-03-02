import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const queryRedirect = location.search ? location.search.split('=')[1] : '/';
    const redirect = queryRedirect.startsWith('/') ? queryRedirect : `/${queryRedirect}`;

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [user, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="flex flex-col items-center pt-10 bg-bg_soft_gray min-h-screen">
            <div className="animate-slide-in flex flex-col items-center w-full">
                <Link to="/" className="flex items-center mb-10 group">
                    <span className="text-5xl font-extrabold tracking-tighter text-deep_blue group-hover:scale-105 transition-transform duration-300">Shop<span className="text-deep_blue_dark">Sphere</span></span>
                </Link>

                <div className="w-full max-w-[420px] bg-white shadow-[0_20px_50px_rgba(30,58,138,0.1)] rounded-3xl p-10 mb-8 border border-white/20 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold mb-8 text-dark_charcoal text-center">Welcome Back</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-700 p-4 text-sm mb-8 rounded-2xl flex items-center gap-3 animate-shake">
                            <div className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">!</div>
                            <div>
                                <p className="font-bold">Login failed</p>
                                <p className="text-xs opacity-80">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="flex flex-col gap-2 focus-within:text-deep_blue transition-colors group">
                            <label className="text-sm font-bold ml-1 text-gray-700 group-focus-within:text-deep_blue transition-colors">Email or Mobile Number</label>
                            <input
                                type="text"
                                placeholder="Enter your email or mobile"
                                className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 text-sm focus:border-deep_blue focus:bg-white focus:ring-8 focus:ring-deep_blue/5 outline-none transition-all placeholder:text-gray-400 font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2 focus-within:text-deep_blue transition-colors group">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-gray-700 group-focus-within:text-deep_blue transition-colors">Password</label>
                                <Link to="/forgotpassword" title="Click to reset your password" className="text-xs text-deep_blue hover:text-deep_blue_dark font-bold">Forgot Password?</Link>
                            </div>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 text-sm focus:border-deep_blue focus:bg-white focus:ring-8 focus:ring-deep_blue/5 outline-none transition-all placeholder:text-gray-400 font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-deep_blue text-white py-4 rounded-2xl shadow-xl shadow-deep_blue/30 hover:bg-deep_blue_dark hover:shadow-deep_blue/40 text-sm font-extrabold transition-all active:scale-[0.98] mt-4"
                        >
                            Sign in
                        </button>
                    </form>

                    <div className="mt-10">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                            <span className="relative bg-white px-6 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">New to ShopSphere?</span>
                        </div>
                        <Link
                            to={`/register?redirect=${redirect}`}
                            className="w-full block text-center py-4 rounded-2xl border-2 border-gray-100 hover:border-deep_blue/20 hover:bg-deep_blue/5 text-sm font-bold text-dark_charcoal hover:text-deep_blue transition-all"
                        >
                            Create your account
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6 text-xs pb-12">
                    <div className="flex gap-10 text-gray-400 font-bold">
                        <span className="hover:text-deep_blue cursor-pointer transition-colors">Terms</span>
                        <span className="hover:text-deep_blue cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-deep_blue cursor-pointer transition-colors">Help</span>
                    </div>
                    <p className="text-gray-300 font-medium">© 2026 ShopSphere E-Commerce. Premium Collection.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
