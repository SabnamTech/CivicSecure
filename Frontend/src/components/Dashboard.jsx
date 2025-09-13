import React, { useState, useEffect, useRef } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaEye, FaPlus, FaMoon, FaSun, FaIdCard, FaShieldAlt, FaArrowLeft, FaSpinner, FaRedo } from "react-icons/fa";

function Dashboard({ toggleTheme, theme, setCurrentPage, currentPage }) {
  // Enhanced state management for Aadhaar verification
  const [currentView, setCurrentView] = useState('dashboard');
  const [verificationStep, setVerificationStep] = useState('form');
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    phoneNumber: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Enhanced error state management
  const [aadhaarError, setAadhaarError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  // Verification persistence state with 10-minute timeout
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedData, setVerifiedData] = useState({ aadhaar: '', phone: '', timestamp: '' });
  
  const [devOTP, setDevOTP] = useState('');
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(60);
  const [showOtpExpired, setShowOtpExpired] = useState(false);
  
  const otpIntervalRef = useRef(null);
  const resendIntervalRef = useRef(null);
  const verificationCleanupRef = useRef(null);

  // Enhanced verification persistence check
  const checkVerificationStatus = () => {
    const verifiedAadhaar = localStorage.getItem('aadhaarVerified');
    const verifiedPhone = localStorage.getItem('verifiedPhone');
    const verificationTimestamp = localStorage.getItem('verificationTimestamp');
    
    if (verifiedAadhaar && verifiedPhone && verificationTimestamp) {
      const verifyTime = new Date(verificationTimestamp);
      const now = new Date();
      const minutesDiff = (now - verifyTime) / (1000 * 60); // Minutes difference
      
      if (minutesDiff <= 10) {
        // Verification is still valid (within 10 minutes)
        setIsVerified(true);
        setVerifiedData({ 
          aadhaar: verifiedAadhaar, 
          phone: verifiedPhone,
          timestamp: verificationTimestamp
        });
        setVerificationStep('success');
        
        // Set up auto-cleanup timer for remaining time
        const remainingMs = (10 * 60 * 1000) - (minutesDiff * 60 * 1000);
        verificationCleanupRef.current = setTimeout(() => {
          clearVerificationStatus();
        }, remainingMs);
        
        return true;
      } else {
        // Verification expired, clear it
        clearVerificationStatus();
        return false;
      }
    }
    return false;
  };

  const clearVerificationStatus = () => {
    localStorage.removeItem('aadhaarVerified');
    localStorage.removeItem('verifiedPhone');
    localStorage.removeItem('verificationTimestamp');
    setIsVerified(false);
    setVerifiedData({ aadhaar: '', phone: '', timestamp: '' });
    if (verificationCleanupRef.current) {
      clearTimeout(verificationCleanupRef.current);
      verificationCleanupRef.current = null;
    }
  };

  // Check verification status on component mount and when currentPage changes
  useEffect(() => {
    checkVerificationStatus();
  }, []);

  // Re-check verification when returning to aadhaar-verify page
  useEffect(() => {
    if (currentPage === 'aadhaar-verify') {
      checkVerificationStatus();
    }
  }, [currentPage]);

  // Cleanup timers on unmount or view change
  useEffect(() => {
    return () => {
      if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
      if (verificationCleanupRef.current) clearTimeout(verificationCleanupRef.current);
    };
  }, []);

  // Handle view changes and state management
  useEffect(() => {
    if (currentView !== 'aadhaar-verify') {
      // Only reset form data if not verified, preserve verification status
      if (!isVerified) {
        setVerificationStep('form');
        setFormData({ aadhaarNumber: '', phoneNumber: '', otp: '' });
      }
      setLoading(false);
      clearAllErrors();
      setDevOTP('');
      setOtpTimer(300);
      setResendCooldown(60);
      setShowOtpExpired(false);
      if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
    }
  }, [currentView, isVerified]);
  // Enhanced validation functions
  const verhoeffValidate = (aadhaar) => {
    if (!/^\d{12}$/.test(aadhaar)) return false;

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
    const arr = aadhaar.split('').map(Number).reverse();

    for (let i = 0; i < arr.length; i++) {
      c = d[c][p[i % 8][arr[i]]];
    }

    return c === 0;
  };

  const generateSecureOTP = () => {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return (array[0] % 1000000).toString().padStart(6, '0');
    } else {
      return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Enhanced validation with proper error messages
  const validateAadhaar = (aadhaar) => {
    if (!aadhaar) return 'Aadhaar number is required';
    if (!/^\d+$/.test(aadhaar)) return 'Aadhaar number format is incorrect';
    if (aadhaar.length < 12) return `Please enter all 12 digits (${12 - aadhaar.length} more needed)`;
    if (aadhaar.length > 12) return 'Aadhaar number cannot exceed 12 digits';
    if (!verhoeffValidate(aadhaar)) return 'Invalid Aadhaar number. Please check the 12-digit number.';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    if (!/^\d+$/.test(phone)) return 'Phone number must contain only digits';
    if (phone.length < 10) return `Please enter all 10 digits (${10 - phone.length} more needed)`;
    if (phone.length > 10) return 'Phone number cannot exceed 10 digits';
    if (phone.startsWith('0') || phone.startsWith('1')) return 'Invalid phone number. Please enter 10 digits.';
    return '';
  };

  const validateOTP = (otp) => {
    if (!otp) return 'OTP is required';
    if (!/^\d+$/.test(otp)) return 'OTP must contain only digits';
    if (otp.length < 6) return `Please enter all 6 digits (${6 - otp.length} more needed)`;
    if (otp.length > 6) return 'OTP cannot exceed 6 digits';
    return '';
  };

  // Enhanced error handling functions
  const clearAllErrors = () => {
    setAadhaarError('');
    setPhoneError('');
    setOtpError('');
    setGeneralError('');
  };

  const clearFieldError = (field) => {
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
      default:
        break;
    }
  };

  // Enhanced event handlers
  const handleInputChange = (field, value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Apply length limits
    let limitedValue = numericValue;
    if (field === 'aadhaarNumber' && numericValue.length > 12) return;
    if (field === 'phoneNumber' && numericValue.length > 10) return;
    if (field === 'otp' && numericValue.length > 6) return;
    
    setFormData(prev => ({ ...prev, [field]: limitedValue }));
    
    // Clear field-specific error when user starts typing
    clearFieldError(field);
    
    // Real-time validation for immediate feedback
    if (field === 'aadhaarNumber' && limitedValue.length >= 12) {
      const error = validateAadhaar(limitedValue);
      if (error) setAadhaarError(error);
    }
    
    if (field === 'phoneNumber' && limitedValue.length >= 10) {
      const error = validatePhone(limitedValue);
      if (error) setPhoneError(error);
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(300); // 5 minutes
    setShowOtpExpired(false);
    
    if (otpIntervalRef.current) {
      clearInterval(otpIntervalRef.current);
    }
    
    otpIntervalRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(otpIntervalRef.current);
          setShowOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    
    if (resendIntervalRef.current) {
      clearInterval(resendIntervalRef.current);
    }
    
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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate both fields
    const aadhaarValidationError = validateAadhaar(formData.aadhaarNumber);
    const phoneValidationError = validatePhone(formData.phoneNumber);
    
    if (aadhaarValidationError) {
      setAadhaarError(aadhaarValidationError);
    }
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
    }
    
    if (aadhaarValidationError || phoneValidationError) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const otp = generateSecureOTP();
      setDevOTP(otp);
      setVerificationStep('otp');
      startOtpTimer();
      startResendCooldown();
    } catch (error) {
      setGeneralError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    clearAllErrors();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const otp = generateSecureOTP();
      setDevOTP(otp);
      startOtpTimer();
      startResendCooldown();
    } catch (error) {
      setGeneralError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    const otpValidationError = validateOTP(formData.otp);
    if (otpValidationError) {
      setOtpError(otpValidationError);
      return;
    }
    
    if (formData.otp !== devOTP) {
      setOtpError('Invalid OTP. Please try again.');
      return;
    }
    
    if (otpTimer <= 0) {
      setOtpError('OTP has expired. Please request a new one.');
      return;
    }
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save verification to localStorage with timestamp for 10-minute expiry
      const verificationTimestamp = new Date().toISOString();
      localStorage.setItem('aadhaarVerified', formData.aadhaarNumber);
      localStorage.setItem('verifiedPhone', formData.phoneNumber);
      localStorage.setItem('verificationTimestamp', verificationTimestamp);
      
      // Update component state
      setIsVerified(true);
      setVerifiedData({
        aadhaar: formData.aadhaarNumber,
        phone: formData.phoneNumber,
        timestamp: verificationTimestamp
      });
      
      setVerificationStep('success');
      
      // Set up 10-minute auto-cleanup timer
      verificationCleanupRef.current = setTimeout(() => {
        clearVerificationStatus();
      }, 10 * 60 * 1000); // 10 minutes
      
      // Cleanup timers
      if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
    } catch (error) {
      setGeneralError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleVerifyAgain = () => {
    // Clear verification state using centralized function
    clearVerificationStatus();
    
    // Reset form
    setVerificationStep('form');
    setFormData({ aadhaarNumber: '', phoneNumber: '', otp: '' });
    clearAllErrors();
    setDevOTP('');
    setOtpTimer(300);
    setResendCooldown(60);
    setShowOtpExpired(false);
  };

  const handleStartOver = () => {
    setVerificationStep('form');
    setFormData({ aadhaarNumber: '', phoneNumber: '', otp: '' });
    clearAllErrors();
    setDevOTP('');
    setOtpTimer(300);
    setResendCooldown(60);
    setShowOtpExpired(false);
    if (otpIntervalRef.current) {
      clearInterval(otpIntervalRef.current);
      otpIntervalRef.current = null;
    }
    if (resendIntervalRef.current) {
      clearInterval(resendIntervalRef.current);
      resendIntervalRef.current = null;
    }
  };

  const handleVerifyDifferent = () => {
    clearVerificationStatus();
    setVerificationStep('form');
    setFormData({ aadhaarNumber: '', phoneNumber: '', otp: '' });
    clearAllErrors();
  };

  // Enhanced styling based on validation state
  const getInputStyle = (field) => {
    const value = formData[field];
    let hasError = false;
    let errorMessage = '';
    
    // Check for field-specific errors
    switch (field) {
      case 'aadhaarNumber':
        hasError = !!aadhaarError;
        errorMessage = aadhaarError;
        break;
      case 'phoneNumber':
        hasError = !!phoneError;
        errorMessage = phoneError;
        break;
      case 'otp':
        hasError = !!otpError;
        errorMessage = otpError;
        break;
      default:
        break;
    }
    
    if (!value) return 'input input-bordered w-full focus:border-blue-500 focus:outline-none';
    if (hasError) return 'input input-bordered input-error w-full border-red-500 focus:border-red-500 focus:outline-none';
    
    // Check validity for success styling
    let isValid = false;
    if (field === 'aadhaarNumber') isValid = !validateAadhaar(value);
    if (field === 'phoneNumber') isValid = !validatePhone(value);
    if (field === 'otp') isValid = !validateOTP(value);
    
    return `input input-bordered w-full focus:outline-none ${
      isValid 
        ? 'input-success border-green-500 focus:border-green-500' 
        : 'border-gray-300 focus:border-blue-500'
    }`;
  };

  // Mask Aadhaar number for display
  const maskAadhaar = (aadhaar) => {
    if (aadhaar.length !== 12) return aadhaar;
    return `XXXX-XXXX-${aadhaar.slice(-4)}`;
  };

  const stats = [
    { label: "Total Complaints", value: "24", icon: FaExclamationTriangle, color: "text-green-600" },
    { label: "Resolved", value: "18", icon: FaCheckCircle, color: "text-green-700" },
    { label: "Pending", value: "6", icon: FaClock, color: "text-yellow-500" },
    { label: "In Review", value: "3", icon: FaEye, color: "text-blue-600" }
  ];

  const recentComplaints = [
    { id: "CMP001", category: "Safety", status: "Pending", date: "2025-09-12" },
    { id: "CMP002", category: "Civic", status: "Resolved", date: "2025-09-11" },
    { id: "CMP003", category: "Disaster", status: "In Review", date: "2025-09-10" }
  ];

  // Check if user clicked Aadhaar Verify from sidebar
  useEffect(() => {
    if (currentPage === 'aadhaar-verify') {
      setCurrentView('aadhaar-verify');
    } else {
      setCurrentView('dashboard');
    }
  }, [currentPage]);
  
  // Enhanced Aadhaar Verification Form with better error handling
  const renderAadhaarForm = () => (
    <div className="max-w-md mx-auto">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="text-center mb-6">
            <FaIdCard className="text-6xl text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Verify Your Aadhaar</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your Aadhaar and phone number to verify your identity</p>
          </div>

          {generalError && (
            <div className="alert alert-error mb-4">
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Aadhaar Number</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter 12-digit Aadhaar number"
                className={getInputStyle('aadhaarNumber')}
                value={formData.aadhaarNumber}
                onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                disabled={loading}
                maxLength="12"
              />
              {aadhaarError && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">{aadhaarError}</span>
                </label>
              )}
              
              {/* Real-time character count for Aadhaar */}
              {formData.aadhaarNumber.length > 0 && formData.aadhaarNumber.length < 12 && !aadhaarError && (
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    {formData.aadhaarNumber.length}/12 digits entered
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Phone Number</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter 10-digit phone number"
                className={getInputStyle('phoneNumber')}
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={loading}
                maxLength="10"
              />
              {phoneError && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">{phoneError}</span>
                </label>
              )}
              
              {/* Real-time character count for Phone */}
              {formData.phoneNumber.length > 0 && formData.phoneNumber.length < 10 && !phoneError && (
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    {formData.phoneNumber.length}/10 digits entered
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-success w-full ${loading ? 'loading' : ''}`}
              disabled={
                loading || 
                !formData.aadhaarNumber || 
                !formData.phoneNumber || 
                !!validateAadhaar(formData.aadhaarNumber) || 
                !!validatePhone(formData.phoneNumber)
              }
            >
              {loading ? (
                <><FaSpinner className="animate-spin mr-2" /> Sending OTP...</>
              ) : (
                <>Send OTP</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // Enhanced OTP Verification Form  
  const renderOtpForm = () => (
    <div className="max-w-md mx-auto">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="text-center mb-6">
            <FaShieldAlt className="text-6xl text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Verify OTP</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter the 6-digit OTP sent to {formData.phoneNumber}
            </p>
          </div>

          {/* Development OTP Display */}
          {devOTP && (
            <div className="alert alert-warning mb-4">
              <div className="flex flex-col items-start">
                <span className="font-semibold">Development Mode - OTP:</span>
                <span className="font-mono text-lg">{devOTP}</span>
              </div>
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center mb-4">
            <div className={`text-lg font-semibold ${otpTimer <= 60 ? 'text-error' : 'text-info'}`}>
              Time remaining: {formatTime(otpTimer)}
            </div>
            {showOtpExpired && (
              <div className="text-error text-sm mt-1">OTP has expired. Please request a new one.</div>
            )}
          </div>

          {generalError && (
            <div className="alert alert-error mb-4">
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Enter OTP</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                className={getInputStyle('otp')}
                value={formData.otp}
                onChange={(e) => handleInputChange('otp', e.target.value)}
                disabled={loading || otpTimer <= 0}
                maxLength="6"
              />
              {otpError && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">{otpError}</span>
                </label>
              )}
              
              {/* Real-time character count for OTP */}
              {formData.otp.length > 0 && formData.otp.length < 6 && !otpError && (
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    {formData.otp.length}/6 digits entered
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-success w-full ${loading ? 'loading' : ''}`}
              disabled={loading || !formData.otp || !!validateOTP(formData.otp) || otpTimer <= 0}
            >
              {loading ? (
                <><FaSpinner className="animate-spin mr-2" /> Verifying...</>
              ) : (
                <>Verify OTP</>
              )}
            </button>

            <button
              type="button"
              className={`btn btn-outline w-full ${loading ? 'loading' : ''}`}
              disabled={loading || resendCooldown > 0}
              onClick={handleResendOTP}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
            </button>
          </form>

          <div className="divider"></div>
          
          <button
            className="btn btn-ghost w-full"
            onClick={() => setVerificationStep('form')}
            disabled={loading}
          >
            <FaArrowLeft className="mr-2" />
            Back to Form
          </button>
        </div>
      </div>
    </div>
  );

  // Enhanced Success Message with verification details
  const renderSuccessMessage = () => (
    <div className="max-w-md mx-auto">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body text-center">
          <FaCheckCircle className="text-8xl text-success mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Verification Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your Aadhaar has been successfully verified. Your identity is now confirmed.
          </p>
          
          {/* Display verified information */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Verified Information:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Aadhaar:</span>
                <span className="font-mono">{maskAadhaar(verifiedData.aadhaar)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="font-mono">+91-{verifiedData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Verified:</span>
                <span className="text-green-600 font-medium">
                  {new Date(verifiedData.timestamp || new Date()).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              className="btn btn-success w-full"
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </button>
            
            <button
              className="btn btn-outline btn-secondary w-full"
              onClick={handleVerifyAgain}
            >
              <FaRedo className="mr-2" />
              Verify Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Aadhaar Verification Section
  const renderAadhaarVerification = () => (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          className="btn btn-ghost mr-4"
          onClick={handleBackToDashboard}
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-400">Aadhaar Verification</h1>
      </div>

      {verificationStep === 'form' && renderAadhaarForm()}
      {verificationStep === 'otp' && renderOtpForm()}
      {verificationStep === 'success' && renderSuccessMessage()}
    </div>
  );

  // Main render - check if we should show Aadhaar verification or dashboard
  if (currentView === 'aadhaar-verify') {
    return renderAadhaarVerification();
  }

  return (
    <div className="w-full">
      {/* Aadhaar Verification Section */}
      {currentPage === "aadhaar-verify" && (
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <FaIdCard className="text-3xl text-green-600 mr-3" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
                Aadhaar Verification
              </h1>
            </div>
            
            {verificationStep === "form" && !isVerified && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Verify Your Aadhaar</h2>
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
                  <button 
                    type="submit" 
                    className={`btn btn-success ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              </div>
            )}

            {verificationStep === "otp" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Enter OTP</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  OTP has been sent to {formData.phoneNumber.replace(/(\d{6})(\d{4})/, '******$2')}
                </p>
                {devOTP && (
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
                      <span>Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="btn btn-link btn-sm p-0"
                        disabled={resendCooldown > 0}
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
                      className="btn btn-outline"
                    >
                      <FaArrowLeft className="mr-2" />
                      Start Over
                    </button>
                  </div>
                </form>
              </div>
            )}

            {(verificationStep === "success" || isVerified) && (
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-700">
                <div className="flex items-center mb-4">
                  <FaCheckCircle className="text-green-600 text-2xl mr-3" />
                  <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
                    Aadhaar Successfully Verified
                  </h2>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-green-700 dark:text-green-300">
                    <strong>Aadhaar:</strong> {verifiedData.aadhaar || formData.aadhaarNumber}
                  </p>
                  <p className="text-green-700 dark:text-green-300">
                    <strong>Phone:</strong> {verifiedData.phone || formData.phoneNumber}
                  </p>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    <strong>Verified on:</strong> {new Date(verifiedData.timestamp || Date.now()).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleVerifyDifferent}
                  className="btn btn-outline btn-success"
                >
                  <FaRedo className="mr-2" />
                  Verify Different Number
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {currentPage === "dashboard" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700 dark:text-gray-400 mb-2">
                Dashboard
              </h1>
              <p className="text-green-700 dark:text-green-400 text-sm sm:text-base lg:text-lg">
                Welcome back! Here's your complaint overview
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                className="btn btn-success btn-sm sm:btn-md flex items-center justify-center gap-2 order-2 sm:order-1"
                onClick={() => setCurrentPage("file-complaint")}
              >
                <FaPlus className="text-sm" />
                <span className="hidden sm:inline">New Complaint</span>
                <span className="sm:hidden">New</span>
              </button>
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="btn btn-outline btn-success btn-sm sm:btn-md flex items-center justify-center order-1 sm:order-2"
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? <FaMoon className="text-sm" /> : <FaSun className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {stats.map(({ label, value, icon: Icon, color }, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="card-body p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 dark:text-gray-200 truncate">
                        {value}
                      </h3>
                      <p className="text-xs lg:text-sm xl:text-base font-semibold text-gray-600 dark:text-gray-400 mt-1 leading-tight">
                        {label}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <Icon className={`${color} text-2xl lg:text-3xl xl:text-4xl`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Complaints */}
          <div className="card bg-base-100 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="card-body p-4 lg:p-6">
              <h2 className="card-title text-lg lg:text-xl xl:text-2xl mb-4 lg:mb-6 font-bold text-gray-800 dark:text-gray-200">
                Recent Complaints
              </h2>
              <div className="overflow-x-auto">
                <ul className="divide-y divide-gray-200 dark:divide-gray-600 min-w-full">
                  {recentComplaints.map(({ id, category, status, date }) => (
                    <li key={id} className="py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-sm sm:text-base">
                          {id}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {category}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end sm:text-right gap-4">
                        <span
                          className={`badge badge-sm font-medium ${
                            status === "Resolved"
                              ? "badge-success"
                              : status === "Pending"
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {status}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {date}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-actions justify-end mt-4 lg:mt-6">
                <button className="btn btn-outline btn-success btn-sm sm:btn-md">
                  View All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
