import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";

const CombinedComplaintForm = () => {
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Administration");
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const storedName = localStorage.getItem(`name_${tabId}`);
    const storedRole = localStorage.getItem(`role_${tabId}`);
    if (storedName && storedRole) {
      setName(storedName);
      setRole(storedRole);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);

    const complaintData = {
      title,
      description,
      category,
      anonymous,
      name: anonymous ? "Anonymous" : name,
      role: anonymous ? "N/A" : role,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/complaints/submit",
        complaintData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Complaint submitted successfully!");
      setTitle("");
      setDescription("");
      setCategory("Administration");
      setAnonymous(false);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <Sidebar userInfo={userInfo} />

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <Card className="shadow">
            <CardContent>
              <Typography variant="h4" align="center" gutterBottom>
                Submit Complaint
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 2 }}
              >
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  margin="normal"
                />

                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  margin="normal"
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="Administration">Administration</MenuItem>
                    <MenuItem value="Staff">Staff</MenuItem>
                    <MenuItem value="Service">Service</MenuItem>
                    <MenuItem value="Faculty">Faculty</MenuItem>
                    <MenuItem value="Committee">Committee</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={anonymous}
                      onChange={() => setAnonymous(!anonymous)}
                    />
                  }
                  label="Submit as Anonymous"
                />

                {!anonymous && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1">
                      <strong>Name:</strong> {name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Role:</strong> {role}
                    </Typography>
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit Complaint
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CombinedComplaintForm;
