const fs = require("fs");
const path = require("path");

const cleanupFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  });
};

module.exports = {
  cleanupFiles
};