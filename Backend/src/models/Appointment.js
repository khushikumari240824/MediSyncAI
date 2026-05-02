const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    reason: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    prescription: {
      type: String,
    },
    advice: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
