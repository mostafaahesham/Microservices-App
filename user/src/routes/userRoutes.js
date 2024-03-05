const express = require("express");

const userModel = require("../models/userModel");

const auth = require("../../../middlewares/authentication-authorization");

const {
  selfUpdateUserInfo,
  selfAddUserAddress,
  selfSetUserAddressById,
  selfUpdateUserAddressById,
  selfRemoveUserAddressById,
  selfUpdateUserPassword,
  selfGetUser,
  selfDeleteUser,
} = require("../services/userServices");

const {
  selfUpdateUserInfoValidator,
  selfUpdateUserPasswordValidator,
  selfSetUserAddressValidator,
  selfRemoveUserAddressValidator,
} = require("../validators/userValidators");

const addressValidatorSelector = require("../middlewares/address-validator-selector");
const embedObjectId = require("../../../middlewares/embedd-object-id");

const router = express.Router();

router.use(
  (req, res, next) => auth.authenticate(req, res, next, [userModel]),
  auth.authorize("user")
);

router
  .route("/update-self-info")
  .put(selfUpdateUserInfoValidator, selfUpdateUserInfo);
router.route("/add-self-address").put(
  (req, res, next) => embedObjectId(req, res, next, ""),
  (req, res, next) => addressValidatorSelector(req, res, next, ""),
  selfAddUserAddress
);
router
  .route("/set-self-address/:addressid")
  .put(selfSetUserAddressValidator, selfSetUserAddressById);
router.route("/update-self-address/:addressid").put(
  (req, res, next) => embedObjectId(req, res, next, ""),
  (req, res, next) => addressValidatorSelector(req, res, next, ""),
  selfUpdateUserAddressById
);
router
  .route("/delete-self-address/:addressid")
  .put(selfRemoveUserAddressValidator, selfRemoveUserAddressById);
router
  .route("/update-self-password")
  .put(selfUpdateUserPasswordValidator, selfUpdateUserPassword);
router.route("/get-self").get(selfGetUser);
router.route("/delete-self").delete(selfDeleteUser);

module.exports = router;
