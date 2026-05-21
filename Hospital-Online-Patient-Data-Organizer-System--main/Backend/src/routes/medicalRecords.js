const express = require("express");
const { body, validationResult } = require("express-validator");
const MedicalRecord = require("../models/MedicalRecord");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const { auth, authorize } = require("../middlewares/auth");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;

// configure cloudinary using env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = express.Router();

const getPatientProfile = async (user) => {
  if (user?.profileId && user.roleModel === "Patient") {
    return user.profileId;
  }

  return Patient.findOne({ user: user?._id });
};

const getDoctorProfile = async (user) => {
  if (user?.profileId && user.roleModel === "Doctor") {
    return user.profileId;
  }

  return Doctor.findOne({ user: user?._id });
};

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

      const doctor = await getDoctorProfile(req.user);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const medicalRecord = new MedicalRecord({
          ...req.body,
          doctor: doctor._id,
      });

      await medicalRecord.save();
      await medicalRecord.populate("patient doctor appointment");

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
    const patient = await getPatientProfile(req.user);
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const records = await MedicalRecord.find({ patient: patient._id })
      .populate("doctor", "firstName lastName specialization")
      .populate("appointment")
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
    const doctor = await getDoctorProfile(req.user);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const records = await MedicalRecord.find({ doctor: doctor._id })
      .populate("patient", "firstName lastName")
      .populate("appointment")
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
      .populate("patient", "firstName lastName phone")
      .populate("doctor", "firstName lastName specialization")
      .populate("appointment")
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
      .populate("patient")
      .populate("doctor")
      .populate("appointment");

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
    const doctor = await getDoctorProfile(req.user);
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    if (record.doctor && record.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(record, req.body);
    await record.save();
    await record.populate("patient doctor appointment");

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Upload medical record file to Cloudinary (Doctor)
router.post(
  "/upload",
  auth,
  authorize("doctor"),
  upload.single("file"),
  async (req, res) => {
    try {
      const doctor = await getDoctorProfile(req.user);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const { patientId, recordType, notes } = req.body;
      if (!patientId) {
        return res.status(400).json({ message: "patientId is required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "File is required" });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "medical_records", resource_type: "auto" },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
          }

          const record = new MedicalRecord({
            patient: patientId,
            doctor: doctor._id,
            uploadedBy: req.user._id,
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            recordType: recordType || "other",
            notes: notes || "",
          });

          await record.save();
          await record.populate("patient doctor appointment");

          return res.status(201).json(record);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

module.exports = router;
