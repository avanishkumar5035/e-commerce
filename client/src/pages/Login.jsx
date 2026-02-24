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
        <div className="flex flex-col items-center pt-10 bg-bg_cool_gray min-h-screen">
            <Link to="/" className="flex items-center mb-8">
                <span className="text-4xl font-extrabold tracking-tighter text-deep_blue">Shop<span className="text-deep_blue_dark">Sphere</span></span>
            </Link>

            <div className="w-full max-w-[400px] bg-white shadow-xl rounded-xl p-8 mb-6 border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-dark_charcoal text-center">Sign in</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm mb-6 rounded-lg flex items-center gap-3">
                        <div className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs italic">!</div>
                        <div>
                            <p className="font-bold">Login failed</p>
                            <p className="text-xs opacity-90">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-5">
                    <div className="flex flex-col gap-1.5 focus-within:text-deep_blue transition-colors">
                        <label className="text-sm font-semibold ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-deep_blue focus:ring-4 focus:ring-deep_blue/10 outline-none transition-all placeholder:text-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 focus-within:text-deep_blue transition-colors">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-semibold">Password</label>
                            <Link className="text-xs text-deep_blue hover:underline font-medium">Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-deep_blue focus:ring-4 focus:ring-deep_blue/10 outline-none transition-all placeholder:text-gray-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-deep_blue text-white py-3 rounded-lg shadow-lg shadow-deep_blue/20 hover:bg-deep_blue_dark text-sm font-bold transition-all active:scale-95"
                    >
                        Sign in
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                        <span className="relative bg-white px-4 text-xs text-text_secondary font-medium uppercase tracking-wider">New to ShopSphere?</span>
                    </div>
                    <Link
                        to={`/register?redirect=${redirect}`}
                        className="w-full block text-center py-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-semibold text-dark_charcoal transition-all"
                    >
                        Create your account
                    </Link>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 text-xs pb-10">
                <div className="flex gap-6 text-gray-500 font-medium">
                    <span className="hover:text-deep_blue cursor-pointer transition-colors">Terms of Service</span>
                    <span className="hover:text-deep_blue cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-deep_blue cursor-pointer transition-colors">Help Center</span>
                </div>
                <p className="text-gray-400">© 2026 ShopSphere E-Commerce. Premium Collection.</p>
            </div>
        </div>
    );
};

export default Login;
