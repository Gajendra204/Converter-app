const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const admin = require("firebase-admin");
const ffmpeg = require("fluent-ffmpeg");
const {
  Credentials,
  ExecutionContext,
  ExportPDF,
  FileRef,
  CreatePDF,
} = require("@adobe/pdfservices-node-sdk");
const serviceAccount = require("./firebase-service-account");

const app = express();
app.use(cors());
const PORT = 5000;

const upload = multer({ dest: "uploads/" });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).send("Unauthorized: No user ID provided");
    }

    // You can verify the user exists in Firebase if needed
    // const user = await admin.auth().getUser(userId);

    // For simplicity, we'll just pass the userId to the next middleware
    req.userId = userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send("Unauthorized: Invalid user");
  }
};

// Adobe PDF Services setup (existing)
const credsJson = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "pdfservices-api-credentials.json"),
    "utf-8"
  )
);

const credentials = Credentials.servicePrincipalCredentialsBuilder()
  .withClientId(credsJson.client_credentials.client_id)
  .withClientSecret(credsJson.client_credentials.client_secret)
  .build();

const executionContext = ExecutionContext.create(credentials);

// Ensure output directory exists
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// ===== ENHANCED DOCUMENT CONVERSIONS =====

// Existing PDF to DOCX
app.post("/convert", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}.docx`
  );

  try {
    const exportOp = ExportPDF.Operation.createNew(
      ExportPDF.SupportedTargetFormats.DOCX
    );
    const input = await FileRef.createFromLocalFile(
      inputPath,
      "application/pdf"
    );
    exportOp.setInput(input);
    const result = await exportOp.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.docx", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Conversion failed");
  }
});

// Existing DOCX to PDF
app.post("/convert-docx-to-pdf", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, "output", `${req.file.filename}.pdf`);

  try {
    const createPdfOperation = CreatePDF.Operation.createNew();
    const input = await FileRef.createFromLocalFile(
      inputPath,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    createPdfOperation.setInput(input);
    const result = await createPdfOperation.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.pdf", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("DOCX to PDF conversion failed");
  }
});

// Existing PDF to PPTX
app.post("/convert-pdf-to-pptx", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}.pptx`
  );

  try {
    const exportPPT = ExportPDF.Operation.createNew(
      ExportPDF.SupportedTargetFormats.PPTX
    );
    const input = await FileRef.createFromLocalFile(
      inputPath,
      "application/pdf"
    );
    exportPPT.setInput(input);
    const result = await exportPPT.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.pptx", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PDF to PPTX conversion failed");
  }
});

// NEW: PDF to Excel
app.post("/convert-pdf-to-xlsx", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}.xlsx`
  );

  try {
    const exportExcel = ExportPDF.Operation.createNew(
      ExportPDF.SupportedTargetFormats.XLSX
    );
    const input = await FileRef.createFromLocalFile(
      inputPath,
      "application/pdf"
    );
    exportExcel.setInput(input);
    const result = await exportExcel.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.xlsx", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PDF to Excel conversion failed");
  }
});

// NEW: PDF to Text
app.post("/convert-pdf-to-txt", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, "output", `${req.file.filename}.txt`);

  try {
    const exportTxt = ExportPDF.Operation.createNew(
      ExportPDF.SupportedTargetFormats.TXT
    );
    const input = await FileRef.createFromLocalFile(
      inputPath,
      "application/pdf"
    );
    exportTxt.setInput(input);
    const result = await exportTxt.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.txt", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PDF to Text conversion failed");
  }
});

// NEW: PDF to RTF
app.post("/convert-pdf-to-rtf", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, "output", `${req.file.filename}.rtf`);

  try {
    const exportRtf = ExportPDF.Operation.createNew(
      ExportPDF.SupportedTargetFormats.RTF
    );
    const input = await FileRef.createFromLocalFile(
      inputPath,
      "application/pdf"
    );
    exportRtf.setInput(input);
    const result = await exportRtf.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.rtf", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PDF to RTF conversion failed");
  }
});

// NEW: PowerPoint to PDF
app.post("/convert-pptx-to-pdf", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, "output", `${req.file.filename}.pdf`);

  try {
    const createPdfOperation = CreatePDF.Operation.createNew();
    const input = await FileRef.createFromLocalFile(
      inputPath,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    createPdfOperation.setInput(input);
    const result = await createPdfOperation.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.pdf", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PowerPoint to PDF conversion failed");
  }
});

// NEW: Excel to PDF
app.post("/convert-xlsx-to-pdf", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, "output", `${req.file.filename}.pdf`);

  try {
    const createPdfOperation = CreatePDF.Operation.createNew();
    const input = await FileRef.createFromLocalFile(
      inputPath,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    createPdfOperation.setInput(input);
    const result = await createPdfOperation.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.pdf", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Excel to PDF conversion failed");
  }
});

// NEW: Text to PDF (using simple text-to-PDF conversion)
app.post("/convert-txt-to-pdf", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, "output", `${req.file.filename}.pdf`);

  try {
    const createPdfOperation = CreatePDF.Operation.createNew();
    const input = await FileRef.createFromLocalFile(inputPath, "text/plain");
    createPdfOperation.setInput(input);
    const result = await createPdfOperation.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.pdf", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Text to PDF conversion failed");
  }
});

// NEW: HTML to PDF
app.post("/convert-html-to-pdf", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, "output", `${req.file.filename}.pdf`);

  try {
    const createPdfOperation = CreatePDF.Operation.createNew();
    const input = await FileRef.createFromLocalFile(inputPath, "text/html");
    createPdfOperation.setInput(input);
    const result = await createPdfOperation.execute(executionContext);
    await result.saveAsFile(outputPath);

    res.download(outputPath, "converted.pdf", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("HTML to PDF conversion failed");
  }
});

// ===== VIDEO CONVERSIONS (Existing) =====
app.post("/convert-video", upload.single("file"), async (req, res) => {
  const { targetFormat, quality } = req.body;
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}.${targetFormat}`
  );

  try {
    let command = ffmpeg(inputPath);

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

    switch (targetFormat) {
      case "mp4":
        command = command.videoCodec("libx264").audioCodec("aac");
        break;
      case "avi":
        command = command.videoCodec("libxvid").audioCodec("mp3");
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
      .on("end", () => {
        res.download(outputPath, `converted.${targetFormat}`, () => {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      })
      .on("error", (err) => {
        console.error("Video conversion error:", err);
        res.status(500).send("Video conversion failed");
      })
      .save(outputPath);
  } catch (err) {
    console.error("Video conversion error:", err);
    res.status(500).send("Video conversion failed");
  }
});

app.post("/convert-video-to-audio", upload.single("file"), async (req, res) => {
  const { targetFormat } = req.body;
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}.${targetFormat}`
  );

  try {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec(targetFormat === "mp3" ? "libmp3lame" : "aac")
      .on("end", () => {
        res.download(outputPath, `converted.${targetFormat}`, () => {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      })
      .on("error", (err) => {
        console.error("Audio extraction error:", err);
        res.status(500).send("Audio extraction failed");
      })
      .save(outputPath);
  } catch (err) {
    console.error("Audio extraction error:", err);
    res.status(500).send("Audio extraction failed");
  }
});

app.post("/compress-video", upload.single("file"), async (req, res) => {
  const { compressionLevel } = req.body;
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}_compressed.mp4`
  );

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
      .on("end", () => {
        res.download(outputPath, "compressed.mp4", () => {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      })
      .on("error", (err) => {
        console.error("Video compression error:", err);
        res.status(500).send("Video compression failed");
      })
      .save(outputPath);
  } catch (err) {
    console.error("Video compression error:", err);
    res.status(500).send("Video compression failed");
  }
});

// ===== AUDIO CONVERSIONS (Existing) =====
app.post("/convert-audio", upload.single("file"), async (req, res) => {
  const { targetFormat, bitrate, sampleRate, channels } = req.body;
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}.${targetFormat}`
  );

  try {
    let command = ffmpeg(inputPath);

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
      .on("end", () => {
        res.download(outputPath, `converted.${targetFormat}`, () => {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      })
      .on("error", (err) => {
        console.error("Audio conversion error:", err);
        res.status(500).send("Audio conversion failed");
      })
      .save(outputPath);
  } catch (err) {
    console.error("Audio conversion error:", err);
    res.status(500).send("Audio conversion failed");
  }
});

app.post("/enhance-audio", upload.single("file"), async (req, res) => {
  const { enhancement, volume, normalize } = req.body;
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}_enhanced.mp3`
  );

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
      .on("end", () => {
        res.download(outputPath, "enhanced.mp3", () => {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      })
      .on("error", (err) => {
        console.error("Audio enhancement error:", err);
        res.status(500).send("Audio enhancement failed");
      })
      .save(outputPath);
  } catch (err) {
    console.error("Audio enhancement error:", err);
    res.status(500).send("Audio enhancement failed");
  }
});

app.post("/trim-audio", upload.single("file"), async (req, res) => {
  const { startTime, duration } = req.body;
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}_trimmed.mp3`
  );

  try {
    let command = ffmpeg(inputPath).audioCodec("libmp3lame");

    if (startTime) {
      command = command.seekInput(startTime);
    }

    if (duration) {
      command = command.duration(duration);
    }

    command
      .on("end", () => {
        res.download(outputPath, "trimmed.mp3", () => {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      })
      .on("error", (err) => {
        console.error("Audio trim error:", err);
        res.status(500).send("Audio trim failed");
      })
      .save(outputPath);
  } catch (err) {
    console.error("Audio trim error:", err);
    res.status(500).send("Audio trim failed");
  }
});

app.post("/merge-audio", upload.array("files", 10), async (req, res) => {
  const inputPaths = req.files.map((file) => file.path);
  const outputPath = path.join(__dirname, "output", `merged_${Date.now()}.mp3`);

  try {
    let command = ffmpeg();

    inputPaths.forEach((path) => {
      command = command.input(path);
    });

    command
      .audioCodec("libmp3lame")
      .on("end", () => {
        res.download(outputPath, "merged.mp3", () => {
          inputPaths.forEach((path) => fs.unlinkSync(path));
          fs.unlinkSync(outputPath);
        });
      })
      .on("error", (err) => {
        console.error("Audio merge error:", err);
        res.status(500).send("Audio merge failed");
      })
      .mergeToFile(outputPath);
  } catch (err) {
    console.error("Audio merge error:", err);
    res.status(500).send("Audio merge failed");
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
