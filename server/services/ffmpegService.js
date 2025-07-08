const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

// Ensure output directory exists
const outputDir = path.join(__dirname, "../../output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const convertVideo = async (inputPath, options) => {
  const { targetFormat, quality } = options;
  const outputFilename = `${path.basename(
    inputPath,
    path.extname(inputPath)
  )}.${targetFormat}`;
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    try {
      let command = ffmpeg(inputPath);

      // Apply quality settings
      switch (quality) {
        case "high":
          command = command.videoBitrate("2000k").audioBitrate("192k");
          break;
        case "medium":
          command = command.videoBitrate("1000k").audioBitrate("128k");
          break;
        case "low":
          command = command.videoBitrate("500k").audioBitrate("96k");
          break;
        default:
          command = command.videoBitrate("1000k").audioBitrate("128k");
      }

      // Apply format-specific settings
      switch (targetFormat) {
        case "mp4":
          command = command.videoCodec("libx264").audioCodec("aac");
          break;
        case "mov":
          command = command.videoCodec("libx264").audioCodec("aac");
          break;
        case "wmv":
          command = command.videoCodec("wmv2").audioCodec("wmav2");
          break;
        case "mkv":
          command = command.videoCodec("libx264").audioCodec("aac");
          break;
      }

      command
        .on("end", () => resolve(outputPath))
        .on("error", (err) => reject(err))
        .save(outputPath);
    } catch (err) {
      reject(err);
    }
  });
};

const extractAudioFromVideo = async (inputPath, options) => {
  const { targetFormat } = options;
  const outputFilename = `${path.basename(
    inputPath,
    path.extname(inputPath)
  )}.${targetFormat}`;
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    try {
      ffmpeg(inputPath)
        .noVideo()
        .audioCodec(targetFormat === "mp3" ? "libmp3lame" : "aac")
        .on("end", () => resolve(outputPath))
        .on("error", (err) => reject(err))
        .save(outputPath);
    } catch (err) {
      reject(err);
    }
  });
};

const compressVideo = async (inputPath, options) => {
  const { compressionLevel } = options;
  const outputFilename = `${path.basename(
    inputPath,
    path.extname(inputPath)
  )}_compressed.mp4`;
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    try {
      let crf = 23;
      switch (compressionLevel) {
        case "light":
          crf = 18;
          break;
        case "medium":
          crf = 23;
          break;
        case "heavy":
          crf = 28;
          break;
      }

      ffmpeg(inputPath)
        .videoCodec("libx264")
        .audioCodec("aac")
        .addOption("-crf", crf)
        .on("end", () => resolve(outputPath))
        .on("error", (err) => reject(err))
        .save(outputPath);
    } catch (err) {
      reject(err);
    }
  });
};

const convertAudio = async (inputPath, options) => {
  const { targetFormat, bitrate, sampleRate, channels } = options;
  const outputFilename = `${path.basename(
    inputPath,
    path.extname(inputPath)
  )}.${targetFormat}`;
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    try {
      let command = ffmpeg(inputPath);

      // Apply format-specific settings
      switch (targetFormat) {
        case "mp3":
          command = command.audioCodec("libmp3lame");
          break;
        case "wav":
          command = command.audioCodec("pcm_s16le");
          break;
        case "flac":
          command = command.audioCodec("flac");
          break;
        case "aac":
          command = command.audioCodec("aac");
          break;
        case "ogg":
          command = command.audioCodec("libvorbis");
          break;
        case "m4a":
          command = command.audioCodec("aac");
          break;
        case "wma":
          command = command.audioCodec("wmav2");
          break;
      }

      // Apply additional settings
      if (bitrate && bitrate !== "auto") {
        command = command.audioBitrate(bitrate);
      }

      if (sampleRate && sampleRate !== "auto") {
        command = command.audioFrequency(Number.parseInt(sampleRate));
      }

      if (channels && channels !== "auto") {
        command = command.audioChannels(Number.parseInt(channels));
      }

      command
        .on("end", () => resolve(outputPath))
        .on("error", (err) => reject(err))
        .save(outputPath);
    } catch (err) {
      reject(err);
    }
  });
};

const enhanceAudio = async (inputPath, options) => {
  const { enhancement, volume, normalize } = options;
  const outputFilename = `${path.basename(
    inputPath,
    path.extname(inputPath)
  )}_enhanced.mp3`;
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    try {
      let command = ffmpeg(inputPath).audioCodec("libmp3lame");

      if (volume && volume !== "0") {
        const volumeFilter = `volume=${volume}dB`;
        command = command.audioFilters(volumeFilter);
      }

      if (normalize === "true") {
        command = command.audioFilters("loudnorm");
      }

      if (enhancement === "noise-reduction") {
        command = command.audioFilters("afftdn");
      }

      if (enhancement === "bass-boost") {
        command = command.audioFilters("bass=g=5");
      }

      if (enhancement === "treble-boost") {
        command = command.audioFilters("treble=g=5");
      }

      command
        .on("end", () => resolve(outputPath))
        .on("error", (err) => reject(err))
        .save(outputPath);
    } catch (err) {
      reject(err);
    }
  });
};

const trimAudio = async (inputPath, options) => {
  const { startTime, duration } = options;
  const outputFilename = `${path.basename(
    inputPath,
    path.extname(inputPath)
  )}_trimmed.mp3`;
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    try {
      let command = ffmpeg(inputPath).audioCodec("libmp3lame");

      if (startTime) {
        command = command.seekInput(startTime);
      }

      if (duration) {
        command = command.duration(duration);
      }

      command
        .on("end", () => resolve(outputPath))
        .on("error", (err) => reject(err))
        .save(outputPath);
    } catch (err) {
      reject(err);
    }
  });
};

const mergeAudio = async (inputPaths, outputFilename) => {
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    try {
      let command = ffmpeg();

      inputPaths.forEach((path) => {
        command = command.input(path);
      });

      command
        .audioCodec("libmp3lame")
        .on("end", () => resolve(outputPath))
        .on("error", (err) => reject(err))
        .mergeToFile(outputPath);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  convertVideo,
  extractAudioFromVideo,
  compressVideo,
  convertAudio,
  enhanceAudio,
  trimAudio,
  mergeAudio,
};
