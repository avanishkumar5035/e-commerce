const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Standard Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Real Email OTP & Verification
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register-with-otp', registerWithOtp);
router.post('/login-otp', loginWithOtp);

// Google Sign-In / OAuth
router.post('/google', googleAuth);

// Password Reset
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Wishlist & Users
router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:id').post(protect, toggleWishlist);
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
