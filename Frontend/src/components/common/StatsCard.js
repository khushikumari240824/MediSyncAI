import React from 'react';
import { Card, CardContent, Box, Typography, alpha } from '@mui/material';

const StatsCard = ({ title, value, icon: Icon, color }) => {
    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: '24px',
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'visible',
                position: 'relative',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) => `0 20px 40px -4px ${alpha(color || theme.palette.primary.main, 0.15)}`,
                    borderColor: 'transparent',
                    '& .icon-box': {
                        transform: 'scale(1.1) rotate(5deg)',
                    }
                },
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box
                        className="icon-box"
                        sx={{
                            p: 2,
                            borderRadius: '20px',
                            background: (theme) => `linear-gradient(135deg, ${alpha(color || theme.palette.primary.main, 0.1)} 0%, ${alpha(color || theme.palette.primary.main, 0.2)} 100%)`,
                            color: color || 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: `0 8px 16px -4px ${alpha(color || '#000', 0.1)}`,
                        }}
                    >
                        {Icon && <Icon sx={{ fontSize: 32 }} />}
                    </Box>
                </Box>

                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
                        {value}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {title}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
