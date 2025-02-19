const Record = require("../models/recordModel");

/**
 * Add a new record (Admin Only)
 */
const addRecord = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });

  try {
    const { studentName, reason, proof } = req.body;

    // Validate Base64 format
    if (!proof.startsWith("data:image/")) {
      return res
        .status(400)
        .json({ message: "Invalid proof format. Use Base64." });
    }

    // Convert Base64 to Buffer
    const base64Data = proof.split(",")[1]; // Remove Base64 prefix
    const bufferData = Buffer.from(base64Data, "base64");

    const record = new Record({ studentName, reason, proof: bufferData });
    await record.save();

    res
      .status(201)
      .json({ message: "Record added successfully", recordId: record._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all records (Public)
 */
const getAllRecords = async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });

    // Convert Buffer to Base64, ensuring proof exists
    const formattedRecords = records.map((record) => ({
      _id: record._id,
      studentName: record.studentName,
      reason: record.reason,
      proof: record.proof
        ? `data:image/png;base64,${record.proof.toString("base64")}`
        : null, // Handle missing proof
      createdAt: record.createdAt,
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addRecord, getAllRecords };
