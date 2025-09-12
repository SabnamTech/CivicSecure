import express from 'express';
import {
    startRegistration,
    verifyOTP,
    login,
    verifyLoginOTP,
    getProfile
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Registration routes
router.post('/register', startRegistration);
router.post('/verify-otp', verifyOTP);

// Login routes
router.post('/login', login);
router.post('/login/verify', verifyLoginOTP);

// Protected routes
router.get('/profile', auth, getProfile);

export default router;
