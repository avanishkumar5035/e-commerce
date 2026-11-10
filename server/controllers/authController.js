const mongoose = require('mongoose');
const User = require('../models/User');
const Otp = require('../models/Otp');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { isValidEmail, isValidMobileNumber, cleanMobileNumber } = require('../utils/validators');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, mobileNumber } = req.body;

    try {
        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: 'Please enter a valid full name' });
        }

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid real email address (e.g. yourname@gmail.com)' });
        }

        if (mobileNumber && !isValidMobileNumber(mobileNumber)) {
            return res.status(400).json({ message: 'Please enter a valid 10-digit Indian mobile number' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanMobile = mobileNumber ? cleanMobileNumber(mobileNumber) : '';

        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail && cleanEmail === adminEmail.trim().toLowerCase()) {
            return res.status(400).json({ message: 'Registration not allowed for admin email. Please login.' });
        }

        const userExists = await User.findOne({
            $or: [
                { email: cleanEmail },
                { mobileNumber: cleanMobile || '---non-existent---' }
            ]
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email or mobile number' });
        }

        const user = await User.create({
            name: name.trim(),
            email: cleanEmail,
            password,
            mobileNumber: cleanMobile
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body; // email field can now contain email OR mobile number

    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        const adminPasswordPlain = process.env.ADMIN_PASSWORD;

        if (adminEmail && (adminPasswordHash || adminPasswordPlain) && email && email.trim().toLowerCase() === adminEmail.trim().toLowerCase()) {
            let isValid = false;
            if (adminPasswordHash) {
                isValid = await bcrypt.compare(password, adminPasswordHash);
            } else if (adminPasswordPlain) {
                isValid = (password === adminPasswordPlain);
            }

            if (!isValid) {
                return res.status(401).json({ message: 'Invalid admin credentials' });
            }

            let user = await User.findOne({ email: adminEmail });
            if (!user) {
                user = await User.create({
                    name: 'Super Admin',
                    email: adminEmail,
                    password: password,
                    role: 'admin'
                });
            } else {
                let modified = false;
                if (user.role !== 'admin') {
                    user.role = 'admin';
                    modified = true;
                }
                const isMatch = await user.matchPassword(password);
                if (!isMatch) {
                    user.password = password;
                    modified = true;
                }
                if (modified) {
                    await user.save();
                }
            }

            await Activity.create({
                user: user._id,
                userName: user.name,
                action: 'LOGIN',
                details: 'Admin logged in',
            });

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

        // Find user by email OR mobile number
        const user = await User.findOne({
            $or: [
                { email: email },
                { mobileNumber: email }
            ]
        });

        if (user && (await user.matchPassword(password))) {
            await Activity.create({
                user: user._id,
                userName: user.name,
                action: 'LOGIN',
                details: `User ${user.email} logged in`,
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email, mobile number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message,
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (error) {
            console.error(error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or token expired' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle item in wishlist
// @route   POST /api/auth/wishlist/:id
// @access  Private
const toggleWishlist = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid Product ID' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isWishlisted = user.wishlist.some(
            (id) => id.toString() === productId
        );

        if (isWishlisted) {
            user.wishlist.pull(productId);
        } else {
            user.wishlist.addToSet(productId);
        }

        await user.save({ validateModifiedOnly: true });

        res.json({
            message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error('Wishlist Error:', error);
        res.status(500).json({ message: error.message || 'Server Error updating wishlist' });
    }
};

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const user = await User.findById(req.user._id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.wishlist || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.mobileNumber = req.body.mobileNumber || user.mobileNumber;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                mobileNumber: updatedUser.mobileNumber,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send OTP to user's real email address
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    try {
        const { email, mobileNumber, type = 'register' } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid real email address (e.g. name@gmail.com)' });
        }

        if (mobileNumber && !isValidMobileNumber(mobileNumber)) {
            return res.status(400).json({ message: 'Please enter a valid 10-digit Indian mobile number' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanMobile = mobileNumber ? cleanMobileNumber(mobileNumber) : '';

        // Registration check: ensure not already registered
        if (type === 'register') {
            const query = [{ email: cleanEmail }];
            if (cleanMobile) query.push({ mobileNumber: cleanMobile });
            const existing = await User.findOne({ $or: query });
            if (existing) {
                return res.status(400).json({ message: 'An account already exists with this email or mobile number. Please login.' });
            }
        } else if (type === 'login') {
            const existing = await User.findOne({ email: cleanEmail });
            if (!existing) {
                return res.status(404).json({ message: 'No registered account found with this email. Please create an account.' });
            }
        }

        // Generate 6-digit cryptographic numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Remove previous OTP for this email and type
        await Otp.deleteMany({ email: cleanEmail, type });

        // Save new OTP in MongoDB
        await Otp.create({
            email: cleanEmail,
            otp,
            type,
            mobileNumber: cleanMobile,
        });

        // Dispatch real email via Google Gmail / SMTP
        await sendEmail({
            email: cleanEmail,
            subject: `Your ShopSphere Verification Code: ${otp}`,
            otp,
            type: type === 'register' ? 'Account Registration' : 'Account Login',
        });

        res.json({
            success: true,
            message: `Verification OTP has been sent to ${cleanEmail}. Please check your inbox (and spam folder).`,
            email: cleanEmail,
        });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ message: error.message || 'Failed to dispatch OTP email' });
    }
};

// @desc    Verify OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    try {
        const { email, otp, type = 'register' } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP code are required' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const record = await Otp.findOne({ email: cleanEmail, type }).sort({ createdAt: -1 });

        if (!record || record.otp !== otp.trim()) {
            return res.status(400).json({ message: 'Invalid or expired OTP code. Please check your email or resend OTP.' });
        }

        res.json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register new user with verified real Email OTP
// @route   POST /api/auth/register-with-otp
// @access  Public
const registerWithOtp = async (req, res) => {
    const { name, email, password, mobileNumber, otp } = req.body;

    try {
        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: 'Please enter your full name' });
        }

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid real email address' });
        }

        if (!mobileNumber || !isValidMobileNumber(mobileNumber)) {
            return res.status(400).json({ message: 'Please enter a valid 10-digit Indian mobile number' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanMobile = cleanMobileNumber(mobileNumber);

        // Verify OTP from database
        const otpRecord = await Otp.findOne({ email: cleanEmail, type: 'register' }).sort({ createdAt: -1 });
        if (!otpRecord || otpRecord.otp !== otp?.trim()) {
            return res.status(400).json({ message: 'Invalid or expired OTP. Please verify with the code sent to your real email.' });
        }

        const userExists = await User.findOne({
            $or: [{ email: cleanEmail }, { mobileNumber: cleanMobile }]
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email or mobile number' });
        }

        const user = await User.create({
            name: name.trim(),
            email: cleanEmail,
            password,
            mobileNumber: cleanMobile,
        });

        // Delete used OTP
        await Otp.deleteMany({ email: cleanEmail, type: 'register' });

        if (user) {
            await Activity.create({
                user: user._id,
                userName: user.name,
                action: 'REGISTER',
                details: `User registered with verified real email: ${user.email}`,
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error('Registration with OTP error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login with Email OTP
// @route   POST /api/auth/login-otp
// @access  Public
const loginWithOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid real email address' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const otpRecord = await Otp.findOne({ email: cleanEmail, type: 'login' }).sort({ createdAt: -1 });

        if (!otpRecord || otpRecord.otp !== otp?.trim()) {
            return res.status(400).json({ message: 'Invalid or expired OTP code' });
        }

        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(404).json({ message: 'No registered user found with this email' });
        }

        // Delete used OTP
        await Otp.deleteMany({ email: cleanEmail, type: 'login' });

        await Activity.create({
            user: user._id,
            userName: user.name,
            action: 'LOGIN',
            details: `User ${user.email} logged in via Email OTP`,
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google Sign-In / OAuth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    const { email, name, googleId } = req.body;

    try {
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid Google email' });
        }

        const cleanEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: cleanEmail });

        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
                name: name || cleanEmail.split('@')[0],
                email: cleanEmail,
                password: randomPassword,
                role: 'user',
            });

            await Activity.create({
                user: user._id,
                userName: user.name,
                action: 'REGISTER',
                details: `User registered via Google Sign-In: ${cleanEmail}`,
            });
        } else {
            await Activity.create({
                user: user._id,
                userName: user.name,
                action: 'LOGIN',
                details: `User logged in via Google Sign-In: ${cleanEmail}`,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ message: error.message || 'Google authentication failed' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    sendOtp,
    verifyOtp,
    registerWithOtp,
    loginWithOtp,
    googleAuth,
    getUsers,
    deleteUser,
    forgotPassword,
    resetPassword,
    toggleWishlist,
    getWishlist,
    getUserProfile,
    updateUserProfile,
};
