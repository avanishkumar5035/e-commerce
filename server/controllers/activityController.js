const Activity = require('../models/Activity');

// @desc    Log a new activity
// @route   POST /api/activity
// @access  Public (or Protect depending on action)
const logActivity = async (req, res) => {
    const { action, details, payload, userName } = req.body;

    try {
        const activity = new Activity({
            user: req.user ? req.user._id : null,
            userName: userName || (req.user ? req.user.name : 'Guest'),
            action,
            details,
            payload,
        });

        const createdActivity = await activity.save();
        res.status(201).json(createdActivity);
    } catch (error) {
        res.status(400);
        throw new Error('Invalid activity data');
    }
};

// @desc    Get all activities
// @route   GET /api/activity
// @access  Private/Admin
const getActivities = async (req, res) => {
    const activities = await Activity.find({})
        .sort({ createdAt: -1 })
        .limit(100); // Limit to last 100 for performance
    res.json(activities);
};

module.exports = {
    logActivity,
    getActivities,
};
