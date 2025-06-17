const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const videoController = require("../controllers/videoController");

// Video conversion routes
router.post("/convert-video", uploadMiddleware.single("file"), videoController.convertVideo);
router.post("/convert-video-to-audio", uploadMiddleware.single("file"), videoController.extractAudioFromVideo);
router.post("/compress-video", uploadMiddleware.single("file"), videoController.compressVideo);

module.exports = router;