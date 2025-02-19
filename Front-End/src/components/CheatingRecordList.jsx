import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";

function CheatingRecordList() {
  const [records, setRecords] = useState([]);
  const [applications, setApplications] = useState([]);
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

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/records")
      .then((res) => setRecords(res.data))
      .catch((err) => console.error("Error fetching records:", err));
  }, []);

  return (
    <div style={styles.container}>
      <Navbar userInfo={userInfo} />

      <h2 style={styles.title}>Cheating Records</h2>
      {records.length === 0 ? (
        <p style={styles.noRecords}>No cheating records available.</p>
      ) : (
        <div style={styles.gridContainer}>
          {records.map((record) => (
            <div key={record._id} style={styles.recordCard}>
              <h4 style={styles.studentName}>{record.studentName}</h4>
              <p>
                <strong>Reason:</strong> {record.reason}
              </p>
              {record.proof && (
                <img src={record.proof} alt="Proof" style={styles.image} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "100%",
    margin: "20px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    color: "#4AAC4E",
    fontSize: "24px",
    fontWeight: "bold",
  },
  noRecords: {
    color: "#777",
    fontSize: "16px",
  },
  gridContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "15px",
  },
  recordCard: {
    backgroundColor: "#fff",
    borderLeft: "5px solid #4AAC4E",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "calc(50% - 10px)", // Two items per row with spacing
    boxSizing: "border-box",
    textAlign: "left",
  },
  studentName: {
    color: "#333",
    fontSize: "18px",
    marginBottom: "5px",
  },
  image: {
    width: "100px",
    borderRadius: "5px",
    marginTop: "10px",
  },
};

export default CheatingRecordList;
