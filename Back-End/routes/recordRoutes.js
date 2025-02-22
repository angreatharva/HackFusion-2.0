const express = require("express");
const { addRecord, getAllRecords } = require("../controllers/recordController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

// Add a new record (Only Admins)
router.post("/add", auth, addRecord);

// Get all records (Public)
router.get("/", getAllRecords);

module.exports = router;
