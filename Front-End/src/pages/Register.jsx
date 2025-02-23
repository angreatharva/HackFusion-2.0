import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import request from "../api/api";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    gender: "",
    studentDetails: {
      rollNumber: "",
      class: "",
      section: "",
      parentEmail: "",
      parentPhone: "",
    },
    doctorDetails: { specialization: "", licenseNumber: "", department: "" },
    coordinatorDetails: { department: "", assignedClasses: "" },
  });

  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  // 🟢 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length > 1) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🚀 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      gender: formData.gender,
    };

    switch (formData.role) {
      case "student":
        payload.studentDetails = formData.studentDetails;
        break;
      case "doctor":
        payload.doctorDetails = formData.doctorDetails;
        break;
      case "coordinator":
        payload.coordinatorDetails = formData.coordinatorDetails;
        break;
      default:
        break;
    }

    try {
      const response = await request("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("🎉 User registered successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "student",
          gender: "",
          studentDetails: {
            rollNumber: "",
            class: "",
            section: "",
            parentEmail: "",
            parentPhone: "",
          },
          doctorDetails: {
            specialization: "",
            licenseNumber: "",
            department: "",
          },
          coordinatorDetails: { department: "", assignedClasses: "" },
        });
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to register user: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("⚠️ An error occurred. Please try again.");
    }
  };

  // 🔒 Check Authentication
  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    if (!token) {
      navigate("/");
    } else {
      setUserInfo({ name, role });
    }
  }, [navigate]);

  const renderRoleFields = () => {
    switch (formData.role) {
      case "student":
        return (
          <div>
            <h5>🎓 Student Details</h5>
            {[
              "rollNumber",
              "class",
              "section",
              "parentEmail",
              "parentPhone",
            ].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  {field.replace(/([A-Z])/g, " $1").trim()}:
                </label>
                <input
                  type={field.includes("Email") ? "email" : "text"}
                  className="form-control"
                  name={`studentDetails.${field}`}
                  value={formData.studentDetails[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
        );
      case "doctor":
        return (
          <div>
            <h5>🏥 Doctor Details</h5>
            {["specialization", "licenseNumber", "department"].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  {field.replace(/([A-Z])/g, " $1").trim()}:
                </label>
                <input
                  type="text"
                  className="form-control"
                  name={`doctorDetails.${field}`}
                  value={formData.doctorDetails[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
        );
      case "coordinator":
        return (
          <div>
            <h5>📅 Coordinator Details</h5>
            {["department", "assignedClasses"].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  {field.replace(/([A-Z])/g, " $1").trim()}:
                </label>
                <input
                  type="text"
                  className="form-control"
                  name={`coordinatorDetails.${field}`}
                  value={formData.coordinatorDetails[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Sidebar userInfo={userInfo} />
      <div className="container mt-5">
        <div className="card shadow-sm mx-auto" style={{ maxWidth: "650px" }}>
          <div className="card-body">
            <h2 className="text-center mb-4">📝 Register User</h2>

            <form onSubmit={handleSubmit}>
              {["name", "email", "password"].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label">
                    {field.charAt(0).toUpperCase() + field.slice(1)} 🟢:
                  </label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    className="form-control"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <div className="mb-3">
                <label className="form-label">Role 🧑‍💼:</label>
                <select
                  className="form-select"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="student">🎓 Student</option>
                  <option value="doctor">🏥 Doctor</option>
                  <option value="coordinator">📅 Coordinator</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Gender ⚧:</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">👨 Male</option>
                  <option value="female">👩 Female</option>
                  <option value="other">🌈 Other</option>
                </select>
              </div>

              {renderRoleFields()}

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary">
                  🚀 Register Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
