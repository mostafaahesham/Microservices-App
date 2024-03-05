const CustomError = require("./custom-error");

class NotFoundError extends CustomError {
  constructor(msg) {
    super(msg);
    this.statusCode = 404;
    this.msg = msg;
    // Setting the prototype explicitly for extending built-in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ msg: this.msg }];
  }
}

module.exports = NotFoundError;
