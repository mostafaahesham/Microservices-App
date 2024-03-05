const bcrypt = require("bcrypt");
const crypto = require("crypto");
const juice = require("juice");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");

const generateRandomCode = require("../utils/randomCode");
const { generateToken } = require("../utils/token");
const checkDocExistence = require("../utils/checkDocExistence");
const userModel = require("../models/userModel");

const BadRequestError = require("../../../errors/bad-request-error");
const NotFoundError = require("../../../errors/not-found-error");

// @desc    User Google Auth
// @route   POST    /api/v2/users/auth/google
// @access  Public
exports.userGoogleAuth = asyncHandler(async (req, res, next) => {
  try {
    const { displayName, email, id, photoUrl } = req.body;
    let user = await userModel.findOne({ googleId: id });
    if (!user) {
      let names = displayName.split(" ");
      let firstName = names[0];
      let lastName = names.length > 1 ? names[names.length - 1] : "";
      user = await userModel.create({
        googleId: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        avatar: photoUrl,
        isEmailVerified: true,
        provider: "google",
      });
    }
    const token = generateToken(user._id);

    res.status(201).json({
      status: 1,
      msg: "",
      data: user,
      token,
    });
  } catch (err) {
    return next(
      new BadRequestError(
        "an error occurred during Google Authentication, the email associated with Google account may already exist"
      )
    );
  }
});

// @desc    User Apple Auth
// @route   POST    /api/v2/users/auth/apple
// @access  Public
exports.userAppleAuth = asyncHandler(async (req, res, next) => {
  try {
    const { displayName, email, id, photoUrl } = req.body;
    let user = await userModel.findOne({ appleId: id });
    if (!user) {
      let names = displayName.split(" ");
      let firstName = names[0];
      let lastName = names.length > 1 ? names[names.length - 1] : "";
      user = await userModel.create({
        appleId: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        avatar: photoUrl,
        isEmailVerified: true,
        provider: "apple",
      });
    }

    const token = generateToken(user._id);
    let msg = "";
    if (email.includes("privaterelay")) {
      msg =
        "Your iCloud email address is currently set to private. While this ensures your privacy, it also means you won't receive any emails from Merchant, including updates, notifications, and password reset links.";
    }

    res.status(201).json({
      status: 1,
      msg: msg,
      data: user,
      token,
    });
  } catch (err) {
    return next(
      new BadRequestError(
        "an error occurred during Apple Authentication, the email associated with Apple account may already exist"
      )
    );
  }
});

// @desc    User Sign Up
// @route   POST    /api/v2/users/auth/sign-up
// @access  Public
exports.userSignUp = asyncHandler(async (req, res, next) => {
  const userSignUpConfirmationCode = generateRandomCode();
  let { firstName, lastName, email, phoneNumber, image, password, fcmId } =
    req.body;
  password = await bcrypt.hash(password, 12);

  const userData = {
    firstName,
    lastName,
    email,
    phoneNumber,
    image,
    password,
    fcmId,
    signUpConfirmationCode: userSignUpConfirmationCode,
  };

  const user = await userModel.create(userData);
  if (!user) {
    return next(new BadRequestError("couldn't signup, please try again"));
  }

  const token = generateToken(user._id);

  res.status(201).json({
    status: 1,
    msg: `an email with a confirmation link was sent to ${user.email}`,
    data: user,
    token,
  });
});

// @desc    User Verify email
// @route   GET    /api/v2/users/auth/verfiy-email/:confirmationcode
// @access  Public
exports.userVerifyEmail = asyncHandler(async (req, res, next) => {
  if (req.params.confirmationcode) {
    const user = await userModel.findOneAndUpdate(
      { signUpConfirmationCode: req.params.confirmationcode },
      {
        isEmailVerified: true,
        $unset: { signUpConfirmationCode: "" },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return next(
        new NotFoundError("user not found or has already been verified")
      );
    }

    const email_verified_path = path.join(
      __dirname,
      "../../emailTemplates/email_verified.html"
    );
    let email_verified_path_content = fs.readFileSync(
      email_verified_path,
      "utf8"
    );
    email_verified_path_content = juice(email_verified_path_content);

    res.status(202).send(email_verified_path_content);
  } else {
    return next(new BadRequestError("couldn't verify email"));
  }
});

// @desc    User Sign In
// @route   POST    /api/v2/users/auth/sign-in
// @access  Public
exports.userSignIn = asyncHandler(async (req, res, next) => {
  const user = await checkDocExistence(
    req,
    res,
    next,
    userModel,
    "email",
    req.body.email
  );

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new BadRequestError("incorrect email or password"));
  }

  if (user.isPasswordResetVerified) {
    return next(
      new BadRequestError(
        `couldn't sign in, a password reset operation is ongoing`
      )
    );
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 1,
    msg: "",
    data: user,
    token: token,
  });
});

// @desc    User Forogt Password
// @route   POST    /api/v2/users/auth/forgot-password
// @access  Public
exports.userForgotPassword = asyncHandler(async (req, res, next) => {
  const passwordResetCode = generateRandomCode();

  const hashedPasswordResetCode = crypto
    .createHash("sha256")
    .update(passwordResetCode)
    .digest("hex");

  const user = await userModel.findOneAndUpdate(
    { email: req.body.email },
    {
      passwordResetCode: hashedPasswordResetCode,
      passwordResetCodeExpiryDate: Date.now() + 10 * 60 * 1000,
      isPasswordResetVerified: false,
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(
      new NotFoundError(`couldn't find a user with email: ${req.body.email}`)
    );
  }

  res.status(200).json({
    status: 1,
    msg: `a password reset code valid for ${process.env.PASSWORD_RESET_CODE_EXPIRE_TIME} mins. was sent to ${user.email}`,
  });
});

// @desc    User Verify Password reset code
// @route   POST    /api/v2/users/auth/verify-password-reset-code
// @access  Public
exports.userVerifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedPasswordResetCode = crypto
    .createHash("sha256")
    .update(req.body.passwordResetCode)
    .digest("hex");

  const user = await userModel.findOneAndUpdate(
    {
      passwordResetCode: hashedPasswordResetCode,
      passwordResetCodeExpiryDate: { $gt: Date.now() },
    },
    {
      isPasswordResetVerified: true,
      $unset: {
        passwordResetCode: "",
        passwordResetCodeExpiryDate: "",
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new BadRequestError("invalid or expired reset code"));
  }

  res.status(200).json({ status: 1, msg: "password reset code verified" });
});

// @desc    User Reset Password
// @route   PUT    /api/v2/users/auth/reset-password
// @access  Public
exports.userResetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    {
      email: req.body.email,
      isPasswordResetVerified: true,
    },
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
      $unset: {
        isPasswordResetVerified: "",
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(
      new BadRequestError(`incorrect email/password or reset code not verified`)
    );
  }

  const token = generateToken(user._id);

  res.status(201).json({
    status: 1,
    msg: "password updated successfully",
    data: user,
    token: token,
  });
});
