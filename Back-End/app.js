require("dotenv").config();
const express = require("express");
const app = express();
const { connectDB } = require("./config/db");
const { auth, authorize } = require('../middleware/authMiddleware');
const complaintRoutes = require("./routes/complaintRoutes"); // ✅ Import complaint routes

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes); // ✅ Add this line to register complaint routes

// Use the PORT from your .env or default to 8000
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server Listening on port http://localhost:${port}`);
});
