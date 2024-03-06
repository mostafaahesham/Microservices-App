const multer = require("multer");
const asyncHandler = require("express-async-handler");
const path = require("path");
const sharp = require("sharp");

const FileFormatError = require("../../../errors/file-format-error");

const memoryStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new FileFormatError(), false);
  }
};

const upload = multer({ storage: memoryStorage, fileFilter: multerFilter });

exports.uploadUserImage = upload.fields([{ name: "image", maxCount: 1 }]);

exports.processUserImage = asyncHandler(async (req, res, next) => {
  const files = req.files;
  let image;
  if (files) {
    image = files["image"] ? files["image"][0] : null;
  }

  if (image) {
    const imageName = `user-image-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.png`;
    const uploadPath = path.join(__dirname, "../", "uploads", imageName); // Explicitly resolve the path
    try {
      await sharp(image.buffer)
        .toFormat("png")
        .png({ quality: 100 })
        .toFile(uploadPath);
      req.body.image = imageName;
    } catch (err) {
      console.error(err);
    }
  }
  next();
});
