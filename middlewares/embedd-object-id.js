const mongoose = require("mongoose");

const embedObjectId = (req, res, next, field) => {
  if (!field) {
    if (!req.body._id) {
      req.body._id = new mongoose.Types.ObjectId();
      next();
    } else {
      next();
    }
  } else if (field && req.body[field]) {
    if (!req.body[field]["_id"]) {
      req.body[field]["_id"] = new mongoose.Types.ObjectId();
      next();
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = embedObjectId;
