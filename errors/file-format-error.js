const CustomError = require("./custom-error");

class FileFormatError extends CustomError {
  constructor() {
    super();
    this.statusCode = 422;
    this.msg = "file format error";

    // Setting the prototype explicitly for extending a built-in class
    Object.setPrototypeOf(this, FileFormatError.prototype);
  }

  serializeErrors() {
    return [{ msg: this.msg }];
  }
}

module.exports = FileFormatError;
