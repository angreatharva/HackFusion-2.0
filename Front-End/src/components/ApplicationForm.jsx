import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";

const ApplicationForm = ({ fetchApplications }) => {
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

  const [formData, setFormData] = useState({
    name: "",
    type: "Event",
    description: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabId = sessionStorage.getItem("tabId") || Date.now();
  sessionStorage.setItem("tabId", tabId);

  const token = localStorage.getItem(`authToken_${tabId}`) || "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await axios.post("http://localhost:8000/api/applications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchApplications();
      setFormData({ name: "", type: "Event", description: "" });
    } catch (error) {
      setError("Failed to submit application. Please try again.");
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          .form-container {
            min-height: 100vh;
            background: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .form-wrapper {
            width: 100%;
            max-width: 600px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .form-header {
            background: linear-gradient(135deg,#45A049 0%,#45A049 100%);
            padding: 2rem;
            color: white;
          }

          .form-header h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .form-header p {
            margin: 0.5rem 0 0;
            opacity: 0.9;
          }

          .form-content {
            padding: 2rem;
          }

          .error-message {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 1rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: #991b1b;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #374151;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1rem;
            transition: all 0.2s;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #45A049;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          }

          .form-group textarea {
            height: 80px;
            resize: vertical;
          }

          .helper-text {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: #6b7280;
          }

          .submit-button {
            width: 100%;
            padding: 0.875rem;
            background: #45A049;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
          }

          .submit-button:hover {
            background:rgb(47, 95, 49);
          }

          .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .spinner {
            animation: spin 1s linear infinite;
            width: 20px;
            height: 20px;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <Navbar userInfo={userInfo} />
      <div className="form-container">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>New Application</h2>
            <p>Complete the form below to submit your application</p>
          </div>

          <form onSubmit={handleSubmit} className="form-content">
            {error && (
              <div className="error-message">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Application Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Event">Event</option>
                <option value="Budget">Budget</option>
                <option value="Sponsorship">Sponsorship</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Please provide a detailed description..."
                value={formData.description}
                onChange={handleChange}
                required
              />
              <p className="helper-text">
                Please be as detailed as possible in your description
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="32"
                      strokeDashoffset="32"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ApplicationForm;
