// src/middleware/contentFilterMiddleware.js
const contentFilterMiddleware = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const [titleAnalysis, descriptionAnalysis] = await Promise.all([
      aiContentFilter.analyzeContent(title),
      aiContentFilter.analyzeContent(description),
    ]);

    req.contentAnalysis = {
      title: titleAnalysis,
      description: descriptionAnalysis,
      isAppropriate:
        titleAnalysis.isAppropriate && descriptionAnalysis.isAppropriate,
    };

    // Handle fallback warning cases
    if (titleAnalysis.warning || descriptionAnalysis.warning) {
      req.contentAnalysis.warning =
        "Content moderation running in degraded mode";
    }

    // Only block if content is explicitly inappropriate
    if (!req.contentAnalysis.isAppropriate) {
      return res.status(400).json({
        success: false,
        message: "Content moderation failed",
        details: {
          title:
            titleAnalysis.flags.length > 0
              ? {
                  flags: titleAnalysis.flags,
                  details: titleAnalysis.details,
                }
              : null,
          description:
            descriptionAnalysis.flags.length > 0
              ? {
                  flags: descriptionAnalysis.flags,
                  details: descriptionAnalysis.details,
                }
              : null,
        },
      });
    }

    next();
  } catch (error) {
    console.error("Content filter middleware error:", error);
    // Allow the request to proceed in case of complete failure
    req.contentAnalysis = {
      isAppropriate: true,
      warning: "Content moderation unavailable",
    };
    next();
  }
};

module.exports = contentFilterMiddleware;
