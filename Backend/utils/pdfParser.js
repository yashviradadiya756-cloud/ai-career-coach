const fs = require("fs");
const pdf = require("pdf-parse");

const extractResumeText = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const data = await pdf(buffer);

    return data.text;
  } catch (error) {
    console.log(error);
    return "";
  }
};

module.exports = extractResumeText;