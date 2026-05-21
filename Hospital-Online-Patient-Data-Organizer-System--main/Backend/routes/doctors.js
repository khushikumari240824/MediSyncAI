const express = require("express");
const Doctor = require("../models/Doctor");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Get doctor profile
router.get("/me", auth, authorize("doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all doctors (Patient/Hospital)
router.get("/all", auth, async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select("-userId")
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single doctor
router.get("/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-userId");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update doctor profile
router.patch("/me", auth, authorize("doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Update allowed fields (excluding licenseNumber and userId)
    const allowedUpdates = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "specialization",
      "qualification",
      "department",
      "experience",
      "consultationFee",
      "availability",
      "profilePicture",
    ];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all doctors (Hospital - with full access)
router.get("/hospital/all", auth, authorize("hospital"), async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
