// controllers/pollController.js
const mongoose = require("mongoose"); // Add this line at the top
const Poll = require("../models/pollModel");
const User = require("../models/userModel");

// Admin creates a poll
const createPoll = async (req, res) => {
  try {
    const { question, options, duration } = req.body;

    if (!duration || duration <= 0) {
      return res.status(400).json({ message: "Invalid poll duration." });
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + duration); // Add duration in minutes

    const newPoll = new Poll({
      question,
      options,
      createdBy: req.user.id,
      duration,
      expiresAt,
    });

    await newPoll.save();
    res
      .status(201)
      .json({ message: "Poll created successfully.", poll: newPoll });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get all polls (for students to vote)
const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate("createdBy", "name");
    res.json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Vote for a poll
const vote = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const poll = await Poll.findById(req.body.pollId).session(session);
    const user = await User.findById(req.user.id).session(session);

    // Check if user already voted
    const existingVote = poll.votes.find((v) => v.user.equals(user._id));
    if (existingVote) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "You have already voted in this poll" });
    }

    // Check if poll is active
    if (!poll.isActive) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "This poll has expired" });
    }

    // Record vote
    poll.votes.push({
      user: user._id,
      optionIndex: req.body.optionIndex,
      gender: user.gender,
    });

    poll.options[req.body.optionIndex].votes++;

    // Update user's voted polls
    if (user.votedPolls.includes(poll._id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "You have already voted" });
    }
    user.votedPolls.push(poll._id);

    await poll.save({ session });
    await user.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Vote recorded successfully",
      votedOptionIndex: req.body.optionIndex,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Error recording vote" });
  }
};
const getPollStats = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId).populate(
      "votes.user",
      "gender"
    );

    // Count votes by gender
    const stats = {
      male: 0,
      female: 0,
      other: 0,
      total: 0,
    };

    poll.votes.forEach((vote) => {
      if (vote.gender === "male") stats.male++;
      else if (vote.gender === "female") stats.female++;
      else stats.other++;
      stats.total++;
    });

    // Get total eligible users
    const eligibleUsers = await User.find(
      poll.targetRole === "all" ? {} : { role: poll.targetRole }
    );

    const eligibleStats = {
      male: eligibleUsers.filter((u) => u.gender === "male").length,
      female: eligibleUsers.filter((u) => u.gender === "female").length,
      other: eligibleUsers.filter((u) => u.gender === "other").length,
      total: eligibleUsers.length,
    };

    res.json({
      voted: stats,
      eligible: eligibleStats,
      nonVoters: {
        male: eligibleStats.male - stats.male,
        female: eligibleStats.female - stats.female,
        other: eligibleStats.other - stats.other,
        total: eligibleStats.total - stats.total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const checkPollExpiry = async () => {
  const polls = await Poll.find({ isActive: true });
  const now = new Date();

  polls.forEach(async (poll) => {
    if (poll.expiresAt <= now) {
      poll.isActive = false;
      await poll.save();
      console.log(`Poll "${poll.question}" has expired.`);
    }
  });
};
// Run the check every minute
setInterval(checkPollExpiry, 60 * 1000);

module.exports = { createPoll, getPolls, vote };
