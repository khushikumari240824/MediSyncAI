const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    diagnosis: {
      type: String,
      trim: true,
    },

    symptoms: [
      {
        type: String,
      },
    ],

    treatment: {
      type: String,
      trim: true,
    },

    medications: [
      {
        medicineName: String,
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

    recordType: {
      type: String,
      enum: [
        "image",
        "pdf",
        "lab-report",
        "prescription",
        "other",
      ],
      default: "other",
    },

    cloudinaryUrl: {
      type: String,
    },

    cloudinaryPublicId: {
      type: String,
    },

    fileName: {
      type: String,
    },

    mimeType: {
      type: String,
    },

    size: {
      type: Number,
    },

    prescription: {
      type: String,
    },

    notes: {
      type: String,
    },

    followUpDate: {
      type: Date,
    },

    visibility: {
      type: String,
      enum: ["private", "shared", "public"],
      default: "private",
    },
  },
  {
    timestamps: true,
  }
);

medicalRecordSchema.index({
  patient: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);