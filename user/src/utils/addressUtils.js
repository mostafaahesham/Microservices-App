const BadRequestError = require("../../../errors/bad-request-error");

exports.generateAddressFields = (req, res, next, addressType) => {
  const {
    _id,
    type,
    label,
    lat,
    long,
    building,
    floor,
    apartment,
    house,
    company,
    street,
    city,
    country,
    additionalDirections,
  } = req.body;
  let addressFields;

  if (addressType === "APT") {
    addressFields = {
      _id,
      type,
      label,
      lat,
      long,
      building,
      floor,
      apartment,
      street,
      city,
      country,
      additionalDirections,
    };
  } else if (addressType === "HOUSE") {
    addressFields = {
      _id,
      type,
      label,
      lat,
      long,
      house,
      street,
      city,
      country,
      additionalDirections,
    };
  } else if (addressType === "OFFICE") {
    addressFields = {
      _id,
      type,
      label,
      lat,
      long,
      building,
      floor,
      company,
      street,
      city,
      country,
      additionalDirections,
    };
  } else {
    return next(new BadRequestError("invalid address type"));
  }

  Object.keys(addressFields).forEach(
    (key) => addressFields[key] === undefined && delete addressFields[key]
  );

  return addressFields;
};

exports.formatAddressForEmail = (addressObj) => {
  const excludeKeys = new Set([
    "_id",
    "lat",
    "long",
    "type",
    "label",
    "country",
  ]);

  const keyLabels = {
    building: "Building",
    house: "House",
    apartment: "Apartment",
    floor: "Floor",
    company: "Company",
    street: "Street",
    city: "City",
    additionalDirections: "Additional Directions",
    phoneNumber: "Phone Number",
  };

  return Object.entries(addressObj)
    .filter(([key, value]) => !excludeKeys.has(key) && value)
    .map(([key, value]) => {
      const keyLabel =
        keyLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
      return `<strong>${keyLabel}:</strong> ${value}`;
    })
    .join("<br>");
};
