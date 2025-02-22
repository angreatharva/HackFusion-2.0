import React, { useState, useEffect } from "react";
import axios from "axios";

const ComplaintForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Service");
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const storedName = localStorage.getItem(`name_${tabId}`);
    const storedRole = localStorage.getItem(`role_${tabId}`);

    if (storedName && storedRole) {
      setName(storedName);
      setRole(storedRole);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);

    const complaintData = {
      title,
      description,
      category,
      anonymous,
      name: anonymous ? "Anonymous" : name,
      role: anonymous ? "N/A" : role,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/complaints/submit",
        complaintData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Complaint submitted successfully!");
      setTitle("");
      setDescription("");
      setCategory("Service");
      setAnonymous(false);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <div className="complaint-form">
      <style>
        {`
          .complaint-form {
            max-width: 700px;
            margin: 0 auto;
            padding: 24px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
          }

          .complaint-form h1 {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
          }

          .complaint-form form {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .complaint-form label {
            font-size: 14px;
            font-weight: 600;
            color: #555;
            display: block;
            margin-bottom: 6px;
          }

          .complaint-form input[type="text"],
          .complaint-form textarea,
          .complaint-form select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
            color: #333;
            outline: none;
            transition: border-color 0.3s ease;
          }

          .complaint-form input[type="text"]:focus,
          .complaint-form textarea:focus,
          .complaint-form select:focus {
            border-color: #007bff;
          }

          .complaint-form textarea {
            height: 100px;
            resize: vertical;
          }

          .complaint-form .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .complaint-form .user-info {
            background-color: #f9f9f9;
            padding: 12px;
            border-radius: 6px;
            margin-top: 8px;
          }

          .complaint-form button {
            width: 100%;
            background-color: #007bff;
            color: white;
            padding: 10px 0;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .complaint-form button:hover {
            background-color: #0056b3;
          }
        `}
      </style>

      <h1>Submit Complaint</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter complaint title"
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe your complaint in detail"
          ></textarea>
        </div>

        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Service">Service</option>
            <option value="Product">Product</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />
          <label>Submit as Anonymous</label>
        </div>

        {!anonymous && (
          <div className="user-info">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Role:</strong> {role}
            </p>
          </div>
        )}

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
