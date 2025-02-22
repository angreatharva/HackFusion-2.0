//app.js
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
const healthReportRoutes = require("./routes/healthReportRoutes");
const leaveRequestRoutes = require("./routes/leaveRequestRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const slotRoutes = require("./routes/slots");
const appointmentRoutes = require("./routes/appointmentRoutes");
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

// Corrected the relative path to the middleware
const { auth, authorize } = require("./middleware/authMiddleware");

const complaintRoutes = require("./routes/complaintRoutes");

// Middleware to parse JSON (note: this is already set above, so it's optional to repeat)
app.use(express.json());

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
app.use("/api/budgets", budgetRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/records", require("./routes/recordRoutes"));
app.use("/api/complaints", complaintRoutes);
app.use("/api/health-reports", healthReportRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/appointments", appointmentRoutes);

const port = 8000;
app.listen(port, () => {
  console.log(`Server Listening on port http://localhost:${port}`);
});
