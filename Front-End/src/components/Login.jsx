import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { encryptData } from "../utils/encryption"; // Import encryption utility

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call loginUser with the email and password
      const {
        token,
        role,
        name,
        email: userEmail,
        gender,
      } = await loginUser(email, password);

      // Generate a unique tab identifier
      const tabId = sessionStorage.getItem("tabId") || Date.now().toString();
      sessionStorage.setItem("tabId", tabId);

      // Encrypt sensitive data before storing in localStorage
      // localStorage.setItem(`authToken_${tabId}`, token);
      // localStorage.setItem(`role_${tabId}`, encryptData(role));
      // localStorage.setItem(`name_${tabId}`, encryptData(name));
      // localStorage.setItem(`email_${tabId}`, encryptData(userEmail));
      // localStorage.setItem(`gender_${tabId}`, encryptData(gender));

      localStorage.setItem(`authToken_${tabId}`, token);
      localStorage.setItem(`role_${tabId}`, role);
      localStorage.setItem(`name_${tabId}`, name);
      localStorage.setItem(`gender_${tabId}`, gender);

      console.log("Token:", token);
      console.log("Role:", role);
      console.log("Name:", name);
      console.log("Gender:", gender);

      navigate("/home");
    } catch (error) {
      setError(error.message || "Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        <a href="/forgot-password">Forgot Password?</a>
      </p>

      <style>{`
        .login-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f5f5;
          padding: 20px !important;
        }
        
        h2 {
          font-size: 2rem !important;
          margin-bottom: 20px !important;
        }
        
        form {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 400px;
          background-color: white !important;
          padding: 30px !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        }
        
        input {
          padding: 10px !important;
          margin: 10px 0 !important;
          border: 1px solid #ccc !important;
          border-radius: 5px !important;
          font-size: 1rem !important;
        }
        
        input:focus {
          border-color: #4CAF50 !important;
          outline: none !important;
        }
        
        button {
          padding: 12px !important;
          margin-top: 10px !important;
          background-color: #4CAF50 !important;
          color: white !important;
          border: none !important;
          border-radius: 5px !important;
          cursor: pointer !important;
          font-size: 1rem !important;
        }
        
        button:hover {
          background-color: #45a049 !important;
        }
        
        .error {
          color: red !important;
          font-size: 0.875rem !important;
          margin-top: 10px !important;
        }
        
        a {
          text-decoration: none !important;
          color: #007bff !important;
          font-size: 1rem !important;
        }
        
        a:hover {
          text-decoration: underline !important;
        }
        
        @media (max-width: 600px) {
          .login-container {
            padding: 15px !important;
          }
        
          h2 {
            font-size: 1.5rem !important;
          }
        
          form {
            width: 100% !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
