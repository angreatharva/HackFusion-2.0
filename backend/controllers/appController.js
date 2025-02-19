const Application = require("../models/Application");

// Create an Application
const createApplication = async (req, res) => {
  try {
    const { title, description } = req.body;

    const application = new Application({
      title,
      description,
      applicant: req.user.id, // Extracted from JWT
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Error submitting application", error });
  }
};

// Get All Applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("applicant", "name email");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
};

module.exports = { createApplication, getApplications };
