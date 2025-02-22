const Booking = require("../models/bookingModel");
const Facility = require("../models/facilityModel");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Email Setup
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

// 🟢 Book a Facility (with slot and redundancy validation)
const requestBooking = async (req, res) => {
  const { facilityId, date, timeSlot } = req.body;

  try {
    const now = new Date();
    const selectedDate = new Date(date);

    // Prevent booking for past dates
    if (selectedDate < now.setHours(0, 0, 0, 0)) {
      return res
        .status(400)
        .json({ message: "Cannot book a facility for past dates." });
    }
    const facility = await Facility.findById(facilityId);
    if (!facility)
      return res.status(404).json({ message: "Facility not found" });

    const maxCapacity = facility.capacity;

    // Check if user has already booked a facility for the same time slot and date
    const existingUserBooking = await Booking.findOne({
      user: req.user.id,
      date,
      timeSlot,
    });

    if (existingUserBooking) {
      return res.status(400).json({
        message:
          "You have already booked a facility for this time slot on this date.",
      });
    }

    // Count existing bookings for the selected slot
    const existingCount = await Booking.countDocuments({
      facility: facilityId,
      date,
      timeSlot,
    });

    if (existingCount >= maxCapacity) {
      return res.status(400).json({
        message: `Slot full! Only ${maxCapacity} allowed per slot.`,
      });
    }

    // Create booking
    const newBooking = new Booking({
      user: req.user.id,
      facility: facilityId,
      date,
      timeSlot,
      status: "Approved",
    });

    await newBooking.save();

    // Send Email Notification
    const user = await User.findById(req.user.id);
    sendEmail(
      user.email,
      "Booking Confirmed",
      `Your booking for ${facility.name} on ${date} at ${timeSlot} has been confirmed.`
    );

    res.status(201).json({ message: "Booking confirmed", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

// 🟢 Get All Bookings (Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("facility", "name location");
    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};

// 🟢 Get User's Bookings (Fixed for "Unknown Facility" issue)
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate({
      path: "facility",
      select: "name location availability",
    });

    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user bookings", error: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  const { facilityId, date } = req.params;

  try {
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const maxCapacity = facility.capacity;

    // Fetch existing bookings for the given facility and date
    const bookings = await Booking.find({ facility: facilityId, date });

    // Count the number of bookings for each time slot
    const slotsCount = {};
    bookings.forEach((booking) => {
      slotsCount[booking.timeSlot] = (slotsCount[booking.timeSlot] || 0) + 1;
    });

    // Define all possible time slots (customize this based on your requirements)
    const allTimeSlots = [
      "09:00 AM - 12:00 PM",
      "02:00 PM - 04:00 PM",
      "06:00 PM - 08:00 PM",
    ];

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Filter out slots that are full or have already passed
    const availableSlots = [];
    const remainingSlots = {};

    allTimeSlots.forEach((slot) => {
      const [startTime] = slot.split(" - ");
      const slotHour = parseInt(startTime.split(":"));
      const slotMinute = parseInt(startTime.split(":"));
      const slotTimeInMinutes = slotHour * 60 + slotMinute;
      const currentCount = slotsCount[slot] || 0;
      const remainingCapacity = maxCapacity - currentCount;

      if (date === currentDate && slotTimeInMinutes <= currentTime) {
        return;
      }
      if (remainingCapacity > 0) {
        availableSlots.push(slot);
        remainingSlots[slot] = remainingCapacity;
      }
    });

    res.json({ availableSlots, remainingSlots });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching slots", error: error.message });
  }
};

module.exports = {
  requestBooking,
  getAllBookings,
  getUserBookings,
  getAvailableSlots,
};
