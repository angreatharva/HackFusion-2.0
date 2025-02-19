import { useState, useEffect } from "react";

const StudentDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetchBookings();
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
      const data = await res.json();
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/facilities")
      .then((res) => res.json())
      .then((data) => setFacilities(data))
      .catch((error) => console.error("Error fetching facilities:", error));
  }, []);

  useEffect(() => {
    if (!selectedFacility || !date) {
      setAvailableSlots([]);
      return;
    }

    fetch(`http://localhost:8000/api/slots/${selectedFacility}/${date}`)
      .then((res) => res.json())
      .then((data) => setAvailableSlots(data.availableSlots || []))
      .catch((error) =>
        console.error("Error fetching available slots:", error)
      );
  }, [selectedFacility, date]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFacility || !date || !timeSlot) {
      alert("Please select all required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ facilityId: selectedFacility, date, timeSlot }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        fetchBookings(); // Refresh bookings automatically
        setSelectedFacility("");
        setDate("");
        setTimeSlot("");
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

  // Function to get the minimum and maximum allowed dates (next 7 days)
  const getMinMaxDates = () => {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0]; // Today's date
    const maxDate = new Date(today.setDate(today.getDate() + 7))
      .toISOString()
      .split("T")[0]; // 7 days from today
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getMinMaxDates();

  return (
    <div className="dashboard-container">
      <h2>📅 My Bookings</h2>

      <div className="booking-form">
        <h3>📌 Request a Booking</h3>
        <form onSubmit={handleBookingSubmit}>
          <select
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

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate} // Restrict to today's date
            max={maxDate} // Restrict to 7 days from today
            required
          />

          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          >
            <option value="">Select Time Slot</option>
            {availableSlots.length > 0 ? (
              availableSlots.map((slotTime, index) => (
                <option key={index} value={slotTime}>
                  {slotTime}
                </option>
              ))
            ) : (
              <option disabled>No slots available</option>
            )}
          </select>

          <button type="submit">Book Facility</button>
        </form>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="booking-table">
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
                <td>{booking.facility?.name || "Unknown Facility"}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{booking.timeSlot}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Availability Chart */}
      <div className="availability-chart">
        <h3>📊 Availability Chart</h3>
        {selectedFacility && date ? (
          <table>
            <thead>
              <tr>
                <th>Time Slot</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {availableSlots.map((slotTime, index) => (
                <tr key={index}>
                  <td>{slotTime}</td>
                  <td>✅ Available</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Select a facility and date to view availability.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
