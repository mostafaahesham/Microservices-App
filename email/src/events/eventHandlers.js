const {
  sendUserSignUpConfirmationLinkEmail,
  sendUserSignUpSuccessfulEmail,
  sendUserPasswordResetCodeEmail,
  sendUserPasswordResetEmail,
  sendUserPasswordUpdatedEmail,
  sendUserInfoUpdatedEmail,
  sendUserAccountDeletedEmail,
} = require("./eventActions");

exports.onUserSignup = async (user) => {
  if (user.provider === "email") {
    sendUserSignUpConfirmationLinkEmail(user);
  } else {
    sendUserSignUpSuccessfulEmail(user);
  }
};

exports.onUserPasswordForgotten = async (user, code) => {
  sendUserPasswordResetCodeEmail(user, code);
};

exports.onUserPasswordReset = async (user) => {
  sendUserPasswordResetEmail(user);
};

exports.onUserPasswordUpdated = async (user) => {
  sendUserPasswordUpdatedEmail(user);
};

exports.onUserInfoUpdated = async (user, newImage, previousImage) => {
  sendUserInfoUpdatedEmail(user);
};

exports.onUserAccountDeleted = async (user) => {
  sendUserAccountDeletedEmail(user);
};
