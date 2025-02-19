const express = require("express");
const router = express.Router();
const { 
  createApplication, 
  getApplications, 
  updateApplicationStatus 
} = require("../controllers/applicationController");
const { auth, checkAdmin } = require("../middleware/authMiddleware");

router.post("/", auth, createApplication);
router.get("/", auth, getApplications);
router.put("/:id", auth, checkAdmin, updateApplicationStatus);

module.exports = router;
