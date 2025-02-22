const express = require("express");
const {
  submitApplication,
  getApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { auth, checkAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Application routes
router.post("/", auth, submitApplication); // Submit an application (Authenticated users)
router.get("/", auth, getApplications); // Get all applications (Authenticated users)
router.put("/:id", auth, checkAdmin, updateApplicationStatus); // Update application status (Admin only)

module.exports = router;
