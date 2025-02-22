const mongoose = require("mongoose");
const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  location: { type: String },
  availability: { type: Boolean, default: true },
  capacity: {
    type: Number,
    required: true,
  },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
});

module.exports = mongoose.model("Facility", facilitySchema);
