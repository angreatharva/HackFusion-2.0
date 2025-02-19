import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  const tabId = sessionStorage.getItem("tabId") || Date.now();
  sessionStorage.setItem("tabId", tabId);
  const token = localStorage.getItem(`authToken_${tabId}`);

  useEffect(() => {
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    if (!token) {
      navigate("/");
    } else {
      setUserInfo({ name, role });
    }
  }, [navigate, token, tabId]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
    const intervalId = setInterval(fetchApplications, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8000/api/applications/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchApplications();
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  return (
    <div className="app-container">
      <style>
        {`
          .app-container {
            min-height: 100vh;
            background: #f5f5f5;
          }

          .app-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .app-title {
            color: #333;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            position: relative;
            display: inline-block;
          }

          .app-title:after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: #4CAF50;
            border-radius: 2px;
          }

          .app-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }

          .app-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border: 1px solid #e0e0e0;
          }

          .app-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          }

          .app-card-header {
            margin-bottom: 1rem;
          }

          .app-card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
          }

          .app-type {
            color: #4CAF50;
            font-weight: 500;
          }

          .app-description {
            color: #666;
            margin-bottom: 1rem;
            line-height: 1.5;
          }

          .status-badge {
            display: inline-block;
            padding: 0.4rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .status-pending {
            background: #FFF3E0;
            color: #F57C00;
          }

          .status-approved {
            background: #E8F5E9;
            color: #4CAF50;
          }

          .status-rejected {
            background: #FFEBEE;
            color: #D32F2F;
          }

          .action-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
          }

          .btn {
            flex: 1;
            padding: 0.6rem 1rem;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
          }

          .btn-approve {
            background: #4CAF50;
            color: white;
          }

          .btn-approve:hover {
            background: #43A047;
            transform: translateY(-2px);
          }

          .btn-reject {
            background: #FF5252;
            color: white;
          }

          .btn-reject:hover {
            background: #D32F2F;
            transform: translateY(-2px);
          }

          .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 2rem;
            color: #666;
            font-size: 1.1rem;
          }

          @media (max-width: 768px) {
            .app-grid {
              grid-template-columns: 1fr;
            }

            .app-title {
              font-size: 2rem;
            }
          }
        `}
      </style>
      <Navbar userInfo={userInfo} />
      <header className="app-header">
        <h2 className="app-title">Application List</h2>
      </header>
      <div className="app-grid">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id} className="app-card">
              <div className="app-card-header">
                <h3 className="app-card-title">
                  {app.name} - <span className="app-type">{app.type}</span>
                </h3>
              </div>
              <p className="app-description">{app.description}</p>
              <div>
                Status:{" "}
                <span
                  className={`status-badge ${
                    app.status === "Pending"
                      ? "status-pending"
                      : app.status === "Approved"
                      ? "status-approved"
                      : "status-rejected"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {userInfo.role === "admin" && app.status === "Pending" && (
                <div className="action-buttons">
                  <button
                    onClick={() => handleApproval(app._id, "Approved")}
                    className="btn btn-approve"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(app._id, "Rejected")}
                    className="btn btn-reject"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">No applications found.</div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
