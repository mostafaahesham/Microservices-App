const NotFoundError = require("../errors/not-found-error");

const checkDocExistance = async (req, res, next, Model, key, val) => {
  let doc;
  switch (key) {
    case "id":
      doc = await Model.findById(val);
      break;
    case "email":
      doc = await Model.findOne({ email: val });
      break;
    default:
      break;
  }
  if (!doc) {
    next(new NotFoundError(`no ${Model.modelName} of ${key}: ${val} exists`));
  }
  return doc;
};

module.exports = checkDocExistance;
