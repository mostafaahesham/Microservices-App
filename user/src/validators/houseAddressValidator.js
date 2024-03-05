const { body } = require("express-validator");
const requestValidator = require("../../../middlewares/request-validator");

const houseAddressValidator = (prefix = "") => [
  body(`${prefix}type`).default("HOUSE"),

  body(`${prefix}label`)
    .optional()
    .default("")
    .isString()
    .withMessage("label must be a string"),

  body(`${prefix}lat`)
    .optional()
    .default("")
    .isFloat({ min: -90, max: 90 })
    .withMessage("latitude must be a valid number between -90 and 90"),

  body(`${prefix}long`)
    .optional()
    .default("")
    .isFloat({ min: -180, max: 180 })
    .withMessage("longitude must be a valid number between -180 and 180"),

  body(`${prefix}house`)
    .notEmpty()
    .withMessage("house is required")
    .isString()
    .withMessage("house must be a string"),

  body(`${prefix}street`)
    .notEmpty()
    .withMessage("street is required")
    .isString()
    .withMessage("street must be a string"),

  body(`${prefix}city`)
    .notEmpty()
    .withMessage("city is required")
    .isString()
    .withMessage("city must be a string"),

  body(`${prefix}country`)
    .default("Egypt")
    .isString()
    .withMessage("country must be a string"),

  body(`${prefix}additionalDirections`)
    .optional()
    .default("")
    .isString()
    .withMessage("additional Directions must be a string"),

  requestValidator,
];

module.exports = houseAddressValidator;
