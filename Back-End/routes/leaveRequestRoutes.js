const express = require("express");
const { createLeaveRequest } = require("../controllers/leaveRequestController");
const { auth, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Only doctors can create leave requests
router.post("/", auth, authorize(["doctor"]), createLeaveRequest);

module.exports = router;
