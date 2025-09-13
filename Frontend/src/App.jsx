import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ComplaintForm from "./components/ComplaintForm";
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
        return <Dashboard toggleTheme={toggleTheme} theme={theme} setCurrentPage={setCurrentPage} />;
      case "file-complaint":
        return <ComplaintForm />;
      case "track-status":
      case "info-hub":
      case "community":
      case "aadhaar-verify":
      default:
        return (
          <div className="p-10 text-center text-gray-600 dark:text-gray-300 text-lg font-semibold">
            Page under construction
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-base-100 text-base-content">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile navbar */}
        <div className="navbar bg-white dark:bg-gray-900 shadow-sm px-4 sm:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-square btn-ghost"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-xl" />
          </button>
          <h1 className="text-xl font-bold text-green-800 dark:text-green-400 ml-3">CivicSecure</h1>
        </div>

        {/* Page content */}
        <main className="flex-grow p-8 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
