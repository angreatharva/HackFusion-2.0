// mern-frontend/src/components/ReportLeave.js
import { useState } from 'react';
import axios from 'axios';

const ReportLeave = () => {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');

  const handleReportLeave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/healthleave/report-leave',
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error reporting leave. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Report Student Leaving Campus</h2>
      <form onSubmit={handleReportLeave}>
        <label className="block text-gray-700 mb-1">Student ID</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter Student ID"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Report Leave
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-green-600">{message}</p>
      )}
    </div>
  );
};

export default ReportLeave;
