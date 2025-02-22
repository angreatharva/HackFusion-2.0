// models/commentModel.js
const { google } = require("googleapis");
const { API_KEY, DISCOVERY_URL } = require("../config/config");

exports.analyzeComment = async (text) => {
  try {
    const client = await google.discoverAPI(DISCOVERY_URL);
    const analyzeRequest = {
      comment: { text },
      requestedAttributes: { TOXICITY: {} },
    };

    const response = await client.comments.analyze({
      key: API_KEY,
      resource: analyzeRequest,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
