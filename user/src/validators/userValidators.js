const { body, param } = require("express-validator");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const requestValidator = require("../middlewares/request-validator");

const BadRequestError = require("../../../errors/bad-request-error");
const NotFoundError = require("../../../errors/not-found-error");

exports.selfUpdateUserInfoValidator = [
  body("firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("user firstName must be between 2 & 50 characters"),
  body("lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("user lastName must be between 2 & 50 characters"),
  body("phoneNumber")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("phone number must be egyptian"),
  body("image")
    .if((value, { req }) => req.body.image !== undefined)
    .notEmpty()
    .withMessage("user image can't be empty"),
  requestValidator,
];

exports.selfUpdateUserPasswordValidator = [
  body("newPassword")
    .notEmpty()
    .withMessage("password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]\\:;"'<>?,./-]).{8,}$/
    )
    .withMessage(
      "password must be 8 chars min, include uppercase, lowercase, numbers, and special characters"
    )
    .custom(async (newPassword, { req }) => {
      const user = await userModel.findOne({ email: req.user.email });
      if (!user) {
        throw new NotFoundError(`no user of e-mail :'${email}' exists`);
      }
      if (await bcrypt.compare(newPassword, user.password)) {
        throw new BadRequestError(
          "new password cannot be the same as your previous password"
        );
      }
      return true;
    }),
  body("newPasswordConfirm")
    .notEmpty()
    .withMessage("password confirmation is required")
    .custom((newPasswordConfirm, { req }) => {
      if (newPasswordConfirm !== req.body.newPassword) {
        throw new BadRequestError(
          "password confirmation does not match password"
        );
      }
      return true;
    }),
  requestValidator,
];

exports.selfSetUserAddressValidator = [
  param("addressid")
    .isMongoId()
    .withMessage("addressid must be a valid mongo id"),
  requestValidator,
];

exports.selfRemoveUserAddressValidator = [
  param("addressid")
    .isMongoId()
    .withMessage("addressid must be a valid mongo id"),
  requestValidator,
];
