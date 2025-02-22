import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const tabId = sessionStorage.getItem("tabId");
      const token = localStorage.getItem(`authToken_${tabId}`);

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/bookings/all", {
          method: "GET",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem(`authToken_${tabId}`);
          navigate("/");
          return;
        }

        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        showToast("Failed to fetch bookings. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleAction = async (id, status) => {
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);

    if (!token) {
      showToast("Unauthorized! Please log in again.", "error");
      navigate("/");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        showToast(data.message, "success");
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } else {
        showToast(`Failed to ${status.toLowerCase()} booking!`, "error");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="admin-panel">
      <style>{`
        .admin-panel {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f4f4f9;
          padding: 20px;
          position: relative;
        }
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          color: white;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: opacity 0.5s ease-in-out;
        }
        .card {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          width: 100%;
          text-align: center;
        }
        .title {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }
        .no-bookings {
          font-size: 18px;
          color: #777;
          text-align: center;
          margin-top: 20px;
        }
        .table-container {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th {
          padding: 12px;
          text-align: center;
          background-color: #4caf50;
          color: white;
          border-bottom: 2px solid #ddd;
        }
        td {
          padding: 12px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }
        .approve-btn, .reject-btn {
          border: none;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          border-radius: 5px;
          margin: 5px;
          transition: background-color 0.3s;
        }
        .approve-btn {
          background-color: #28a745;
        }
        .approve-btn:hover {
          background-color: #218838;
        }
        .reject-btn {
          background-color: #dc3545;
        }
        .reject-btn:hover {
          background-color: #c82333;
        }
      `}</style>

      {toast.show && (
        <div
          className="toast"
          style={{
            backgroundColor: toast.type === "success" ? "#28a745" : "#dc3545",
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="card">
        <h2 className="title">Pending Bookings</h2>

        {loading ? (
          <p className="no-bookings">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="no-bookings">No pending bookings.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.facility.name}</td>
                    <td>{b.date}</td>
                    <td>{b.timeSlot}</td>
                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => handleAction(b._id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleAction(b._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
