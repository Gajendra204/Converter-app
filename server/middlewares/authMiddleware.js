const admin = require("../config/firebaseConfig");

const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).send("Unauthorized: No user ID provided");
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send("Unauthorized: Invalid user");
  }
};

module.exports = {
  authenticateUser
};