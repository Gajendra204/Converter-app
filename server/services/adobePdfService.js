const { executionContext } = require("../config/adobeConfig");
const { ExportPDF, CreatePDF, FileRef } = require("@adobe/pdfservices-node-sdk");
const path = require("path");
const fs = require("fs");

// Ensure output directory exists
const outputDir = path.join(__dirname, "../../output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const convertDocument = async (inputPath, targetFormat, outputFilename) => {
  const outputPath = path.join(outputDir, outputFilename);
  
  try {
    let operation;
    let contentType;

    if (targetFormat === 'pdf') {
      operation = CreatePDF.Operation.createNew();
      // Determine content type based on input file extension
      const ext = path.extname(inputPath).toLowerCase();
      switch(ext) {
        case '.docx':
          contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case '.pptx':
          contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
          break;
        case '.xlsx':
          contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          break;
        case '.txt':
          contentType = "text/plain";
          break;
        case '.html':
          contentType = "text/html";
          break;
        default:
          contentType = "application/octet-stream";
      }
    } else {
      operation = ExportPDF.Operation.createNew(getTargetFormat(targetFormat));
      contentType = "application/pdf";
    }

    const input = await FileRef.createFromLocalFile(inputPath, contentType);
    operation.setInput(input);
    const result = await operation.execute(executionContext);
    await result.saveAsFile(outputPath);

    return outputPath;
  } catch (err) {
    console.error("Adobe PDF Services error:", err);
    throw err;
  }
};

const getTargetFormat = (format) => {
  switch(format) {
    case 'docx': return ExportPDF.SupportedTargetFormats.DOCX;
    case 'pptx': return ExportPDF.SupportedTargetFormats.PPTX;
    case 'xlsx': return ExportPDF.SupportedTargetFormats.XLSX;
    case 'txt': return ExportPDF.SupportedTargetFormats.TXT;
    case 'rtf': return ExportPDF.SupportedTargetFormats.RTF;
    default: return ExportPDF.SupportedTargetFormats.DOCX;
  }
};

module.exports = {
  convertDocument
};