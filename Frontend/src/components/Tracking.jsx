import React, { useState } from "react";

const statusSteps = [
  { label: "Pending", color: "bg-yellow-500" },
  { label: "In Review", color: "bg-blue-500" },
  { label: "Resolved", color: "bg-green-500" },
];

const TrackStatus = () => {
  const [complaintId, setComplaintId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Dummy status data (later you can fetch from backend API)
  const mockStatus = {
    "12345": {
      id: "12345",
      title: "Pothole near Market Road",
      status: "In Review",
      lastUpdate: "2025-09-12",
      department: "Municipal Corporation",
      history: [
        { step: "Pending", date: "2025-09-10", remark: "Complaint filed" },
        { step: "In Review", date: "2025-09-12", remark: "Assigned to officer" },
      ],
    },
    "67890": {
      id: "67890",
      title: "Street Light not working",
      status: "Resolved",
      lastUpdate: "2025-09-10",
      department: "Electricity Board",
      history: [
        { step: "Pending", date: "2025-09-08", remark: "Complaint filed" },
        { step: "In Review", date: "2025-09-09", remark: "Inspection scheduled" },
        { step: "Resolved", date: "2025-09-10", remark: "Issue fixed" },
      ],
    },
    "54321": {
      id: "54321",
      title: "Garbage collection delay",
      status: "Pending",
      lastUpdate: "2025-09-14",
      department: "Sanitation",
      history: [
        { step: "Pending", date: "2025-09-14", remark: "Complaint filed" },
      ],
    },
  };

  const handleTrack = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus(mockStatus[complaintId] || "not-found");
      setLoading(false);
    }, 1500);
  };

  // Find the current step index
  const currentStepIndex = status
    ? statusSteps.findIndex((step) => step.label === status.status)
    : -1;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
        Track Complaint Status
      </h2>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter Complaint ID"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
        />
        <button
          onClick={handleTrack}
          disabled={loading || !complaintId}
          className="btn btn-primary flex items-center"
        >
          {loading ? <span className="animate-pulse">⏳</span> : "Track"}
        </button>
      </div>

      {status && status !== "not-found" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Complaint ID: {status.id}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Issue:</span> {status.title}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`${
                status.status === "Resolved"
                  ? "text-green-600"
                  : status.status === "In Review"
                  ? "text-blue-600"
                  : "text-yellow-600"
              }`}
            >
              {status.status}
            </span>
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Department:</span>{" "}
            {status.department}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Last Updated:</span>{" "}
            {status.lastUpdate}
          </p>

          {/* Status Timeline */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, idx) => (
                <div key={step.label} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                      ${idx <= currentStepIndex ? step.color : "bg-gray-300"}
                    `}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      idx <= currentStepIndex ? "text-gray-900 dark:text-white" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  {idx < statusSteps.length - 1 && (
                    <div className="w-full h-1 bg-gray-300 mt-1 mb-1">
                      <div
                        className={`h-1 ${idx < currentStepIndex ? step.color : ""}`}
                        style={{
                          width: idx < currentStepIndex ? "100%" : "0%",
                          transition: "width 0.3s",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          {status.history && (
            <div className="mt-8">
              <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Status History</h4>
              <ol className="border-l-2 border-green-400 pl-4">
                {status.history.map((event, idx) => (
                  <li key={idx} className="mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          event.step === status.status
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      <span className="font-bold">{event.step}</span>
                      <span className="text-xs text-gray-500 ml-2">{event.date}</span>
                    </div>
                    <div className="ml-5 text-sm text-gray-600 dark:text-gray-300">{event.remark}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {status === "not-found" && (
        <p className="text-red-500 font-medium">
          ❌ No complaint found with ID {complaintId}
        </p>
      )}
    </div>
  );
};

export default TrackStatus;