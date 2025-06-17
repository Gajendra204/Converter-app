const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Currently just using middleware, but can add auth routes here if needed
module.exports = router;