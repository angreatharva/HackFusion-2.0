import { useEffect, useState } from "react";
import axios from "axios";
import AdminPanel from "../Components/AdminPanelCheating";

function AdminDashboard() {
  const [records, setRecords] = useState([]);

  // Fetch records on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/records")
      .then((res) => setRecords(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center font-sans">
          Admin Dashboard
        </h1>

        {/* Admin Panel Component - Handles Adding Records */}
        <AdminPanel setRecords={setRecords} />

        {/* Cheating Records Display */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
          Cheating Records
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.length > 0 ? (
            records.map((record) => (
              <div
                key={record._id}
                className="bg-white shadow-md rounded-lg p-5 border border-gray-200 transition-transform hover:scale-105"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {record.studentName}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{record.reason}</p>
                {record.proofURL && (
                  <img
                    src={record.proofURL}
                    alt="Proof"
                    className="mt-4 w-full h-40 object-cover rounded-md shadow-sm"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No records found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
