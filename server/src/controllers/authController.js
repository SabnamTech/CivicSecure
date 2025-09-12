import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate mock OTP (always returns 123456 for prototype)
const generateMockOTP = () => '123456';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Mock Aadhaar verification (always succeeds for prototype)
export const startRegistration = async (req, res) => {
    try {
        const { aadhaarNumber, phoneNumber } = req.body;

        // Basic validation
        if (!aadhaarNumber || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Aadhaar and phone number are required'
            });
        }

        if (aadhaarNumber.length !== 12 || phoneNumber.length !== 10) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Aadhaar or phone number format'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ aadhaarNumber }, { phoneNumber }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this Aadhaar or phone number'
            });
        }

        // Mock: Create user with mock OTP
        const mockOTP = generateMockOTP();
        const user = await User.create({
            aadhaarNumber,
            phoneNumber,
            name: `User ${phoneNumber}`, // Mock name
            otp: mockOTP,
            otpExpires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        });

        console.log(`📱 Mock OTP for ${phoneNumber}: ${mockOTP}`);

        res.json({
            success: true,
            message: 'Mock OTP sent! Check console for OTP (Prototype mode)',
            mockOTP: mockOTP, // Only for prototype - remove in production
            step: 'otp_verification'
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Verify OTP and complete registration
export const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and OTP are required'
            });
        }

        // Find user with matching phone and valid OTP
        const user = await User.findOne({
            phoneNumber,
            otp,
            otpExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Mark user as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Registration completed successfully',
            token,
            user: {
                id: user._id,
                aadhaarNumber: user.aadhaarNumber,
                phoneNumber: user.phoneNumber,
                name: user.name,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('OTP Verification Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Mock login (generates mock OTP)
export const login = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        // Find user
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found. Please register first.'
            });
        }

        // Generate mock OTP
        const mockOTP = generateMockOTP();
        user.otp = mockOTP;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        console.log(`📱 Mock Login OTP for ${phoneNumber}: ${mockOTP}`);

        res.json({
            success: true,
            message: 'Mock login OTP sent! Check console (Prototype mode)',
            mockOTP: mockOTP, // Only for prototype
            step: 'login_verification'
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Verify login OTP
export const verifyLoginOTP = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        const user = await User.findOne({
            phoneNumber,
            otp,
            otpExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                aadhaarNumber: user.aadhaarNumber,
                phoneNumber: user.phoneNumber,
                name: user.name,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Login Verification Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get user profile (protected route)
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-otp -otpExpires');
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};
