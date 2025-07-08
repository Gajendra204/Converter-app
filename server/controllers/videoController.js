const ffmpegService = require("../services/ffmpegService");
const fileService = require("../services/fileService");
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath('./bin/ffmpeg');

async function convertVideo(inputPath, { targetFormat, quality }) {
  const outputPath = inputPath.replace(/\.\w+$/, `.${targetFormat}`);

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath).output(outputPath);

    // Set bitrate based on quality
    switch (quality) {
      case 'high':
        command.videoBitrate('2000k');
        break;
      case 'medium':
        command.videoBitrate('1000k');
        break;
      case 'low':
        command.videoBitrate('500k');
        break;
    }

    // Set codecs based on target format
    switch (targetFormat) {
      case 'avi':
        command
          .videoCodec('mpeg4')          // For AVI video
          .audioCodec('libmp3lame');    // For AVI audio
        break;
      case 'mp4':
        command
          .videoCodec('libx264')
          .audioCodec('aac');
        break;
      case 'mov':
        command
          .videoCodec('libx264')
          .audioCodec('aac');
        break;
      case 'wmv':
        command
          .videoCodec('wmv2')
          .audioCodec('wmav2');
        break;
      case 'mkv':
        command
          .videoCodec('libx264')
          .audioCodec('aac');
        break;
      default:
        return reject(new Error('Unsupported format'));
    }

    command
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

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