const jwt = require("jsonwebtoken");
const ms = require("ms");

const NotAuthenticatedError = require("../../../errors/not-authenticated-error");
const TokenExpiredError = require("../../../errors/token-expired-error");

exports.generateToken = (payload) => {
  const token = jwt.sign({ id: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  let tokenExpiryDate;
  if (typeof process.env.JWT_EXPIRE_TIME === "string") {
    tokenExpiryDate = new Date(Date.now() + ms(process.env.JWT_EXPIRE_TIME));
  } else {
    tokenExpiryDate = new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRE_TIME, 10) * 1000
    );
  }

  return { token, tokenExpiryDate };
};

exports.verifyToken = (req, res, next, token) => {
  let decoded;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new TokenExpiredError());
    } else if (error instanceof jwt.JsonWebTokenError) {
      return next(new NotAuthenticatedError());
    } else {
      return next(new NotAuthenticatedError());
    }
  }
};
