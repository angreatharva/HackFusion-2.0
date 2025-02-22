const Record = require("../models/recordModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Add a new record (Admin Only)
 */
// send email
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,

  auth: {
    user: "teambraten@gmail.com",
    pass: "mruiybbmowgvvode",
  },
});

// Send Email Notification
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: text,
    });
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// add record
const addRecord = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });

  try {
    const {
      ucid,
      studentName,
      email,
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
      email,
      reason,
      dateOfCheating,
      examination,
      semester,
      proof: bufferData,

      subjectName,
    });
    await record.save();
    // Send email notification to student
    const emailText = `Dear ${studentName},\n\n
      You have been reported for cheating in the ${examination} examination.\n
      - Subject: ${subjectName}\n
      - Semester: ${semester}\n
      - Reason: ${reason}\n
      - Date: ${dateOfCheating}\n\n
      If you believe this is a mistake, please contact the academic office.\n
      Regards,\nAcademic Integrity Committee`;

    await sendEmail(email, "Cheating Record Notification", emailText);

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
