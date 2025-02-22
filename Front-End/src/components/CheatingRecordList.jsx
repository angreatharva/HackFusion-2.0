import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";
import { Table, Form, InputGroup, Spinner, Alert } from "react-bootstrap";

function CheatingRecordList() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  // Session handling
  const tabId = sessionStorage.getItem("tabId") || Date.now();
  sessionStorage.setItem("tabId", tabId);
  const token = localStorage.getItem(`authToken_${tabId}`);

  // Fetch user info
  useEffect(() => {
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    if (!token) {
      navigate("/");
    } else {
      setUserInfo({ name, role });
    }
  }, [navigate, token, tabId]);

  // Fetch cheating records
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/records")
      .then((res) => {
        setRecords(res.data);
        setFilteredRecords(res.data);
      })
      .catch(() => setError("Failed to fetch records. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = records.filter(
      (record) =>
        record.ucid.toLowerCase().includes(search.toLowerCase()) ||
        record.studentName.toLowerCase().includes(search.toLowerCase()) ||
        record.subjectName.toLowerCase().includes(search.toLowerCase()) ||
        record.examination.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [search, records]);

  // Sort records
  const handleSort = (key) => {
    setSortBy(key);
    const sorted = [...filteredRecords].sort((a, b) => {
      if (key === "date") {
        return new Date(a.dateOfCheating) - new Date(b.dateOfCheating);
      } else if (key === "name") {
        return a.studentName.localeCompare(b.studentName);
      } else if (key === "semester") {
        return a.semester - b.semester;
      }
      return 0;
    });
    setFilteredRecords(sorted);
  };

  return (
    <div className="container mt-4">
      <Navbar userInfo={userInfo} />
      <h2 className="text-center text-success mb-4">
        <i className="fas fa-list-alt me-2"></i>Cheating Records
      </h2>

      {/* Search Bar */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by UCID, Name, Subject, or Examination"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {/* Sorting Options */}
      <div className="d-flex justify-content-end mb-3">
        <Form.Select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="w-auto"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="semester">Sort by Semester</option>
        </Form.Select>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* Error Message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Cheating Records Table */}
      {!loading && filteredRecords.length === 0 && !error ? (
        <p className="text-muted text-center fs-5">
          <i className="fas fa-exclamation-circle me-2"></i>No records found.
        </p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="shadow">
            <thead className="table-success">
              <tr>
                <th>Sr. No.</th>
                <th>UCID</th>
                <th>Student Name</th>
                <th>Semester</th>
                <th>Subject</th>
                <th>Examination</th>
                <th>Date of Cheating</th>
                <th>Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={record._id}>
                  <td>{index + 1}</td>
                  <td>{record.ucid}</td>
                  <td>{record.studentName}</td>
                  <td>{record.semester}</td>
                  <td>{record.subjectName}</td>
                  <td>{record.examination}</td>
                  <td>
                    {new Date(record.dateOfCheating).toLocaleDateString()}
                  </td>
                  <td
                    className={
                      record.actionTaken ? "text-success" : "text-danger"
                    }
                  >
                    {record.actionTaken || "Yet to take action"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default CheatingRecordList;
