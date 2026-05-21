import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Grid,
  Chip,
  Avatar,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  LocalHospital,
  Logout,
  CalendarToday,
  MedicalServices,
  Person,
  CheckCircle,
  Schedule,
  Add,
  History,
  Info,
  SmartToy,
} from "@mui/icons-material";
import ThemeToggle from '../components/common/ThemeToggle';
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import StatsCard from "../components/common/StatsCard";
import PageHeader from "../components/common/PageHeader";

const PatientDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // Dialogs
  const [openAppointment, setOpenAppointment] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For viewing advice

  const [appointmentData, setAppointmentData] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });
  const [message, setMessage] = useState("");
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem("patientDashboardTab");
    return savedTab ? parseInt(savedTab, 10) : 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem("patientDashboardTab", newValue);
  };

  useEffect(() => {
    const loadData = () => {
      fetchAppointments();
      fetchDoctors();
      fetchMedicalRecords();
    };

    loadData(); // Initial load
    const interval = setInterval(loadData, 30000); // Reload every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments/patient");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/doctors/all");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await api.get("/medical-records/patient");
      setMedicalRecords(response.data);
    } catch (error) {
      console.error("Error fetching medical records:", error);
    }
  };

  // Helpers for compatibility with new backend shapes
  const getDoctor = (item) => item.doctor || item.doctorId || null;
  const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

  const getScheduledAt = (apt) => {
    if (!apt) return null;

    // Try scheduledAt in multiple shapes (ISO string, Date, Mongo extended JSON)
    if (apt.scheduledAt) {
      const raw = apt.scheduledAt;
      let dt = null;
      if (raw instanceof Date) dt = raw;
      else if (typeof raw === "string") dt = new Date(raw);
      else if (raw.$date) dt = new Date(raw.$date);

      if (isValidDate(dt)) return dt;
    }

    // Fallback to appointmentDate + appointmentTime
    if (apt.appointmentDate && apt.appointmentTime) {
      const datePart = apt.appointmentDate.includes("T")
        ? apt.appointmentDate.split("T")[0]
        : apt.appointmentDate;
      const combined = `${datePart}T${apt.appointmentTime}`;
      const dt = new Date(combined);
      if (isValidDate(dt)) return dt;
    }

    if (apt.appointmentDate) {
      const dt = new Date(apt.appointmentDate);
      if (isValidDate(dt)) return dt;
    }

    return null;
  };

  const handleBookAppointment = async () => {
    try {
      await api.post("/appointments", appointmentData);
      setMessage("Appointment booked successfully!");
      setOpenAppointment(false);
      setAppointmentData({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
      });
      fetchAppointments();
    } catch (error) {
      setMessage(
        "Error booking appointment: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const activeAppointments = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed",
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled",
  );

  const handleViewAdvice = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenHistory(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
      case "confirmed":
      case "completed":
        return "success";
      case "pending":
      case "checked-in":
      case "in-progress":
        return "warning";
      case "cancelled":
      case "no-show":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 4 }}>
      {/* Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: "12px",
              color: "primary.main",
              display: "flex",
            }}
          >
            <LocalHospital />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.02em",
            }}
          >
            Patient
            <Box component="span" sx={{ color: "primary.main" }}>
              Portal
            </Box>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ThemeToggle />
            <Button
              color="inherit"
              onClick={() => navigate("/profile")}
              startIcon={<Person />}
              sx={{ borderRadius: "10px", px: 2 }}
            >
              Profile
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{ borderRadius: "10px", px: 2, boxShadow: "none" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <PageHeader
          title={`Hello, ${user?.firstName || "User"}`}
          subtitle="Manage your health journey"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenAppointment(true)}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: "0 8px 16px -4px rgba(0,118,255,0.39)",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Book Appointment
              </Button>
              <Button
                variant="outlined"
                startIcon={<SmartToy />}
                onClick={() => navigate('/ai-chat')}
                sx={{ borderRadius: '12px', px: 2 }}
              >
                AI Assistant
              </Button>
            </Box>
          }
        />

        {message && (
          <Alert
            severity={message.includes("Error") ? "error" : "success"}
            sx={{ mb: 3 }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Upcoming Visits"
              value={activeAppointments.length}
              icon={CalendarToday}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Past Visits"
              value={pastAppointments.length}
              icon={History}
              color={theme.palette.text.secondary}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Medical Records"
              value={medicalRecords.length}
              icon={MedicalServices}
              color={theme.palette.secondary.main}
            />
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              px: 2,
              "& .MuiTab-root": {
                minHeight: 64,
                fontSize: "0.95rem",
                fontWeight: 600,
                textTransform: "none",
              },
            }}
          >
            <Tab
              label="Upcoming Appointments"
              icon={<Schedule sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab
              label="Past History"
              icon={<History sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab
              label="Medical Reports"
              icon={<MedicalServices sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          </Tabs>

          {/* Upcoming Tab */}
          {tabValue === 0 && (
            <Box>
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Date & Time
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Doctor
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Reason
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeAppointments.map((appointment) => (
                      <TableRow
                        key={appointment._id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                          },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.primary"
                          >
                            {getScheduledAt(appointment)
                              ? getScheduledAt(appointment).toLocaleDateString()
                              : "-"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getScheduledAt(appointment)
                              ? getScheduledAt(appointment).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : appointment.appointmentTime || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: "primary.main",
                              }}
                            >
                              {getDoctor(appointment)?.firstName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.primary"
                              >
                                Dr. {getDoctor(appointment)?.firstName} {" "}
                                {getDoctor(appointment)?.lastName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {getDoctor(appointment)?.specialization}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 250 }}
                          >
                            {appointment.reason}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                            sx={{
                              borderRadius: "8px",
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {activeAppointments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              opacity: 0.5,
                            }}
                          >
                            <CalendarToday sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="h6">
                              No upcoming appointments
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Past History Tab */}
          {tabValue === 1 && (
            <Box>
              <Alert severity="info" sx={{ m: 2, borderRadius: "12px" }}>
                This section contains your completed appointments and doctor's
                advice.
              </Alert>
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Doctor
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Reason
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Result
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pastAppointments.map((appointment) => (
                      <TableRow
                        key={appointment._id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                          },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.primary"
                          >
                            {getScheduledAt(appointment)
                              ? getScheduledAt(appointment).toLocaleDateString()
                              : "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: alpha(
                                  theme.palette.text.secondary,
                                  0.1,
                                ),
                                color: "text.secondary",
                              }}
                            >
                              {getDoctor(appointment)?.firstName?.[0]}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              Dr. {getDoctor(appointment)?.firstName} {" "}
                              {getDoctor(appointment)?.lastName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {appointment.reason}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                            sx={{
                              borderRadius: "8px",
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {appointment.advice ? (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleViewAdvice(appointment)}
                              startIcon={<CheckCircle />}
                              sx={{ borderRadius: "8px" }}
                            >
                              View Advice
                            </Button>
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              No advice yet
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {pastAppointments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              opacity: 0.5,
                            }}
                          >
                            <History sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="h6">
                              No past history available
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Medical Records Tab */}
          {tabValue === 2 && (
            <Box>
              <Alert severity="info" sx={{ m: 2, borderRadius: "12px" }}>
                Official medical reports, diagnoses, and lab results created by
                your doctors.
              </Alert>
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Doctor
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Specialization
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Diagnosis
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Treatment
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicalRecords.map((record) => (
                      <TableRow
                        key={record._id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                          },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.primary"
                          >
                            {new Date(record.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(record.createdAt).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: "primary.main",
                                fontSize: "0.875rem",
                              }}
                            >
                              {getDoctor(record)?.firstName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                Dr. {getDoctor(record)?.firstName}{" "}
                                {getDoctor(record)?.lastName}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                            <Chip
                            label={getDoctor(record)?.specialization || "N/A"}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: "6px" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {record.diagnosis || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {record.treatment || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedAppointment(record);
                              setOpenHistory(true);
                            }}
                            startIcon={<Info />}
                            sx={{ borderRadius: "8px" }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {medicalRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              opacity: 0.5,
                            }}
                          >
                            <MedicalServices sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="h6">
                              No medical reports found
                            </Typography>
                            <Typography variant="body2">
                              Your medical reports will appear here once your
                              doctor creates them.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>

        {/* Book Appointment Dialog */}
        <Dialog
          open={openAppointment}
          onClose={() => setOpenAppointment(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogContent dividers>
            <TextField
              select
              fullWidth
              label="Select Doctor"
              margin="normal"
              value={appointmentData.doctorId}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  doctorId: e.target.value,
                })
              }
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName} -{" "}
                  {doctor.specialization}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Date"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={appointmentData.appointmentDate}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  appointmentDate: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Time"
              type="time"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={appointmentData.appointmentTime}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  appointmentTime: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Reason for Visit"
              margin="normal"
              multiline
              rows={3}
              value={appointmentData.reason}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  reason: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAppointment(false)}>Cancel</Button>
            <Button onClick={handleBookAppointment} variant="contained">
              Book Now
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Advice/Medical Record Dialog */}
        <Dialog
          open={openHistory}
          onClose={() => setOpenHistory(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedAppointment?.advice
              ? "Doctor's Advice & Prescription"
              : "Medical Report Details"}
          </DialogTitle>
          <DialogContent dividers>
            {selectedAppointment && (
              <Box>
                {selectedAppointment.advice ? (
                  // Appointment Advice View
                  <>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Diagnosis/Advice
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, mb: 3, bgcolor: "background.default" }}
                    >
                      <Typography>{selectedAppointment.advice}</Typography>
                    </Paper>

                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Prescription
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Typography style={{ whiteSpace: "pre-line" }}>
                        {selectedAppointment.prescription ||
                          "No prescription provided."}
                      </Typography>
                    </Paper>
                  </>
                ) : (
                  // Medical Record View
                  <>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {new Date(
                            selectedAppointment.createdAt,
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            selectedAppointment.createdAt,
                          ).toLocaleTimeString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Doctor
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          Dr. {getDoctor(selectedAppointment)?.firstName} {" "}
                          {getDoctor(selectedAppointment)?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getDoctor(selectedAppointment)?.specialization}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Diagnosis
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, mb: 3, bgcolor: "background.default" }}
                    >
                      <Typography>
                        {selectedAppointment.diagnosis ||
                          "No diagnosis provided."}
                      </Typography>
                    </Paper>

                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Treatment
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, mb: 3, bgcolor: "background.default" }}
                    >
                      <Typography style={{ whiteSpace: "pre-line" }}>
                        {selectedAppointment.treatment ||
                          "No treatment details provided."}
                      </Typography>
                    </Paper>

                    {selectedAppointment.notes && (
                      <>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Additional Notes
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, bgcolor: "background.default" }}
                        >
                          <Typography style={{ whiteSpace: "pre-line" }}>
                            {selectedAppointment.notes}
                          </Typography>
                        </Paper>
                      </>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHistory(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PatientDashboard;
