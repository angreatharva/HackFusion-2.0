import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";
// import { useNavigate } from "react-router-dom";

const StudentAppointmentForm = () => {
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
  const [formData, setFormData] = useState({
    rollNo: "",
    description: "",
    isEmergency: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tabId = sessionStorage.getItem("tabId");
      const token = localStorage.getItem(`authToken_${tabId}`);

      await axios.post("http://localhost:8000/api/appointments", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Appointment requested successfully");
      navigate("/home");
    } catch (error) {
      alert("Failed to request appointment");
    }
  };

  return (
    <Container maxWidth="sm" className="mt-5">
      <Sidebar userInfo={userInfo} />

      <Paper elevation={3} className="p-4">
        <Typography variant="h5" className="mb-4">
          Request Doctor Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Typography variant="subtitle1" className="mb-2">
              Roll Number:
            </Typography>
            <TextField
              fullWidth
              value={formData.rollNo}
              onChange={(e) =>
                setFormData({ ...formData, rollNo: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <Typography variant="subtitle1" className="mb-2">
              Description of Issue:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isEmergency}
                onChange={(e) =>
                  setFormData({ ...formData, isEmergency: e.target.checked })
                }
              />
            }
            label="Emergency Case"
            className="mb-3"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-2"
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default StudentAppointmentForm;
