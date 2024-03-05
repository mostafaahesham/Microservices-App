const { sendEmail } = require("../utils/emailUtils");

const {
  signUpConfirmationEmail,
  signupSuccessfulEmail,
  forgotPasswordEmail,
  passwordResetSuccessfulEmail,
  accountInfoUpdateSuccessfulEmail,
  accountDeletionSuccessfulEmail,
} = require("../utils/emailHtmlParsers");

exports.sendUserSignUpConfirmationLinkEmail = async (user) => {
  const userConfirmationLink = `${process.env.BASE_URL}/api/v2/users/auth/verify-email/${user.signUpConfirmationCode}`;
  await sendEmail({
    email: user.email,
    subject: "Sign-up Confirmation Link",
    message: await signUpConfirmationEmail(
      user.firstName,
      userConfirmationLink
    ),
  });
};

exports.sendUserSignUpSuccessfulEmail = async (user) => {
  await sendEmail({
    email: user.email,
    subject: "Sign-up Confirmation Success",
    message: await signupSuccessfulEmail(user.firstName),
  });
};

exports.sendUserPasswordResetCodeEmail = async (user, code) => {
  await sendEmail({
    email: user.email,
    subject: "Password Reset Request",
    message: await forgotPasswordEmail(user.firstName, code),
  });
};

exports.sendUserPasswordResetEmail = async (user) => {
  await sendEmail({
    email: user.email,
    subject: "Password Reset Successful",
    message: await passwordResetSuccessfulEmail(user.firstName),
  });
};

exports.sendUserPasswordUpdatedEmail = async (user) => {
  await sendEmail({
    email: user.email,
    subject: "Password Update Successful",
    message: await passwordResetSuccessfulEmail(user.firstName),
  });
};

exports.sendUserInfoUpdatedEmail = async (user) => {
  await sendEmail({
    email: user.email,
    subject: "Account Info Update",
    message: await accountInfoUpdateSuccessfulEmail(user.firstName),
  });
};

exports.sendUserAccountDeletedEmail = async (user) => {
  await sendEmail({
    email: user.email,
    subject: "Account Info Update",
    message: await accountDeletionSuccessfulEmail(user.firstName),
  });
};
