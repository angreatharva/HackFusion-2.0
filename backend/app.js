require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const escalatePriorities = require("./utils/escalation");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5176"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Connect to MongoDB
connectDB();

// WebSocket Connection Setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Function to notify clients
const notifyClients = () => {
  io.emit("updateApplications");
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// API Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Run Priority Escalation Every 1 Hour
setInterval(escalatePriorities, 60 * 60 * 1000);

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = { app, io, notifyClients };
