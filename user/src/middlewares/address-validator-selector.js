const aptartmentAddressValidator = require("../validators/apartmentAddressValidator");
const houseAddressValidator = require("../validators/houseAddressValidator");
const officeAddressValidator = require("../validators/officeAddressValidator");

const BadRequestError = require("../../../errors/bad-request-error");

const addressValidatorSelector = (req, res, next, prefix) => {
  const addressType = req.body["address.type"] || req.body.type;
  let validator;
  if (addressType === "APT") {
    validator = aptartmentAddressValidator(prefix);
  } else if (addressType === "HOUSE") {
    validator = houseAddressValidator(prefix);
  } else if (addressType === "OFFICE") {
    validator = officeAddressValidator(prefix);
  } else {
    return next(new BadRequestError("invalid address type"));
  }

  const runValidatorsSequentially = (index) => {
    if (index < validator.length) {
      validator[index](req, res, (err) => {
        if (err) {
          return next(err);
        }
        runValidatorsSequentially(index + 1);
      });
    } else {
      next();
    }
  };

  runValidatorsSequentially(0);
};

module.exports = addressValidatorSelector;
