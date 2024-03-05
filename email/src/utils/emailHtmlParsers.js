const fs = require("fs");
const path = require("path");
const juice = require("juice");

exports.accountDeletionSuccessfulEmail = async (name) => {
  const templatePath = path.join(__dirname, "templates", "user_account_deleted.html");
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent.replace("{{name}}", name);
};

exports.forgotPasswordEmail = async (name, code) => {
  const templatePath = path.join(__dirname, "./templates", "reset_password_code.html");
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent.replace("{{name}}", name).replace("{{code}}", code);
};

exports.signUpConfirmationEmail = async (name, verificationLink) => {
  const templatePath = path.join(
    __dirname,
    "./templates",
    "signup_confirmation_link.html"
  );
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent
    .replace("{{name}}", name)
    .replace("{{verificationLink}}", verificationLink);
};

exports.passwordResetCodeVerifiedEmail = async (name) => {
  const templatePath = path.join(
    __dirname,
    "./templates",
    "reset_password_confirmation.html"
  );
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent.replace("{{name}}", name);
};

exports.passwordResetSuccessfulEmail = async (name) => {
  const templatePath = path.join(
    __dirname,
    "./templates",
    "user_change_password_confirmation.html"
  );
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent.replace("{{name}}", name);
};

exports.accountInfoUpdateSuccessfulEmail = async (name) => {
  const templatePath = path.join(
    __dirname,
    "./templates",
    "user_change_account_info_confirmation.html"
  );
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent.replace("{{name}}", name);
};

exports.vendorSignupSuccessfulEmail = async (brandOwner, brandName) => {
  const templatePath = path.join(
    __dirname,
    "./templates",
    "brand_signup_wait_for_confirmation.html"
  );
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent
    .replace("{{brandOwner}}", brandOwner)
    .replace("{{brandName}}", brandName);
};

exports.signupSuccessfulEmail = async (name) => {
  const templatePath = path.join(
    __dirname,
    "./templates",
    "signup_confirmation_success.html"
  );
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent.replace("{{name}}", name);
};

exports.vendorWaitForApprovalEmail = async (name) => {
  const templatePath = path.join(
    __dirname,
    "./templates",
    "brand_signup_wait_for_confirmation.html"
  );
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent
    .replace("{{brandOwner}}", name)
    .replace("{{brandOwner}}", name);
};

exports.vendorApprovalEmail = async (brandName, brandOwner) => {
  const templatePath = path.join(__dirname, "./templates", "brand_accepted.html");
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent
    .replace("{{brandOwner}}", brandOwner)
    .replace("{{brandName}}", brandName)
    .replace("{{brandName}}", brandName);
};

exports.vendorRejectionEmail = async (brandOwner) => {
  const templatePath = path.join(__dirname, "./templates", "brand_rejected.html");
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent.replace("{{brandOwner}}", brandOwner);
};

exports.vendorPauseEmail = async (brandName, brandOwner) => {
  const templatePath = path.join(__dirname, "./templates", "brand_paused.html");
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent
    .replace("{{brandOwner}}", brandOwner)
    .replace("{{brandName}}", brandName);
};

exports.vendorResumeEmail = async (brandName, brandOwner) => {
  const templatePath = path.join(__dirname, "./templates", "brand_resumed.html");
  const htmlContent = await fs.promises.readFile(templatePath, "utf-8");
  const inlinedHtmlContent = juice(htmlContent);

  return inlinedHtmlContent
    .replace("{{brandOwner}}", brandOwner)
    .replace("{{brandName}}", brandName);
};