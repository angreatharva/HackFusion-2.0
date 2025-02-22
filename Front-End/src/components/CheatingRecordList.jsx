import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";

function CheatingRecordList() {
  const [records, setRecords] = useState([]);
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
                <strong>UCID:</strong> {record.ucid}
              </p>
              <p>
                <strong>Semester:</strong> {record.semester}
              </p>
              <p>
                <strong>Subject:</strong> {record.subjectName}
              </p>
              <p>
                <strong>Examination:</strong> {record.examination}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(record.dateOfCheating).toLocaleDateString()}
              </p>
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
    maxWidth: "90%",
    margin: "30px auto",
    backgroundColor: "#F7F9FC",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    color: "#2E7D32",
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  noRecords: {
    color: "#777",
    fontSize: "18px",
    fontStyle: "italic",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  },
  recordCard: {
    backgroundColor: "#fff",
    borderLeft: "5px solid #2E7D32",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.15)",
    textAlign: "left",
    transition: "transform 0.2s ease-in-out",
  },
  studentName: {
    color: "#1E1E1E",
    fontSize: "20px",
    marginBottom: "8px",
  },
  image: {
    width: "100%",
    maxWidth: "250px",
    borderRadius: "8px",
    marginTop: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
};

export default CheatingRecordList;
