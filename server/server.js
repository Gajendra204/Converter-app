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
} = require("@adobe/pdfservices-node-sdk");

const app = express();
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
    const input = await FileRef.createFromLocalFile(inputPath, 'application/pdf');
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

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
