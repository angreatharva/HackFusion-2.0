const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

module.exports = (io) => {
  // ✅ Get all applications (Sorted by priority & createdAt)
  router.get("/", async (req, res) => {
    try {
      const applications = await Application.find().sort({ priority: -1, createdAt: 1 });
      res.json(applications);
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Create a new application
  router.post("/", async (req, res) => {
    try {
      const newApplication = new Application(req.body);
      await newApplication.save();
      
      io.emit("applicationsUpdated"); // ✅ Notify clients
      res.status(201).json(newApplication);
    } catch (error) {
      console.error("❌ Error creating application:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Delete an application (Updated)
  router.delete("/:id", async (req, res) => {
    try {
      const applicationId = req.params.id;

      if (!applicationId) {
        return res.status(400).json({ error: "Application ID is required." });
      }

      // Check if the application exists before deleting
      const applicationToDelete = await Application.findById(applicationId);

      if (!applicationToDelete) {
        return res.status(404).json({ error: "Application not found." });
      }

      // Delete the application
      await Application.findByIdAndDelete(applicationId);
      
      io.emit("applicationsUpdated"); // ✅ Notify clients
      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting application:", error);
      // Log the error to debug any issues with the payload (e.g., invalid IDs)
      res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Update an application
  router.put("/:id", async (req, res) => {
    try {
      const updatedApplication = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });

      io.emit("applicationsUpdated"); // ✅ Notify clients
      res.json(updatedApplication);
    } catch (error) {
      console.error("❌ Error updating application:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Approve or Reject an Application
  router.patch("/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const updatedApplication = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      io.emit("applicationsUpdated"); // ✅ Notify clients
      res.json(updatedApplication);
    } catch (error) {
      console.error("❌ Error updating application status:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Escalate Unattended Applications (Increase Priority)
  router.patch("/escalate", async (req, res) => {
    try {
      const escalatedApplications = await Application.updateMany(
        { status: "Pending" },
        { $inc: { priority: 1 } } // ✅ Increase priority value
      );

      io.emit("applicationsUpdated"); // ✅ Notify clients
      res.json({ message: "Pending applications escalated", escalatedApplications });
    } catch (error) {
      console.error("❌ Error escalating applications:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};
