const CustomError = require("./custom-error");

class RequestValidationError extends CustomError {
  constructor(errors) {
    super("Invalid request parameters");
    this.errors = errors;
    this.statusCode = 400;

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === "field") {
        return { msg: err.msg, field: err.path };
      }
      return { msg: err.msg };
    });
  }
}

module.exports = RequestValidationError;
