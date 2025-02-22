const Application = require("../models/applicationModel");

const escalatePriorities = async () => {
  try {
    const pendingApps = await Application.find({ status: "Pending" });
    for (let app of pendingApps) {
      const hoursPassed = Math.floor(
        (Date.now() - app.createdAt) / (1000 * 60 * 60)
      );
      app.priority = hoursPassed;
      await app.save();
    }
    console.log("Priority escalation completed.");
  } catch (error) {
    console.error("Error escalating priorities:", error);
  }
};

module.exports = escalatePriorities;
