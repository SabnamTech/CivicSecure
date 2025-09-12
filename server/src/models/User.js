import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true,
        length: 12
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        length: 10
    },
    name: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String, // Store current OTP for prototype
    otpExpires: Date
}, { timestamps: true });

export default mongoose.model('User', userSchema);
