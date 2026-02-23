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

    const redirect = location.search ? location.search.split('=')[1] : '/';

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
        <div className="flex flex-col items-center pt-6 bg-white min-h-screen">
            <Link to="/" className="text-3xl font-bold tracking-tighter text-primary_navy mb-4">
                Shop<span className="text-accent_gold">Sphere</span>
            </Link>

            <div className="w-full max-w-[350px] border border-gray-300 rounded-lg p-6 mb-4">
                <h1 className="text-3xl font-normal mb-4">Sign in</h1>

                {error && (
                    <div className="bg-red-50 border border-red-700 text-red-700 p-2 text-xs mb-4 rounded flex items-center gap-2">
                        <span className="font-bold text-lg">!</span>
                        <div>
                            <p className="font-bold">There was a problem</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold">Email or mobile phone number</label>
                        <input
                            type="email"
                            className="w-full border border-gray-400 rounded-sm px-2 py-1 text-sm focus:border-accent_gold focus:ring-1 focus:ring-accent_gold outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold">Password</label>
                            <Link className="text-xs text-blue-600 hover:text-red-700 hover:underline">Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            className="w-full border border-gray-400 rounded-sm px-2 py-1 text-sm focus:border-accent_gold focus:ring-1 focus:ring-accent_gold outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-accent_gold py-1.5 rounded shadow-sm border border-[#a88734] hover:bg-[#f3a847] text-sm transition"
                    >
                        Sign in
                    </button>
                </form>

                <p className="text-xs text-gray-800 mt-4 leading-relaxed">
                    By continuing, you agree to ShopSphere's <span className="text-blue-600 hover:underline">Conditions of Use</span> and <span className="text-blue-600 hover:underline">Privacy Notice</span>.
                </p>

                <div className="mt-6">
                    <p className="text-xs text-gray-600 flex items-center gap-2 before:content-[''] before:flex-1 before:border-b before:border-gray-200 after:content-[''] after:flex-1 after:border-b after:border-gray-200">
                        New to ShopSphere?
                    </p>
                    <Link
                        to={`/register?redirect=${redirect}`}
                        className="w-full block text-center mt-3 py-1.5 rounded shadow-sm border border-gray-300 hover:bg-gray-100 text-sm transition"
                    >
                        Create your ShopSphere account
                    </Link>
                </div>
            </div>

            <div className="w-full max-w-5xl border-t border-gray-200 mt-8 pt-8 pb-10 px-4">
                <div className="flex justify-center gap-10 text-xs text-blue-600 mb-2">
                    <span className="hover:underline hover:text-red-700 cursor-pointer">Conditions of Use</span>
                    <span className="hover:underline hover:text-red-700 cursor-pointer">Privacy Notice</span>
                    <span className="hover:underline hover:text-red-700 cursor-pointer">Help</span>
                </div>
                <p className="text-center text-[10px] text-gray-500">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
            </div>
        </div>
    );
};

export default Login;
