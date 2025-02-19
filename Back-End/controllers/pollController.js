// controllers/pollController.js
const Poll = require("../models/pollModel");
const User = require("../models/userModel");

// Admin creates a poll
const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const newPoll = new Poll({
      question,
      options,
      createdBy: req.user.id,
    });
    await newPoll.save();
    res.status(201).json({ message: "Poll created successfully." });
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
  const { pollId, optionIndex } = req.body;

  try {
    if (!pollId || optionIndex === undefined) {
      return res
        .status(400)
        .json({ message: "Poll ID or Option index is missing." });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found." });

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.votedPolls.includes(pollId)) {
      return res
        .status(400)
        .json({ message: "You have already voted on this poll." });
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index." });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    user.votedPolls.push(pollId);
    await user.save();

    res.json({ message: "Vote successful!" });
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { createPoll, getPolls, vote };
