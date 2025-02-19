const Application = require("../models/applicationModel");
const { notifyClients } = require("../utils/socketService"); // Use notifyClients from socketService

// Create Application
const createApplication = async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    notifyClients(); // Notify clients after saving
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({
      priority: -1,
      createdAt: 1,
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve/Reject Application (Admin Only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    notifyClients(); // Notify clients after updating status
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
};
