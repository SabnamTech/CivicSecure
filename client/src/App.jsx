import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContainer from './components/Auth/AuthContainer';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <header style={{ backgroundColor: '#007bff', color: 'white', padding: '20px', textAlign: 'center' }}>
                <h1>CivicSecure - Prototype</h1>
                <p>Authentication System Demo</p>
              </header>

              <main>
                <AuthContainer />
              </main>

              <footer style={{ textAlign: 'center', padding: '20px', marginTop: '50px', borderTop: '1px solid #eee' }}>
                <p><strong>Prototype Mode:</strong> This is a demonstration version with mock authentication</p>
              </footer>
            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
