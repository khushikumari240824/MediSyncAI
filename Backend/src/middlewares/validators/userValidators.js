const { body, param } = require("express-validator");

const passwordStrengthRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const registerPatientValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .matches(passwordStrengthRule)
    .withMessage(
      "Password must be at least 8 chars and include uppercase, lowercase, and a number",
    ),
  body("firstName").notEmpty().trim().withMessage("First name is required"),
  body("lastName").notEmpty().trim().withMessage("Last name is required"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Please provide a valid date of birth"),
  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Please select a valid gender"),
  body("phone").notEmpty().trim().withMessage("Phone number is required"),
];

const registerDoctorValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .matches(passwordStrengthRule)
    .withMessage(
      "Password must be at least 8 chars and include uppercase, lowercase, and a number",
    ),
  body("firstName").notEmpty().trim().withMessage("First name is required"),
  body("lastName").notEmpty().trim().withMessage("Last name is required"),
  body("specialization")
    .notEmpty()
    .trim()
    .withMessage("Specialization is required"),
  body("licenseNumber")
    .notEmpty()
    .trim()
    .withMessage("License number is required"),
  body("phone").notEmpty().trim().withMessage("Phone number is required"),
  body("department").notEmpty().trim().withMessage("Department is required"),
];

const registerHospitalValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .matches(passwordStrengthRule)
    .withMessage(
      "Password must be at least 8 chars and include uppercase, lowercase, and a number",
    ),
  body("name").notEmpty().trim().withMessage("Hospital name is required"),
  body("phone").notEmpty().trim().withMessage("Phone number is required"),
  body("registrationNumber")
    .notEmpty()
    .trim()
    .withMessage("Registration number is required"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const resetPasswordValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("newPassword")
    .matches(passwordStrengthRule)
    .withMessage(
      "Password must be at least 8 chars and include uppercase, lowercase, and a number",
    ),
];

const objectIdValidation = [
  param("id").isMongoId().withMessage("Invalid Mongo ObjectId format"),
];

module.exports = {
  registerPatientValidation,
  registerDoctorValidation,
  registerHospitalValidation,
  loginValidation,
  resetPasswordValidation,
  objectIdValidation,
};
