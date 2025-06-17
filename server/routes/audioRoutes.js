const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const audioController = require("../controllers/audioController");

// Audio conversion routes
router.post("/convert-audio", uploadMiddleware.single("file"), audioController.convertAudio);
router.post("/enhance-audio", uploadMiddleware.single("file"), audioController.enhanceAudio);
router.post("/trim-audio", uploadMiddleware.single("file"), audioController.trimAudio);
router.post("/merge-audio", uploadMiddleware.array("files", 10), audioController.mergeAudio);

module.exports = router;