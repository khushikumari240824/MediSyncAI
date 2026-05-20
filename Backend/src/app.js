const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

// Root test route
app.get("/", (req, res) => {
  res.send("MediSync AI Backend Running");
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/medical-records", require("./routes/medicalRecords"));
app.use("/api/hospital", require("./routes/hospital"));
app.use("/api/ai", require("./routes/ai.routes"));

module.exports = app;