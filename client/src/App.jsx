import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContainer from './components/Auth/AuthContainer';
import Dashboard from './components/Dashboard';
import { authStyles } from './styles/authStyles';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div style={authStyles.authPageContainer}>
              <header style={authStyles.header}>
                <h1 style={authStyles.headerTitle}>CivicSecure</h1>
                <p style={authStyles.headerSubtitle}>Secure Digital Identity Platform</p>
              </header>

              <main style={authStyles.mainContent}>
                <AuthContainer />
              </main>

              <footer style={authStyles.footer}>
                <p><strong>🚧 Prototype Mode:</strong> This is a demonstration version with mock authentication</p>
              </footer>
            </div>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
