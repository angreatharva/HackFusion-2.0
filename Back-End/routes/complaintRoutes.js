// routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");

router.post("/submit", complaintController.submitComplaint);
router.get("/", complaintController.getComplaints); // Updated route to get all complaints
router.post(
  "/increment-approval/:complaintId",
  complaintController.incrementApproval
);
router.post("/vote", complaintController.voteComplaint); // New vote route

module.exports = router;
