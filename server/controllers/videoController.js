const ffmpegService = require("../services/ffmpegService");
const fileService = require("../services/fileService");

const convertVideo = async (req, res) => {
  const { targetFormat, quality } = req.body;
  
  try {
    const outputPath = await ffmpegService.convertVideo(req.file.path, {
      targetFormat,
      quality
    });

    res.download(outputPath, `converted.${targetFormat}`, () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Video conversion error:", err);
    res.status(500).send("Video conversion failed");
  }
};

const extractAudioFromVideo = async (req, res) => {
  const { targetFormat } = req.body;
  
  try {
    const outputPath = await ffmpegService.extractAudioFromVideo(req.file.path, {
      targetFormat
    });

    res.download(outputPath, `converted.${targetFormat}`, () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Audio extraction error:", err);
    res.status(500).send("Audio extraction failed");
  }
};

const compressVideo = async (req, res) => {
  const { compressionLevel } = req.body;
  
  try {
    const outputPath = await ffmpegService.compressVideo(req.file.path, {
      compressionLevel
    });

    res.download(outputPath, "compressed.mp4", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Video compression error:", err);
    res.status(500).send("Video compression failed");
  }
};

module.exports = {
  convertVideo,
  extractAudioFromVideo,
  compressVideo
};