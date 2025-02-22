const express = require("express");
const {
  requestBooking,
  getAllBookings,
  getUserBookings,
  getAvailableSlots,
} = require("../controllers/bookingController");
const { auth, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/request", auth, requestBooking);
router.get("/all", auth, authorize(["admin"]), getAllBookings);
router.get("/my-bookings", auth, getUserBookings);
router.get("/slots/:facilityId/:date", getAvailableSlots);

module.exports = router;
