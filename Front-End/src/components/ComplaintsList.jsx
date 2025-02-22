import React, { useEffect, useState } from "react";
import axios from "axios";

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    if (token && role && name) {
      setUserRole(role);
      setUserName(name);
      setUserToken(token);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [userToken]);

  const fetchComplaints = async () => {
    if (!userToken) return;
    try {
      const response = await axios.get("http://localhost:8000/api/complaints", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    }
  };

  const handleApproval = async (complaintId, hasVoted) => {
    if (hasVoted) {
      alert("❗ You have already voted for this complaint.");
      return;
    }

    try {
      const voteData = { complaintId, name: userName, role: userRole };

      await axios.post("http://localhost:8000/api/complaints/vote", voteData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      fetchComplaints();
    } catch (error) {
      console.error("Failed to vote:", error.response?.data || error);
    }
  };

  return (
    <div className="complaints-container">
      <h1>📜 Complaints List</h1>
      {complaints.length > 0 ? (
        complaints.map((complaint) => {
          const {
            _id,
            title,
            description,
            anonymous,
            approval_count,
            voters,
            name,
            role,
          } = complaint;
          const hasVoted = voters?.includes(userName);
          const showUser =
            anonymous && approval_count < 4
              ? { name: "Anonymous", role: "Anonymous" }
              : { name, role };

          return (
            <div key={_id} className="complaint-item">
              <p>
                🏷️ <strong>Title:</strong> {title}
              </p>
              <p>
                📝 <strong>Description:</strong> {description}
              </p>
              <p>
                👤 <strong>Posted By:</strong> {showUser.name} ({showUser.role})
              </p>
              <p>
                ✅ <strong>Approval Count:</strong> {approval_count}
              </p>
              <p>
                📊 <strong>Voted:</strong> {hasVoted ? "✅ Yes" : "❌ No"}
              </p>

              {userRole === "board_member" && (
                <button
                  className="approve-btn"
                  onClick={() => handleApproval(_id, hasVoted)}
                  disabled={hasVoted}
                >
                  {hasVoted ? "✅ Already Voted" : "👍 Approve Complaint"}
                </button>
              )}
            </div>
          );
        })
      ) : (
        <p>🚫 No complaints found.</p>
      )}

      <style>
        {`
          .complaints-container {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
          }

          .complaint-item {
            background-color: #fff;
            padding: 15px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .complaint-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          p {
            margin: 8px 0;
            color: #555;
          }

          .approve-btn {
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .approve-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }

          .approve-btn:hover:not(:disabled) {
            background-color: #0056b3;
          }

          @media (max-width: 600px) {
            .complaint-item {
              padding: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ComplaintsList;
