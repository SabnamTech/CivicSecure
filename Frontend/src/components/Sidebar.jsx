import React from "react";
import { 
  FaHome, 
  FaFileAlt, 
  FaChartBar, 
  FaInfoCircle, 
  FaComments, 
  FaIdCard 
} from "react-icons/fa";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: FaHome },
  { id: "file-complaint", label: "File Complaint", icon: FaFileAlt },
  { id: "track-status", label: "Track Status", icon: FaChartBar },
  { id: "info-hub", label: "Info Hub", icon: FaInfoCircle },
  { id: "community", label: "Community", icon: FaComments },
  { id: "aadhaar-verify", label: "Aadhaar Verify", icon: FaIdCard }
];

export default function Sidebar({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-1">CivicSecure</h1>
        <p className="text-green-600 dark:text-green-300 text-sm">Citizen Grievance Hub</p>
      </div>

      <ul className="menu p-4 space-y-2">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              onClick={() => {
                setCurrentPage(id);
                if (sidebarOpen) setSidebarOpen(false);
              }}
              className={`flex items-center w-full p-3 rounded-lg font-medium transition-all duration-200
                ${currentPage === id
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
                }
              `}
              aria-current={currentPage === id ? "page" : undefined}
            >
              <Icon
                className={`text-xl mr-3 ${
                  currentPage === id ? "text-white" : "text-green-600 dark:text-green-400"
                }`}
              />
              <span className="text-base">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
