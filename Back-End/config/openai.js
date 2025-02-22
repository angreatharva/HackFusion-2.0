import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function moderateText(text, retries = 3) {
  try {
    const moderation = await openai.moderations.create({ input: text });
    return moderation.results;
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn(
        `Rate limit hit. Retrying in 10 seconds... (${retries} attempts left)`
      );
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
      return moderateText(text, retries - 1);
    }

    console.error("OpenAI Moderation API Error:", error);
    throw error;
  }
}

export { moderateText };
