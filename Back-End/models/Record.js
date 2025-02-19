const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  studentName: String,
  reason: String,
  proofURL: String, // Image/PDF link stored in Cloudinary
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Record", RecordSchema);
