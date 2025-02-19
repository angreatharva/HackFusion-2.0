const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student or Faculty
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    date: { type: Date, required: true }, // Booking date
    timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 12:00 PM"
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    }, // Approval status
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
