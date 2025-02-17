require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");

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

const port = 8000;

app.listen(port, () => {
  console.log(`Server Listening on port http://localhost:${port}`);
});
