const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

class UserService {
  static generateToken(userId) {
    return jwt.sign(
      { userId },
      env.jwtSecret,
      { expiresIn: "7d" }
    );
  }

  // Register Patient
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

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new ApiError(
        400,
        "An account with this email already exists."
      );
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
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: "patient",
      profileId: patient._id,
      roleModel: "Patient",
      phoneNumber: phone,
      gender: gender.toLowerCase(),
      dateOfBirth,
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

  // Register Doctor
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

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new ApiError(
        400,
        "An account with this email already exists."
      );
    }

    const existingDoctor =
      await Doctor.findOne({
        licenseNumber,
      });

    if (existingDoctor) {
      throw new ApiError(
        400,
        "A doctor with this license number already exists."
      );
    }

    const doctor = await Doctor.create({
      firstName,
      lastName,
      specialization,
      qualification:
        qualification ||
        "Not specified",
      licenseNumber,
      phone,
      email,
      department,
      experience:
        experience || 0,
      consultationFee:
        consultationFee || 0,
      availability:
        availability || {},
    });

    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: "doctor",
      profileId: doctor._id,
      roleModel: "Doctor",
      phoneNumber: phone,
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

  // Register Hospital
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

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      throw new ApiError(
        400,
        "An account with this email already exists."
      );
    }

    const existingHospital =
      await Hospital.findOne({
        registrationNumber,
      });

    if (existingHospital) {
      throw new ApiError(
        400,
        "A hospital with this registration number already exists."
      );
    }

    const hospital =
      await Hospital.create({
        name,
        address,
        phone,
        email,
        registrationNumber,
        departments:
          departments || [],
      });

    const user = await User.create({
      name,
      email,
      password,
      role: "hospital",
      profileId:
        hospital._id,
      roleModel:
        "Hospital",
      phoneNumber: phone,
    });

    hospital.userId = user._id;
    await hospital.save();

    return {
      token:
        this.generateToken(
          user._id
        ),

      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: hospital,
      },
    };
  }

  // Login
  static async login(payload) {
    const {
      email,
      password,
    } = payload;

    const normalizedEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : email;

    const user =
      await User.findOne({
        email: normalizedEmail,
      })
        .select(
          "+password"
        )
        .populate(
          "profileId"
        );

    if (!user) {
      throw new ApiError(
        400,
        "Invalid credentials"
      );
    }

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {
      throw new ApiError(
        400,
        "Invalid credentials"
      );
    }

    if (
      user.role ===
        "doctor" &&
      user.profileId
        ?.status !==
        "approved"
    ) {
      throw new ApiError(
        403,
        "Your account is pending approval from the hospital."
      );
    }

    return {
      token:
        this.generateToken(
          user._id
        ),

      user: {
        id: user._id,
        email:
          user.email,
        role:
          user.role,
        profile:
          user.profileId,
      },
    };
  }

  // Get Current User
  static async getCurrentUser(
    authenticatedUserId
  ) {
    const user =
      await User.findById(
        authenticatedUserId
      ).populate(
        "profileId"
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    return {
      user: {
        id: user._id,
        email:
          user.email,
        role:
          user.role,
        profile:
          user.profileId,
      },
    };
  }

  // Reset Password
  static async resetPassword(
    payload
  ) {
    const {
      email,
      newPassword,
    } = payload;

    const user =
      await User.findOne({
        email,
      }).select(
        "+password"
      );

    if (!user) {
      throw new ApiError(
        404,
        "No account found with this email address"
      );
    }

    user.password =
      newPassword;

    await user.save();

    return {
      message:
        "Password reset successfully.",
    };
  }

  // Get User By ID
  static async getUserById(
    userId
  ) {
    const user =
      await User.findById(
        userId
      ).populate(
        "profileId"
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    return {
      user: {
        id: user._id,
        email:
          user.email,
        role:
          user.role,
        profile:
          user.profileId,
      },
    };
  }
}

module.exports = UserService;