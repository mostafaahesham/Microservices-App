const { body } = require("express-validator");
const bcrypt = require("bcrypt");

const requestValidator = require("../../../middlewares/request-validator");

const userModel = require("../models/userModel");

const BadRequestError = require("../../../errors/bad-request-error");
const NotFoundError = require("../../../errors/not-found-error");

exports.userSignUpValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("user firstName is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("user firstName must be between 2 & 50 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("user lastName is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("user lastName must be between 2 & 50 characters"),
  body("email")
    .notEmpty()
    .withMessage("user email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (email) => {
      const user = await userModel.findOne({ email });
      if (user) {
        throw new BadRequestError(`e-mail :'${email}' already in use`);
      }
    }),
  body("phoneNumber")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("phone number must be egyptian"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]\\:;"'<>?,./-]).{8,}$/
    )
    .withMessage(
      "password must be 8 chars min, include uppercase, lowercase, numbers, and special characters"
    ),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation is required")
    .custom((passwordConfirm, { req }) => {
      if (passwordConfirm !== req.body.password) {
        throw new BadRequestError(
          "password confirmation does not match password"
        );
      }
      return true;
    }),
  body("image")
    .if((value, { req }) => req.body.image !== undefined)
    .notEmpty()
    .withMessage("user image can't be empty"),
  body("fcmId").notEmpty().withMessage("fcmId is required"),
  requestValidator,
];

exports.userSignInValidator = [
  body("email")
    .notEmpty()
    .withMessage("e-mail is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (email) => {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new NotFoundError(`no user of e-mail :'${email}' exists`);
      }
    }),
  body("password").notEmpty().withMessage("password is required"),
  requestValidator,
];

exports.userForgotPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("e-mail is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (email) => {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new NotFoundError(`no user of e-mail :'${email}' exists`);
      }
    }),
  requestValidator,
];

exports.userVerifyPasswordResetCode = [
  body("passwordResetCode")
    .notEmpty()
    .withMessage("password reset code is required"),
  requestValidator,
];

exports.userResetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("e-mail is required")
    .isEmail()
    .withMessage("invalid email address"),
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
      const user = await userModel.findOne({ email: req.body.email });
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
