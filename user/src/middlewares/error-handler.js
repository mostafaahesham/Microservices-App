const CustomError = require("../../../errors/custom-error");

const { deleteUploadedFilesOnReqError } = require("../utils/fileManager");

const sendDevErrors = async (err, req, res) => {
  await deleteUploadedFilesOnReqError(req);
  return res
    .status(err.statusCode)
    .send({ status: 0, errors: err.serializeErrors(), stack: err.stack });
};

const sendProdErrors = async (err, req, res) => {
  await deleteUploadedFilesOnReqError(req);
  return res
    .status(err.statusCode)
    .send({ status: 0, errors: err.serializeErrors() });
};

const errorHandler = async (err, req, res, next) => {
  if (err instanceof CustomError) {
    if (process.env.NODE_ENV === "dev") {
      return await sendDevErrors(err, req, res);
    } else if (process.env.NODE_ENV === "prod") {
      return await sendProdErrors(err, req, res);
    }
  } else {
    await deleteUploadedFilesOnReqError(req);
    return res.status(500).send({
      errors: [
        {
          status: 0,
          msg: "Something went wrong",
          stack: err.stack,
        },
      ],
    });
  }
};

module.exports = errorHandler;
