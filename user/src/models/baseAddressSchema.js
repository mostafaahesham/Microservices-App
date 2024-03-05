const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    type: { type: String },
    label: { type: String, default: "" },
    lat: { type: Number, default: "" },
    long: { type: Number, default: "" },
    house: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    building: {
      type: String,
      default: "",
    },
    floor: {
      type: String,
      default: "",
    },
    apartment: {
      type: String,
      default: "",
    },
    street: {
      type: String,
      default: "",
    },
    city: {
      type: String,
    },
    country: {
      type: String,
      default: "Egypt",
    },
    additionalDirections: {
      type: String,
      default: "",
    },
  },
  { discriminatorKey: "type", _id: false }
);
