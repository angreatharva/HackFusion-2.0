// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");

// Middleware to parse JSON
app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);

// Connect to MongoDB
connectDB();

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

const port = 8000;

app.listen(port, () => {
  console.log(`Server Listening on port http://localhost:${port}`);
});
