import React from 'react';
import { Card, CardContent } from '@mui/material';

const GlassCard = ({ children, variant = 'default', sx, contentSx = {}, noPadding = false, ...props }) => {
  // Define style variations
  const variants = {
    default: {
      background: 'var(--glass-gradient)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)'
    },
    subtle: {
      background: 'var(--glass-bg-dark)',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: 'var(--glass-shadow-sm)'
    },
    prominent: {
      background: 'var(--glass-bg-light)',
      border: '1px solid var(--glass-border-strong)',
      boxShadow: 'var(--glass-shadow-lg)'
    }
  };

  const variantStyle = variants[variant] || variants.default;

  return (
    <Card
      elevation={0}
      sx={{
        ...variantStyle,
        borderRadius: 14,
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        transition: 'var(--transition-normal)',
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: -1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top left, rgba(255,255,255,0.1), transparent 70%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: 0,
          transition: 'opacity var(--transition-normal)'
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 'var(--glass-shadow-lg)',
          borderColor: 'var(--glass-border-hover)',
          background: 'var(--glass-gradient-hover)',
          '&::after': {
            opacity: 1
          }
        },
        ...sx,
      }}
      {...props}
    >
      {noPadding ? (
        children
      ) : (
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, ...contentSx }}>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default GlassCard;