// controllers/commentController.js
const CommentModel = require("../models/commentModel");

exports.analyze = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required." });
  }

  try {
    const result = await CommentModel.analyzeComment(text);
    const toxicityScore =
      result?.attributeScores?.TOXICITY?.summaryScore?.value;

    if (toxicityScore !== undefined) {
      const percentage = (toxicityScore * 100).toFixed(2); // Convert to percentage
      return res.status(200).json({ toxicity: `${percentage}%` });
    }

    res.status(404).json({ message: "Toxicity score not found." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to analyze comment.", error: error.message });
  }
};
