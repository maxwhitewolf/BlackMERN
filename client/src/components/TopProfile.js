import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const ProfileContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 16,
  right: 16,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '8px 16px',
  backgroundColor: 'rgba(30, 30, 30, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  border: '1px solid rgba(38, 38, 38, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(38, 38, 38, 0.9)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(0, 149, 246, 0.3)',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  border: '2px solid rgba(0, 149, 246, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: '#0095f6',
    transform: 'scale(1.1)',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 8,
  margin: '2px 8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 149, 246, 0.1)',
    transform: 'translateX(4px)',
  },
}));

const TopProfile = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate(`/profile/${user?.username}`);
  };

  const handleEditProfileClick = () => {
    handleMenuClose();
    navigate('/edit-profile');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1300,
        animation: 'slideInRight 0.6s ease-out',
      }}
    >
      <Box
        className="glass-card"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
          },
        }}
        onClick={handleMenuOpen}
      >
        <Avatar
          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
          sx={{
            width: 40,
            height: 40,
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              borderColor: 'rgba(102, 126, 234, 0.8)',
            },
          }}
        />
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'white',
              lineHeight: 1.2,
            }}
          >
            {user?.username}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.75rem',
            }}
          >
            View Profile
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: 'white',
              transform: 'rotate(180deg)',
            },
          }}
        >
          <ArrowIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          className: 'glass-card',
          sx: {
            mt: 1,
            minWidth: 200,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            '& .MuiMenuItem-root': {
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(4px)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Profile
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditProfileClick}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Edit Profile
            </Typography>
          </ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Logout
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopProfile; 