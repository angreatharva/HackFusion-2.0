// controllers/healthReportController.js
const HealthReport = require("../models/HealthReportModel");

const createHealthReport = async (req, res) => {
  try {
    const { patient, diagnosis, prescription } = req.body;

    if (!patient || !diagnosis) {
      return res
        .status(400)
        .json({ message: "Patient and diagnosis are required." });
    }

    const newReport = await HealthReport.create({
      patient,
      diagnosis,
      prescription,
      createdBy: req.user.id,
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating health report:", error);
    res.status(500).json({ message: "Failed to create health report." });
  }
};

module.exports = { createHealthReport };
