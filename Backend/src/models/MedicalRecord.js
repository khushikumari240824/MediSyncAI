const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recordType: {
      type: String,
      enum: ['image', 'pdf', 'lab-report', 'prescription', 'other'],
      default: 'other',
    },
    description: {
      type: String,
      trim: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
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
    tags: [String],
    visibility: {
      type: String,
      enum: ['private', 'shared', 'public'],
      default: 'private',
    },
  },
  {
    timestamps: true,
  },
);

medicalRecordSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', medicalRecordSchema);
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
