import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Phone, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setName(user.name || '');
            setEmail(user.email || '');
            setMobileNumber(user.mobileNumber || '');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        const res = await updateProfile({ name, email, mobileNumber, password });
        setIsLoading(false);

        if (res.success) {
            setMessage('Profile Updated Successfully');
            setPassword('');
            setConfirmPassword('');
        } else {
            setError(res.message || 'Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
                    <div className="bg-deep_blue dark:bg-slate-800 px-8 py-10 border-b border-white/10">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                            <User className="w-8 h-8" />
                            User Profile
                        </h2>
                        <p className="text-sky_blue/80 font-medium mt-2">Manage your account details and password</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="font-bold text-sm tracking-wide">{error}</span>
                            </div>
                        )}
                        {message && (
                            <div className="mb-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-2xl flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                <span className="font-bold text-sm tracking-wide">{message}</span>
                            </div>
                        )}

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-deep_blue dark:group-focus-within:text-sky_blue transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky_blue focus:border-transparent outline-none transition-all text-sm font-bold text-dark_charcoal dark:text-white"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-deep_blue dark:group-focus-within:text-sky_blue transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky_blue focus:border-transparent outline-none transition-all text-sm font-bold text-dark_charcoal dark:text-white opacity-70 cursor-not-allowed"
                                            placeholder="Enter your email"
                                            disabled
                                            title="Email cannot be changed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">Email cannot be modified.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Mobile Number</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-deep_blue dark:group-focus-within:text-sky_blue transition-colors" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky_blue focus:border-transparent outline-none transition-all text-sm font-bold text-dark_charcoal dark:text-white"
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-slate-700 my-6" />

                            <div>
                                <h3 className="text-lg font-bold text-dark_charcoal dark:text-white mb-4">Update Password (Optional)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">New Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-deep_blue dark:group-focus-within:text-sky_blue transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky_blue focus:border-transparent outline-none transition-all text-sm font-bold text-dark_charcoal dark:text-white"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Confirm New Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-deep_blue dark:group-focus-within:text-sky_blue transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky_blue focus:border-transparent outline-none transition-all text-sm font-bold text-dark_charcoal dark:text-white"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto px-8 py-3 bg-deep_blue hover:bg-deep_blue_dark text-white rounded-2xl text-sm font-black tracking-wide transition-all shadow-xl shadow-deep_blue/20 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
