import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        setIsLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-gray-600 animate-pulse">Loading your dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                {/* Responsive Header Banner */}
                <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 text-center rounded-2xl shadow-xl mb-8 lg:mb-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight drop-shadow-sm">CivicSecure Dashboard</h1>
                        <p className="text-lg sm:text-xl lg:text-2xl opacity-90">Welcome to your secure portal</p>
                    </div>
                </header>

                {/* Dashboard Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-10 lg:mb-12">
                    {/* User Profile Card */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 border-b-2 border-gray-100 pb-4">User Profile</h3>
                        <div className="space-y-5 sm:space-y-6">
                            <div className="flex flex-col space-y-1">
                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Full Name</span>
                                <span className="text-lg sm:text-xl font-medium text-gray-800">{user.name || 'Not provided'}</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone Number</span>
                                <span className="text-lg sm:text-xl font-medium text-gray-800">{user.phoneNumber || 'Not provided'}</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Aadhaar Number</span>
                                <span className="text-lg sm:text-xl font-medium text-gray-800">
                                    {user.aadhaarNumber ? `****-****-${user.aadhaarNumber.slice(-4)}` : 'Not provided'}
                                </span>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Verification Status</span>
                                <div className="flex items-center space-x-2">
                                    {user.isVerified ? (
                                        <>
                                            <span className="text-2xl">✅</span>
                                            <span className="text-lg sm:text-xl font-semibold text-green-600">Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-2xl">⏳</span>
                                            <span className="text-lg sm:text-xl font-semibold text-yellow-600">Pending</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prototype Mode Box */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 to-transparent"></div>
                        <div className="relative z-10">
                            <h4 className="text-2xl sm:text-3xl font-bold text-yellow-800 mb-4 sm:mb-6 flex items-center space-x-3">
                                <span className="text-3xl">🚧</span>
                                <span>Prototype Mode</span>
                            </h4>
                            <p className="text-base sm:text-lg text-yellow-800 mb-5 sm:mb-6 leading-relaxed">
                                This is a demonstration version. In production, this dashboard would include:
                            </p>
                            <ul className="space-y-3 text-yellow-800">
                                <li className="flex items-start space-x-3">
                                    <span className="text-yellow-600 mt-1">•</span>
                                    <span className="text-sm sm:text-base">Government service access</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-yellow-600 mt-1">•</span>
                                    <span className="text-sm sm:text-base">Document management</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-yellow-600 mt-1">•</span>
                                    <span className="text-sm sm:text-base">Secure messaging</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-yellow-600 mt-1">•</span>
                                    <span className="text-sm sm:text-base">Transaction history</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-yellow-600 mt-1">•</span>
                                    <span className="text-sm sm:text-base">Profile settings</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="flex justify-center lg:justify-end">
                    <button
                        onClick={handleLogout}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 active:translate-y-0 text-base sm:text-lg w-full sm:w-auto max-w-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;