const { deleteFile } = require("../../../utils/fileManager");

exports.deleteUserImage = async (image) => {
  let splitUrl, imageName;
  if (image) {
    splitUrl = image.split("/");
    imageName = splitUrl[splitUrl.length - 1];
  }
  await deleteFile(`src/uploads/${imageName}`);
};
