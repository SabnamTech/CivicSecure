import React from 'react';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    if (!token) {
        window.location.href = '/';
        return null;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
            <header style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '20px', 
                textAlign: 'center',
                marginBottom: '30px',
                borderRadius: '8px'
            }}>
                <h1>CivicSecure Dashboard</h1>
                <p>Welcome to your secure portal</p>
            </header>

            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3>User Profile</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Phone:</strong> {user.phoneNumber}</p>
                <p><strong>Aadhaar:</strong> {user.aadhaarNumber}</p>
                <p><strong>Verified:</strong> {user.isVerified ? '✅ Yes' : '❌ No'}</p>
            </div>

            <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7',
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h4>🚧 Prototype Mode</h4>
                <p>This is a demonstration version. In production, this dashboard would include:</p>
                <ul>
                    <li>Government service access</li>
                    <li>Document management</li>
                    <li>Secure messaging</li>
                    <li>Transaction history</li>
                    <li>Profile settings</li>
                </ul>
            </div>

            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={handleLogout}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;