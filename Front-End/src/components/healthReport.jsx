import React, { useState } from "react";
import axios from "axios";

const HealthReportForm = () => {
  const [formData, setFormData] = useState({
    patient: "",
    diagnosis: "",
    prescription: "",
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveData, setLeaveData] = useState({
    leaveDate: "",
    returnDate: "",
  });

  const tabId = sessionStorage.getItem("tabId");
  const token = localStorage.getItem(`authToken_${tabId}`);
  const name = localStorage.getItem(`name_${tabId}`);
  const role = localStorage.getItem(`role_${tabId}`);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/health-reports",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create health report");
    }
  };

  const handleLeaveChange = (e) => {
    const { name, value } = e.target;
    setLeaveData({ ...leaveData, [name]: value });
  };

  const submitLeaveRequest = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/leave-requests",
        {
          studentId: response.patient,
          leaveDate: leaveData.leaveDate,
          returnDate: leaveData.returnDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Leave request submitted successfully");
      setShowLeaveForm(false);
    } catch (err) {
      alert("Failed to submit leave request");
    }
  };

  return (
    <div className="form-container">
      <h1>Health Report Form</h1>
      <form onSubmit={handleSubmit}>
        <label>Patient ID:</label>
        <input
          type="text"
          name="patient"
          value={formData.patient}
          onChange={handleChange}
          required
        />

        <label>Diagnosis:</label>
        <input
          type="text"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />

        <label>Prescription:</label>
        <input
          type="text"
          name="prescription"
          value={formData.prescription}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>

      {response && (
        <div className="response">
          <h2>Report Created Successfully</h2>
          <p>Is the student very sick and needs to leave the campus?</p>
          <button onClick={() => setShowLeaveForm(true)}>Request Leave</button>

          {showLeaveForm && (
            <div className="leave-form">
              <h3>Leave Request Form</h3>
              <label>Leave Date:</label>
              <input
                type="datetime-local"
                name="leaveDate"
                value={leaveData.leaveDate}
                onChange={handleLeaveChange}
                required
              />

              <label>Return Date:</label>
              <input
                type="datetime-local"
                name="returnDate"
                value={leaveData.returnDate}
                onChange={handleLeaveChange}
                required
              />

              <button onClick={submitLeaveRequest}>Submit Leave Request</button>
            </div>
          )}
        </div>
      )}

      {error && <div className="error">Error: {error}</div>}

      <style>{`
        .form-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          background-color: #f9f9f9;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          font-family: Arial, sans-serif;
        }

        h1, h2, h3 {
          text-align: center;
          color: #333;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        label {
          font-weight: bold;
          color: #555;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }

        button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #0056b3;
        }

        .response, .leave-form {
          margin-top: 20px;
          padding: 10px;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 5px;
        }

        .error {
          margin-top: 20px;
          padding: 10px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 5px;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

export default HealthReportForm;
