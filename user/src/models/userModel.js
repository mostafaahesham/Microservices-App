const mongoose = require("mongoose");

const apartmentAddressSchema = require("./apartmentAddressSchema");
const houseAddressSchema = require("./houseAddressSchema");
const officeAddressSchema = require("./officeAddressSchema");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    address: {
      type: mongoose.Schema.Types.Mixed,
    },
    addresses: {
      type: [mongoose.Schema.Types.Mixed],
    },
    password: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetCode: {
      type: String,
    },
    passwordResetCodeExpiryDate: {
      type: Date,
    },
    isPasswordResetVerified: {
      type: Boolean,
    },
    signUpConfirmationCode: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    fcmId: { type: String },
    googleId: { type: String },
    appleId: { type: String },
    avatar: { type: String },
    provider: { type: String, default: "email" },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const singleAddress = this.address;
  if (singleAddress) {
    this.address = convertAddress(singleAddress);
  }

  if (this.addresses && this.addresses.length) {
    this.addresses = this.addresses.map((address) => convertAddress(address));
  }

  next();
});

function convertAddress(address) {
  switch (address.type) {
    case "APT":
      return new mongoose.model("ApartmentAddress", apartmentAddressSchema)(
        address
      ).toObject();
    case "HOUSE":
      return new mongoose.model("HouseAddress", houseAddressSchema)(
        address
      ).toObject();
    case "OFFICE":
      return new mongoose.model("OfficeAddress", officeAddressSchema)(
        address
      ).toObject();
    default:
      throw new Error("Invalid address type");
  }
}

module.exports = mongoose.model("User", userSchema);
