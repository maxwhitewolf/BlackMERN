import React from 'react';
import { Box, Container } from '@mui/material';

const PageContainer = ({ children, maxWidth = 'lg', variant = 'default', sx }) => {
  // Define background variations
  const backgrounds = {
    default: {
      background: `
        radial-gradient(1500px 800px at 5% -10%, rgba(16,163,127,0.15) 0%, rgba(16,163,127,0) 70%),
        radial-gradient(1200px 600px at 110% 10%, rgba(124,77,255,0.15) 0%, rgba(124,77,255,0) 70%),
        radial-gradient(800px 800px at 50% 110%, rgba(102,126,234,0.1) 0%, rgba(102,126,234,0) 70%),
        #0d0f14`
    },
    gradient: {
      background: 'var(--dark-bg)'
    },
    minimal: {
      background: `
        linear-gradient(135deg, rgba(13,15,20,0.97) 0%, rgba(13,15,20,0.95) 100%),
        radial-gradient(1000px 600px at 50% 0%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)`
    }
  };

  const variantStyle = backgrounds[variant] || backgrounds.default;

  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      ...variantStyle,
      pt: { xs: 8, md: 10 },
      pb: { xs: 10, md: 12 },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'rgba(255,255,255,0.03)\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        opacity: 0.5,
        zIndex: -1,
      },
      ...sx
    }}>
      <Container maxWidth={maxWidth}>
        {children}
      </Container>
    </Box>
  );
};

export default PageContainer;