import { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post('/api/auth/forgotpassword', { email });
            setMessage('Password reset link has been sent to your email.');
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 dark:bg-slate-900">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-gray-100 dark:border-slate-700 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-deep_blue/5 dark:bg-sky_blue/5 blur-[50px] -z-10 rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky_blue/5 blur-[50px] -z-10 rounded-full" />

                <Link to="/login" className="inline-flex items-center text-sm font-black text-gray-400 dark:text-gray-500 hover:text-deep_blue dark:hover:text-sky_blue transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-deep_blue/10 dark:bg-sky_blue/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                        <Mail className="w-10 h-10 text-deep_blue dark:text-sky_blue" />
                    </div>
                    <h1 className="text-4xl font-black text-dark_charcoal dark:text-white tracking-tighter mb-3">Forgot Password?</h1>
                    <p className="text-text_secondary dark:text-gray-400 font-medium px-4">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {message ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-center animate-in zoom-in duration-300">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                        <p className="text-emerald-800 font-bold mb-6">{message}</p>
                        <Link to="/login" className="block w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-gray-500 group-focus-within:text-deep_blue dark:group-focus-within:text-sky_blue transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-[1.5rem] outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-deep_blue/20 dark:focus:border-sky_blue/30 focus:ring-4 focus:ring-deep_blue/5 dark:focus:ring-sky_blue/10 transition-all font-bold text-dark_charcoal dark:text-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-deep_blue text-white rounded-[1.5rem] font-black shadow-2xl shadow-deep_blue/20 hover:bg-deep_blue_dark transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
