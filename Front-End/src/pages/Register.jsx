import React, { useState } from "react";
import request from "../api/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
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

  // 🔄 Handle input change
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

  // 🚀 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🌟 Prepare payload based on role
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "student") {
      payload.studentDetails = formData.studentDetails;
    } else if (formData.role === "doctor") {
      payload.doctorDetails = formData.doctorDetails;
    } else if (formData.role === "coordinator") {
      payload.coordinatorDetails = formData.coordinatorDetails;
    }

    try {
      console.log("Submitting Data:", payload);

      const response = await request("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("User registered successfully!");
      console.log("Response:", response);
    } catch (error) {
      alert("Failed to register user.");
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register User</h2>

      <form onSubmit={handleSubmit} className="register-form">
        {/* 🟢 Basic User Info */}
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="doctor">Doctor</option>
            <option value="coordinator">Coordinator</option>
          </select>
        </div>

        {/* 🟡 Role-Specific Fields */}
        {formData.role === "student" && (
          <div className="role-section">
            <h3>Student Details</h3>
            {[
              "rollNumber",
              "class",
              "section",
              "parentEmail",
              "parentPhone",
            ].map((field) => (
              <input
                key={field}
                type={field.includes("Email") ? "email" : "text"}
                name={`studentDetails.${field}`}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={formData.studentDetails[field]}
                onChange={handleChange}
                required
              />
            ))}
          </div>
        )}

        {formData.role === "doctor" && (
          <div className="role-section">
            <h3>Doctor Details</h3>
            {["specialization", "licenseNumber", "department"].map((field) => (
              <input
                key={field}
                type="text"
                name={`doctorDetails.${field}`}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={formData.doctorDetails[field]}
                onChange={handleChange}
                required
              />
            ))}
          </div>
        )}

        {formData.role === "coordinator" && (
          <div className="role-section">
            <h3>Coordinator Details</h3>
            {["department", "assignedClasses"].map((field) => (
              <input
                key={field}
                type="text"
                name={`coordinatorDetails.${field}`}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={formData.coordinatorDetails[field]}
                onChange={handleChange}
                required
              />
            ))}
          </div>
        )}

        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>

      {/* 🎨 Styling */}
      <style jsx>{`
        .register-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f8f8;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          color: #333;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: #555;
          font-weight: bold;
        }

        input,
        select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1em;
          outline: none;
        }

        .role-section {
          margin-top: 20px;
          padding: 10px;
          background-color: #e9f7f7;
          border-left: 5px solid #007bff;
          border-radius: 5px;
        }

        .submit-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 1em;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Register;
