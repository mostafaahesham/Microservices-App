const express = require("express");
const {
  userAppleAuth,
  userGoogleAuth,
  userSignUp,
  userVerifyEmail,
  userSignIn,
  userForgotPassword,
  userVerifyResetCode,
  userResetPassword,
} = require("../services/userAuthServices");

const {
  userSignUpValidator,
  userSignInValidator,
  userForgotPasswordValidator,
  userVerifyPasswordResetCode,
  userResetPasswordValidator,
} = require("../validators/userAuthValidators");

const router = express.Router();

router.route("/google").post(userGoogleAuth);
router.route("/apple").post(userAppleAuth);
router.route("/sign-up").post(userSignUpValidator, userSignUp);
router.route("/sign-in").post(userSignInValidator, userSignIn);
router
  .route("/forgot-password")
  .post(userForgotPasswordValidator, userForgotPassword);
router
  .route("/verify-password-reset-code")
  .post(userVerifyPasswordResetCode, userVerifyResetCode);
router
  .route("/reset-password")
  .put(userResetPasswordValidator, userResetPassword);
router.route("/verify-email/:confirmationcode").get(userVerifyEmail);

module.exports = router;
