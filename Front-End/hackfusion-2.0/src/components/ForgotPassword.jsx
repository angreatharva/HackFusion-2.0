import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/forgot-password",
        {
          email: email,
        }
      );
      const resetToken = response.data.resetToken;
      console.log(resetToken);
      // Navigate to resetPassword page with the resetToken in the URL
      navigate(`/reset-password/${resetToken}`);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <style>{`
        .forgot-password-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f5f5;
          padding: 20px !important;
          margin: 0 !important;
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
        
        @media (max-width: 600px) {
          .forgot-password-container {
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
}

export default ForgotPassword;
