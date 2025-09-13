import React, { useState, useEffect, useRef } from 'react';
import { FaIdCard, FaCheckCircle, FaExclamationTriangle, FaClock, FaSpinner, FaRedo, FaArrowLeft } from 'react-icons/fa';
import { validateAadhaarNumber } from '../../utils/verhoeff';
import { 
  generateSecureOTP, 
  validateOTP, 
  validatePhoneNumber, 
  maskPhoneNumber, 
  formatTime, 
  OTP_TIMER_DURATION, 
  RESEND_COOLDOWN,
  isDev 
} from '../../utils/otp';

const AadhaarVerification = ({ 
  initialAadhaar = '', 
  initialPhone = '', 
  onVerificationComplete,
  onCancel,
  title = "Aadhaar Verification",
  showTitle = true 
}) => {
  // Form state
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    aadhaarNumber: initialAadhaar,
    phoneNumber: initialPhone,
    otp: ''
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [aadhaarError, setAadhaarError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // OTP management
  const [devOTP, setDevOTP] = useState('');
  const [otpTimer, setOtpTimer] = useState(OTP_TIMER_DURATION);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showOtpExpired, setShowOtpExpired] = useState(false);

  // Refs for cleanup
  const otpIntervalRef = useRef(null);
  const resendIntervalRef = useRef(null);

  // Clear all errors
  const clearAllErrors = () => {
    setAadhaarError('');
    setPhoneError('');
    setOtpError('');
    setGeneralError('');
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    switch (field) {
      case 'aadhaarNumber':
        setAadhaarError('');
        break;
      case 'phoneNumber':
        setPhoneError('');
        break;
      case 'otp':
        setOtpError('');
        break;
    }
    setGeneralError('');
  };

  // Start OTP timer
  const startOtpTimer = () => {
    setOtpTimer(OTP_TIMER_DURATION);
    setShowOtpExpired(false);
    
    otpIntervalRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          setShowOtpExpired(true);
          clearInterval(otpIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start resend cooldown
  const startResendCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN);
    
    resendIntervalRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(resendIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle form submission (send OTP)
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearAllErrors();

    try {
      // Validate Aadhaar
      const aadhaarValidation = validateAadhaarNumber(formData.aadhaarNumber);
      if (!aadhaarValidation.isValid) {
        setAadhaarError(aadhaarValidation.error);
        setLoading(false);
        return;
      }

      // Validate phone
      const phoneValidation = validatePhoneNumber(formData.phoneNumber);
      if (!phoneValidation.isValid) {
        setPhoneError(phoneValidation.error);
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate OTP for development
      const otp = generateSecureOTP();
      setDevOTP(otp);

      // Move to OTP step
      setStep('otp');
      startOtpTimer();

      setLoading(false);
    } catch (error) {
      setGeneralError('Failed to send OTP. Please try again.');
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearAllErrors();

    try {
      // Validate OTP
      const otpValidation = validateOTP(formData.otp);
      if (!otpValidation.isValid) {
        setOtpError(otpValidation.error);
        setLoading(false);
        return;
      }

      // Check if OTP expired
      if (showOtpExpired) {
        setOtpError('OTP has expired. Please request a new one.');
        setLoading(false);
        return;
      }

      // In development, verify against generated OTP
      if (isDev && formData.otp !== devOTP) {
        setOtpError('Invalid OTP. Please check and try again.');
        setLoading(false);
        return;
      }

      // Simulate API verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success - call parent callback with verification data
      if (onVerificationComplete) {
        onVerificationComplete({
          aadhaar: formData.aadhaarNumber,
          phone: formData.phoneNumber,
          timestamp: new Date().toISOString()
        });
      }

      setStep('success');
      setLoading(false);
    } catch (error) {
      setGeneralError('OTP verification failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    clearAllErrors();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate new OTP
      const otp = generateSecureOTP();
      setDevOTP(otp);
      
      // Reset timers
      startOtpTimer();
      startResendCooldown();
      
      setLoading(false);
    } catch (error) {
      setGeneralError('Failed to resend OTP. Please try again.');
      setLoading(false);
    }
  };

  // Handle start over
  const handleStartOver = () => {
    setStep('form');
    setFormData({ aadhaarNumber: '', phoneNumber: '', otp: '' });
    clearAllErrors();
    setDevOTP('');
    setOtpTimer(OTP_TIMER_DURATION);
    setResendCooldown(0);
    setShowOtpExpired(false);
    
    // Clear timers
    if (otpIntervalRef.current) {
      clearInterval(otpIntervalRef.current);
      otpIntervalRef.current = null;
    }
    if (resendIntervalRef.current) {
      clearInterval(resendIntervalRef.current);
      resendIntervalRef.current = null;
    }
  };

  // Handle verify different number
  const handleVerifyDifferent = () => {
    handleStartOver();
    if (onCancel) onCancel();
  };

  // Mask Aadhaar number for display (show only last 4 digits)
  const maskAadhaar = (aadhaarNumber) => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) return 'Not provided';
    const lastFour = aadhaarNumber.slice(-4);
    return `****-****-${lastFour}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      {showTitle && (
        <div className="flex items-center mb-6">
          <FaIdCard className="text-3xl text-green-600 mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
            {title}
          </h1>
        </div>
      )}

      {/* Form Step */}
      {step === 'form' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Verify Your Aadhaar
          </h2>
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aadhaar Number
              </label>
              <input
                type="text"
                value={formData.aadhaarNumber}
                onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                placeholder="Enter your 12-digit Aadhaar number"
                className={`input input-bordered w-full max-w-md ${aadhaarError ? 'input-error' : ''}`}
                maxLength={12}
                required
              />
              {aadhaarError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{aadhaarError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter your 10-digit phone number"
                className={`input input-bordered w-full max-w-md ${phoneError ? 'input-error' : ''}`}
                maxLength={10}
                required
              />
              {phoneError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{phoneError}</p>
              )}
            </div>
            {generalError && (
              <div className="alert alert-error">
                <FaExclamationTriangle className="h-6 w-6" />
                <span>{generalError}</span>
              </div>
            )}
            <div className="flex gap-4">
              <button 
                type="submit" 
                className={`btn btn-success ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-outline bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* OTP Step */}
      {step === 'otp' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Enter OTP</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            OTP has been sent to {maskPhoneNumber(formData.phoneNumber)}
          </p>
          
          {/* Development OTP Display */}
          {isDev && devOTP && (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mb-4 border border-blue-200 dark:border-blue-700">
              <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                Development OTP: <span className="font-mono text-lg">{devOTP}</span>
              </p>
            </div>
          )}
          
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                OTP
              </label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => handleInputChange('otp', e.target.value)}
                placeholder="Enter 6-digit OTP"
                className={`input input-bordered w-full max-w-md ${otpError ? 'input-error' : ''}`}
                maxLength={6}
                required
              />
              {otpError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{otpError}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {otpTimer > 0 ? (
                <span>Resend OTP in {formatTime(otpTimer)}</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="btn btn-link btn-sm p-0"
                  disabled={resendCooldown > 0 || loading}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              )}
            </div>
            
            {showOtpExpired && (
              <div className="alert alert-warning">
                <FaClock className="h-6 w-6" />
                <span>OTP has expired. Please request a new one.</span>
              </div>
            )}
            
            {generalError && (
              <div className="alert alert-error">
                <FaExclamationTriangle className="h-6 w-6" />
                <span>{generalError}</span>
              </div>
            )}
            
            <div className="flex gap-4">
              <button 
                type="submit" 
                className={`btn btn-success ${loading ? 'loading' : ''}`}
                disabled={loading || showOtpExpired}
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={handleStartOver}
                className="btn btn-outline bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              >
                <FaArrowLeft className="mr-2" />
                Start Over
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Step */}
      {step === 'success' && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-lg p-6 border border-green-200 dark:border-green-700">
          {/* Success Header with Icon */}
          <div className="flex items-center mb-6">
            <FaCheckCircle className="text-green-600 dark:text-green-400 text-2xl mr-3" />
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
              Aadhaar Successfully Verified
            </h2>
          </div>
          
          {/* Verification Details with Proper Contrast */}
          <div className="space-y-3 mb-6">
            <p className="text-gray-800 dark:text-gray-200 mt-2">
              <strong className="text-black dark:text-white">Aadhaar:</strong> {maskAadhaar(formData.aadhaarNumber)}
            </p>
            <p className="text-gray-800 dark:text-gray-200 mt-2 mb-2">
              <strong className="text-black dark:text-white">Phone:</strong> {maskPhoneNumber(formData.phoneNumber)}
            </p>
            <p className="text-gray-800 dark:text-gray-200 text-sm mt-2 mb-2">
              <strong className="text-black dark:text-white">Verified on:</strong> {new Date().toLocaleString()}
            </p>
            
            {/* Expiry Note - Smaller and Italic */}
            <p className="text-green-600 dark:text-green-400 text-xs italic mt-3">
              Verification valid for current session
            </p>
          </div>
          
          {/* Button with Hover Effect */}
          <button
            onClick={handleVerifyDifferent}
            className="btn btn-success bg-green-600 hover:bg-green-700 text-white border-none shadow-md transition-colors duration-200 flex items-center"
          >
            <FaRedo className="mr-2" />
            Verify Different Number
          </button>
        </div>
      )}
    </div>
  );
};

export default AadhaarVerification;