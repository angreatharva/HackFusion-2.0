const express = require("express");
const Record = require("../models/Record");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

// Add a new record (Only Admins)
router.post("/add", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });

  try {
    const { studentName, reason, proofURL } = req.body;
    const record = new Record({ studentName, reason, proofURL });
    await record.save();

    res.status(201).json({ message: "Record added", record });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all records (Public)
router.get("/", async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
