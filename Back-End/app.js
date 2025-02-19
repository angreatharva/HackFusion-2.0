require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const slotRoutes = require("./routes/slots");
const escalatePriorities = require("./utils/escalation");
const { initializeSocket } = require("./utils/socketService");

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON with increased payload size
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Enable CORS
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
app.use("/api/records", require("./routes/recordRoutes"));

const port = 8000;

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
