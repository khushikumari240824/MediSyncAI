const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "admin",
        "doctor",
        "patient",
        "receptionist",
        "labTechnician",
        "hospital",
      ],
      required: true,
    },

    // Dynamic reference to Patient/Doctor/Hospital profile
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roleModel",
    },

    roleModel: {
      type: String,
      enum: ["Patient", "Doctor", "Hospital"],
    },

    profileImage: {
      type: String,
      default: "",
    },

    phoneNumber: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dateOfBirth: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      virtuals: true,
    },
  }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(
      this.password,
      saltRounds
    );

    next();
  } catch (error) {
    next(error);
  }
});

// Compare password during login
userSchema.methods.comparePassword =
  async function (candidatePassword) {
    return bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);