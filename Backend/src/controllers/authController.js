import User from '../models/User.js';
import OTP from '../models/OTP.js';
import smsService from '../services/smsService.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';

// Generate cryptographically secure OTP
const generateSecureOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Enhanced Aadhaar validation (Luhn algorithm check)
const validateAadhaarNumber = (aadhaar) => {
    if (!/^\d{12}$/.test(aadhaar)) return false;

    // Verhoeff algorithm for Aadhaar validation
    const d = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let c = 0;
    const myArray = aadhaar.split('').map(Number).reverse();

    for (let i = 0; i < myArray.length; i++) {
        c = d[c][p[((i + 1) % 8)][myArray[i]]];
    }

    return c === 0;
};

// Mock Aadhaar database for demonstration
const mockAadhaarData = {
    '123456789012': {
        name: 'John Doe',
        phone: '9876543210',
        address: '123 Main St, Delhi',
        dob: '1990-01-01',
        gender: 'Male'
    },
    '987654321098': {
        name: 'Jane Smith',
        phone: '8765432109',
        address: '456 Park Ave, Mumbai',
        dob: '1985-05-15',
        gender: 'Female'
    },
    '456789123045': {
        name: 'Raj Kumar',
        phone: '7654321098',
        address: '789 Gandhi Road, Bangalore',
        dob: '1992-12-25',
        gender: 'Male'
    }
};

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Enhanced registration with Aadhaar validation
export const startRegistration = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { aadhaarNumber, phoneNumber } = req.body;

        // Enhanced Aadhaar validation
        if (!validateAadhaarNumber(aadhaarNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Aadhaar number format'
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

        // Check if Aadhaar exists in mock database
        const aadhaarInfo = mockAadhaarData[aadhaarNumber];
        if (!aadhaarInfo) {
            return res.status(400).json({
                success: false,
                message: 'Aadhaar number not found in records'
            });
        }

        // Verify if provided phone matches Aadhaar-linked phone
        if (aadhaarInfo.phone !== phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number does not match Aadhaar records'
            });
        }

        // Generate secure OTP
        const secureOTP = generateSecureOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to database
        await OTP.create({
            identifier: phoneNumber,
            otp: secureOTP,
            type: 'aadhaar_registration',
            aadhaarNumber: aadhaarNumber,
            expiresAt: otpExpiry
        });

        // Send OTP via SMS (using free service)
        const smsResult = await smsService.sendOTP(phoneNumber, secureOTP);

        if (!smsResult.success) {
            // Fallback: Log OTP for development
            console.log(`🔐 OTP for ${phoneNumber}: ${secureOTP}`);
        }

        res.json({
            success: true,
            message: smsResult.success
                ? 'OTP sent to your mobile number'
                : `OTP generation failed. Dev OTP: ${secureOTP}`,
            step: 'otp_verification',
            // Only show OTP in development mode
            ...(process.env.NODE_ENV === 'development' && { devOTP: secureOTP })
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Enhanced OTP verification
export const verifyRegistrationOTP = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { phoneNumber, otp } = req.body;

        // Find and verify OTP
        const otpRecord = await OTP.findOne({
            identifier: phoneNumber,
            otp: otp,
            type: 'aadhaar_registration',
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Get Aadhaar data
        const aadhaarInfo = mockAadhaarData[otpRecord.aadhaarNumber];

        // Create user with Aadhaar information
        const user = await User.create({
            aadhaarNumber: otpRecord.aadhaarNumber,
            phoneNumber: phoneNumber,
            name: aadhaarInfo.name,
            isVerified: true,
            profile: {
                address: aadhaarInfo.address,
                dateOfBirth: new Date(aadhaarInfo.dob),
                gender: aadhaarInfo.gender
            }
        });

        // Remove OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

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

// Enhanced login with secure OTP
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { phoneNumber } = req.body;

        // Find user
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found. Please register first.'
            });
        }

        // Generate secure OTP
        const secureOTP = generateSecureOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        // Save OTP
        await OTP.create({
            identifier: phoneNumber,
            otp: secureOTP,
            type: 'login',
            expiresAt: otpExpiry
        });

        // Send OTP
        const smsResult = await smsService.sendOTP(phoneNumber, secureOTP);

        if (!smsResult.success) {
            console.log(`🔐 Login OTP for ${phoneNumber}: ${secureOTP}`);
        }

        res.json({
            success: true,
            message: smsResult.success
                ? 'Login OTP sent to your mobile number'
                : `OTP generation failed. Dev OTP: ${secureOTP}`,
            step: 'login_verification',
            ...(process.env.NODE_ENV === 'development' && { devOTP: secureOTP })
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { phoneNumber, otp } = req.body;

        // Verify OTP
        const otpRecord = await OTP.findOneAndDelete({
            identifier: phoneNumber,
            otp: otp,
            type: 'login',
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Find user
        const user = await User.findOne({ phoneNumber });

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

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-__v');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                aadhaarNumber: user.aadhaarNumber,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
