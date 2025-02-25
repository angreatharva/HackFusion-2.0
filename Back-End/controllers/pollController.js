// controllers/pollController.js
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
  try {
    const poll = await Poll.findById(req.body.pollId);
    const user = await User.findById(req.user.id);

    // Record vote with gender
    poll.votes.push({
      user: user._id,
      optionIndex: req.body.optionIndex,
      gender: user.gender,
    });

    poll.options[req.body.optionIndex].votes++;
    await poll.save();

    user.votedPolls.push(poll._id);
    await user.save();

    res.json({ message: "Vote recorded successfully" });
  } catch (error) {
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
