const Record = require("../models/recordModel");

/**
 * Add a new record (Admin Only)
 */
const addRecord = async (req, res) => {
  if (req.user.role !== "invigilator")
    return res.status(403).json({ message: "Access denied" });

  try {
    const {
      ucid,
      studentName,
      reason,
      dateOfCheating,
      examination,

      semester,
      proof,

      subjectName,
    } = req.body;

    if (!proof.startsWith("data:image/")) {
      return res
        .status(400)
        .json({ message: "Invalid proof format. Use Base64." });
    }

    const base64Data = proof.split(",")[1];
    const bufferData = Buffer.from(base64Data, "base64");

    const record = new Record({
      ucid,
      studentName,
      reason,
      dateOfCheating,
      examination,
      semester,
      proof: bufferData,

      subjectName,
    });
    await record.save();

    res
      .status(201)
      .json({ message: "Record added successfully", recordId: record._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllRecords = async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });

    const formattedRecords = records.map((record) => ({
      _id: record._id,
      ucid: record.ucid,
      studentName: record.studentName,
      reason: record.reason,
      proof: record.proof
        ? `data:image/png;base64,${record.proof.toString("base64")}`
        : null,
      dateOfCheating: record.dateOfCheating,
      examination: record.examination,
      semester: record.semester,
      subjectName: record.subjectName,
      createdAt: record.createdAt,
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addRecord, getAllRecords };
