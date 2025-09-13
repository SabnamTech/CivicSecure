import React from "react";
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaEye, FaPlus, FaMoon, FaSun } from "react-icons/fa";

function Dashboard({ toggleTheme, theme, setCurrentPage }) {
  const stats = [
    { label: "Total Complaints", value: "24", icon: FaExclamationTriangle, color: "text-green-600" },
    { label: "Resolved", value: "18", icon: FaCheckCircle, color: "text-green-700" },
    { label: "Pending", value: "6", icon: FaClock, color: "text-yellow-500" },
    { label: "In Review", value: "3", icon: FaEye, color: "text-blue-600" }
  ];

  const recentComplaints = [
    { id: "CMP001", category: "Safety", status: "Pending", date: "2025-09-12" },
    { id: "CMP002", category: "Civic", status: "Resolved", date: "2025-09-11" },
    { id: "CMP003", category: "Disaster", status: "In Review", date: "2025-09-10" }
  ];

  return (
    <div className="space-y-10 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-400 mb-1">Dashboard</h1>
          <p className="text-green-700 dark:text-green-400 text-lg">Welcome back! Here's your complaint overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="btn btn-success btn-lg flex items-center gap-2"
            onClick={() => setCurrentPage("file-complaint")}
          >
            <FaPlus />
            New Complaint
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="btn btn-outline btn-success p-3"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <div
            key={i}
            className="card bg-base-100 shadow-sm"
          >
            <div className="card-body p-6 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-extrabold">{value}</h3>
                <p className="font-semibold">{label}</p>
              </div>
              <Icon className={`${color} text-5xl`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-5 font-semibold">Recent Complaints</h2>
          <ul className="divide-y divide-gray-200">
            {recentComplaints.map(({ id, category, status, date }) => (
              <li key={id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{id}</p>
                  <p className="text-sm">{category}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`badge ${
                      status === "Resolved"
                        ? "badge-success"
                        : status === "Pending"
                        ? "badge-warning"
                        : "badge-info"
                    }`}
                  >
                    {status}
                  </span>
                  <p className="text-xs mt-1">{date}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="card-actions justify-end mt-6">
            <button className="btn btn-outline btn-success">View All</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
