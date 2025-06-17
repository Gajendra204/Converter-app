const ffmpegService = require("../services/ffmpegService");
const fileService = require("../services/fileService");

const convertAudio = async (req, res) => {
  const { targetFormat, bitrate, sampleRate, channels } = req.body;
  
  try {
    const outputPath = await ffmpegService.convertAudio(req.file.path, {
      targetFormat,
      bitrate,
      sampleRate,
      channels
    });

    res.download(outputPath, `converted.${targetFormat}`, () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Audio conversion error:", err);
    res.status(500).send("Audio conversion failed");
  }
};

const enhanceAudio = async (req, res) => {
  const { enhancement, volume, normalize } = req.body;
  
  try {
    const outputPath = await ffmpegService.enhanceAudio(req.file.path, {
      enhancement,
      volume,
      normalize
    });

    res.download(outputPath, "enhanced.mp3", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Audio enhancement error:", err);
    res.status(500).send("Audio enhancement failed");
  }
};

const trimAudio = async (req, res) => {
  const { startTime, duration } = req.body;
  
  try {
    const outputPath = await ffmpegService.trimAudio(req.file.path, {
      startTime,
      duration
    });

    res.download(outputPath, "trimmed.mp3", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Audio trim error:", err);
    res.status(500).send("Audio trim failed");
  }
};

const mergeAudio = async (req, res) => {
  try {
    const inputPaths = req.files.map(file => file.path);
    const outputFilename = `merged_${Date.now()}.mp3`;
    
    const outputPath = await ffmpegService.mergeAudio(inputPaths, outputFilename);

    res.download(outputPath, "merged.mp3", () => {
      fileService.cleanupFiles([...inputPaths, outputPath]);
    });
  } catch (err) {
    console.error("Audio merge error:", err);
    res.status(500).send("Audio merge failed");
  }
};

module.exports = {
  convertAudio,
  enhanceAudio,
  trimAudio,
  mergeAudio
};