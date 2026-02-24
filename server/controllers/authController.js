const User = require('../models/User');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    const { name, email, password } = req.body;

    try {
        if (email === 'avanishkumar5035@gmail.com') {
            return res.status(400).json({ message: 'Registration not allowed for admin email. Please login.' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
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
    const { email, password } = req.body;

    try {
        if (email === 'avanishkumar5035@gmail.com') {
            if (password !== 'avanish@2006') {
                return res.status(401).json({ message: 'Invalid admin credentials' });
            }

            let user = await User.findOne({ email });
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

        const user = await User.findOne({ email });

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
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
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

module.exports = { registerUser, loginUser, getUsers, deleteUser };
