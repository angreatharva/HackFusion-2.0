import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const storedToken = localStorage.getItem(`authToken_${tabId}`);
    const storedRole = localStorage.getItem(`role_${tabId}`);

    if (!storedToken) {
      navigate("/");
    } else {
      setToken(storedToken);
      setRole(storedRole);
      fetchApplications(storedToken);
    }

    const interval = setInterval(() => {
      fetchApplications(storedToken);
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchApplications = async (authToken) => {
    try {
      const response = await axios.get("http://localhost:8000/api/applications", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8000/api/applications/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications(token);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <style>
        {`
          .custom-container {
            max-width: 1100px;
            margin: auto;
          }
          .custom-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            text-align: center;
          }
          @media (min-width: 640px) {
            .custom-header {
              flex-direction: row;
              text-align: left;
            }
          }
          .custom-button {
            background: #3b82f6;
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: bold;
            transition: 0.3s;
            border: none;
          }
          .custom-button:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
          }
          .custom-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            border: 1px solid #e5e7eb;
            transition: 0.3s;
          }
          .custom-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }
          .custom-status {
            padding: 4px 12px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
          }
          .status-pending {
            background: #facc15;
            color: #1e293b;
          }
          .status-approved {
            background: #22c55e;
            color: white;
          }
          .status-rejected {
            background: #ef4444;
            color: white;
          }
          .custom-image-container {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
          }
          .custom-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .custom-actions button {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            transition: 0.3s;
            cursor: pointer;
          }
          .approve-button {
            background: #22c55e;
            color: white;
          }
          .approve-button:hover {
            background: #16a34a;
          }
          .reject-button {
            background: #ef4444;
            color: white;
          }
          .reject-button:hover {
            background: #dc2626;
          }
        `}
      </style>

      <div className="custom-container">
        {/* Header Section */}
        <div className="custom-header mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">📋 Application List</h2>
          <button onClick={() => navigate("/ApplicationForm")} className="custom-button">
            ➕ Submit a Form
          </button>
        </div>

        {/* Grid Layout - 2 Cards Per Row on Desktop, 1 on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="custom-card">
                {/* Top Section */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">🆔 {app._id.slice(-6)}</h3>
                  <span
                    className={`custom-status ${
                      app.status === "Approved"
                        ? "status-approved"
                        : app.status === "Rejected"
                        ? "status-rejected"
                        : "status-pending"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Application Details */}
                <div className="text-gray-700 space-y-2">
                  <p className="text-sm font-medium">👤 {app.studentName}</p>
                  <p className="text-sm">📌 Type: <span className="font-semibold">{app.type}</span></p>
                  <p className="text-sm font-semibold text-green-600">💰 Budget: {app.requestedBudget}</p>
                  <p className="text-sm">🔥 Priority: {app.priority}</p>
                </div>

                {/* Supporting Document Image */}
                <div className="mt-4 flex justify-center">
                  {app.supportingDoc ? (
                    <div className="custom-image-container">
                      <img src={app.supportingDoc} alt="Supporting Doc" />
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">🚫 No Image</p>
                  )}
                </div>

                {/* Action Buttons */}
                {role === "admin" && app.status === "Pending" && (
                  <div className="mt-4 flex space-x-2 justify-center custom-actions">
                    <button onClick={() => handleAction(app._id, "Approved")} className="approve-button">
                      ✅ Approve
                    </button>
                    <button onClick={() => handleAction(app._id, "Rejected")} className="reject-button">
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-500 text-lg">🚫 No applications found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationList;
