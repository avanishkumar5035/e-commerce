const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['register', 'login', 'reset'],
            default: 'register',
        },
        mobileNumber: {
            type: String,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600, // 10 minutes TTL: MongoDB automatically deletes expired OTPs
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Otp', otpSchema);

