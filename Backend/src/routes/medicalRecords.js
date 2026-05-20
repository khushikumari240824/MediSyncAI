const express = require("express");
const { body, validationResult } = require("express-validator");
const MedicalRecord = require("../models/MedicalRecord");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Create medical record (Doctor)
router.post(
  "/",
  auth,
  authorize("doctor"),
  [body("patientId").notEmpty(), body("diagnosis").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const medicalRecord = new MedicalRecord({
        ...req.body,
        doctorId: doctor._id,
      });

      await medicalRecord.save();
      await medicalRecord.populate("patientId doctorId appointmentId");

      res.status(201).json(medicalRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Get patient medical records (Patient)
router.get("/patient", auth, authorize("patient"), async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const records = await MedicalRecord.find({ patientId: patient._id })
      .populate("doctorId", "firstName lastName specialization")
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get doctor's medical records
router.get("/doctor", auth, authorize("doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const records = await MedicalRecord.find({ doctorId: doctor._id })
      .populate("patientId", "firstName lastName")
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all medical records (Hospital)
router.get("/all", auth, authorize("hospital"), async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate("patientId", "firstName lastName phone")
      .populate("doctorId", "firstName lastName specialization")
      .populate("appointmentId")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single medical record
router.get("/:id", auth, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate("patientId")
      .populate("doctorId")
      .populate("appointmentId");

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update medical record (Doctor)
router.patch("/:id", auth, authorize("doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    if (record.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(record, req.body);
    await record.save();
    await record.populate("patientId doctorId appointmentId");

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
