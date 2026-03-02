const mongoose = require('mongoose');
const User = require('../models/User');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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
        if (email === 'avanishkumar5035@gmail.com') {
            return res.status(400).json({ message: 'Registration not allowed for admin email. Please login.' });
        }

        const userExists = await User.findOne({
            $or: [
                { email },
                { mobileNumber: mobileNumber || '---non-existent---' }
            ]
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email or mobile number' });
        }

        const user = await User.create({
            name,
            email,
            password,
            mobileNumber
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
        if (email === 'avanishkumar5035@gmail.com') {
            if (password !== 'avanish@2006') {
                return res.status(401).json({ message: 'Invalid admin credentials' });
            }

            let user = await User.findOne({ email });
            // ... (rest of admin logic remains the same)
            if (!user) {
                user = await User.create({
                    name: 'Super Admin',
                    email,
                    password,
                    role: 'admin'
                });
            } else if (user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
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

module.exports = { registerUser, loginUser, getUsers, deleteUser, forgotPassword, resetPassword, toggleWishlist, getWishlist };
