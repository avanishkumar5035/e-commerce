const express = require('express');
const router = express.Router();
const {
    logActivity,
    getActivities,
} = require('../controllers/activityController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(logActivity)
    .get(protect, admin, getActivities);

module.exports = router;
