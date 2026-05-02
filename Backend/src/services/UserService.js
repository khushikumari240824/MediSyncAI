const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

class UserService {
  static generateToken(userId) {
    return jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });
  }

  static async registerPatient(payload) {
    const {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      address,
      emergencyContact,
      bloodGroup,
      allergies,
    } = payload;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "An account with this email already exists.");
    }

    const patient = await Patient.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      address,
      emergencyContact,
      bloodGroup,
      allergies: allergies || [],
    });

    const user = await User.create({
      email,
      password,
      role: "patient",
      profileId: patient._id,
      roleModel: "Patient",
    });

    patient.userId = user._id;
    await patient.save();

    return {
      token: this.generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: patient,
      },
    };
  }

  static async registerDoctor(payload) {
    const {
      email,
      password,
      firstName,
      lastName,
      specialization,
      qualification,
      licenseNumber,
      phone,
      department,
      experience,
      consultationFee,
      availability,
    } = payload;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "An account with this email already exists.");
    }

    const existingDoctor = await Doctor.findOne({ licenseNumber });
    if (existingDoctor) {
      throw new ApiError(
        400,
        "A doctor with this license number already exists.",
      );
    }

    const doctor = await Doctor.create({
      firstName,
      lastName,
      specialization,
      qualification: qualification || "Not specified",
      licenseNumber,
      phone,
      email,
      department,
      experience: experience || 0,
      consultationFee: consultationFee || 0,
      availability: availability || {},
    });

    const user = await User.create({
      email,
      password,
      role: "doctor",
      profileId: doctor._id,
      roleModel: "Doctor",
    });

    doctor.userId = user._id;
    await doctor.save();

    return {
      token: this.generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: doctor,
      },
    };
  }

  static async registerHospital(payload) {
    const {
      email,
      password,
      name,
      address,
      phone,
      registrationNumber,
      departments,
    } = payload;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "An account with this email already exists.");
    }

    const existingHospital = await Hospital.findOne({ registrationNumber });
    if (existingHospital) {
      throw new ApiError(
        400,
        "A hospital with this registration number already exists.",
      );
    }

    const hospital = await Hospital.create({
      name,
      address,
      phone,
      email,
      registrationNumber,
      departments: departments || [],
    });

    const user = await User.create({
      email,
      password,
      role: "hospital",
      profileId: hospital._id,
      roleModel: "Hospital",
    });

    hospital.userId = user._id;
    await hospital.save();

    return {
      token: this.generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: hospital,
      },
    };
  }

  static async login(payload) {
    const { email, password } = payload;

    const user = await User.findOne({ email }).populate("profileId");
    if (!user) {
      throw new ApiError(400, "Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid credentials");
    }

    if (user.role === "doctor" && user.profileId?.status !== "approved") {
      throw new ApiError(
        403,
        "Your account is pending approval from the hospital.",
      );
    }

    return {
      token: this.generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profileId,
      },
    };
  }

  static async getCurrentUser(authenticatedUserId) {
    const user = await User.findById(authenticatedUserId).populate("profileId");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profileId,
      },
    };
  }

  static async resetPassword(payload) {
    const { email, newPassword } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "No account found with this email address");
    }

    user.password = newPassword;
    await user.save();

    return {
      message:
        "Password reset successfully. You can now login with your new password.",
    };
  }

  static async getUserById(userId) {
    const user = await User.findById(userId).populate("profileId");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profileId,
      },
    };
  }
}

module.exports = UserService;
