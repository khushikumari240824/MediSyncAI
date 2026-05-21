import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Fade,
  Grid,
  Card,
  CircularProgress
} from '@mui/material';
import {
  LocalHospital,
  Lock,
  Email,
  Person,
  MedicalServices,
  Business
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');
  const { login, resetPassword, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.role) {
      setSelectedRole(location.state.role);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await login(email, password);
    if (result.success && result.user) {
      const role = result.user.role;
      navigate(`/${role}`);
    } else {
      setError(result.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await resetPassword(email, password);
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        setShowReset(false);
        setSuccess('');
      }, 3000);
    } else {
      setError(result.message);
    }
  };

  const roleOptions = [
    {
      value: 'patient',
      label: 'Patient',
      icon: <Person sx={{ fontSize: 40 }} />,
      color: '#10b981',
      description: 'Access your appointments and medical records'
    },
    {
      value: 'doctor',
      label: 'Doctor',
      icon: <MedicalServices sx={{ fontSize: 40 }} />,
      color: '#3b82f6',
      description: 'Manage appointments and provide medical advice'
    },
    {
      value: 'hospital',
      label: 'Hospital',
      icon: <Business sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      description: 'Administrative access to all system data'
    }
  ];

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
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Grid container spacing={4}>
            {/* Role Selection Section */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={24}
                sx={{
                  padding: 4,
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0288d1 0%, #26a69a 100%)',
                      mb: 2,
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.62)',
                    }}
                  >
                    <LocalHospital sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #0288d1 0%, #26a69a 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    Hospital Management
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Select your role to continue
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {roleOptions.map((role) => (
                    <Card
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      sx={{
                        p: 2.5,
                        cursor: 'pointer',
                        border: 2,
                        borderColor: selectedRole === role.value ? role.color : 'divider',
                        borderRadius: 3,
                        background: selectedRole === role.value
                          ? `${role.color}10`
                          : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: role.color,
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 20px ${role.color}30`,
                          background: `${role.color}10`,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: selectedRole === role.value
                              ? `${role.color}20`
                              : 'action.hover',
                            color: selectedRole === role.value ? role.color : 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {role.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: selectedRole === role.value ? role.color : 'text.primary',
                              mb: 0.5,
                            }}
                          >
                            {role.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {role.description}
                          </Typography>
                        </Box>
                        {selectedRole === role.value && (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: role.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: 'white',
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Login Form Section */}
            <Grid item xs={12} md={7}>
              <Paper
                elevation={24}
                sx={{
                  padding: { xs: 3, sm: 5 },
                  height: '100%',
                  background: 'rgba(199, 223, 223, 0.8)', // Matching Glassmorphism from theme
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: 'text.primary',
                    }}
                  >
                    {showReset ? 'Reset Password' : 'Sign In'}
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      bgcolor: `${roleOptions.find(r => r.value === selectedRole)?.color}20`,
                      color: roleOptions.find(r => r.value === selectedRole)?.color,
                      mb: 2,
                    }}
                  >
                    {roleOptions.find(r => r.value === selectedRole)?.icon}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {roleOptions.find(r => r.value === selectedRole)?.label} {showReset ? 'Account' : 'Login'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {showReset
                      ? 'Enter your email and a new password to reset your account'
                      : 'Enter your credentials to access your account'}
                  </Typography>
                </Box>

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        alignItems: 'center',
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                    }}
                  >
                    {success}
                  </Alert>
                )}

                <Box
                  component="form"
                  onSubmit={showReset ? handleReset : handleSubmit}
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <TextField
                    fullWidth
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2.5 }}
                    InputProps={{
                      startAdornment: (
                        <Email sx={{ color: 'action.active', mr: 1, ml: 1 }} />
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    required
                    name="password"
                    label={showReset ? 'New Password' : 'Password'}
                    type="password"
                    id="password"
                    autoComplete={showReset ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 1 }}
                    InputProps={{
                      startAdornment: (
                        <Lock sx={{ color: 'action.active', mr: 1, ml: 1 }} />
                      ),
                    }}
                  />

                  {!showReset && (
                    <Box sx={{ textAlign: 'right', mb: 2 }}>
                      <Button
                        size="small"
                        onClick={() => {
                          setShowReset(true);
                          setError('');
                          setSuccess('');
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          color: roleOptions.find(r => r.value === selectedRole)?.color
                        }}
                      >
                        Forgot Password?
                      </Button>
                    </Box>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={authLoading}
                    sx={{
                      mt: showReset ? 4 : 'auto',
                      mb: 2,
                      py: 1.5,
                      background: `linear-gradient(135deg, ${roleOptions.find(r => r.value === selectedRole)?.color} 0%, ${roleOptions.find(r => r.value === selectedRole)?.color}dd 100%)`,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${roleOptions.find(r => r.value === selectedRole)?.color}dd 0%, ${roleOptions.find(r => r.value === selectedRole)?.color}bb 100%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 10px 25px ${roleOptions.find(r => r.value === selectedRole)?.color}40`,
                      },
                    }}
                  >
                    {authLoading ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : showReset ? (
                      'Reset My Password'
                    ) : (
                      `Sign In as ${roleOptions.find(r => r.value === selectedRole)?.label}`
                    )}
                  </Button>

                  <Box textAlign="center" sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {showReset ? (
                        <Button
                          onClick={() => {
                            setShowReset(false);
                            setError('');
                            setSuccess('');
                          }}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            color: roleOptions.find(r => r.value === selectedRole)?.color
                          }}
                        >
                          Back to Sign In
                        </Button>
                      ) : (
                        <>
                          Don't have an account?{' '}
                          <Link
                            to="/register"
                            style={{
                              textDecoration: 'none',
                              color: roleOptions.find(r => r.value === selectedRole)?.color,
                              fontWeight: 600,
                            }}
                          >
                            Register here
                          </Link>
                        </>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
