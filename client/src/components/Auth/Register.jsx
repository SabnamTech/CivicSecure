import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { authStyles } from '../../styles/authStyles';

const Register = ({ onSwitchToLogin }) => {
    const [step, setStep] = useState('details');
    const [formData, setFormData] = useState({
        aadhaarNumber: '',
        phoneNumber: '',
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [mockOTP, setMockOTP] = useState('');

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await authAPI.register(formData.aadhaarNumber, formData.phoneNumber);
            setMessage(response.data.message);
            setMockOTP(response.data.mockOTP);
            setStep('otp');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.verifyOTP(formData.phoneNumber, formData.otp);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setMessage('Registration successful! Redirecting...');

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={authStyles.authContainer}>
            <h2 style={authStyles.authTitle}>Create Your Account</h2>

            {step === 'details' && (
                <form style={authStyles.form} onSubmit={handleDetailsSubmit}>
                    <div style={authStyles.formField}>
                        <label style={authStyles.label}>Aadhaar Number</label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={formData.aadhaarNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                setFormData({ ...formData, aadhaarNumber: value });
                            }}
                            placeholder="Enter 12-digit Aadhaar number"
                            maxLength="12"
                            required
                            style={authStyles.input}
                        />
                    </div>

                    <div style={authStyles.formField}>
                        <label style={authStyles.label}>Phone Number</label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                setFormData({ ...formData, phoneNumber: value });
                            }}
                            placeholder="Enter 10-digit phone number"
                            maxLength="10"
                            required
                            style={authStyles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...authStyles.primaryButton,
                            ...(loading ? authStyles.primaryButtonDisabled : {})
                        }}
                    >
                        {loading ? 'Processing...' : 'Send Verification Code'}
                    </button>
                </form>
            )}

            {step === 'otp' && (
                <div>
                    <div style={authStyles.otpDisplayBox}>
                        <p style={authStyles.otpTitle}>🔐 Prototype Mode</p>
                        <div style={authStyles.otpValue}>{mockOTP}</div>
                        <p style={authStyles.otpSubtext}>In production, this would be sent via SMS</p>
                    </div>

                    <form style={authStyles.form} onSubmit={handleOTPSubmit}>
                        <div style={authStyles.formField}>
                            <label style={authStyles.label}>Verification Code</label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={formData.otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setFormData({ ...formData, otp: value });
                                }}
                                placeholder="Enter 6-digit code"
                                maxLength="6"
                                required
                                style={authStyles.input}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...authStyles.successButton,
                                ...(loading ? authStyles.primaryButtonDisabled : {})
                            }}
                        >
                            {loading ? 'Verifying...' : 'Complete Registration'}
                        </button>
                    </form>
                </div>
            )}

            {message && (
                <div style={{
                    ...authStyles.messageBox,
                    ...(message.includes('successful') ? authStyles.successMessage : authStyles.errorMessage)
                }}>
                    {message}
                </div>
            )}

            {onSwitchToLogin && (
                <div style={authStyles.switchAuth}>
                    <p>Already have an account? <button 
                        onClick={onSwitchToLogin}
                        style={authStyles.switchAuthButton}
                    >Sign in here</button></p>
                </div>
            )}
        </div>
    );
};

export default Register;