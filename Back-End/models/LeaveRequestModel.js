// models/LeaveRequest.js
const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  leaveDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Rejected"],
    default: "Confirmed", // Set default to Confirmed
  },
});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
