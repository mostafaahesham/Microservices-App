class CustomError extends Error {
  constructor(msg) {
    super(msg);

    if (this.constructor === CustomError) {
      throw new Error("Cannot instantiate abstract class");
    }

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors() {
    throw new Error("Method 'serializeErrors()' must be implemented.");
  }
}

module.exports = CustomError;

