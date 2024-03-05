const fs = require("fs");
const util = require("util");
const unlinkAsync = util.promisify(fs.unlink);

const extractValuesToList = (body, keywords) => {
  let valuesList = [];
  Object.keys(body).forEach((key) => {
    const lowerCaseKey = key.toLowerCase();
    const matchedKeyword = keywords.find((keyword) =>
      lowerCaseKey.includes(keyword.toLowerCase())
    );
    if (matchedKeyword) {
      if (Array.isArray(body[key])) {
        valuesList = valuesList.concat(body[key]);
      } else {
        valuesList.push(body[key]);
      }
    }
  });
  return valuesList;
};

const deleteFile = async (filePath) => {
  await unlinkAsync(filePath).catch((err) => {
    console.error("Error deleting file:", err);
  });
};

exports.deleteFile = deleteFile;

exports.deleteUploadedFilesOnReqError = async (req) => {
  const basePath = `uploads/${req.originalUrl.split("/")[3]}/`;
  const fileNames = extractValuesToList(req.body, [
    "image",
    "logo",
    "sizechart",
  ]);

  await Promise.all(
    fileNames.map((fileName) => deleteFile(`${basePath}${fileName}`))
  );
};
