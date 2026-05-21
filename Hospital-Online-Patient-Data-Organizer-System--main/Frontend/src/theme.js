import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
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
        background: {
            default: '#f8fafc', // Modern Slate Background
            paper: '#ffffff',
        },
        text: {
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
                    background: '#ffffff',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
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
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                elevation24: {
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: 'none',
                    color: '#0f172a',
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

export default theme;
