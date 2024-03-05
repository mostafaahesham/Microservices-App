const CustomError = require("./custom-error");

class BadRequestError extends CustomError {
  constructor(msg) {
    super(msg);
    this.statusCode = 400;
    this.msg = msg;

    // Setting the prototype explicitly for extending a built-in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ msg: this.msg }];
  }
}

module.exports = BadRequestError;
