const express = require("express");
const { body, validationResult } = require("express-validator");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

const getPatientProfile = async (user) => {
  if (user?.profileId && user.roleModel === "Patient") {
    return user.profileId;
  }

  return Patient.findOne({ user: user?._id });
};

// Book appointment (Patient)
router.post(
  "/",
  auth,
  authorize("patient"),
  [
    body("doctorId").notEmpty(),
    body("appointmentDate").isISO8601(),
    body("appointmentTime").notEmpty(),
    body("reason").notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
      const patient = await getPatientProfile(req.user);

      if (!patient) {
        return res.status(404).json({ message: "Patient profile not found" });
      }

      let scheduledAt;
      if (appointmentDate && appointmentTime) {
        const datePart = appointmentDate.includes('T')
          ? appointmentDate.split('T')[0]
          : appointmentDate;
        scheduledAt = new Date(`${datePart}T${appointmentTime}`);
      } else if (appointmentDate) {
        scheduledAt = new Date(appointmentDate);
      } else {
        return res.status(400).json({ message: 'Invalid appointment date/time' });
      }

      const appointment = new Appointment({
        patient: patient._id,
        doctor: doctorId,
        scheduledAt,
        reason,
        status: "scheduled",
      });

      await appointment.save();
      await appointment.populate("patient doctor");

      res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Get patient appointments
router.get("/patient", auth, authorize("patient"), async (req, res) => {
  try {
    const patient = await getPatientProfile(req.user);
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate("doctor", "firstName lastName specialization department")
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get doctor appointments
router.get("/doctor", auth, authorize("doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "firstName lastName phone")
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all appointments (Hospital)
router.get("/all", auth, authorize("hospital"), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "firstName lastName phone")
      .populate("doctor", "firstName lastName specialization department")
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update appointment status (Doctor)
router.patch(
  "/:id/status",
  auth,
  authorize("doctor"),
  [
    body("status").isIn([
      "scheduled",
      "checked-in",
      "in-progress",
      "completed",
      "cancelled",
      "no-show",
    ]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const doctor = await Doctor.findOne({ user: req.user._id });
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      if (appointment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      appointment.status = req.body.status;
      await appointment.save();
      await appointment.populate("patient doctor");

      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Add advice/prescription (Doctor)
router.patch(
  "/:id/advice",
  auth,
  authorize("doctor"),
  [body("advice").notEmpty(), body("prescription").optional()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const doctor = await Doctor.findOne({ user: req.user._id });
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      if (appointment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      appointment.advice = req.body.advice;
      appointment.prescription = req.body.prescription || "";
      appointment.status = "completed";
      await appointment.save();
      await appointment.populate("patient doctor");

      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Get single appointment
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Role-based access: patient owner, doctor owner, hospital, admin
    const role = req.user.role;

    if (role === 'patient') {
      const patient = await getPatientProfile(req.user);
      if (!patient || appointment.patient.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else if (role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else if (!['hospital', 'admin'].includes(role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
