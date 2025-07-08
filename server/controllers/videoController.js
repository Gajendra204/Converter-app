const ffmpegService = require("../services/ffmpegService");
const fileService = require("../services/fileService");

const convertVideo = async (req, res) => {
  const { targetFormat, quality } = req.body;
  try {
    if (!req.file) {
      console.error("No file uploaded for video conversion");
      return res.status(400).send("No file uploaded");
    }
    const outputPath = await ffmpegService.convertVideo(req.file.path, {
      targetFormat,
      quality
    });

    res.download(outputPath, `converted.${targetFormat}`, (err) => {
      if (err) {
        console.error("Error sending converted file:", err);
      }
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Video conversion error:", err);
    if (err.stderr) {
      console.error("ffmpeg stderr:", err.stderr);
    }
    res.status(500).send("Video conversion failed");
  }
  }


const extractAudioFromVideo = async (req, res) => {
  const { targetFormat } = req.body;
  try {
    if (!req.file) {
      console.error("No file uploaded for audio extraction");
      return res.status(400).send("No file uploaded");
    }
    const outputPath = await ffmpegService.extractAudioFromVideo(req.file.path, {
      targetFormat
    });

    res.download(outputPath, `converted.${targetFormat}`, (err) => {
      if (err) {
        console.error("Error sending extracted audio:", err);
      }
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Audio extraction error:", err);
    if (err.stderr) {
      console.error("ffmpeg stderr:", err.stderr);
    }
    res.status(500).send("Audio extraction failed");
  }
  }


const compressVideo = async (req, res) => {
  const { compressionLevel } = req.body;
  try {
    if (!req.file) {
      console.error("No file uploaded for video compression");
      return res.status(400).send("No file uploaded");
    }
    const outputPath = await ffmpegService.compressVideo(req.file.path, {
      compressionLevel
    });

    res.download(outputPath, "compressed.mp4", (err) => {
      if (err) {
        console.error("Error sending compressed video:", err);
      }
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Video compression error:", err);
    if (err.stderr) {
      console.error("ffmpeg stderr:", err.stderr);
    }
    res.status(500).send("Video compression failed");
  }
  }


module.exports = {
  convertVideo,
  extractAudioFromVideo,
  compressVideo
}