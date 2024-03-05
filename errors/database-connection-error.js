const CustomError = require("./custom-error");

class DatabaseConnectionError extends CustomError {
  constructor() {
    super();
    this.statusCode = 500;
    this.msg = "Error connecting to database";

    // Setting the prototype explicitly for extending a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ msg: this.msg }];
  }
}

module.exports = DatabaseConnectionError;
