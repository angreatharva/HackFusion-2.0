const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Facility Name (Tennis Court, Auditorium)
    description: { type: String }, // Short Description
    location: { type: String }, // Where it is on campus
    availability: { type: Boolean, default: true }, // Is it currently available?
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }], // Reference to bookings
  },
  { timestamps: true }
);

module.exports = mongoose.model("Facility", facilitySchema);
