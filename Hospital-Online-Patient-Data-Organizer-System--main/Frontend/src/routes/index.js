const express = require("express");

const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/patients", require("../../../Backend/src/routes/patients"));
router.use("/doctors", require("../../../Backend/src/routes/doctors"));
router.use(
  "/appointments",
  require("../../../Backend/src/routes/appointments"),
);
router.use(
  "/medical-records",
  require("../../../Backend/src/routes/medicalRecords"),
);
router.use("/hospital", require("../../../Backend/src/routes/hospital"));

module.exports = router;
