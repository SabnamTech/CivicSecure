import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ComplaintForm from "./components/ComplaintForm";
import InfoHub from "./components/InfoHub";  // <-- import your InfoHub component
import { FaBars } from "react-icons/fa";

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // App state
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // Check authentication on app load
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    checkAuthenticationStatus();
  }, [theme]);

  const checkAuthenticationStatus = async () => {
    setAuthLoading(true);
    const token = localStorage.getItem('authToken');
    const userPhone = localStorage.getItem('userPhone');

    if (!token || !userPhone) {
      setAuthLoading(false);
      return;
    }

    try {
      // Validate token with your backend
      const response = await fetch('/api/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token invalid, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userPhone');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      // Clear storage on error
      localStorage.removeItem('authToken');
      localStorage.removeItem('userPhone');
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage("dashboard"); // Redirect to dashboard after login
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPhone');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage("dashboard");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            toggleTheme={toggleTheme}
            theme={theme}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        );
      case "file-complaint":
        return <ComplaintForm />;
      case "info-hub":
        return <InfoHub />;      // <-- Render InfoHub here
      case "aadhaar-verify":
        return (
          <Dashboard
            toggleTheme={toggleTheme}
            theme={theme}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        );
      case "track-status":
      case "community":
      default:
        return (
          <div className="p-10 text-center text-gray-600 dark:text-gray-300 text-lg font-semibold">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p>This page is under construction and will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-green-500"></span>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading CiciSecure...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content container */}
      <div className="lg:ml-64">
        {/* Mobile navbar */}
        <div className="navbar bg-white dark:bg-gray-900 shadow-sm px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-square btn-ghost"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-xl" />
          </button>
          <h1 className="text-xl font-bold text-green-800 dark:text-green-400 ml-3">
            CivicSecure
          </h1>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;