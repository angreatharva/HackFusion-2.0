// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const http = require("http");
// require("dotenv").config();

// const applicationRoutes = require("./routes/applicationRoutes");
// const escalatePriorities = require("./utils/escalation");
// const { initializeSocket } = require("./utils/socketService"); // Import socket service

// const app = express();
// const server = http.createServer(app);

// // Initialize WebSocket
// initializeSocket(server);

// // Middleware
// app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5176"],
//     credentials: true,
//   })
// );

// // Routes
// app.use("/api/applications", applicationRoutes);

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));

// // API Test Route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // Run Priority Escalation Every 1 Hour
// setInterval(escalatePriorities, 60 * 60 * 1000);

// // Start Server
// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = { app };
