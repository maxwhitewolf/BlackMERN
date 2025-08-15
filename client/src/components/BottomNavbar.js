import React from 'react';
import {
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  AddBox as AddBoxIcon,
  Message as MessageIcon,
  Favorite as HeartIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: HomeIcon, label: 'Home', href: '/home' },
  { icon: ExploreIcon, label: 'Explore', href: '/explore' },
  { icon: AddBoxIcon, label: 'Create', href: '/create' },
  { icon: MessageIcon, label: 'Messages', href: '/messages' },
  { icon: HeartIcon, label: 'Activity', href: '/activity' },
  { icon: PersonIcon, label: 'Profile', href: '/profile' },
];

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(42, 47, 74, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(184, 197, 214, 0.2)',
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: 0,
      }}
      elevation={0}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '64px',
          }}
        >
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = location.pathname === href;
            return (
              <IconButton
                key={href}
                onClick={() => navigate(href)}
                sx={{
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(0, 245, 212, 0.2) 0%, rgba(0, 180, 216, 0.2) 100%)',
                        color: '#00f5d4',
                        boxShadow: '0 0 16px rgba(0, 245, 212, 0.4)',
                        border: '1px solid rgba(0, 245, 212, 0.3)',
                      }
                    : {
                        background: 'rgba(42, 47, 74, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(184, 197, 214, 0.2)',
                        color: 'rgba(245, 245, 245, 0.8)',
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.05)',
                          boxShadow: '0 0 16px rgba(0, 245, 212, 0.4)',
                          border: '1px solid rgba(0, 245, 212, 0.4)',
                          color: '#00f5d4',
                        },
                      }),
                  '&:active': {
                    transform: 'scale(0.97)',
                  },
                }}
              >
                <Icon />
              </IconButton>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default BottomNavbar;