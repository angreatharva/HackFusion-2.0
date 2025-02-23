import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";

import "bootstrap/dist/css/bootstrap.min.css";
import { FaUpload } from "react-icons/fa";

const AddRecord = () => {
  const [studentName, setStudentName] = useState("");
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState(null);
  const [email, setEmail] = useState("");

  const [ucid, setUcid] = useState("");
  const [dateOfCheating, setDateOfCheating] = useState("");
  const [examination, setExamination] = useState("Mid-Sem");
  const [semester, setSemester] = useState(1);
  const [subjectName, setSubjectName] = useState("");
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

  // Clear alerts after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

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

    const emailRegex = /^[a-zA-Z0-9._%+-]+@spit\.ac\.in$/;
    if (!emailRegex.test(email)) {
      setError("Only @spit.ac.in email addresses are allowed.");
      return;
    }

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
          ucid,
          studentName,
          email,
          reason,
          proof,
          dateOfCheating,
          examination,
          semester,
          subjectName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      setSuccess("Record added successfully!");
      setStudentName("");
      setEmail("");
      setReason("");
      setProof(null);
      setDateOfCheating("");
      setExamination("Mid-Sem");
      setSemester(1);
      setSubjectName("");
      setUcid("");
    } catch (err) {
      setError(err.message);
      console.error("Error adding record:", err);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Sidebar userInfo={userInfo} />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div
              className="card shadow-lg border-0 rounded-4"
              style={{ backgroundColor: "#fff" }}
            >
              <div
                className="card-header text-white text-center rounded-top-4"
                style={{
                  background: "linear-gradient(90deg, #007bff, #00c6ff)",
                }}
              >
                <h3 className="mb-0">📄 Add Student Record</h3>
              </div>
              <div className="card-body p-5">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label">UCID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={ucid}
                        onChange={(e) => setUcid(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Student Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        pattern="^[a-zA-Z0-9._%+-]+@spit\.ac\.in$"
                        title="Only @spit.ac.in emails are allowed"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Subject Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Reason for Cheating</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Date of Cheating</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dateOfCheating}
                        onChange={(e) => setDateOfCheating(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Examination</label>
                      <select
                        className="form-select"
                        value={examination}
                        onChange={(e) => setExamination(e.target.value)}
                        required
                      >
                        <option value="Mid-Sem">Mid-Sem</option>
                        <option value="End-Sem">End-Sem</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Semester</label>
                      <select
                        className="form-select"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        required
                      >
                        {[...Array(8).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Upload Proof</label>
                      <div className="input-group">
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleProofChange}
                          required
                        />
                        <span className="input-group-text bg-primary text-white">
                          <FaUpload />
                        </span>
                      </div>
                      {proof && (
                        <div className="mt-3">
                          <img
                            src={proof}
                            alt="Proof"
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 rounded-pill shadow-sm"
                      >
                        Submit Record 🚀
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center text-muted">
                <small>
                  Ensure all details are accurate before submission.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecord;
