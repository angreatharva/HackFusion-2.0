// routes/healthReportRoutes.js
const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/authMiddleware");
const healthReportController = require("../controllers/healthReportController");

router.post(
  "/",
  auth,
  authorize(["doctor"]), // Ensure this matches the role in your database
  healthReportController.createHealthReport
);

module.exports = router;
