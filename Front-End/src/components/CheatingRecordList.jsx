import { useEffect, useState } from "react";
import axios from "axios";

function CheatingRecordList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/records")
      .then((res) => setRecords(res.data))
      .catch((err) => console.error("Error fetching records:", err));
  }, []);

  return (
    <div>
      <h2>Cheating Records</h2>
      {records.length === 0 ? (
        <p>No cheating records available.</p>
      ) : (
        records.map((record) => (
          <div
            key={record._id}
            style={{
              border: "1px solid black",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <h4>{record.studentName}</h4>
            <p>
              <strong>Reason:</strong> {record.reason}
            </p>
            {record.proofURL && (
              <img src={record.proofURL} alt="Proof" width="100" />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CheatingRecordList;
