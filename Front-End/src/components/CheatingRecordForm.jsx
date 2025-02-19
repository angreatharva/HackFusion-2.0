import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";

const AddRecord = () => {
  const [studentName, setStudentName] = useState("");
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProof(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!studentName || !reason || !proof) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/records/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentName,
          reason,
          proof,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      setSuccess("Record added successfully!");
      setStudentName("");
      setReason("");
      setProof(null);
    } catch (err) {
      setError(err.message);
      console.error("Error adding record:", err);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar userInfo={userInfo} />
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Add Record</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="studentName" style={styles.label}>
              Student Name:
            </label>
            <input
              type="text"
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="reason" style={styles.label}>
              Reason:
            </label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="proof" style={styles.label}>
              Proof:
            </label>
            <input
              type="file"
              id="proof"
              onChange={handleProofChange}
              required
              style={styles.inputFile}
            />
            {proof && (
              <p style={styles.selectedFile}>
                Selected file: {proof.slice(0, 50)}...
              </p>
            )}
          </div>
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "400px",
    marginTop: "20px", // Added margin to separate the form from the navbar
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  success: {
    color: "green",
    marginBottom: "10px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  inputFile: {
    width: "100%",
  },
  selectedFile: {
    marginTop: "5px",
    color: "#777",
    fontSize: "14px",
  },
  submitButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
};

export default AddRecord;
