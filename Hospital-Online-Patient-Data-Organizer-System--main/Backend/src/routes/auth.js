const express = require("express");
const UserController = require("../controllers/UserController");
const validateRequest = require("../middlewares/validateRequest");
const { auth, authorize } = require("../middlewares/auth");
const {
  registerPatientValidation,
  registerDoctorValidation,
  registerHospitalValidation,
  loginValidation,
  resetPasswordValidation,
  objectIdValidation,
} = require("../middlewares/validators/userValidators");

const router = express.Router();

router.post(
  "/register/patient",
  registerPatientValidation,
  validateRequest,
  UserController.registerPatient,
);
router.post(
  "/register/doctor",
  registerDoctorValidation,
  validateRequest,
  UserController.registerDoctor,
);
router.post(
  "/register/hospital",
  registerHospitalValidation,
  validateRequest,
  UserController.registerHospital,
);
router.post("/login", loginValidation, validateRequest, UserController.login);
router.get("/me", auth, UserController.getCurrentUser);
router.post(
  "/reset-password",
  resetPasswordValidation,
  validateRequest,
  UserController.resetPassword,
);
router.get(
  "/id/:id",
  auth,
  authorize("hospital"),
  objectIdValidation,
  validateRequest,
  UserController.getUserById,
);

module.exports = router;
