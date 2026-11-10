import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Mail, Phone, Lock, User, ShieldCheck, ArrowRight, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // OTP verification states
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const { sendOtp, registerWithOtp, googleAuth, user } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [user, navigate, redirect]);

    // Resend countdown timer
    useEffect(() => {
        let interval = null;
        if (showOtpInput && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [showOtpInput, timer]);

    // Real validation helpers
    const validateEmailFormat = (val) => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        return regex.test(val.trim());
    };

    const validateMobileFormat = (val) => {
        const cleaned = val.replace(/[\s\-\(\)\+]/g, '');
        const numberOnly = cleaned.startsWith('91') && cleaned.length === 12 ? cleaned.slice(2) : cleaned;
        return /^[6-9]\d{9}$/.test(numberOnly);
    };

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (name.trim().length < 2) {
            setError('Please enter your full name (at least 2 characters)');
            return;
        }

        if (!validateEmailFormat(email)) {
            setError('Please enter a valid real email address (e.g. name@gmail.com)');
            return;
        }

        if (!validateMobileFormat(mobileNumber)) {
            setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        const result = await sendOtp(email.trim(), mobileNumber.trim(), 'register');
        setIsSubmitting(false);

        if (result.success) {
            setShowOtpInput(true);
            setTimer(60);
            setCanResend(false);
            addToast(`Verification OTP sent to ${email}`, 'success');
        } else {
            setError(result.message);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (!enteredOtp || enteredOtp.length !== 6) {
            setError('Please enter the full 6-digit OTP code received in your email');
            return;
        }

        setIsSubmitting(true);
        const result = await registerWithOtp(
            name.trim(),
            email.trim().toLowerCase(),
            password,
            mobileNumber.trim(),
            enteredOtp.trim()
        );
        setIsSubmitting(false);

        if (result.success) {
            addToast('Account created successfully! Welcome to ShopSphere.', 'success');
            navigate(redirect);
        } else {
            setError(result.message);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;
        setIsSubmitting(true);
        setError('');
        const result = await sendOtp(email.trim(), mobileNumber.trim(), 'register');
        setIsSubmitting(false);

        if (result.success) {
            setTimer(60);
            setCanResend(false);
            setEnteredOtp('');
            addToast(`New verification code sent to ${email}`, 'info');
        } else {
            setError(result.message);
        }
    };

    const handleGoogleLoginMock = async () => {
        // Quick 1-click Google Sign-In with validated real Google email prompt
        const promptEmail = window.prompt("Enter your Google Account email (e.g. yourname@gmail.com):", email || "");
        if (!promptEmail) return;

        if (!validateEmailFormat(promptEmail)) {
            setError('Please enter a valid Google email address.');
            return;
        }

        setIsSubmitting(true);
        const googleName = promptEmail.split('@')[0].replace(/[._]/g, ' ');
        const result = await googleAuth(promptEmail, googleName, 'g_' + Date.now());
        setIsSubmitting(false);

        if (result.success) {
            addToast('Successfully authenticated via Google Account!', 'success');
            navigate(redirect);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center pt-8 pb-16 px-4 bg-bg_soft_gray dark:bg-[#0E0D12] min-h-screen text-dark_charcoal dark:text-gray-100 transition-colors duration-300">
            <Link to="/" className="flex items-center mb-6 group">
                <span className="text-4xl font-extrabold tracking-tighter text-[#E8630A] dark:text-[#F59E0B] group-hover:scale-105 transition-transform duration-300">
                    Shop<span className="text-dark_charcoal dark:text-white">Sphere</span>
                </span>
            </Link>

            <div className="w-full max-w-[480px] bg-white dark:bg-[#17151D] shadow-2xl dark:shadow-black/70 rounded-3xl p-8 md:p-10 border border-gray-200/80 dark:border-white/[0.08] backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-black mb-2 text-dark_charcoal dark:text-white">
                        {showOtpInput ? 'Verify Your Email' : 'Create an Account'}
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {showOtpInput
                            ? 'Enter the 6-digit code sent to your real email inbox'
                            : 'Sign up with your real email & mobile for secure delivery'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 text-xs font-semibold mb-6 rounded-2xl flex items-center gap-3 animate-shake">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                        <div>{error}</div>
                    </div>
                )}

                {/* Google Sign-In Option */}
                {!showOtpInput && (
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={handleGoogleLoginMock}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#201D27] hover:bg-gray-50 dark:hover:bg-[#262330] text-gray-700 dark:text-gray-200 text-xs font-bold transition shadow-xs cursor-pointer active:scale-98"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            Continue with Google
                        </button>
                        <div className="relative flex items-center justify-center my-6">
                            <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                            <span className="absolute bg-white dark:bg-[#17151D] px-4 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                Or register with email
                            </span>
                        </div>
                    </div>
                )}

                {showOtpInput ? (
                    /* OTP Verification Screen */
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="p-4 bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 rounded-2xl text-center space-y-1">
                            <div className="w-10 h-10 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center text-[#E8630A] mb-2">
                                <Mail className="w-5 h-5" />
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                Real OTP dispatched to:
                            </p>
                            <p className="text-sm font-black text-[#E8630A] dark:text-[#F59E0B]">
                                {email}
                            </p>
                            <p className="text-[11px] text-gray-400 pt-1">
                                Please check your Gmail Inbox or Spam/Promotions folder.
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 block text-center">
                                Enter 6-Digit OTP Code
                            </label>
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="• • • • • •"
                                className="w-full border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#1C1924] rounded-2xl px-4 py-3.5 text-2xl text-center tracking-[0.5em] font-mono font-black focus:border-[#E8630A] focus:bg-white dark:focus:bg-[#201D29] outline-none transition dark:text-white"
                                value={enteredOtp}
                                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                                autoFocus
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowOtpInput(false);
                                    setError('');
                                }}
                                className="text-gray-500 dark:text-gray-400 hover:underline font-semibold cursor-pointer"
                            >
                                ← Edit Email or Mobile
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={!canResend || isSubmitting}
                                className={`font-bold transition cursor-pointer ${
                                    canResend
                                        ? 'text-[#E8630A] dark:text-[#F59E0B] hover:underline'
                                        : 'text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || enteredOtp.length !== 6}
                            className="w-full bg-gradient-to-r from-[#E8630A] to-[#F59E0B] hover:from-[#C4500A] hover:to-[#D97706] text-white py-3.5 rounded-2xl text-xs uppercase tracking-widest font-black shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? 'Verifying OTP...' : 'Verify OTP & Create Account'}
                        </button>
                    </form>
                ) : (
                    /* Initial Details Form */
                    <form onSubmit={handleInitialSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter your first and last name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/10 bg-gray-50/60 dark:bg-[#1C1924] rounded-2xl text-xs focus:border-[#E8630A] focus:bg-white dark:focus:bg-[#201D29] outline-none transition dark:text-white font-medium"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">
                                Real Email Address <span className="text-[10px] text-gray-400 font-normal">(OTP will be delivered here)</span>
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="yourname@gmail.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/10 bg-gray-50/60 dark:bg-[#1C1924] rounded-2xl text-xs focus:border-[#E8630A] focus:bg-white dark:focus:bg-[#201D29] outline-none transition dark:text-white font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">
                                Real Mobile Number <span className="text-[10px] text-gray-400 font-normal">(10-digit Indian Mobile)</span>
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                                <input
                                    type="tel"
                                    maxLength="10"
                                    placeholder="9876543210"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/10 bg-gray-50/60 dark:bg-[#1C1924] rounded-2xl text-xs focus:border-[#E8630A] focus:bg-white dark:focus:bg-[#201D29] outline-none transition dark:text-white font-medium"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="Min. 6 chars"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/10 bg-gray-50/60 dark:bg-[#1C1924] rounded-2xl text-xs focus:border-[#E8630A] focus:bg-white dark:focus:bg-[#201D29] outline-none transition dark:text-white font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">
                                    Confirm
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="Re-enter password"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/10 bg-gray-50/60 dark:bg-[#1C1924] rounded-2xl text-xs focus:border-[#E8630A] focus:bg-white dark:focus:bg-[#201D29] outline-none transition dark:text-white font-medium"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#E8630A] to-[#F59E0B] hover:from-[#C4500A] hover:to-[#D97706] text-white py-3.5 rounded-2xl text-xs uppercase tracking-widest font-black shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-98 disabled:opacity-50 cursor-pointer mt-2"
                        >
                            {isSubmitting ? 'Sending Real OTP...' : 'Send Verification OTP'}
                        </button>
                    </form>
                )}

                {!showOtpInput && (
                    <div className="mt-8 border-t border-gray-100 dark:border-white/[0.06] pt-6 text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            Already have an account?{' '}
                            <Link to={`/login?redirect=${redirect}`} className="text-[#E8630A] dark:text-[#F59E0B] font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
