import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        setError('');

        try {
            await axios.put(`/api/auth/resetpassword/${token}`, { password });
            setSuccess(true);
            setLoading(false);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-deep_blue/5 blur-[50px] -z-10 rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky_blue/5 blur-[50px] -z-10 rounded-full" />

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-deep_blue/10 rounded-3xl flex items-center justify-center mx-auto mb-6 -rotate-3">
                        <Lock className="w-10 h-10 text-deep_blue" />
                    </div>
                    <h1 className="text-4xl font-black text-dark_charcoal tracking-tighter mb-3">Set New Password</h1>
                    <p className="text-text_secondary font-medium px-4">Create a strong, unique password to secure your account.</p>
                </div>

                {success ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-center animate-in zoom-in duration-300">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                        <p className="text-emerald-800 font-bold mb-2">Password Reset Successful!</p>
                        <p className="text-emerald-600 text-sm font-medium">Redirecting you to login...</p>
                    </div>
                ) : (
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-deep_blue transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-deep_blue/20 focus:ring-4 focus:ring-deep_blue/5 transition-all font-bold text-dark_charcoal"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-deep_blue transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-deep_blue transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-deep_blue/20 focus:ring-4 focus:ring-deep_blue/5 transition-all font-bold text-dark_charcoal"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center animate-shake">
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
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}

                {!success && (
                    <Link to="/login" className="flex items-center justify-center mt-8 text-sm font-bold text-gray-400 hover:text-deep_blue transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Cancel and return to login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
