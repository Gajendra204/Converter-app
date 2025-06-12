const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const {
  Credentials,
  ExecutionContext,
  ExportPDF,
  FileRef,
  CreatePDF,
  ExportPDFToImagesJob,
  ExportPDFToImagesParams,
  ExportPDFToImagesTargetFormat,
  ExportPDFToImagesOutputType,
} = require("@adobe/pdfservices-node-sdk");

const app = express();
app.use(cors());
const PORT = 5000;

app.use(cors());
const upload = multer({ dest: "uploads/" });

// ✅ Make sure this is outside and ABOVE your routes
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

app.post("/convert-docx-to-pdf", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, "output", `${req.file.filename}.pdf`);

  try {
    const createPdfOperation = CreatePDF.Operation.createNew();

    // Set the DOCX file as input
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

app.post("/convert-pdf-to-pptx", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(
    __dirname,
    "output",
    `${req.file.filename}.pptx`
  );

  try {
    // ✅ Create ExportPDF operation for PowerPoint
    const exportPPT = ExportPDF.Operation.createNew(
      ExportPDF.SupportedTargetFormats.PPTX
    );

    // ✅ Load input PDF file
    const input = await FileRef.createFromLocalFile(
      inputPath,
      "application/pdf"
    );
    exportPPT.setInput(input);

    // ✅ Execute conversion
    const result = await exportPPT.execute(executionContext);
    await result.saveAsFile(outputPath);

    // ✅ Send the converted file
    res.download(outputPath, "converted.pptx", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PDF to PPTX conversion failed");
  }
});

// app.post("/convert-pdf-to-xlsx", upload.single("file"), async (req, res) => {
//   const input = await FileRef.createFromLocalFile(
//     req.file.path,
//     "application/pdf"
//   );
//   const exportOp = ExportPDF.Operation.createNew(
//     ExportPDF.SupportedTargetFormats.XLSX
//   ).setInput(input);

//   try {
//     const result = await exportOp.execute(executionContext);
//     const out = path.join(__dirname, "output", `${req.file.filename}.xlsx`);
//     await result.saveAsFile(out);
//     res.download(out, "converted.xlsx", cleanup(req.file.path, out));
//   } catch (e) {
//     errorHandler(e, res);
//   }
// });

// Helpers for cleanup and error responses
function cleanup(...files) {
  return () => files.forEach((f) => fs.unlinkSync(f));
}
function errorHandler(err, res) {
  console.error("Conversion error:", err);
  const msg = err.message.includes("encrypted")
    ? "Encrypted PDFs not supported."
    : "Conversion failed.";
  res.status(400).json({ error: msg });
}

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
