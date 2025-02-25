// controllers/complaintController.js
const ComplaintModel = require("../models/complaintModel");
const CommentModel = require("../models/commentModel");

exports.submitComplaint = async (req, res) => {
  const { title, description, category, anonymous, name, role } = req.body;

  if (
    !title ||
    !description ||
    !category ||
    anonymous === undefined ||
    !name ||
    !role
  ) {
    return res.status(400).json({
      message:
        "Title, description, category, anonymous flag, name, and role are required.",
    });
  }

  try {
    const titleResult = await CommentModel.analyzeComment(title);
    const descriptionResult = await CommentModel.analyzeComment(description);

    const titleScore =
      titleResult?.attributeScores?.TOXICITY?.summaryScore?.value || 0;
    const descriptionScore =
      descriptionResult?.attributeScores?.TOXICITY?.summaryScore?.value || 0;

    const toxicityReport = {
      titleScore: (titleScore * 100).toFixed(2) + "%",
      descriptionScore: (descriptionScore * 100).toFixed(2) + "%",
    };

    // If toxicity is detected, return 201 with an appropriate message
    if (titleScore > 0.6 || descriptionScore > 0.6) {
      return res.status(201).json({
        success: false,
        message: "Inappropriate content detected. Complaint cannot be posted.",
        toxicityReport,
      });
    }

    const complaintData = {
      title,
      description,
      category,
      anonymous,
      name,
      role,
    };
    const newComplaint = new ComplaintModel(complaintData);
    await newComplaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint: newComplaint,
      toxicityReport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit complaint.",
      error: error.message,
    });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await ComplaintModel.find();

    const formattedComplaints = complaints.map((complaint) => {
      const complaintData = complaint.toObject();

      return complaintData;
    });

    res.status(200).json({ complaints: formattedComplaints });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch complaints.", error: error.message });
  }
};
// controllers/complaintController.js
exports.incrementApproval = async (req, res) => {
  const { complaintId } = req.params;

  try {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Increment approval count
    complaint.approval_count += 1;

    // Reveal name if approval count exceeds 5
    if (complaint.approval_count > 5) {
      complaint.anonymous = false;
    }

    await complaint.save();

    res.status(200).json({
      message: "Approval count incremented successfully.",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to increment approval count.",
      error: error.message,
    });
  }
};
exports.voteComplaint = async (req, res) => {
  const { complaintId, name, role } = req.body;

  if (!complaintId || !name || !role) {
    return res
      .status(400)
      .json({ message: "Complaint ID, name, and role are required." });
  }

  try {
    const complaint = await ComplaintModel.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Check if user already voted
    const alreadyVoted = complaint.votedBy.some(
      (voter) => voter.name === name && voter.role === role
    );

    if (alreadyVoted) {
      return res
        .status(400)
        .json({ message: "You have already voted for this complaint." });
    }

    // Add vote
    complaint.approval_count += 1;
    complaint.votedBy.push({ name, role });

    await complaint.save();

    res.status(200).json({
      message: "Vote submitted successfully.",
      approval_count: complaint.approval_count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit vote.",
      error: error.message,
    });
  }
};
