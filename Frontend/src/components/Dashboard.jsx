import React, { useState, useEffect, useRef } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaEye, FaPlus, FaMoon, FaSun } from "react-icons/fa";
import AadhaarVerification from "./shared/AadhaarVerification";

function Dashboard({ toggleTheme, theme, setCurrentPage, currentPage }) {
  // Verification persistence state with 10-minute timeout
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedData, setVerifiedData] = useState({ aadhaar: '', phone: '', timestamp: '' });

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

  // Handle verification completion from AadhaarVerification component
  const handleVerificationComplete = (data) => {
    const timestamp = new Date().toISOString();

    // Store in localStorage with 10-minute expiry
    localStorage.setItem('aadhaarVerified', data.aadhaar);
    localStorage.setItem('verifiedPhone', data.phone);
    localStorage.setItem('verificationTimestamp', timestamp);

    // Update state
    setIsVerified(true);
    setVerifiedData({
      aadhaar: data.aadhaar,
      phone: data.phone,
      timestamp: timestamp
    });

    // Set auto-cleanup timer for 10 minutes
    verificationCleanupRef.current = setTimeout(() => {
      clearVerificationStatus();
    }, 10 * 60 * 1000);
  };

  // Handle verification cancellation
  const handleVerificationCancel = () => {
    clearVerificationStatus();
  };

  // Mask Aadhaar number for display (show only last 4 digits)
  const maskAadhaar = (aadhaarNumber) => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) return 'Not provided';
    const lastFour = aadhaarNumber.slice(-4);
    return `****-****-${lastFour}`;
  };

  // Mask phone number for display (show last 4 digits)
  const maskPhoneNumber = (phone) => {
    if (!phone || phone.length < 4) return '****';
    return phone.replace(/(\d{6})(\d{4})/, '******$2');
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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (verificationCleanupRef.current) clearTimeout(verificationCleanupRef.current);
    };
  }, []);

  // Sample data for dashboard
  const stats = [
    { label: "Total Complaints", value: "24", icon: FaExclamationTriangle, color: "text-orange-500" },
    { label: "Resolved", value: "18", icon: FaCheckCircle, color: "text-green-500" },
    { label: "In Progress", value: "4", icon: FaEye, color: "text-blue-500" },
    { label: "Pending", value: "2", icon: FaExclamationTriangle, color: "text-red-500" },
  ];

  const recentComplaints = [
    { id: "CMP-2024-001", category: "Water Supply", status: "Resolved", date: "2024-01-15" },
    { id: "CMP-2024-002", category: "Road Maintenance", status: "In Progress", date: "2024-01-14" },
    { id: "CMP-2024-003", category: "Electricity", status: "Pending", date: "2024-01-13" },
    { id: "CMP-2024-004", category: "Waste Management", status: "Resolved", date: "2024-01-12" },
  ];

  return (
    <div className="w-full">
      {/* Aadhaar Verification Section */}
      {currentPage === "aadhaar-verify" && (
        <div className="mb-8">
          {isVerified ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-lg p-6 border border-green-200 dark:border-green-700">
                {/* Success Header with Icon */}
                <div className="flex items-center mb-6">
                  <FaCheckCircle className="text-green-600 dark:text-green-400 text-2xl mr-3" />
                  <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
                    Aadhaar Successfully Verified
                  </h2>
                </div>

                {/* Verification Details with Enhanced Contrast */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-green-200 dark:border-green-700">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-bold text-gray-800 dark:text-gray-200 min-w-[120px] mb-1 sm:mb-0">
                        Aadhaar:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-mono text-lg">
                        {maskAadhaar(verifiedData.aadhaar)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-bold text-gray-800 dark:text-gray-200 min-w-[120px] mb-1 sm:mb-0">
                        Phone:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-mono text-lg">
                        +91-{maskPhoneNumber(verifiedData.phone)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-bold text-gray-800 dark:text-gray-200 min-w-[120px] mb-1 sm:mb-0">
                        Verified on:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {new Date(verifiedData.timestamp).toLocaleString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expiry Note */}
                <div className="bg-green-100 dark:bg-green-900/40 rounded-lg p-3 mb-6">
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Verification expires in 10 minutes from verification time
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleVerificationCancel}
                    className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Verify Different Number
                  </button>
                  <button
                    onClick={() => setCurrentPage("dashboard")}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <AadhaarVerification
              onVerificationComplete={handleVerificationComplete}
              onCancel={handleVerificationCancel}
            />
          )}
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
                        <p className="font-semibold text-gray-600 dark:text-gray-400 truncate text-sm sm:text-base">
                          {id}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {category}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end sm:text-right gap-4">
                        <span
                          className={`badge badge-sm font-medium ${status === "Resolved"
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
