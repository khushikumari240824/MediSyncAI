import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Box,
  Avatar,
  Typography,
  Button,
  Alert,
  MenuItem,
  IconButton,
  CircularProgress,
  AppBar,
  Toolbar,
  alpha,
  useTheme,
  Stack,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  CameraAlt,
  Logout,
  ArrowBack,
  Email,
  Phone,
} from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let endpoint;
        if (user.role === "hospital") {
          endpoint = "/hospital/profile";
        } else {
          endpoint = `/${user.role}s/me`;
        }
        const response = await api.get(endpoint);
        setProfileData(response.data);
        setFormData(response.data);
        if (response.data.profilePicture) {
          setPreviewImage(response.data.profilePicture);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Error loading profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}), // Null safety
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        setFormData((prev) => ({
          ...prev,
          profilePicture: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      let endpoint;
      if (user.role === "hospital") {
        endpoint = "/hospital/profile";
      } else {
        endpoint = `/${user.role}s/me`;
      }

      const response = await api.patch(endpoint, formData);
      setProfileData(response.data);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setPreviewImage(profileData?.profilePicture || null);
    setIsEditing(false);
    setMessage("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (profileData?.firstName && profileData?.lastName) {
      return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
    }
    if (profileData?.name) {
      return profileData.name.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          <IconButton
            onClick={() => navigate(`/${user.role}`)}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
            }}
          >
            <ArrowBack />
          </IconButton>
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
            My
            <Box component="span" sx={{ color: "primary.main" }}>
              Profile
            </Box>
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{ borderRadius: "10px", boxShadow: "none" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        {message && (
          <Alert
            severity={message.includes("Error") ? "error" : "success"}
            sx={{
              mb: 4,
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Sidebar / Profile Card */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "32px",
                border: "1px solid",
                borderColor: "divider",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
                position: "sticky",
                top: 100,
              }}
            >
              <Box
                sx={{ position: "relative", display: "inline-block", mb: 3 }}
              >
                <Avatar
                  src={previewImage}
                  sx={{
                    width: 160,
                    height: 160,
                    margin: "0 auto",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontSize: "4rem",
                    fontWeight: 700,
                    border: "6px solid white",
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                  }}
                >
                  {!previewImage && getInitials()}
                </Avatar>
                {isEditing && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: "primary.main",
                      color: "white",
                      border: "4px solid white",
                      "&:hover": { bgcolor: "primary.dark" },
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CameraAlt fontSize="small" />
                  </IconButton>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </Box>

              <Typography
                variant="h5"
                sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}
              >
                {profileData?.firstName && profileData?.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : profileData?.name || "User"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  mb: 3,
                }}
              >
                {user.role}
              </Typography>

              <Stack spacing={2} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    bgcolor: "white",
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Email color="primary" fontSize="small" />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.email || profileData?.email}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    bgcolor: "white",
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Phone color="primary" fontSize="small" />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "text.secondary" }}
                  >
                    {profileData?.phone || "No phone set"}
                  </Typography>
                </Box>
              </Stack>

              {!isEditing ? (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    py: 1.5,
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                      py: 1.5,
                      borderRadius: "16px",
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                      boxShadow: `0 8px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
                    }}
                  >
                    {saving ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{ py: 1.5, borderRadius: "16px" }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* Form Content */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: "32px",
                border: "1px solid",
                borderColor: "divider",
                background: "white",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 24,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                  }}
                />
                Account Settings
              </Typography>

              <Grid container spacing={3}>
                {user.role === "patient" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData?.firstName || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData?.lastName || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={
                          formData?.dateOfBirth
                            ? new Date(formData.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Gender"
                        name="gender"
                        value={formData?.gender || ""}
                        disabled={true}
                      />
                    </Grid>
                  </>
                )}

                {user.role === "doctor" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData?.firstName || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData?.lastName || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Specialization"
                        name="specialization"
                        value={formData?.specialization || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Qualification"
                        name="qualification"
                        value={formData?.qualification || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Experience (years)"
                        name="experience"
                        type="number"
                        value={formData?.experience || 0}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Consultation Fee"
                        name="consultationFee"
                        type="number"
                        value={formData?.consultationFee || 0}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={formData?.department || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </>
                )}

                {user.role === "hospital" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Hospital Name"
                        name="name"
                        value={formData?.name || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Reg. Number"
                        name="registrationNumber"
                        value={formData?.registrationNumber || ""}
                        disabled={true}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || formData?.email}
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData?.phone || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>

                {/* Address Section */}
                {(user.role === "patient" || user.role === "hospital") && (
                  <>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 24,
                            bgcolor: "secondary.main",
                            borderRadius: 1,
                          }}
                        />
                        Location Details
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        name="address.street"
                        value={formData?.address?.street || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="City"
                        name="address.city"
                        value={formData?.address?.city || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="State"
                        name="address.state"
                        value={formData?.address?.state || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Zip Code"
                        name="address.zipCode"
                        value={formData?.address?.zipCode || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </>
                )}

                {user.role === "patient" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Blood Group"
                        name="bloodGroup"
                        value={formData?.bloodGroup || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (group) => (
                            <MenuItem key={group} value={group}>
                              {group}
                            </MenuItem>
                          ),
                        )}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Allergies (comma separated)"
                        name="allergies"
                        value={
                          Array.isArray(formData?.allergies)
                            ? formData.allergies.join(", ")
                            : ""
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            allergies: e.target.value
                              .split(",")
                              .map((a) => a.trim())
                              .filter((a) => a),
                          }))
                        }
                        disabled={!isEditing}
                        placeholder="e.g., Peanuts, Penicillin"
                      />
                    </Grid>
                  </>
                )}

                {user.role === "hospital" && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Departments (comma separated)"
                      name="departments"
                      value={
                        Array.isArray(formData?.departments)
                          ? formData.departments.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          departments: e.target.value
                            .split(",")
                            .map((d) => d.trim())
                            .filter((d) => d),
                        }))
                      }
                      disabled={!isEditing}
                      placeholder="e.g., Cardiology, Neurology, Pediatrics"
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
