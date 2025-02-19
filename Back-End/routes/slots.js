const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Facility = require("../models/Facility");

// Predefined slots (Modify as per your need)
const predefinedSlots = ["9 AM - 12 PM", "2 PM - 4 PM", "6 PM - 8 PM"];

// Fetch available slots for a specific facility and date
router.get("/:facilityId/:date", async (req, res) => {
  try {
    const { facilityId, date } = req.params;

    // Validate facilityId
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    // Validate date (ensure it's not in the past)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    if (selectedDate < today) {
      return res.status(400).json({ message: "Date cannot be in the past" });
    }

    // Fetch existing bookings for this facility and date
    const bookedSlots = await Booking.find({
      facility: facilityId,
      date,
    }).select("timeSlot");

    // Extract booked slot times
    const bookedTimeSlots = bookedSlots.map((b) => b.timeSlot);

    // Filter out already booked slots
    const availableSlots = predefinedSlots.filter(
      (slot) => !bookedTimeSlots.includes(slot)
    );

    res.json({ availableSlots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
