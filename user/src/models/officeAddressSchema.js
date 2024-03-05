const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  type: { type: String, default: "OFFICE" }, // required
  label: { type: String, default: "" }, // optional
  lat: { type: Number, default: "" }, // optional
  long: { type: Number, default: "" }, // optional
  building: {
    type: String,
    default: "",
  }, // required
  floor: {
    type: String,
    default: "",
  }, // optional
  company: {
    type: String,
    default: "",
  }, // required
  street: {
    type: String,
    default: "",
  }, // required
  city: {
    type: String,
  }, // required
  country: {
    type: String,
    default: "Egypt",
  }, // required
  additionalDirections: {
    type: String,
    default: "",
  }, // optional
});
