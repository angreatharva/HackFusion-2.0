import { useState } from "react";
import axios from "axios";

function AdminPanel({ setRecords }) {
  const [studentName, setStudentName] = useState("");
  const [reason, setReason] = useState("");
  const [proofURL, setProofURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddRecord = async () => {
    const token = localStorage.getItem("token");
    if (!studentName || !reason || !proofURL) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/records/add",
        { studentName, reason, proofURL },
        { headers: { Authorization: token } }
      );
      setRecords((prev) => [res.data.record, ...prev]);
      setStudentName("");
      setReason("");
      setProofURL("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Add Cheating Record
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Proof URL"
          value={proofURL}
          onChange={(e) => setProofURL(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-1 md:col-span-2"
        />
      </div>

      <button
        onClick={handleAddRecord}
        className={`mt-4 px-6 py-2 text-white rounded-lg font-medium transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Record"}
      </button>
    </div>
  );
}

export default AdminPanel;
