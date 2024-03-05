const asyncHandler = require("express-async-handler");

const { verifyToken } = require("../utils/token");

const BadRequestError = require("../errors/bad-request-error");
const NotAuthenticatedError = require("../errors/not-authenticated-error");
const NotAuthorizedError = require("../errors/not-authorized-error");

exports.authenticate = asyncHandler(async (req, res, next, models) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new NotAuthenticatedError());
  }
  const decoded = verifyToken(req, res, next, token);
  let doc = undefined;
  for (const model of models) {
    doc = await model.findById(decoded.id);
    if (doc) break;
  }

  if (!doc) {
    return next(new NotAuthenticatedError());
  }

  if (doc.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      doc.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new BadRequestError(
          `email ${doc.email} has recently changed password, please login again.`
        )
      );
    }
  }
  req.user = doc;
  next();
});

exports.authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new NotAuthorizedError());
    }
    next();
  });
