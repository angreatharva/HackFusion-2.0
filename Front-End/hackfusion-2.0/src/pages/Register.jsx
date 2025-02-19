import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";

const Register = () => {
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /.+@spit\.ac\.in$/i;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim() || !emailRegex.test(formData.email))
      newErrors.email = "Please use a valid institute email (@spit.ac.in)";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Registration successful! You can now log in.");
        setFormData({ name: "", email: "", password: "", role: "" });
      } else {
        setErrors({ apiError: data.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ apiError: "Network error. Please try again." });
    }
  };

  return (
    <>
      <style>
        {`
          body {
            font-family: "Poppins", sans-serif;
            background: #f4f7fc;
            margin: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
          }
          .register-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding-top: 80px; /* Ensures content isn't overlapped by navbar */
          }
          .register-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
            width: 400px;
            text-align: center;
          }
          h2 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
          }
          .form-group {
            text-align: left;
            margin-bottom: 20px;
          }
          label {
            font-size: 14px;
            font-weight: 600;
            color: #555;
            display: block;
            margin-bottom: 5px;
          }
          input, select {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            transition: 0.3s ease-in-out;
          }
          input:focus, select:focus {
            border-color: #007bff;
            box-shadow: 0px 0px 5px rgba(0, 123, 255, 0.3);
            outline: none;
          }
          button {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease-in-out;
          }
          button:hover {
            background: #0056b3;
          }
          .error {
            color: red;
            font-size: 12px;
            margin-top: 5px;
          }
          .success-message {
            color: green;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .error-message {
            color: red;
            font-size: 14px;
            margin-bottom: 10px;
          }
          @media (max-width: 450px) {
            .register-card {
              width: 90%;
              padding: 30px;
            }
            input, select {
              font-size: 14px;
            }
          }
        `}
      </style>

      {/* Navbar at the top */}
      <Navbar userInfo={userInfo} />

      {/* Register Form Centered */}
      <div className="register-container">
        <div className="register-card">
          <h2>Register</h2>
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {errors.apiError && (
            <p className="error-message">{errors.apiError}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.name && <small className="error">{errors.name}</small>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your @spit.ac.in email"
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
              />
              {errors.password && (
                <small className="error">{errors.password}</small>
              )}
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <small className="error">{errors.role}</small>}
            </div>

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
