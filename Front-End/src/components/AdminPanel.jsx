import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      // Redirect to login if no token
      navigate("/admin-login");
      return;
    }

    fetch("http://localhost:5000/api/bookings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure token is included
      },
    })
      .then((res) => {
        if (res.status === 401) {
          // If unauthorized, clear token and redirect to login
          localStorage.removeItem("token");
          navigate("/admin-login");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setBookings(data);
        else setBookings([]); // Prevent crash if response is unexpected
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [navigate]);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized! Please log in again.");
      navigate("/admin-login");
      return;
    }

    const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Approved" }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setBookings(
        (prevBookings) => prevBookings.filter((b) => b._id !== id) // Remove the approved booking
      );
    } else {
      alert("Failed to approve booking!");
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized! Please log in again.");
      navigate("/admin-login");
      return;
    }

    const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Rejected" }), // Set status to "Rejected"
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setBookings(
        (prevBookings) => prevBookings.filter((b) => b._id !== id) // Remove the rejected booking
      );
    } else {
      alert("Failed to reject booking!");
    }
  };

  return (
    <div>
      <h2>Pending Bookings</h2>
      {bookings.map((b) => (
        <div key={b._id}>
          <p>
            {b.facility.name} - {b.date} - {b.timeSlot}
          </p>
          <button onClick={() => handleApprove(b._id)}>Approve</button>
          <button onClick={() => handleReject(b._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
