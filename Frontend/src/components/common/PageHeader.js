import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';
const PageHeader = ({ title, subtitle, action, icon: Icon }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                mb: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 3,
                position: 'relative',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
                {Icon && (
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: '18px',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
                            color: 'primary.main',
                            display: 'flex',
                            boxShadow: `0 8px 24px -6px ${alpha(theme.palette.primary.main, 0.25)}`,
                        }}
                    >
                        <Icon sx={{ fontSize: 36 }} />
                    </Box>
                )}
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em', mb: 0.5 }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            {action && (
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {action}
                </Box>
            )}
        </Box>
    );
};

export default PageHeader;
