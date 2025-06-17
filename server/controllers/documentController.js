const adobePdfService = require("../services/adobePdfService");
const fileService = require("../services/fileService");

const convertPdfToDocx = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'docx',
      `${req.file.filename}.docx`
    );

    res.download(outputPath, "converted.docx", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Conversion failed");
  }
};

const convertDocxToPdf = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'pdf',
      `${req.file.filename}.pdf`
    );

    res.download(outputPath, "converted.pdf", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("DOCX to PDF conversion failed");
  }
};

const convertPdfToPptx = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'pptx',
      `${req.file.filename}.pptx`
    );

    res.download(outputPath, "converted.pptx", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PDF to PPTX conversion failed");
  }
};

const convertPdfToXlsx = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'xlsx',
      `${req.file.filename}.xlsx`
    );

    res.download(outputPath, "converted.xlsx", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PDF to Excel conversion failed");
  }
};

const convertPdfToTxt = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'txt',
      `${req.file.filename}.txt`
    );

    res.download(outputPath, "converted.txt", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PDF to Text conversion failed");
  }
};

const convertPdfToRtf = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'rtf',
      `${req.file.filename}.rtf`
    );

    res.download(outputPath, "converted.rtf", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PDF to RTF conversion failed");
  }
};

const convertPptxToPdf = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'pdf',
      `${req.file.filename}.pdf`
    );

    res.download(outputPath, "converted.pdf", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("PowerPoint to PDF conversion failed");
  }
};

const convertXlsxToPdf = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'pdf',
      `${req.file.filename}.pdf`
    );

    res.download(outputPath, "converted.pdf", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Excel to PDF conversion failed");
  }
};

const convertTxtToPdf = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'pdf',
      `${req.file.filename}.pdf`
    );

    res.download(outputPath, "converted.pdf", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Text to PDF conversion failed");
  }
};

const convertHtmlToPdf = async (req, res) => {
  try {
    const outputPath = await adobePdfService.convertDocument(
      req.file.path,
      'pdf',
      `${req.file.filename}.pdf`
    );

    res.download(outputPath, "converted.pdf", () => {
      fileService.cleanupFiles([req.file.path, outputPath]);
    });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("HTML to PDF conversion failed");
  }
};

module.exports = {
  convertPdfToDocx,
  convertDocxToPdf,
  convertPdfToPptx,
  convertPdfToXlsx,
  convertPdfToTxt,
  convertPdfToRtf,
  convertPptxToPdf,
  convertXlsxToPdf,
  convertTxtToPdf,
  convertHtmlToPdf
};