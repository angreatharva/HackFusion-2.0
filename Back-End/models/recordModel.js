const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  reason: { type: String, required: true },
  proof: { type: Buffer, required: true }, // Ensure Buffer type if storing as binary data
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Record", RecordSchema);
