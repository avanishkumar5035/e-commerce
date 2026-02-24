const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, // Optional for guest actions if any
            ref: 'User',
        },
        userName: {
            type: String,
            required: true,
            default: 'Guest',
        },
        action: {
            type: String,
            required: true,
            enum: ['LOGIN', 'LOGOUT', 'ADD_TO_CART', 'REMOVE_FROM_CART', 'PURCHASE', 'VIEW_PRODUCT', 'PAYMENT'],
        },
        details: {
            type: String, // Stringified details or a description
            required: false,
        },
        payload: {
            type: Object, // Structured data (e.g., product info)
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
