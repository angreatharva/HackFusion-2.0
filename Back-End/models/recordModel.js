const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  ucid: { type: String, required: true, length: 10 },
  studentName: { type: String, required: true },
  reason: { type: String, required: true },

  dateOfCheating: { type: Date, required: true },
  examination: { type: String, enum: ["Mid-Sem", "End-Sem"], required: true },
  semester: { type: Number, min: 1, max: 8, required: true },
  proof: { type: Buffer, required: true },
  subjectName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Record", RecordSchema);
