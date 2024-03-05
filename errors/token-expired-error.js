const CustomError = require("./custom-error");

class TokenExpiredError extends CustomError {
  constructor() {
    super();
    this.statusCode = 401;
    this.msg = "session expired, please login again";

    // Setting the prototype explicitly for extending a built-in class
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }

  serializeErrors() {
    return [{ msg: this.msg }];
  }
}

module.exports = TokenExpiredError;
