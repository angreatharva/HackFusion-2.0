import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Avatar,
  Chip,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  CircularProgress,
  Alert,
} from "@mui/material";
import { MedicalServices, Emergency } from "@mui/icons-material";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
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
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [bedRest, setBedRest] = useState({ required: false, days: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const tabId = sessionStorage.getItem("tabId");
        const token = localStorage.getItem(`authToken_${tabId}`);
        const { data } = await axios.get(
          "http://localhost:8000/api/appointments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(data.filter((app) => app.status !== "approved"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleSubmit = async () => {
    if (!selectedAppointment || submitting) return;

    setSubmitting(true);
    try {
      const tabId = sessionStorage.getItem("tabId");
      const token = localStorage.getItem(`authToken_${tabId}`);

      await axios.put(
        `http://localhost:8000/api/appointments/${selectedAppointment._id}`,
        { prescription, bedRest, status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments((prev) =>
        prev.filter((app) => app._id !== selectedAppointment._id)
      );
      setSelectedAppointment(null);
      setPrescription("");
      setBedRest({ required: false, days: 1 });
    } catch (err) {
      setError("Failed to approve appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LinearProgress sx={{ mt: 2 }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Sidebar userInfo={userInfo} />

      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <MedicalServices fontSize="large" color="primary" />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Doctor's Dashboard
        </Typography>
      </Box>

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
        {/* Appointments List */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pending Appointments ({appointments.length})
            </Typography>

            <List sx={{ maxHeight: 500, overflow: "auto" }}>
              {appointments.map((appointment) => (
                <ListItem
                  key={appointment._id}
                  button
                  selected={selectedAppointment?._id === appointment._id}
                  onClick={() => setSelectedAppointment(appointment)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    ...(appointment.isEmergency && {
                      borderLeft: "3px solid",
                      borderColor: "error.main",
                    }),
                  }}
                >
                  <Box width="100%">
                    <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                      <Avatar
                        sx={{
                          bgcolor: appointment.isEmergency
                            ? "error.main"
                            : "primary.main",
                          width: 32,
                          height: 32,
                        }}
                      >
                        {appointment.rollNo.slice(-2)}
                      </Avatar>
                      <Typography variant="subtitle1">
                        {appointment.rollNo}
                      </Typography>
                      {appointment.isEmergency && (
                        <Chip
                          icon={<Emergency fontSize="small" />}
                          label="Urgent"
                          color="error"
                          size="small"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.description}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Prescription Form */}
        {selectedAppointment && (
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6" gutterBottom>
                  Quick Prescription
                </Typography>

                <TextField
                  multiline
                  rows={4}
                  label="Treatment Plan"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  fullWidth
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={bedRest.required}
                      onChange={(e) =>
                        setBedRest((prev) => ({
                          ...prev,
                          required: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Bed Rest Required"
                />

                {bedRest.required && (
                  <TextField
                    type="number"
                    label="Duration (Days)"
                    value={bedRest.days}
                    onChange={(e) =>
                      setBedRest((prev) => ({
                        ...prev,
                        days: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    inputProps={{ min: 1 }}
                    fullWidth
                  />
                )}

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={!prescription.trim() || submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                  sx={{ mt: 2 }}
                >
                  {submitting ? "Processing..." : "Approve Now"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default DoctorDashboard;
