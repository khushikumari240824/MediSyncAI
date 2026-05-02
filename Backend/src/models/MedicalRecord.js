const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: [String],
    treatment: {
      type: String,
    },
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],
    testResults: [
      {
        testName: String,
        result: String,
        date: Date,
      },
    ],
    notes: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.MedicalRecord ||
  mongoose.model("MedicalRecord", medicalRecordSchema);
