const LeaveRequest = require("../models/LeaveRequestModel");
const Student = require("../models/userModel"); // Ensure this is the correct path
const sendEmail = require("../utils/sendEmail");

const createLeaveRequest = async (req, res) => {
  try {
    const { studentId, leaveDate, returnDate } = req.body;

    if (!studentId || !leaveDate || !returnDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch student details, including parentEmail
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const parentEmail = student.studentDetails?.parentEmail;
    if (!parentEmail) {
      return res
        .status(400)
        .json({ message: "Parent email not found for the student" });
    }

    // Create the leave request with status 'Confirmed'
    const newLeaveRequest = new LeaveRequest({
      studentId,
      leaveDate,
      returnDate,
      status: "Confirmed", // Set status to Confirmed
    });

    await newLeaveRequest.save();

    // Send email notification to the parent
    const emailSubject = `Leave Request Confirmation for ${student.name}`;
    const emailText = `Dear Parent,\n\nYour child, ${
      student.name
    }, has requested leave from ${new Date(
      leaveDate
    ).toDateString()} to ${new Date(
      returnDate
    ).toDateString()}. This leave has been confirmed.\n\nBest regards,\nSchool Administration`;

    await sendEmail({
      to: parentEmail,
      subject: emailSubject,
      text: emailText,
    });

    res.status(201).json({
      message:
        "Leave request created and confirmed. Notification sent to parent.",
      leaveRequest: newLeaveRequest,
    });
  } catch (error) {
    console.error("Error creating leave request:", error);
    res.status(500).json({ message: "Failed to create leave request." });
  }
};

module.exports = { createLeaveRequest };
