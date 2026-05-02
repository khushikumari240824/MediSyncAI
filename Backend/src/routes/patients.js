const express = require("express");
const Patient = require("../models/Patient");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Get patient profile
router.get("/me", auth, authorize("patient"), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all patients (Hospital)
router.get("/all", auth, authorize("hospital"), async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update patient profile
router.patch("/me", auth, authorize("patient"), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    // Update allowed fields
    const allowedUpdates = [
      "firstName",
      "lastName",
      "phone",
      "address",
      "emergencyContact",
      "bloodGroup",
      "allergies",
      "profilePicture",
    ];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    await patient.save();
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single patient (Hospital/Doctor)
router.get("/:id", auth, authorize("hospital", "doctor"), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
