import React from "react";
import {
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaInfoCircle,
  FaComments,
  FaIdCard
} from "react-icons/fa";

const Sidebar = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, user, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FaHome },
    { id: "file-complaint", label: "File Complaint", icon: FaFileAlt },
    { id: "track-status", label: "Track Status", icon: FaSearch },
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "aadhaar-verify", label: "Verify Aadhaar", icon: FaIdCard },
    { id: "info-hub", label: "Info Hub", icon: FaInfoCircle },
    { id: "community", label: "Community", icon: FaUsers },
  ];

  const handleMenuClick = (pageId) => {
    setCurrentPage(pageId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      aria-label="Sidebar"
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-1">CivicSecure</h1>
        <p className="text-green-600 dark:text-green-300 text-sm">Citizen Grievance Hub</p>
      </div>

      {/* Menu Section - Justified spacing */}
      <div className="flex-1 flex flex-col justify-between px-4 pt-8 pb-4">
        <ul className="menu space-y-4 flex-1 flex flex-col justify-evenly">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => {
                  setCurrentPage(id);
                  if (sidebarOpen) setSidebarOpen(false);
                }}
                className={`flex items-center w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105
                  ${currentPage === id
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
                  }
                `}
                aria-current={currentPage === id ? "page" : undefined}
              >
                <Icon
                  className={`text-xl mr-4 ${currentPage === id ? "text-white" : "text-green-600 dark:text-green-400"
                    }`}
                />
                <span className="text-base">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Section */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p className="font-medium">CivicSecure v1.0</p>
          <p className="text-[10px] leading-tight">Secure • Reliable • Trusted</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
