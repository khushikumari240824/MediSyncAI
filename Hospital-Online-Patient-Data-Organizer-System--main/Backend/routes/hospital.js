const express = require("express");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");
const Hospital = require("../models/Hospital");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Get hospital profile
router.get("/profile", auth, authorize("hospital"), async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }
    res.json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update hospital profile
router.patch("/profile", auth, authorize("hospital"), async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital profile not found" });
    }

    // Update allowed fields (excluding registrationNumber and userId)
    const allowedUpdates = [
      "name",
      "phone",
      "email",
      "address",
      "departments",
      "profilePicture",
    ];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        hospital[field] = req.body[field];
      }
    });

    await hospital.save();
    res.json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get dashboard statistics
router.get("/dashboard", auth, authorize("hospital"), async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({
      status: "pending",
    });
    const completedAppointments = await Appointment.countDocuments({
      status: "completed",
    });
    const totalRecords = await MedicalRecord.countDocuments();

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      totalRecords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all data (comprehensive view)
router.get("/all-data", auth, authorize("hospital"), async (req, res) => {
  try {
    const patients = await Patient.find();
    const doctors = await Doctor.find();
    const appointments = await Appointment.find()
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName specialization");
    const records = await MedicalRecord.find()
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");

    res.json({
      patients,
      doctors,
      appointments,
      records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get pending doctors
router.get(
  "/doctors/pending",
  auth,
  authorize("hospital"),
  async (req, res) => {
    try {
      const pendingDoctors = await Doctor.find({ status: "pending" }).populate(
        "userId",
        "email",
      );
      res.json(pendingDoctors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Approve doctor
router.patch(
  "/doctors/:id/approve",
  auth,
  authorize("hospital"),
  async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      doctor.status = "approved";
      await doctor.save();
      res.json({ message: "Doctor approved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Reject doctor
router.patch(
  "/doctors/:id/reject",
  auth,
  authorize("hospital"),
  async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      doctor.status = "rejected";
      await doctor.save();
      res.json({ message: "Doctor rejected" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

module.exports = router;
