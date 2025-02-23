import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard = () => {
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
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [remainingSlots, setRemainingSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);

  const tabId = sessionStorage.getItem("tabId");
  const token = localStorage.getItem(`authToken_${tabId}`);

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  useEffect(() => {
    fetch("http://localhost:8000/api/facilities")
      .then((res) => res.json())
      .then((data) => setFacilities(data))
      .catch(() => setBookingMessage("Failed to load facilities."));
  }, []);

  useEffect(() => {
    if (!selectedFacility || !date) {
      setAvailableSlots([]);
      setRemainingSlots({});
      return;
    }

    fetch(
      `http://localhost:8000/api/bookings/slots/${selectedFacility}/${date}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAvailableSlots(data.availableSlots || []);
        setRemainingSlots(data.remainingSlots || {});
      })
      .catch(() => setBookingMessage("Failed to load available slots."));
  }, [selectedFacility, date]);

  useEffect(() => {
    if (bookingMessage) {
      const timer = setTimeout(() => setBookingMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [bookingMessage]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8000/api/bookings/my-bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch bookings.");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookingMessage("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFacility || !date || !timeSlot) {
      setBookingMessage("Please select all required fields.");
      return;
    }

    setSubmitting(true);
    setBookingMessage(null);

    try {
      const res = await fetch("http://localhost:8000/api/bookings/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ facilityId: selectedFacility, date, timeSlot }),
      });

      const data = await res.json();
      if (res.ok) {
        setBookingMessage("✅ Successfully booked!");
        fetchBookings();
        setSelectedFacility("");
        setDate("");
        setTimeSlot("");
        setAvailableSlots([]);
        setRemainingSlots({});
      } else {
        setBookingMessage(data.message || "Booking failed. Please try again.");
      }
    } catch {
      setBookingMessage("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getMinMaxDates = () => {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    const maxDate = new Date(today.setDate(today.getDate() + 7))
      .toISOString()
      .split("T")[0];
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getMinMaxDates();

  const chartData = {
    labels: availableSlots,
    datasets: [
      {
        label: "Remaining Slots",
        data: availableSlots.map((slot) => remainingSlots[slot] || 0),
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <Sidebar userInfo={userInfo} />

      <h2 className="m-2 text-center text-primary fw-bold">
        🚀 Campus Facility Booking
      </h2>

      {bookingMessage && (
        <div
          className="alert alert-info text-center fade show mt-3"
          role="alert"
        >
          {bookingMessage}
        </div>
      )}

      <div className="card shadow-sm mb-4 animate__animated animate__fadeIn">
        <div className="card-body">
          <h3 className="card-title text-success fw-bold">
            📌 Request a Booking
          </h3>
          <form onSubmit={handleBookingSubmit}>
            <div className="mb-3">
              <label htmlFor="facility" className="form-label">
                Facility:
              </label>
              <select
                className="form-select border-primary"
                id="facility"
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                required
              >
                <option value="">Select Facility</option>
                {facilities.map((facility) => (
                  <option key={facility._id} value={facility._id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Date:
              </label>
              <input
                type="date"
                className="form-control border-primary"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                max={maxDate}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="timeSlot" className="form-label">
                Time Slot:
              </label>
              <select
                className="form-select border-primary"
                id="timeSlot"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
              >
                <option value="">Select Time Slot</option>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slotTime, index) => (
                    <option key={index} value={slotTime}>
                      {slotTime} (Remaining: {remainingSlots[slotTime] || 0})
                    </option>
                  ))
                ) : (
                  <option disabled>No slots available</option>
                )}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={submitting}
            >
              {submitting ? "Booking..." : "Book Facility"}
            </button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm animate__animated animate__fadeInUp">
        <div className="card-body">
          <h3 className="card-title text-warning fw-bold">
            📊 Availability Chart
          </h3>
          {selectedFacility && date ? (
            <div>
              {/* <Pie data={chartData} /> */}
              {availableSlots.map((slotTime, index) => (
                <div key={index} className="mb-2">
                  <strong>{slotTime}:</strong>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${(remainingSlots[slotTime] || 0) * 10}%`,
                      }}
                    >
                      {remainingSlots[slotTime] || 0} slots
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Select a facility and date to view availability.</p>
          )}
        </div>
      </div>

      <h2 className="mt-5 text-center">📅 My Bookings</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Facility</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.facility?.name || "Facility not found"}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.timeSlot}</td>
                  <td>
                    <span
                      className={`badge ${
                        booking.status === "Approved"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
