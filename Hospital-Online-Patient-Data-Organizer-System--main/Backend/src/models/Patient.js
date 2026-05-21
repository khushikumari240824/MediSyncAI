const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    allergies: [String],
    profilePicture: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

patientSchema.pre('save', async function (next) {
  if (!this.user) return next();
  try {
    const User = mongoose.model('User');
    const user = await User.findById(this.user).select('+role');
    if (!user) return next(new Error('Associated user not found'));
    if (user.role !== 'patient') return next(new Error('Linked user must have role "patient"'));
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
