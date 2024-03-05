const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const userModel = require("../models/userModel");

const { generateToken, verifyToken } = require("../utils/token");
const { generateAddressFields } = require("../utils/addresses");

const BadRequestError = require("../../../errors/bad-request-error");
const NotFoundError = require("../../../errors/not-found-error");

// @desc    Update Logged User info
// @route   PUT    /api/v2/users/update-self-info
// @access  authenticated / authorized (user)
exports.selfUpdateUserInfo = asyncHandler(async (req, res, next) => {
  let previousImagePath;
  const previousImage = req.user.image ? req.user.image.split("/").pop() : null;
  if (previousImage) previousImagePath = `uploads/users/${previousImage}`;
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      image: req.body.image,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(
      new BadRequestError("couldn't update user info, please try again")
    );
  }

  const newImage = req.body.image ? req.body.image : null;

  res
    .status(200)
    .json({ status: 1, msg: "user info updated successfully", data: user });
});

// @desc    Update Logged User Password
// @route   PUT /api/v2/users/update-self-password
// @access  authenticated / authorized (user)
exports.selfUpdateUserPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(
      new BadRequestError("couldn't update user password, please try again")
    );
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 1,
    msg: "user password updated successfully",
    data: user,
    token: token,
  });
});

// @desc    Add Logged User Address
// @route   PUT /api/v2/users/add-self-address
// @access  authenticated / authorized (user)
exports.selfAddUserAddress = asyncHandler(async (req, res, next) => {
  const addressFields = generateAddressFields(req, res, next, req.body.type);
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { addresses: addressFields }, $set: { address: addressFields } }, // Push the new address to the addresses array
    { new: true }
  );

  if (!user) {
    return next(
      new BadRequestError("couldn't add user address, please try again")
    );
  }

  res
    .status(200)
    .json({ status: 1, msg: "user address added successfully", data: user });
});

// @desc    Set Default Logged User Address
// @route   PUT /api/v2/users/set-self-address/:addressid
// @access  authenticated / authorized (user)
exports.selfSetUserAddressById = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    {
      _id: req.user._id,
      "addresses._id": new mongoose.Types.ObjectId(req.params.addressid),
    },
    [
      {
        $set: {
          address: {
            $first: {
              $filter: {
                input: "$addresses",
                as: "addr",
                cond: {
                  $eq: [
                    "$$addr._id",
                    new mongoose.Types.ObjectId(req.params.addressid),
                  ],
                },
              },
            },
          },
        },
      },
    ],
    { new: true }
  );

  if (!user) {
    return next(
      new BadRequestError("couldn't set user address, please try again")
    );
  }

  res.status(200).json({
    status: 1,
    msg: "user default address set successfully",
    data: user,
  });
});

// @desc    Update Logged User Address
// @route   PUT /api/v2/users/update-self-address/:addressid
// @access  authenticated / authorized (user)
exports.selfUpdateUserAddressById = asyncHandler(async (req, res, next) => {
  const addressFields = generateAddressFields(req, res, next, req.body.type);

  const user = await userModel.findOneAndUpdate(
    {
      _id: req.user._id,
      "addresses._id": new mongoose.Types.ObjectId(req.params.addressid),
    },
    {
      $set: {
        "addresses.$": addressFields,
        address: addressFields,
      },
    },
    { new: true }
  );

  if (!user) {
    return next(
      new BadRequestError("couldn't update user address, please try again")
    );
  }
  res
    .status(200)
    .json({ status: 1, msg: "user address updated successfully", data: user });
});

// @desc    Remove Logged User Address
// @route   PUT /api/v2/users/delete-self-address/:addressid
// @access  authenticated / authorized (user)
exports.selfRemoveUserAddressById = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const addressId = new mongoose.Types.ObjectId(req.params.addressid);

  const user = await userModel.findOneAndUpdate(
    { _id: userId, "addresses._id": addressId },
    [
      {
        $set: {
          addresses: {
            $cond: {
              if: { $gt: [{ $size: "$addresses" }, 1] },
              then: {
                $filter: {
                  input: "$addresses",
                  as: "address",
                  cond: { $ne: ["$$address._id", addressId] },
                },
              },
              else: "$addresses",
            },
          },
        },
      },
      {
        $set: {
          address: { $arrayElemAt: ["$addresses", 0] },
        },
      },
    ],
    { new: true }
  );

  if (!user) {
    return next(
      new BadRequestError("couldn't remove user address, please try again")
    );
  }

  res
    .status(200)
    .json({ status: 1, msg: "user address removed successfully", data: user });
});

// @desc    Get Logged User data
// @route   GET /api/v2/users/get-self
// @access  authenticated / authorized (user)
exports.selfGetUser = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  const decoded = verifyToken(req, res, next, token);
  const tokenExpiryDate = new Date(decoded.exp * 1000);

  token = { token, tokenExpiryDate };

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new NotFoundError("user not found"));
  }
  res.status(200).json({
    status: 1,
    msg: "",
    data: user,
    token,
  });
});

// @desc    Delete Logged User
// @route   GET /api/v2/users/delete-self
// @access  authenticated / authorized (user)
exports.selfDeleteUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  await userModel.findByIdAndDelete(req.user._id);

  res.status(200).json({ status: 1, msg: "user deleted successfully" });
});
