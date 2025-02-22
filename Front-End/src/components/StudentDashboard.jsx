import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentDashboard = () => {
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

  // Fetch user's bookings
  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

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
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookingMessage("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all facilities
  useEffect(() => {
    fetch("http://localhost:8000/api/facilities")
      .then((res) => res.json())
      .then((data) => setFacilities(data))
      .catch((error) => {
        console.error("Error fetching facilities:", error);
        setBookingMessage("Failed to load facilities.");
      });
  }, []);

  // Fetch available slots when facility or date changes
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
        console.log("API Response:", data); // Debugging log
        setAvailableSlots(data.availableSlots || []);
        setRemainingSlots(data.remainingSlots || {});
      })
      .catch((error) => {
        console.error("Error fetching available slots:", error);
        setBookingMessage("Failed to load available slots.");
      });
  }, [selectedFacility, date]);

  // Handle booking submission
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
        setBookingMessage("Successfully booked!");
        fetchBookings(); // Refresh bookings
        setSelectedFacility("");
        setDate("");
        setTimeSlot("");
        setAvailableSlots([]);
        setRemainingSlots({});
      } else {
        setBookingMessage(data.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setBookingMessage("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get min and max dates for the date picker
  const getMinMaxDates = () => {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    const maxDate = new Date(today.setDate(today.getDate() + 7))
      .toISOString()
      .split("T")[0];
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getMinMaxDates();

  return (
    <div className="container mt-4">
      <h2>📅 My Bookings</h2>
      {bookingMessage && (
        <div className="alert alert-info mt-3" role="alert">
          {bookingMessage}
        </div>
      )}

      {/* Booking Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">📌 Request a Booking</h3>
          <form onSubmit={handleBookingSubmit}>
            <div className="mb-3">
              <label htmlFor="facility" className="form-label">
                Facility:
              </label>
              <select
                className="form-select"
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
                className="form-control"
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
                className="form-select"
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
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Booking..." : "Book Facility"}
            </button>
          </form>
        </div>
      </div>

      {/* Availability Chart */}
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">📊 Availability Chart</h3>
          {selectedFacility && date ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Time Slot</th>
                  <th>Remaining Capacity</th>
                </tr>
              </thead>
              <tbody>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slotTime, index) => (
                    <tr key={index}>
                      <td>{slotTime}</td>
                      <td>{remainingSlots[slotTime] || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No slots available</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <p>Select a facility and date to view availability.</p>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="table table-striped">
          <thead>
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
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDashboard;
