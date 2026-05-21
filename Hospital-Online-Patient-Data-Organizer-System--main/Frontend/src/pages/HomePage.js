import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    Paper,
    Stack,
    Chip,
    Avatar,
    Divider,
    useTheme,
} from '@mui/material';
import ThemeToggle from '../components/common/ThemeToggle';
import {
    LocalHospital,
    People,
    MedicalServices,
    Assignment,
    Security,
    Speed,
    CloudQueue,
    Login as LoginIcon
} from '@mui/icons-material';

const HomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const portalTiles = [
        {
            title: 'Patient Portal',
            desc: 'Seamlessly access your medical journey, prescriptions, and expert care.',
            icon: People,
            color: '#0ea5e9',
            path: '/login',
            role: 'patient',
            features: ['Smart Appointments', 'Digital Prescriptions', 'Health Analytics'],
            gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)'
        },
        {
            title: 'Doctor Portal',
            desc: 'Empowering physicians with real-time data and clinical precision.',
            icon: MedicalServices,
            color: '#10b981',
            path: '/login',
            role: 'doctor',
            features: ['Live Diagnostics', 'Patient Triage', 'Rapid Documentation'],
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            title: 'Administration',
            desc: 'The nerve center of hospital operations and enterprise management.',
            icon: LocalHospital,
            color: '#6366f1',
            path: '/login',
            role: 'hospital',
            features: ['System Intelligence', 'Resource Audit', 'Enterprise Security'],
            gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
        }
    ];

    // const systemStats = [
    //     { title: 'Global Patients', value: '12.4k', icon: People, color: '#0ea5e9' },
    //     { title: 'Medical Experts', value: '450+', icon: MedicalServices, color: '#10b981' },
    //     { title: 'Uptime Rate', value: '99.9%', icon: Speed, color: '#6366f1' },
    //     { title: 'Daily Consults', value: '128', icon: CalendarToday, color: '#f59e0b' }
    // ];

    return (
        <Box sx={{
            bgcolor: 'background.default',
            color: 'text.primary',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Elements */}
            <Box sx={{
                position: 'absolute', top: -100, right: -100, width: 400, height: 400,
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
                zIndex: 0
            }} />
            <Box sx={{
                position: 'absolute', bottom: -100, left: -100, width: 500, height: 500,
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
                zIndex: 0
            }} />

            {/* Premium Navbar */}
            <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '80px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box>
                                <Typography variant="h6" sx={{
                                    fontWeight: 900, fontSize: '1.4rem', color: 'text.primary',
                                    letterSpacing: '-0.04em', lineHeight: 1
                                }}>
                                    MediSyncAI
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Next-Generation Healthcare Platform
                                </Typography>
                            </Box>
                        </Box>

                        <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, px: 2, py: 0.5, borderRadius: '20px', bgcolor: 'rgba(16, 185, 129, 0.1)' }}>
                                <Box sx={{ width: 8, height: 8, bgcolor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#047857' }}>SYSTEM LIVE</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<LoginIcon />}
                                onClick={() => navigate('/login')}
                                sx={{
                                    borderRadius: '14px',
                                    px: 4,
                                    boxShadow: '0 10px 20px -5px rgba(14, 165, 233, 0.4)'
                                }}
                            >
                                Login
                            </Button>
                            {/* Theme toggle */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <ThemeToggle />
                            </Box>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Hero Section */}
            <Box sx={{ pt: '140px', pb: 10, position: 'relative', zIndex: 1 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Chip
                            label="Next-Gen Healthcare"
                            size="small"
                            sx={{
                                mb: 3,
                                fontWeight: 800,
                                bgcolor: 'rgba(14, 165, 233, 0.1)',
                                color: 'primary.main',
                                border: '1px solid rgba(14, 165, 233, 0.2)',
                                px: 1
                            }}
                        />
                        <Typography variant="h1" sx={{ color: 'text.primary', mb: 3 }}>
                            MediSyncAI
Healthcare <br />
                            <Box component="span" sx={{
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Management Dashboard</Box>
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 5, maxWidth: '700px', mx: 'auto', fontWeight: 500 }}>
                            MediSyncAI bridges the gap between hospitals,
doctors, and patients through secure,
AI-powered healthcare management with
real-time appointments, medical records,
and intelligent assistance.
                        </Typography>

                        {/* <Grid container spacing={4} sx={{ mt: 2 }}>
                            {systemStats.map((stat, idx) => (
                                <Grid item xs={6} md={3} key={idx}>
                                    <Box sx={{
                                        p: 3,
                                        borderRadius: '24px',
                                        bgcolor: 'white',
                                        border: '1px solid rgba(226, 232, 240, 0.8)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { transform: 'translateY(-5px)', borderColor: stat.color, boxShadow: `0 12px 24px -10px ${stat.color}40` }
                                    }}>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: stat.color, mb: 0.5 }}>{stat.value}</Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{stat.title}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid> */}
                    </Box>

                    {/* Portals Section */}
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 5, color: 'text.primary', textAlign: 'center' }}>
                        Choose Your Portal
                    </Typography>
                    <Grid container spacing={4}>
                        {portalTiles.map((portal, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <Card sx={{
                                    height: '100%',
                                    p: 1,
                                    borderRadius: '32px',
                                    position: 'relative',
                                    '&:hover': {
                                        transform: 'translateY(-12px)',
                                        '& .portal-btn': {
                                            transform: 'scale(1.02)',
                                            boxShadow: `0 20px 40px -10px ${portal.color}60`
                                        }
                                    }
                                }}>
                                        <Box sx={{
                                            p: 4,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: '28px',
                                            bgcolor: 'background.paper'
                                        }}>
                                        <Box sx={{
                                            width: 64, height: 64, borderRadius: '20px',
                                            background: portal.gradient,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            mb: 4,
                                            boxShadow: `0 12px 24px -6px ${portal.color}50`
                                        }}>
                                            <portal.icon sx={{ color: theme.palette.common.white, fontSize: 32 }} />
                                        </Box>

                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                                            {portal.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, flexGrow: 1, lineHeight: 1.6 }}>
                                            {portal.desc}
                                        </Typography>

                                        <Stack spacing={2} sx={{ mb: 5 }}>
                                            {portal.features.map((feat, i) => (
                                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: portal.color }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>{feat}</Typography>
                                                </Box>
                                            ))}
                                        </Stack>

                                        <Button
                                            fullWidth
                                            className="portal-btn"
                                            variant="contained"
                                            onClick={() => navigate(portal.path, { state: { role: portal.role } })}
                                            sx={{
                                                background: portal.gradient,
                                                borderRadius: '16px',
                                                py: 2,
                                                fontSize: '1rem',
                                                '&:hover': { background: portal.gradient }
                                            }}
                                        >
                                            Access Portal
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Informative Ecosystem */}
                    <Box sx={{ mt: 15 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 6, textAlign: 'center' }}>
                            Platform Capabilities
                        </Typography>
                        <Grid container spacing={3}>
                        {[
                            { title: 'Unified Ledger', desc: 'Immutable medical history tracking across hospital nodes.', icon: Assignment, color: '#0ea5e9' },
                            { title: 'Rapid Sync', desc: 'Sub-second synchronization for ultra-responsive care.', icon: Speed, color: '#10b981' },
                            { title: 'Medical Records', desc: 'Enterprise every medical record with proper patient and doctor identity.', icon: Security, color: '#6366f1' },
                            { title: 'Appointment Scheduling', desc: 'Appoinment scheduling by patient to doctor by ensuring date and time availability.', icon: CloudQueue, color: '#0ea5e9' }
                        ].map((info, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Box sx={{
                                    p: 4,
                                    borderRadius: '24px',
                                    height: '100%',
                                    bgcolor: isDark ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(8px)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'}`,
                                    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.6)' : '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
                                }}>
                                    <info.icon sx={{ fontSize: 40, color: info.color, mb: 2 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>{info.title}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6, display: 'block' }}>{info.desc}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    </Box>

                    {/* How It Works Section */}
                    <Box sx={{ mt: 15, position: 'relative' }}>
                        <Paper elevation={0} sx={{
                            p: { xs: 4, md: 8 },
                            borderRadius: '48px',
                            bgcolor: isDark ? theme.palette.background.paper : theme.palette.primary.dark,
                            color: 'text.primary',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {/* Decorative background circle */}
                            <Box sx={{
                                position: 'absolute', top: -100, right: -100, width: 300, height: 300,
                                bgcolor: 'primary.main', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1
                            }} />

                            <Grid container spacing={8} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h2" sx={{ color: isDark ? 'text.primary' : 'white', mb: 4 }}>
                                        Engineered for <br />
                                        <Box component="span" sx={{ color: 'primary.light' }}>Performance</Box>
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: isDark ? 'text.secondary' : theme.palette.common.white, mb: 6 }}>
                                        Our architecture prioritize interoperability and zero-latency data access, ensuring that life-critical information is always where it belongs: in the hands of care providers.
                                    </Typography>
                                    <Stack spacing={4}>
                                        {[
                                            { title: 'Strict Verification', desc: 'Secure onboarding for medical staff and patients.' },
                                            { title: 'Metadata Indexing', desc: 'Instant search across millions of health records.' },
                                            { title: 'Real-time Audit', desc: 'Complete transparency on data access and changes.' }
                                        ].map((step, i) => (
                                            <Box key={i} sx={{ display: 'flex', gap: 3 }}>
                                                <Box sx={{
                                                    width: 32, height: 32, borderRadius: '50%',
                                                    bgcolor: 'primary.main', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <Typography variant="caption" fontWeight={900}>{i + 1}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={800}>{step.title}</Typography>
                                                    <Typography variant="body2" sx={{ color: isDark ? 'text.secondary' : 'rgba(255,255,255,0.8)' }}>{step.desc}</Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{
                                        p: 5, borderRadius: '32px',
                                        bgcolor: isDark ? theme.palette.background.default : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}`,
                                        backdropFilter: 'blur(8px)'
                                    }}>
                                        <Stack spacing={4}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}><Security /></Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: isDark ? 'text.primary' : 'inherit' }}>Sovereign Identity</Typography>
                                                            <Typography variant="caption" sx={{ color: isDark ? 'text.secondary' : 'rgba(255,255,255,0.75)' }}>Blockchain-inspired data integrity protocols.</Typography>
                                                </Box>
                                            </Box>
                                            <Divider sx={{ borderColor: isDark ? 'divider' : 'rgba(15,23,42,0.08)' }} />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}><Speed /></Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: isDark ? 'text.primary' : 'inherit' }}>Sub-ms Latency</Typography>
                                                    <Typography variant="caption" sx={{ color: isDark ? 'text.secondary' : 'rgba(255,255,255,0.75)' }}>Optimized for emergency medical response.</Typography>
                                                </Box>
                                            </Box>
                                            {/* <Button variant="contained" fullWidth sx={{ mt: 2, height: 56 }}>
                                                Deep Dive into Architecture
                                            </Button> */}
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 10, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
                <Box
                    sx={{
                        height: 4,
                        background: (footerTheme) => `linear-gradient(90deg, ${footerTheme.palette.primary.main} 0%, ${footerTheme.palette.secondary.main} 100%)`
                    }}
                />
                <Container maxWidth="xl" sx={{ py: 6 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={5}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'action.hover'
                                    }}
                                >
                                    <LocalHospital sx={{ color: 'primary.main', fontSize: 24 }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
                                    Hospital Management System
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                                Secure patient records, appointments, and clinical workflows in one unified healthcare platform.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>
                                Quick Links
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, cursor: 'pointer' }}>Terms</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, cursor: 'pointer' }}>Privacy</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, cursor: 'pointer' }}>GDPR</Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>
                                Platform Trust
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">Role-based secure access</Typography>
                                <Typography variant="body2" color="text.secondary">Encrypted health data management</Typography>
                                <Typography variant="body2" color="text.secondary">Reliable appointment workflow</Typography>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            © 2026 Hospital Management System. All rights reserved.
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
                            Built for modern healthcare delivery
                        </Typography>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
