// src/utils/aiContentFilter.js
const OpenAI = require("openai");

class AIContentFilter {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.cache = new Map();
    this.moderationCategories = [
      "hate",
      "hate/threatening",
      "harassment",
      "harassment/threatening",
      "self-harm",
      "self-harm/intent",
      "self-harm/instructions",
      "sexual",
      "sexual/minors",
      "violence",
      "violence/graphic",
    ];

    // Add fallback moderation rules
    this.fallbackRules = {
      profanityList: ["badword1", "badword2"], // Add your list of inappropriate words
      maxLength: 1000, // Maximum content length
      minLength: 10, // Minimum content length
    };
  }

  async analyzeContent(content) {
    try {
      // Check cache first
      const cachedResult = this.cache.get(content);
      if (cachedResult) {
        return cachedResult;
      }

      // Try OpenAI moderation first
      try {
        const moderationResult = await this.checkModeration(content);
        this.cache.set(content, moderationResult);
        return moderationResult;
      } catch (openaiError) {
        console.warn(
          "OpenAI moderation failed, using fallback:",
          openaiError.message
        );

        // Use fallback moderation if OpenAI fails
        return this.fallbackModeration(content);
      }
    } catch (error) {
      console.error("Content filtering error:", error);
      // In case of complete failure, allow the content but log the error
      return {
        isAppropriate: true,
        flags: [],
        details: "Moderation service degraded - content accepted with warning",
        confidenceScore: 0,
        warning: "Content moderation services are currently limited",
      };
    }
  }

  fallbackModeration(content) {
    const flags = [];
    let isAppropriate = true;
    const details = [];

    // Length checks
    if (content.length > this.fallbackRules.maxLength) {
      flags.push("content_too_long");
      details.push(
        `Content exceeds ${this.fallbackRules.maxLength} characters`
      );
      isAppropriate = false;
    }

    if (content.length < this.fallbackRules.minLength) {
      flags.push("content_too_short");
      details.push(`Content below ${this.fallbackRules.minLength} characters`);
      isAppropriate = false;
    }

    // Basic profanity check
    const containsProfanity = this.fallbackRules.profanityList.some((word) =>
      content.toLowerCase().includes(word.toLowerCase())
    );

    if (containsProfanity) {
      flags.push("inappropriate_language");
      details.push("Content contains inappropriate language");
      isAppropriate = false;
    }

    return {
      isAppropriate,
      flags,
      details: details.join("; "),
      confidenceScore: 0.5,
      source: "fallback_moderation",
    };
  }

  async checkModeration(content) {
    try {
      const moderationResponse = await this.openai.moderations.create({
        input: content,
      });

      const result = moderationResponse.results[0];
      const flags = [];

      // Check each category for flags
      this.moderationCategories.forEach((category) => {
        if (result.categories[category]) {
          flags.push(category);
        }
      });

      return {
        isAppropriate: !result.flagged,
        flags,
        scores: result.category_scores,
        confidenceScore:
          flags.length > 0
            ? Math.max(...Object.values(result.category_scores))
            : 0,
      };
    } catch (error) {
      throw new Error(`Moderation API error: ${error.message}`);
    }
  }

  async analyzeWithGPT(content) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              You are a content moderation assistant. Analyze the following content for:
              1. Subtle harassment or bullying
              2. Potential threats or harmful content
              3. Sensitive personal information
              4. Spam or misleading content
              5. Inappropriate language or context
              
              Respond with a JSON object containing:
              {
                "isAppropriate": boolean,
                "flags": string[],
                "reason": string,
                "confidenceScore": number (0-1),
                "suggestedAction": string
              }
            `,
          },
          {
            role: "user",
            content: content,
          },
        ],
        temperature: 0,
        max_tokens: 500,
      });

      const analysis = JSON.parse(completion.choices[0].message.content);

      return {
        isAppropriate: analysis.isAppropriate,
        flags: analysis.flags,
        details: {
          reason: analysis.reason,
          suggestedAction: analysis.suggestedAction,
        },
        confidenceScore: analysis.confidenceScore,
      };
    } catch (error) {
      throw new Error(`GPT analysis error: ${error.message}`);
    }
  }
}

// Export singleton instance
const aiContentFilter = new AIContentFilter();
module.exports = aiContentFilter;
