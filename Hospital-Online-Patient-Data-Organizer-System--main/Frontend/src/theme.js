import { createTheme } from '@mui/material/styles';

const buildTheme = (mode = 'light') => createTheme({
    palette: {
        mode,
        primary: {
            main: '#0ea5e9', // Vibrant Sky Blue
            light: '#7dd3fc',
            dark: '#0369a1',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#10b981', // Medical Emerald
            light: '#6ee7b7',
            dark: '#047857',
            contrastText: '#ffffff',
        },
        background: mode === 'dark' ? {
            default: '#0b1220',
            paper: '#08101a'
        } : {
            default: '#f8fafc', // Modern Slate Background
            paper: '#ffffff',
        },
        text: mode === 'dark' ? {
            primary: '#e6eef8',
            secondary: '#9fb3c8'
        } : {
            primary: '#0f172a', // Slate 900
            secondary: '#64748b', // Slate 500
        },
        action: {
            active: '#0ea5e9',
            hover: 'rgba(14, 165, 233, 0.04)',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '4.5rem',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            color: '#0f172a',
        },
        h2: {
            fontWeight: 800,
            fontSize: '3.5rem',
            letterSpacing: '-0.02em',
            color: '#0f172a',
        },
        h3: {
            fontWeight: 700,
            fontSize: '2.25rem',
            color: '#26a69a',
        },
        body1: {
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: '#3E5060',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '12px 28px',
                    boxShadow: 'none',
                    fontWeight: 700,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 20px -8px rgba(14, 165, 233, 0.3)',
                    }
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
                    }
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '24px',
                    background: mode === 'dark' ? '#071022' : '#ffffff',
                    border: mode === 'dark' ? '1px solid rgba(255,255,255,0.02)' : '1px solid rgba(148, 163, 184, 0.1)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '24px',
                },
                elevation1: {
                    boxShadow: mode === 'dark' ? '0 6px 14px -6px rgba(0,0,0,0.6)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                elevation24: {
                    boxShadow: mode === 'dark' ? '0 20px 40px -10px rgba(0,0,0,0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: mode === 'dark' ? 'rgba(3,7,18,0.6)' : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: 'none',
                    color: mode === 'dark' ? '#e6eef8' : '#0f172a',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                }
            }
        }
    },
});

export default buildTheme;
