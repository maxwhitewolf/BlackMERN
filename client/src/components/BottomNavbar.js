import React from 'react';
import {
  Box,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Search as SearchIcon,
  AddBox as AddBoxIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/home',
      icon: <HomeIcon />,
      label: 'Home',
    },
    {
      path: '/explore',
      icon: <ExploreIcon />,
      label: 'Explore',
    },
    {
      path: '/search',
      icon: <SearchIcon />,
      label: 'Search',
    },
    {
      path: '/create',
      icon: <AddBoxIcon />,
      label: 'Create',
    },
    {
      path: '/messages',
      icon: <MessageIcon />,
      label: 'Messages',
    },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        px: 2,
        background: 'rgba(13, 15, 20, 0.75)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderTop: '1px solid var(--glass-border)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        transition: 'var(--transition-normal)',
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <IconButton
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              color: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.8)',
              transition: 'var(--transition-normal)',
              borderRadius: '12px',
              p: 1.5,
              background: isActive ? 'rgba(16, 163, 127, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(16, 163, 127, 0.3)' : '1px solid transparent',
              backdropFilter: isActive ? 'var(--glass-blur-sm)' : 'none',
              WebkitBackdropFilter: isActive ? 'var(--glass-blur-sm)' : 'none',
              boxShadow: isActive ? 'var(--glass-shadow-sm)' : 'none',
              '&:hover': {
                transform: 'translateY(-4px)',
                color: 'primary.main',
                background: 'rgba(16, 163, 127, 0.15)',
                border: '1px solid rgba(16, 163, 127, 0.4)',
                boxShadow: 'var(--glass-shadow)',
              },
              '&:active': {
                transform: 'translateY(-2px) scale(0.98)',
                boxShadow: 'var(--glass-shadow-sm)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'var(--transition-normal)',
                position: 'relative',
                width: 24,
                height: 24,
                fontSize: '1.3rem',
                justifyContent: 'center',
                '&::after': isActive ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -28,
                  width: '40%',
                  height: '3px',
                  background: 'var(--glass-gradient)',
                  borderRadius: '2px',
                  opacity: 0.8,
                  boxShadow: '0 0 8px rgba(16, 163, 127, 0.6)',
                } : {},
              }}
            >
              {item.icon}
            </Box>
          </IconButton>
        );
      })}
    </Box>
  );
};

export default BottomNavbar;