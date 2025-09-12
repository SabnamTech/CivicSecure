import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { authStyles } from '../../styles/authStyles';

const Login = ({ onSwitchToRegister }) => {
    const [step, setStep] = useState('phone');
    const [formData, setFormData] = useState({
        phoneNumber: '',
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [mockOTP, setMockOTP] = useState('');

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await authAPI.login(formData.phoneNumber);
            setMessage(response.data.message);
            setMockOTP(response.data.mockOTP);
            setStep('otp');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.verifyLoginOTP(formData.phoneNumber, formData.otp);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setMessage('Login successful! Redirecting...');

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
            <h2 style={authStyles.authTitle}>Welcome Back</h2>

            {step === 'phone' && (
                <form style={authStyles.form} onSubmit={handlePhoneSubmit}>
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
                            placeholder="Enter your registered phone number"
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
                        {loading ? 'Sending...' : 'Send Verification Code'}
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
                            {loading ? 'Signing in...' : 'Complete Sign In'}
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

            <div style={authStyles.switchAuth}>
                <p>Don't have an account? <button 
                    onClick={onSwitchToRegister}
                    style={authStyles.switchAuthButton}
                >Create account</button></p>
            </div>
        </div>
    );
};

export default Login;