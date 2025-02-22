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
      const tabId = sessionStorage.getItem("tabId");
      const token = localStorage.getItem(`authToken_${tabId}`);
      const name = localStorage.getItem(`name_${tabId}`);
      const role = localStorage.getItem(`role_${tabId}`);
      console.log("Token:" + token);
      console.log("Name:" + name);
      console.log("Role:" + role);
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
      const tabId = sessionStorage.getItem("tabId");
      const token = localStorage.getItem(`authToken_${tabId}`);
      const name = localStorage.getItem(`name_${tabId}`);
      const role = localStorage.getItem(`role_${tabId}`);
      console.log("Token:" + token);
      console.log("Name:" + name);
      console.log("Role:" + role);
      const res = await fetch("http://localhost:8000/api/bookings/request", {
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
        fetchBookings();
        setSelectedFacility("");
        setDate("");
        setTimeSlot("");
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
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

  return (
    <div className="dashboard-container">
      <style>{`
        /* General Styles */
        body {
          font-family: "Arial", sans-serif;
          background-color: #f4f4f9;
          color: #333;
          margin: 0;
          padding: 0;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h2, h3 {
          color: #2c3e50;
        }

        h2 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 20px;
          margin-bottom: 15px;
        }

        /* Booking Form Styles */
        .booking-form {
          margin-bottom: 30px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .booking-form form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .booking-form select,
        .booking-form input[type="date"] {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          background-color: #fff;
          transition: border-color 0.3s ease;
        }

        .booking-form select:focus,
        .booking-form input[type="date"]:focus {
          border-color: #3498db;
          outline: none;
        }

        .booking-form button {
          padding: 10px 15px;
          background-color: #3498db;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .booking-form button:hover {
          background-color: #2980b9;
        }

        /* Booking Table Styles */
        .booking-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .booking-table th,
        .booking-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .booking-table th {
          background-color: #3498db;
          color: #fff;
        }

        .booking-table tr:hover {
          background-color: #f1f1f1;
        }

        /* Availability Chart Styles */
        .availability-chart {
          margin-top: 30px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
      `}</style>

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
            min={minDate}
            max={maxDate}
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
