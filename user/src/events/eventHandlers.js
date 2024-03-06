const { deleteUserImage } = require("./eventActions");

exports.onUserAccountDeleted = async (user) => {
  deleteUserImage(user.image);
};
