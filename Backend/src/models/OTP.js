import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        index: true
    },
    otp: {
        type: String,
        required: true,
        length: 6
    },
    type: {
        type: String,
        enum: ['aadhaar_registration', 'login', 'password_reset'],
        required: true
    },
    aadhaarNumber: {
        type: String,
        sparse: true // Only for registration OTPs
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3
    },
    verified: {
        type: Boolean,
        default: false
    },
    smsProvider: {
        type: String,
        default: 'unknown'
    },
    messageId: String,
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    }
}, {
    timestamps: true
});

// Indexes for performance
otpSchema.index({ identifier: 1, type: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
