import React, { useState, useEffect } from 'react';
import { dashboardStyles } from '../styles/dashboardStyles';

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [profileCardHover, setProfileCardHover] = useState(false);
    const [logoutButtonHover, setLogoutButtonHover] = useState(false);
    const [logoutButtonActive, setLogoutButtonActive] = useState(false);

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
            <div style={dashboardStyles.dashboardContainer}>
                <div style={{...dashboardStyles.contentWrapper, textAlign: 'center', paddingTop: '100px'}}>
                    <div style={{fontSize: '1.25rem', color: '#6c757d'}}>Loading your dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={dashboardStyles.dashboardContainer} className="dashboard-container">
            <div style={dashboardStyles.contentWrapper}>
                {/* Responsive Header Banner */}
                <header style={dashboardStyles.header} className="dashboard-header">
                    <h1 style={dashboardStyles.headerTitle}>CivicSecure Dashboard</h1>
                    <p style={dashboardStyles.headerSubtitle}>Welcome to your secure portal</p>
                </header>

                {/* Dashboard Grid Layout */}
                <div style={dashboardStyles.dashboardGrid} className="dashboard-grid">
                    {/* User Profile Card */}
                    <div 
                        style={{
                            ...dashboardStyles.profileCard,
                            ...(profileCardHover ? dashboardStyles.profileCardHover : {})
                        }}
                        className="dashboard-card profile-card"
                        onMouseEnter={() => setProfileCardHover(true)}
                        onMouseLeave={() => setProfileCardHover(false)}
                    >
                        <h3 style={dashboardStyles.profileTitle}>User Profile</h3>
                        <div style={dashboardStyles.profileInfo} className="profile-info">
                            <div style={dashboardStyles.profileItem}>
                                <span style={dashboardStyles.profileLabel}>Full Name</span>
                                <span style={dashboardStyles.profileValue}>{user.name || 'Not provided'}</span>
                            </div>
                            <div style={dashboardStyles.profileItem}>
                                <span style={dashboardStyles.profileLabel}>Phone Number</span>
                                <span style={dashboardStyles.profileValue}>{user.phoneNumber || 'Not provided'}</span>
                            </div>
                            <div style={dashboardStyles.profileItem}>
                                <span style={dashboardStyles.profileLabel}>Aadhaar Number</span>
                                <span style={dashboardStyles.profileValue}>
                                    {user.aadhaarNumber ? `****-****-${user.aadhaarNumber.slice(-4)}` : 'Not provided'}
                                </span>
                            </div>
                            <div style={dashboardStyles.profileItem}>
                                <span style={dashboardStyles.profileLabel}>Verification Status</span>
                                <span style={{...dashboardStyles.profileValue, ...dashboardStyles.verificationBadge}} className="verification-badge">
                                    {user.isVerified ? (
                                        <>✅ <span style={{color: '#28a745'}}>Verified</span></>
                                    ) : (
                                        <>⏳ <span style={{color: '#ffc107'}}>Pending</span></>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Prototype Mode Box */}
                    <div style={dashboardStyles.prototypeBox} className="dashboard-card prototype-box">
                        <h4 style={dashboardStyles.prototypeTitle}>
                            🚧 Prototype Mode
                        </h4>
                        <p style={dashboardStyles.prototypeDescription}>
                            This is a demonstration version. In production, this dashboard would include:
                        </p>
                        <ul style={dashboardStyles.prototypeList}>
                            <li style={dashboardStyles.prototypeListItem}>Government service access</li>
                            <li style={dashboardStyles.prototypeListItem}>Document management</li>
                            <li style={dashboardStyles.prototypeListItem}>Secure messaging</li>
                            <li style={dashboardStyles.prototypeListItem}>Transaction history</li>
                            <li style={dashboardStyles.prototypeListItem}>Profile settings</li>
                        </ul>
                    </div>
                </div>

                {/* Logout Section */}
                <div style={dashboardStyles.logoutSection} className="logout-section">
                    <button
                        onClick={handleLogout}
                        onMouseEnter={() => setLogoutButtonHover(true)}
                        onMouseLeave={() => setLogoutButtonHover(false)}
                        onMouseDown={() => setLogoutButtonActive(true)}
                        onMouseUp={() => setLogoutButtonActive(false)}
                        style={{
                            ...dashboardStyles.logoutButton,
                            ...(logoutButtonHover ? dashboardStyles.logoutButtonHover : {}),
                            ...(logoutButtonActive ? dashboardStyles.logoutButtonActive : {}),
                        }}
                        className="logout-button"
                        onFocus={(e) => {
                            e.target.style.boxShadow = dashboardStyles.focusStyles.boxShadow;
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = dashboardStyles.logoutButton.boxShadow;
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;