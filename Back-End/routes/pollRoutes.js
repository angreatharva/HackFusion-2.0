// routes/pollRoutes.js
const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/authMiddleware"); // Import middleware
const { createPoll, getPolls, vote } = require("../controllers/pollController");

// Admin-only route to create polls
router.post("/create", auth, authorize("admin"), createPoll);

// Public route to get all polls (for all users)
router.get("/allPolls", getPolls);

// Route for voting on a poll
router.post("/vote", auth, vote);

module.exports = router;
