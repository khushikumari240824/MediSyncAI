const UserService = require("../services/UserService");
const asyncHandler = require("../utils/asyncHandler");

class UserController {
  static registerPatient = asyncHandler(async (req, res) => {
    const result = await UserService.registerPatient(req.body);
    return res.status(201).json(result);
  });

  static registerDoctor = asyncHandler(async (req, res) => {
    const result = await UserService.registerDoctor(req.body);
    return res.status(201).json(result);
  });

  static registerHospital = asyncHandler(async (req, res) => {
    const result = await UserService.registerHospital(req.body);
    return res.status(201).json(result);
  });

  static login = asyncHandler(async (req, res) => {
    const result = await UserService.login(req.body);
    return res.status(200).json(result);
  });

  static getCurrentUser = asyncHandler(async (req, res) => {
    const result = await UserService.getCurrentUser(req.user._id);
    return res.status(200).json(result);
  });

  static resetPassword = asyncHandler(async (req, res) => {
    const result = await UserService.resetPassword(req.body);
    return res.status(200).json(result);
  });

  static getUserById = asyncHandler(async (req, res) => {
    const result = await UserService.getUserById(req.params.id);
    return res.status(200).json(result);
  });
}

module.exports = UserController;
