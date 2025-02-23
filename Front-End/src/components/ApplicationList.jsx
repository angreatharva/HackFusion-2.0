import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";

const ApplicationList = () => {
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Get the unique tab identifier
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    // If token does not exist, navigate to login page
    if (!token) {
      navigate("/");
    } else {
      // Set the user info (name, role) into the state
      setUserInfo({ name, role });
    }
  }, [navigate]);
  const [applications, setApplications] = useState([]);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [chartData, setChartData] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  });

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
      window.location.reload(); // Refreshes the page every 1 second
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchApplications = async (authToken) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/applications",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setApplications(response.data);
      updateChartData(response.data);
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

  const updateChartData = (data) => {
    const counts = { approved: 0, pending: 0, rejected: 0 };
    data.forEach((app) => {
      counts[app.status.toLowerCase()] += 1;
    });
    setChartData(counts);
    renderChart(counts);
  };

  const renderChart = (counts) => {
    const ctx = document.getElementById("statusChart");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Approved", "Pending", "Rejected"],
          datasets: [
            {
              label: "Application Status",
              data: [counts.approved, counts.pending, counts.rejected],
              backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
              borderRadius: 5,
            },
          ],
        },
        options: {
          animation: { duration: 1000 },
          responsive: true,
          plugins: { legend: { display: false } },
        },
      });
    }
  };

  return (
    <div className="container py-5">
      <Sidebar userInfo={userInfo} />

      <h2 className="text-center mb-4 display-6 fw-bold text-primary">
        📋 Application List
      </h2>

      {/* Chart Section */}
      <div className="row mb-5 justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-lg rounded-4 bg-light">
            <canvas id="statusChart"></canvas>
          </div>
        </div>
      </div>

      {/* Add Form Button */}
      <div className="d-flex justify-content-end mb-4">
        <button
          onClick={() => navigate("/ApplicationForm")}
          className="btn btn-primary btn-lg shadow"
        >
          ➕ Submit a Form
        </button>
      </div>

      {/* Table Section */}
      <div className="table-responsive">
        <table className="table table-hover text-center align-middle shadow-lg rounded-4">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Type</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Priority</th>
              {role === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white">
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app._id} className="fade-in">
                  <td className="fw-bold text-secondary">
                    🆔 {app._id.slice(-6)}
                  </td>
                  <td className="text-dark">👤 {app.studentName}</td>
                  <td className="text-primary fw-bold">📌 {app.type}</td>
                  <td className="text-success fw-bold">
                    💰 {app.requestedBudget}
                  </td>
                  <td>
                    <span
                      className={`badge px-3 py-2 ${
                        app.status === "Approved"
                          ? "bg-success"
                          : app.status === "Rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div
                      className="progress"
                      style={{ height: "22px", borderRadius: "10px" }}
                    >
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: `${app.priority * 20}%` }}
                        aria-valuenow={app.priority}
                        aria-valuemin="0"
                        aria-valuemax="5"
                      >
                        {app.priority}
                      </div>
                    </div>
                  </td>
                  {role === "admin" && app.status === "Pending" && (
                    <td>
                      <button
                        onClick={() => handleAction(app._id, "Approved")}
                        className="btn btn-success btn-sm me-2 px-3 py-2 shadow-sm"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleAction(app._id, "Rejected")}
                        className="btn btn-danger btn-sm px-3 py-2 shadow-sm"
                      >
                        ❌ Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-muted py-3">
                  🚫 No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationList;
