const CustomError = require("./custom-error");

class NotAuthorizedError extends CustomError {
  constructor() {
    super();
    this.statusCode = 403;
    this.msg = "you are not allowed to perform this action";

    // Setting the prototype explicitly for extending a built-in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ msg: this.msg }];
  }
}

module.exports = NotAuthorizedError;
