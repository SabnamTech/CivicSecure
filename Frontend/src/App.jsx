import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ComplaintForm from "./components/ComplaintForm";
import InfoHub from "./components/InfoHub";  // <-- import your InfoHub component
import { FaBars } from "react-icons/fa";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
            Page under construction
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
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
