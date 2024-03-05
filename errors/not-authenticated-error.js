const CustomError = require("./custom-error");

class NotAuthenticatedError extends CustomError {
  constructor() {
    super();
    this.statusCode = 401;
    this.msg = "please login to continue";

    // Setting the prototype explicitly for extending a built-in class
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }

  serializeErrors() {
    return [{ msg: this.msg }];
  }
}

module.exports = NotAuthenticatedError;
