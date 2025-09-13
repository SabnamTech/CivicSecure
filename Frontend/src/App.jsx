import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContainer from './components/Auth/AuthContainer';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen flex flex-col bg-gray-50">
              <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 lg:px-8 py-6 text-center shadow-lg">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">CivicSecure</h1>
                <p className="text-base sm:text-lg lg:text-xl opacity-90">Secure Digital Identity Platform</p>
              </header>

              <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <AuthContainer />
              </main>

              <footer className="bg-white border-t border-gray-200 text-center py-4 px-4 text-gray-600 text-sm">
                <p><strong className="text-yellow-600">🚧 Prototype Mode:</strong> This is a demonstration version with mock authentication</p>
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
