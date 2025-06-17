const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const documentController = require("../controllers/documentController");

// Document conversion routes
router.post("/convert", uploadMiddleware.single("file"), documentController.convertPdfToDocx);
router.post("/convert-docx-to-pdf", uploadMiddleware.single("file"), documentController.convertDocxToPdf);
router.post("/convert-pdf-to-pptx", uploadMiddleware.single("file"), documentController.convertPdfToPptx);
router.post("/convert-pdf-to-xlsx", uploadMiddleware.single("file"), documentController.convertPdfToXlsx);
router.post("/convert-pdf-to-txt", uploadMiddleware.single("file"), documentController.convertPdfToTxt);
router.post("/convert-pdf-to-rtf", uploadMiddleware.single("file"), documentController.convertPdfToRtf);
router.post("/convert-pptx-to-pdf", uploadMiddleware.single("file"), documentController.convertPptxToPdf);
router.post("/convert-xlsx-to-pdf", uploadMiddleware.single("file"), documentController.convertXlsxToPdf);
router.post("/convert-txt-to-pdf", uploadMiddleware.single("file"), documentController.convertTxtToPdf);
router.post("/convert-html-to-pdf", uploadMiddleware.single("file"), documentController.convertHtmlToPdf);

module.exports = router;