const Application = require("../models/applicationModel");
const jwt = require("jsonwebtoken");

// 📌 Middleware to verify and extract user data from token
const verifyToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header missing or invalid format.");
      return null;
    }
    return jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }
};

// 📌 Submit a new application (Requires authentication)
exports.submitApplication = async (req, res) => {
  try {
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized. Valid token required." });

    const {studentName, email,contactNo,type, eventName, requestedBudget, justification, supportingDoc } = req.body;

    // Validate required fields
    if (!type || !eventName || !requestedBudget || !justification) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Ensure extracted user details exist
    // const studentName = user.name || "Unknown User";
    // const email = user.email || "noemail@example.com";
    // const contactNo = user.contactNo || "0000000000";

    const newApplication = new Application({
      studentName,
      email,
      contactNo,
      type,
      eventName,
      requestedBudget: Number(requestedBudget), // Ensure number conversion
      justification,
      supportingDoc: supportingDoc || "", // Base64 string or empty
      priority: 1, // Default priority
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!", application: newApplication });
  } catch (error) {
    console.error("Error submitting application:", error.message);
    res.status(500).json({ error: "Internal Server Error. Failed to submit application." });
  }
};

// 📌 Get all applications (Requires authentication)
exports.getApplications = async (req, res) => {
  try {
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized. Valid token required." });

    const applications = await Application.find().sort({ submittedAt: -1 }); // Latest applications first
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error.message);
    res.status(500).json({ error: "Internal Server Error. Failed to fetch applications." });
  }
};

// 📌 Update application status (Approve/Reject) (Requires Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const user = verifyToken(req);
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update." });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.status(200).json({ message: "Application status updated successfully!", application: updatedApplication });
  } catch (error) {
    console.error("Error updating application status:", error.message);
    res.status(500).json({ error: "Internal Server Error. Failed to update status." });
  }
};
