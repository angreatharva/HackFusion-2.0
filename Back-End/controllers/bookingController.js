const Booking = require("../models/bookingModel");
const Facility = require("../models/facilityModel");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
require("dotenv").config();
// const twilio = require("twilio");

//node emailer setup
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

// 🟢 Student Requests a Booking
const requestBooking = async (req, res) => {
  const { facilityId, date, timeSlot } = req.body;

  try {
    const facility = await Facility.findById(facilityId);
    if (!facility)
      return res.status(404).json({ message: "Facility not found" });

    const existingBooking = await Booking.findOne({
      facility: facilityId,
      date,
      timeSlot,
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Time slot already booked. Choose another slot." });
    }

    const newBooking = new Booking({
      user: req.user.id,
      facility: facilityId,
      date,
      timeSlot,
      status: "Pending",
    });

    await newBooking.save();
    // Get User Details
    const user = await User.findById(req.user.id);

    // Send Email & SMS Notification to User
    console.log(user.email);
    sendEmail(
      user.email,
      "Booking Request Received",
      `Your booking request for ${facility.name} on ${date} at ${timeSlot} is pending approval.`
    );
    res
      .status(201)
      .json({ message: "Booking request submitted", booking: newBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to process booking", error: error.message });
  }
};

// 🟢 Admin Approves or Rejects a Booking
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Invalid status. Use 'Approved' or 'Rejected'." });
  }

  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("user", "email")
      .populate("facility", "name");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    await Facility.findByIdAndUpdate(booking.facility, {
      availability: status !== "Approved",
    });

    // Send Email & SMS Notification to User
    sendEmail(
      booking.user.email,
      `Booking ${status}`,
      `Your booking for ${booking.facility.name} on ${booking.date} at ${
        booking.timeSlot
      } has been ${status.toLowerCase()}.`
    );

    res.json({ message: `Booking ${status.toLowerCase()}`, booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking status", error: error.message });
  }
};

// 🟢 Get All Bookings (Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Pending" })
      .populate("user", "name email")
      .populate("facility", "name location availability");

    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};

// 🟢 Get User's Bookings (Student/Faculty)
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "facility",
      "name location"
    );

    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user bookings", error: error.message });
  }
};

module.exports = {
  requestBooking,
  updateBookingStatus,
  getAllBookings,
  getUserBookings,
};
