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
  Grid,
  Tabs,
  Tab,
  Avatar,
  Chip,
  useTheme,
  Alert,
  alpha,
  Stack,
} from "@mui/material";
import {
  Logout,
  People,
  MedicalServices,
  CalendarToday,
  Assignment,
  Person,
} from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import StatsCard from "../components/common/StatsCard";
import PageHeader from "../components/common/PageHeader";

const HospitalDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [stats, setStats] = useState({});
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem("hospitalDashboardTab");
    return savedTab ? parseInt(savedTab, 10) : 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem("hospitalDashboardTab", newValue);
  };
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData(); // Initial load
    const interval = setInterval(fetchDashboardData, 30000); // Reload every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        statsRes,
        patientsRes,
        doctorsRes,
        pendingRes,
        appointmentsRes,
        recordsRes,
      ] = await Promise.all([
        api.get("/hospital/dashboard"),
        api.get("/patients/all"),
        api.get("/doctors/hospital/all"),
        api.get("/hospital/doctors/pending"),
        api.get("/appointments/all"),
        api.get("/medical-records/all"),
      ]);
      setStats(statsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setPendingDoctors(pendingRes.data);
      setAppointments(appointmentsRes.data);
      setMedicalRecords(recordsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    }
  };

  // Helpers to support both old and new backend field names
  const getPatient = (item) => item.patient || item.patientId || null;
  const getDoctor = (item) => item.doctor || item.doctorId || null;
  const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

  const getScheduledAt = (apt) => {
    if (!apt) return null;

    if (apt.scheduledAt) {
      const raw = apt.scheduledAt;
      let dt = null;
      if (raw instanceof Date) dt = raw;
      else if (typeof raw === "string") dt = new Date(raw);
      else if (raw.$date) dt = new Date(raw.$date);

      if (isValidDate(dt)) return dt;
    }

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

  const handleApproveDoctor = async (doctorId) => {
    try {
      await api.patch(`/hospital/doctors/${doctorId}/approve`);
      setPendingDoctors(pendingDoctors.filter((doc) => doc._id !== doctorId));
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error approving doctor:", error);
      setError("Failed to approve doctor.");
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      await api.patch(`/hospital/doctors/${doctorId}/reject`);
      setPendingDoctors(pendingDoctors.filter((doc) => doc._id !== doctorId));
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      setError("Failed to reject doctor.");
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
          {/* <Business sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} /> */}
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
            Hospital
            <Box component="span" sx={{ color: "primary.main" }}>
              Admin
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
          title={`Welcome, ${user?.name || "Admin"}`}
          subtitle="Hospital Overview & Management"
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "16px" }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Patients"
              value={stats.totalPatients || patients.length}
              icon={People}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Doctors"
              value={stats.totalDoctors || doctors.length}
              icon={MedicalServices}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Appointments"
              value={stats.totalAppointments || appointments.length}
              icon={CalendarToday}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Medical Records"
              value={stats.totalRecords || medicalRecords.length}
              icon={Assignment}
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
              label="Patients"
              icon={<People sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab
              label="Doctors"
              icon={<MedicalServices sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab
              label="Doctor Approvals"
              icon={<Person sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab
              label="Appointments"
              icon={<CalendarToday sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab
              label="Medical Records"
              icon={<Assignment sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          </Tabs>

          {/* Patients Tab */}
          {tabValue === 0 && (
            <Box>
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Date of Birth
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Gender
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Phone
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Blood Group
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow
                        key={patient._id}
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
                              {patient.firstName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.primary"
                              >
                                {patient.firstName} {patient.lastName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                ID: {patient._id?.substring(0, 8)}...
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {new Date(patient.dateOfBirth).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {patient.gender || "-"}
                        </TableCell>
                        <TableCell>{patient.phone || "-"}</TableCell>
                        <TableCell>{patient.bloodGroup || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Doctors Tab */}
          {tabValue === 1 && (
            <Box>
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Specialization
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Department
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        License
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Phone
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctors.map((doctor) => (
                      <TableRow
                        key={doctor._id}
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
                                bgcolor: alpha(
                                  theme.palette.secondary.main,
                                  0.1,
                                ),
                                color: "secondary.main",
                              }}
                            >
                              {doctor.firstName?.[0]}
                            </Avatar>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="text.primary"
                            >
                              Dr. {doctor.firstName} {doctor.lastName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={doctor.specialization}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{doctor.department}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              bgcolor: "grey.100",
                              px: 1,
                              borderRadius: 1,
                            }}
                          >
                            {doctor.licenseNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{doctor.phone}</TableCell>
                      </TableRow>
                    ))}
                    {doctors.length === 0 && (
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
                            <MedicalServices sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="h6">
                              No doctors found
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

          {/* Doctor Approvals Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 0 }}>
              {pendingDoctors.length === 0 ? (
                <Box
                  sx={{
                    py: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: 0.5,
                  }}
                >
                  <Person sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6">
                    No pending doctor approvals
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell
                          sx={{ fontWeight: 600, color: "text.secondary" }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, color: "text.secondary" }}
                        >
                          Email
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, color: "text.secondary" }}
                        >
                          Specialization
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, color: "text.secondary" }}
                        >
                          License Number
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, color: "text.secondary" }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingDoctors.map((doctor) => (
                        <TableRow
                          key={doctor._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {doctor.firstName} {doctor.lastName}
                            </Typography>
                          </TableCell>
                          <TableCell>{doctor.userId?.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={doctor.specialization}
                              size="small"
                              color="default"
                            />
                          </TableCell>
                          <TableCell>{doctor.licenseNumber}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleApproveDoctor(doctor._id)}
                                disableElevation
                                sx={{ borderRadius: "8px" }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleRejectDoctor(doctor._id)}
                                sx={{ borderRadius: "8px" }}
                              >
                                Reject
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Appointments Tab */}
          {tabValue === 3 && (
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
                        Doctor
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Status
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
                          <Typography variant="body2">
                            {getPatient(appointment)?.firstName} {" "}
                            {getPatient(appointment)?.lastName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            Dr. {getDoctor(appointment)?.firstName} {" "}
                            {getDoctor(appointment)?.lastName}
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
                    {appointments.length === 0 && (
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
          {tabValue === 4 && (
            <Box>
              <Alert severity="info" sx={{ m: 2, borderRadius: "12px" }}>
                Complete medical records and reports for all patients in the
                hospital system.
              </Alert>
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
                        {/* Patient Column */}
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
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: "success.main",
                                fontSize: "1rem",
                              }}
                            >
                              {(record.patient || record.patientId)?.firstName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                color="text.primary"
                              >
                                {(record.patient || record.patientId)?.firstName}{" "}
                                {(record.patient || record.patientId)?.lastName}
                              </Typography>
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                ID:{" "}
                                {(record.patient || record.patientId)?._id
                                  ?.slice(-8)
                                  .toUpperCase() || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        {/* Doctor Column */}
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
                                fontSize: "1rem",
                              }}
                            >
                              {getDoctor(record)?.firstName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                color="text.primary"
                              >
                                Dr. {getDoctor(record)?.firstName}{" "}
                                {getDoctor(record)?.lastName}
                              </Typography>
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                {getDoctor(record)?.specialization || "General"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getDoctor(record)?.specialization || "N/A"}
                            size="small"
                            color="default"
                            variant="outlined"
                            sx={{ borderRadius: "6px", fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200, fontWeight: 500 }}
                          >
                            {record.diagnosis || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200, color: "text.secondary" }}
                          >
                            {record.treatment || "-"}
                          </Typography>
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
                            <Assignment sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="h6">
                              No medical records found
                            </Typography>
                            <Typography variant="body2">
                              Medical records will appear here once doctors
                              create them.
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
    </Box>
  );
};

export default HospitalDashboard;
