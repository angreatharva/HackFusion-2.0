const express = require("express");
const Facility = require("../models/Facility");
const { auth, checkAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Add a new facility (Admin Only)
router.post("/", auth, checkAdmin, async (req, res) => {
  try {
    const { name, description, location } = req.body;

    const existingFacility = await Facility.findOne({ name });
    if (existingFacility) {
      return res.status(400).json({ message: "Facility already exists" });
    }

    const facility = new Facility({ name, description, location });
    await facility.save();
    res.status(201).json(facility);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all facilities
router.get("/", async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a specific facility by ID
router.get("/:id", async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id).populate(
      "bookings"
    );
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.json(facility);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
