import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";
const AdminPanel = () => {
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Get the unique tab identifier
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    // If token does not exist, navigate to login page
    if (!token) {
      navigate("/");
    } else {
      // Set the user info (name, role) into the state
      setUserInfo({ name, role });
    }
  }, [navigate]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

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
        showToast("Failed to fetch bookings. Please try again.", "danger");
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
      showToast("Unauthorized! Please log in again.", "danger");
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
        showToast(`Failed to ${status.toLowerCase()} booking!`, "danger");
      }
    } catch (error) {
      showToast("Something went wrong. Please try again.", "danger");
    }
  };

  return (
    <div className="container py-5">
      {/* <Navbar userInfo={userInfo} /> */}
      <Sidebar userInfo={userInfo} />
      {toast.show && (
        <div
          className={`alert alert-${toast.type} alert-dismissible fade show`}
          role="alert"
        >
          {toast.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setToast({ show: false })}
          ></button>
        </div>
      )}

      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Admin Panel - Pending Bookings</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-center text-muted">
              No pending bookings available.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Facility</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.facility?.name}</td>
                      <td>{booking.date}</td>
                      <td>{booking.timeSlot}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleAction(booking._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction(booking._id, "Rejected")}
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
    </div>
  );
};

export default AdminPanel;
