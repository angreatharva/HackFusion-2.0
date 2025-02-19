// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const slotRoutes = require("./routes/slots");
const escalatePriorities = require("./utils/escalation");
const { initializeSocket } = require("./utils/socketService"); // Import socket service

// Middleware to parse JSON
app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);

// Connect to MongoDB
connectDB();

// Initialize WebSocket
initializeSocket(server);

// Run Priority Escalation Every 1 Hour
setInterval(escalatePriorities, 60 * 60 * 1000);

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/records", require("./routes/record"));

const port = 8000;

app.listen(port, () => {
  console.log(`Server Listening on port http://localhost:${port}`);
});
