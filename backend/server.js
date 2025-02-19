const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const http = require("http");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const Application = require("./models/Application"); // ✅ Import Application Model

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server
const io = new Server(server, { cors: { origin: "*" } }); // ✅ Attach WebSocket

// ✅ Improved CORS Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Origin not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json()); // ✅ Middleware for JSON requests (built-in in Express)
app.use(express.urlencoded({ extended: true })); // ✅ Supports form data (built-in in Express)

// ✅ MongoDB Connection (Improved Logging)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    startEscalationScheduler(); // ✅ Start Automated Escalation Task
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.stack);
    process.exit(1);
  });

// ✅ WebSocket Connection
io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

// ✅ Function to Emit Real-Time Application Updates
const sendApplicationUpdates = async () => {
  const updatedApps = await Application.find().sort({ priority: -1 });
  io.emit("applicationsUpdated", updatedApps);
};

// ✅ Routes (Pass WebSocket Update Function)
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes(sendApplicationUpdates));
app.use("/api/budget", budgetRoutes);

// ✅ Health Check Route (Use this to verify API status)
app.get("/health", (req, res) => {
  res.json({ status: "running", uptime: process.uptime() });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is Running...");
});

// ✅ 404 Handler for Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handling Middleware (Includes Stack Trace)
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Graceful Shutdown on Unexpected Errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.stack);
  process.exit(1);
});

// ✅ Handle Process Termination (Closes DB Connection)
process.on("SIGINT", async () => {
  console.log("🔴 Closing MongoDB Connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB Disconnected. Server shutting down.");
  process.exit(0);
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Automated Escalation Scheduler (Runs Every 24 Hours & Emits Updates)
function startEscalationScheduler() {
  console.log("⏳ Automated Escalation Task Started...");

  setInterval(async () => {
    try {
      const result = await Application.updateMany(
        { status: "Pending" },
        { $inc: { priority: 1 } } // ✅ Increase priority dynamically
      );

      if (result.modifiedCount > 0) {
        console.log(`⚡ Escalation Task Executed: ${result.modifiedCount} applications escalated.`);
        sendApplicationUpdates(); // ✅ Emit real-time update
      }
    } catch (error) {
      console.error("❌ Error during automatic escalation:", error);
    }
  }, 24 * 60 * 60 * 1000); // ✅ Runs every 24 hours
}
