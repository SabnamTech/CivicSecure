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
      className={`sidebar fixed top-0 left-0 z-40 w-72 h-screen transition-transform ease-in-out duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="p-8 border-b border-sidebar-border">
        <h1 className="text-4xl font-bold text-text-primary mb-2">CivicSecure</h1>
        <p className="text-text-primary text-base">Citizen Grievance Hub</p>
      </div>

      <ul className="menu p-6 space-y-3 text-lg">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              onClick={() => {
                setCurrentPage(id);
                if (sidebarOpen) setSidebarOpen(false);
              }}
              className={`flex items-center w-full p-4 rounded-lg font-semibold transition
                ${currentPage === id
                  ? "bg-black text-white shadow-lg"
                  : "text-green-800 hover:bg-black hover:text-white"
                }
              `}
              aria-current={currentPage === id ? "page" : undefined}
            >
              <Icon
                className={`text-2xl mr-4 ${
                  currentPage === id ? "text-white" : "text-green-800 group-hover:text-white"
                }`}
              />
              <span className="text-lg">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
