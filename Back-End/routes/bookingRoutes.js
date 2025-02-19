const express = require("express");
const {
  requestBooking,
  updateBookingStatus,
  getAllBookings,
  getUserBookings,
} = require("../controllers/bookingController");
const { auth, authorize, checkAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/request", auth, requestBooking);
router.put("/:bookingId/status", auth, checkAdmin, updateBookingStatus);
router.get("/all", auth, checkAdmin, getAllBookings);
router.get("/my-bookings", auth, getUserBookings);

module.exports = router;
