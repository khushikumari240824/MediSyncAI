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
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";
import {
  Logout,
  CalendarToday,
  MedicalServices,
  Person,
  CheckCircle,
  Schedule,
  AddBox,
  History,
} from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import StatsCard from "../components/common/StatsCard";
import PageHeader from "../components/common/PageHeader";

const DoctorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Dialogs
  const [openAdvice, setOpenAdvice] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  // Data
  const [adviceData, setAdviceData] = useState({
    advice: "",
    prescription: "",
  });
  const [reportData, setReportData] = useState({
    patientId: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  // allow attaching a file for uploads
  // `file` will be a File object when selected
  // keep it inside reportData as `file`
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);

  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem("doctorDashboardTab");
    return savedTab ? parseInt(savedTab, 10) : 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem("doctorDashboardTab", newValue);
  };
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = () => {
      fetchAppointments();
      fetchMedicalRecords();
    };

    loadData();
    const interval = setInterval(loadData, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments/doctor");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await api.get("/medical-records/doctor");
      setMedicalRecords(response.data);
    } catch (error) {
      console.error("Error fetching medical records:", error);
    }
  };

  // Helpers to support both old and new backend field names
  const getPatient = (item) => item.patient || item.patientId || null;
  const getDoctor = (item) => item.doctor || item.doctorId || null;
  const getScheduledAt = (apt) => {
    if (!apt) return null;
    if (apt.scheduledAt) return new Date(apt.scheduledAt);
    if (apt.appointmentDate && apt.appointmentTime)
      return new Date(`${apt.appointmentDate}T${apt.appointmentTime}`);
    if (apt.appointmentDate) return new Date(apt.appointmentDate);
    return null;
  };

  // --- Actions ---

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status });
      setMessage("Status updated successfully!");
      fetchAppointments();
    } catch (error) {
      setMessage(
        "Error updating status: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleOpenAdvice = (appointment) => {
    setSelectedAppointment(appointment);
    setAdviceData({
      advice: appointment.advice || "",
      prescription: appointment.prescription || "",
    });
    setOpenAdvice(true);
  };

  const handleSubmitAdvice = async () => {
    try {
      await api.patch(
        `/appointments/${selectedAppointment._id}/advice`,
        adviceData,
      );
      setMessage("Advice added successfully!");
      setOpenAdvice(false);
      fetchAppointments();
    } catch (error) {
      setMessage(
        "Error submitting advice: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleCreateReport = async () => {
    try {
      if (reportData.file) {
        const fd = new FormData();
        fd.append("file", reportData.file);
        fd.append("patientId", reportData.patientId);
        fd.append("diagnosis", reportData.diagnosis || "");
        fd.append("treatment", reportData.treatment || "");
        fd.append("notes", reportData.notes || "");
        await api.post("/medical-records/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/medical-records", reportData);
      }
      setMessage("Medical report created successfully!");
      setOpenReport(false);
      setReportData({ patientId: "", diagnosis: "", treatment: "", notes: "", file: null });
      fetchMedicalRecords();
    } catch (error) {
      console.log(error);
      setMessage(
        "Error creating report: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const viewPatientHistory = async (patientId) => {
    // In a real app, you might fetch specific history here.
    // For now, we filter existing loaded data for simplicity,
    // but ideally we should hit an endpoint like /api/patients/:id/history
    const patientAppointments = appointments.filter((a) => getPatient(a)?._id === patientId);
    const patientRecords = medicalRecords.filter((r) => (r.patient || r.patientId)?._id === patientId);

    setSelectedPatientHistory({
      appointments: patientAppointments,
      records: patientRecords,
    });
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
          bgcolor: "rgba(255,255,255,0.8)",
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
            <MedicalServices />
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
            Doctor
            <Box component="span" sx={{ color: "primary.main" }}>
              Portal
            </Box>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          title={`Welcome back, Dr. ${user?.firstName || "Doctor"}`}
          subtitle="Manage your appointments and patient records effectively"
          action={
            <Button
              variant="contained"
              startIcon={<AddBox />}
              onClick={() => setOpenReport(true)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Create New Report
            </Button>
          }
        />

        {message && (
          <Alert
            severity={message.includes("Error") ? "error" : "success"}
            sx={{ mb: 3, borderRadius: "16px" }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Appointments"
              value={appointments.length}
              icon={CalendarToday}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Pending Requests"
              value={appointments.filter((a) => a.status === "pending").length}
              icon={Schedule}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Confirmed Today"
              value={
                appointments.filter((a) => a.status === "confirmed").length
              }
              icon={CheckCircle}
              color={theme.palette.success.main}
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

        {/* Content Area */}
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
              label="Appointments"
              icon={<CalendarToday sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab
              label="Medical Records"
              icon={<MedicalServices sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          </Tabs>

          {/* Appointments Tab */}
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
                        Patient
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
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment) => (
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
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Schedule sx={{ fontSize: 14 }} />{" "}
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
                                fontWeight: 700,
                              }}
                            >
                              {getPatient(appointment)?.firstName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {getPatient(appointment)?.firstName} {" "}
                                {getPatient(appointment)?.lastName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {getPatient(appointment)?.phone}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ maxWidth: 200 }}
                            noWrap
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
                              fontWeight: 600,
                              borderRadius: "8px",
                              textTransform: "capitalize",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() =>
                                handleStatusChange(appointment._id, "confirmed")
                              }
                              disabled={!(appointment.status === "pending" || appointment.status === "scheduled")}
                              sx={{ borderRadius: "8px" }}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              disableElevation
                              onClick={() => handleOpenAdvice(appointment)}
                              sx={{ borderRadius: "8px" }}
                            >
                              Advise
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() =>
                                viewPatientHistory(getPatient(appointment)?._id)
                              }
                              sx={{ color: "text.secondary" }}
                            >
                              <History />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {appointments.length === 0 && (
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
                            <CalendarToday sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="h6">
                              No appointments found
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
          {tabValue === 1 && (
            <Box>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
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
                        Patient
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
                                  theme.palette.secondary.main,
                                  0.1,
                                ),
                                color: "secondary.main",
                              }}
                            >
                              {(record.patient || record.patientId)?.firstName?.[0]}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                                {(record.patient || record.patientId)?.firstName} {" "}
                                {(record.patient || record.patientId)?.lastName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {record.diagnosis}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 300 }}
                          >
                            {record.treatment || "-"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {medicalRecords.length === 0 && (
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
                            <MedicalServices sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="h6">
                              No medical records found
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
      </Container>

      {/* Advice Dialog */}
      <Dialog
        open={openAdvice}
        onClose={() => setOpenAdvice(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Medical Advice & Prescription</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Advice"
            multiline
            rows={4}
            value={adviceData.advice}
            onChange={(e) =>
              setAdviceData({ ...adviceData, advice: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Prescription"
            multiline
            rows={4}
            value={adviceData.prescription}
            onChange={(e) =>
              setAdviceData({ ...adviceData, prescription: e.target.value })
            }
            margin="normal"
            helperText="Enter medications, dosage, and frequency"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdvice(false)}>Cancel</Button>
          <Button onClick={handleSubmitAdvice} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Report Dialog */}
      <Dialog
        open={openReport}
        onClose={() => setOpenReport(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Medical Report</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            fullWidth
            label="Select Patient"
            margin="normal"
            value={reportData.patientId}
            onChange={(e) =>
              setReportData({ ...reportData, patientId: e.target.value })
            }
          >
            {/* Unique patients from appointments */}
            {[
              ...new Map(
                appointments.map((item) => [
                  getPatient(item)?._id,
                  getPatient(item),
                ]),
              ).values(),
            ]
              .filter((p) => p) // filter undefined
              .map((patient) => (
                <MenuItem key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName} ({patient.phone})
                </MenuItem>
              ))}
          </TextField>
          <TextField
            fullWidth
            label="Diagnosis"
            value={reportData.diagnosis}
            onChange={(e) =>
              setReportData({ ...reportData, diagnosis: e.target.value })
            }
            margin="normal"
          />
          <Box sx={{ mt: 1, mb: 1 }}>
            <input
              id="report-file"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                setReportData({ ...reportData, file: e.target.files[0] })
              }
            />
          </Box>
          <TextField
            fullWidth
            label="Treatment Plan"
            multiline
            rows={3}
            value={reportData.treatment}
            onChange={(e) =>
              setReportData({ ...reportData, treatment: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={2}
            value={reportData.notes}
            onChange={(e) =>
              setReportData({ ...reportData, notes: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReport(false)}>Cancel</Button>
          <Button onClick={handleCreateReport} variant="contained">
            Create Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Patient History Dialog */}
      <Dialog
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Patient History</DialogTitle>
        <DialogContent dividers>
          {selectedPatientHistory && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Past Appointments
              </Typography>
              {selectedPatientHistory.appointments.length > 0 ? (
                <List>
                  {selectedPatientHistory.appointments.map((apt) => (
                    <React.Fragment key={apt._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`${getScheduledAt(apt)
                            ? getScheduledAt(apt).toLocaleDateString()
                            : "-"} - ${apt.status}`}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                Reason: {apt.reason}
                              </Typography>
                              {apt.advice && <br />}
                              {apt.advice && `Advice: ${apt.advice}`}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No past appointments.
                </Typography>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Medical Records
              </Typography>
              {selectedPatientHistory.records.length > 0 ? (
                <List>
                  {selectedPatientHistory.records.map((rec) => (
                    <React.Fragment key={rec._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`${new Date(rec.createdAt).toLocaleDateString()} - ${rec.diagnosis}`}
                          secondary={rec.treatment}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No medical records.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorDashboard;
