import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Grid,
  Fade,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Card,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  PersonAdd,
  Person,
  MedicalServices,
  Business,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    specialization: '',
    licenseNumber: '',
    department: '',
    name: '',
    registrationNumber: ''
  });
  const [error, setError] = useState('');
  const { register, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (activeStep === 0 && !role) {
      setError('Please select a role to continue');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register(role, formData);
    if (result.success && result.user) {
      navigate(`/${result.user.role}`);
    } else {
      setError(result.message);
    }
  };

  const roleOptions = [
    {
      value: 'patient',
      label: 'Patient',
      description: 'Book appointments & view history',
      icon: <Person sx={{ fontSize: 32 }} />,
      color: '#10b981'
    },
    {
      value: 'doctor',
      label: 'Doctor',
      description: 'Manage patients & records',
      icon: <MedicalServices sx={{ fontSize: 32 }} />,
      color: '#3b82f6'
    },
    {
      value: 'hospital',
      label: 'Hospital',
      description: 'Administer system & staff',
      icon: <Business sx={{ fontSize: 32 }} />,
      color: '#f59e0b'
    },
  ];

  const steps = ['Choose Role', 'Account Info', 'Personal Details'];

  const renderRoleSelection = () => (
    <Grid container spacing={3}>
      {roleOptions.map((option) => (
        <Grid item xs={12} sm={4} key={option.value}>
          <Card
            onClick={() => {
              setRole(option.value);
              setError('');
            }}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px solid',
              borderColor: role === option.value ? option.color : 'transparent',
              background: role === option.value ? alpha(option.color, 0.05) : 'rgba(255,255,255,0.5)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 24px -4px ${alpha(option.color, 0.2)}`,
                borderColor: alpha(option.color, 0.5)
              }
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                bgcolor: alpha(option.color, 0.1),
                color: option.color,
                mb: 2,
                transition: 'all 0.3s ease'
              }}
            >
              {option.icon}
            </Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              {option.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {option.description}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderAccountDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          helperText="Must be at least 6 characters"
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }}
        />
      </Grid>
    </Grid>
  );

  const renderSpecificDetails = () => {
    switch (role) {
      case 'patient':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Date of Birth" name="dateOfBirth" type="date" InputLabelProps={{ shrink: true }} value={formData.dateOfBirth} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select required fullWidth label="Gender" name="gender" value={formData.gender} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      case 'doctor':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Department" name="department" value={formData.department} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
          </Grid>
        );
      case 'hospital':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField required fullWidth label="Hospital Name" name="name" value={formData.name} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.5)' } }} />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(179, 118, 118, 0.84) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s infinite linear',
        },
        '@keyframes float': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(-50px, -50px)' },
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 6 },
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px -10px rgba(0,0,0,0.1)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0288d1 0%, #26a69a 100%)',
                  mb: 3,
                  boxShadow: '0 10px 25px rgba(2, 136, 209, 0.3)',
                }}
              >
                <PersonAdd sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #0288d1 0%, #10b981 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                Join our advanced healthcare ecosystem
              </Typography>
            </Box>

            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: 6,
                '& .MuiStepLabel-label': { fontWeight: 600, mt: 1 },
                '& .MuiStepIcon-root': { fontSize: 28 },
                '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
                '& .MuiStepIcon-root.Mui-completed': { color: 'success.main' },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ minHeight: 320, mb: 4 }}>
                <Fade in={true} key={activeStep}>
                  <Box>
                    {activeStep === 0 && renderRoleSelection()}
                    {activeStep === 1 && renderAccountDetails()}
                    {activeStep === 2 && renderSpecificDetails()}
                  </Box>
                </Fade>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                  sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible', fontSize: '1rem', px: 3 }}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<PersonAdd />}
                    disabled={authLoading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #0288d1 0%, #10b981 100%)',
                      boxShadow: '0 8px 20px -4px rgba(2, 136, 209, 0.4)'
                    }}
                  >
                    {authLoading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                    sx={{ px: 4, py: 1.5, borderRadius: '12px', fontSize: '1rem' }}
                  >
                    Next Step
                  </Button>
                )}
              </Box>

              <Box textAlign="center" sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                    }}
                  >
                    Login here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
