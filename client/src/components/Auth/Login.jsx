import React, { useState } from 'react';
import { authAPI } from '../../services/api';

const Login = ({ onSwitchToRegister }) => {
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
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
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>CivicSecure Login</h2>

            {step === 'phone' && (
                <form onSubmit={handlePhoneSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            placeholder="Enter 10-digit phone number"
                            maxLength="10"
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        {loading ? 'Sending...' : 'Send Login OTP'}
                    </button>
                </form>
            )}

            {step === 'otp' && (
                <div>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', marginBottom: '15px', borderRadius: '4px' }}>
                        <p><strong>Prototype Mode:</strong></p>
                        <p>Mock OTP: <strong>{mockOTP}</strong></p>
                        <p><small>In production, this would be sent via SMS</small></p>
                    </div>

                    <form onSubmit={handleOTPSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Enter OTP:</label>
                            <input
                                type="text"
                                value={formData.otp}
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                    </form>
                </div>
            )}

            {message && (
                <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
                    border: `1px solid ${message.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`,
                    borderRadius: '4px',
                    color: message.includes('successful') ? '#155724' : '#721c24'
                }}>
                    {message}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Don't have an account? <button 
                    onClick={onSwitchToRegister}
                    style={{ color: '#007bff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
                >Register here</button></p>
            </div>
        </div>
    );
};

export default Login;