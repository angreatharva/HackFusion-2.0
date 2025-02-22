import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ApplicationForm = ({ onApplicationSubmit }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    contactNo: "",
    type: "Event Organization",
    eventName: "",
    requestedBudget: "",
    justification: "",
    supportingDoc: "",
  });

  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const storedToken = localStorage.getItem(`authToken_${tabId}`);

    if (!storedToken) {
      navigate("/");
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData({ ...formData, supportingDoc: reader.result });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Unauthorized: Please log in again.");

    try {
      await axios.post(
        "http://localhost:8000/api/applications",
        { ...formData, priority: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Application submitted successfully!");
      setFormData({
        studentName: "",
        email: "",
        contactNo: "",
        type: "Event Organization",
        eventName: "",
        requestedBudget: "",
        justification: "",
        supportingDoc: "",
      });

      if (onApplicationSubmit) {
        onApplicationSubmit();
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="application-container">
      <h2 className="title">📜 Submit Application</h2>

      <div className="form-box">
        <form onSubmit={handleSubmit} className="application-form">
          <input
            type="text"
            name="studentName"
            placeholder="👤 Student Name"
            value={formData.studentName}
            onChange={handleChange}
            className="input-field"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="📧 Email ID"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />

          <input
            type="tel"
            name="contactNo"
            placeholder="📞 Contact No"
            value={formData.contactNo}
            onChange={handleChange}
            className="input-field"
            required
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Event Organization">🎉 Event Organization</option>
            <option value="Budget Request">💰 Budget Request</option>
            <option value="Sponsorship">🤝 Sponsorship</option>
          </select>

          {/* <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Event Organization">🎉 Event Organization</option>
            <option value="Budget Request">💰 Budget Request</option>
            <option value="Sponsorship">🤝 Sponsorship</option>
            <option value="Educational Trip">🚌 Educational Trip</option>
            <option value="Mess Work">🍽️ Mess Work</option>
            <option value="Departmental Work">🏫 Departmental Work</option>
          </select> */}

          <input
            type="text"
            name="eventName"
            placeholder="📌 Event/Project Name"
            value={formData.eventName}
            onChange={handleChange}
            className="input-field"
            required
          />

          <input
            type="number"
            name="requestedBudget"
            placeholder="💵 Requested Budget"
            value={formData.requestedBudget}
            onChange={handleChange}
            className="input-field"
            required
          />

          <textarea
            name="justification"
            placeholder="✍️ Justification/Details"
            value={formData.justification}
            onChange={handleChange}
            className="input-field textarea"
            required
          ></textarea>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />

          <button type="submit" className="submit-btn">
            🚀 Submit Application
          </button>
        </form>
      </div>

      <style>
        {`
          .application-container {
            max-width: 700px;
            margin: auto;
            padding: 20px;
          }
          .title {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }
          .form-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .application-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .input-field {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
            color: #374151;
            outline: none;
            transition: 0.3s;
          }
          .input-field:focus {
            border-color: #facc15;
            box-shadow: 0 0 8px rgba(250, 204, 21, 0.5);
          }
          .textarea {
            height: 80px;
            resize: none;
          }
          .file-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .submit-btn {
            width: 100%;
            padding: 12px;
            border-radius: 5px;
            font-weight: bold;
            background-color: #facc15;
            color: #1e293b;
            transition: 0.3s;
            border: none;
            cursor: pointer;
          }
          .submit-btn:hover {
            background-color: #eab308;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(250, 204, 21, 0.4);
          }
        `}
      </style>
    </div>
  );
};

export default ApplicationForm;
