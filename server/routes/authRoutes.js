const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUsers,
    deleteUser,
    forgotPassword,
    resetPassword,
    toggleWishlist,
    getWishlist,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:id').post(protect, toggleWishlist);
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);

module.exports = router;
