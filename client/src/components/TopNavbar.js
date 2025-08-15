import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Bookmark as BookmarkIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBadge from './NotificationBadge';

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleSavedClick = () => {
    handleMenuClose();
    navigate('/saved');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 3,
        background: 'rgba(13, 15, 20, 0.75)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        transition: 'var(--transition-normal)',
      }}
    >
      {/* Left side - Logo/Brand */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/home')}
      >
        BlanX
      </Typography>

      {/* Right side - User actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <NotificationBadge />
        
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              width: 32,
              height: 32,
              background: user?.avatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {!user?.avatar && user?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              background: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow-lg)',
              borderRadius: 3,
              overflow: 'hidden',
              '& .MuiMenuItem-root': {
                transition: 'var(--transition-fast)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateX(4px)'
                }
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.main',
                minWidth: 36
              },
            },
          }}
          TransitionProps={{
            enter: true,
            exit: true,
          }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleEditProfileClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Profile</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleSavedClick}>
            <ListItemIcon>
              <BookmarkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Saved Posts</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default TopNavbar;