import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const [messageResponse, notificationResponse] = await Promise.all([
          fetch('/api/messages/unread-count', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/notifications/unread-count', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (messageResponse.ok) {
          const messageData = await messageResponse.json();
          setMessageCount(messageData.count || 0);
        }

        if (notificationResponse.ok) {
          const notificationData = await notificationResponse.json();
          setNotificationCount(notificationData.count || 0);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleMenuClose();
  };

  const handleProfile = () => {
    if (user) {
      navigate(`/profile/${user.username}`);
    }
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/edit-profile');
    handleMenuClose();
  };

  const navItems = [
    { 
      icon: <MessageIcon />, 
      label: 'Messages', 
      href: '/messages',
      badge: messageCount,
      onClick: () => navigate('/messages')
    },
    { 
      icon: <NotificationsIcon />, 
      label: 'Activity', 
      href: '/activity',
      badge: notificationCount,
      onClick: () => navigate('/activity')
    },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'rgba(42, 47, 74, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(184, 197, 214, 0.2)',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        boxShadow: 'none',
        zIndex: 50,
      }}
    >
      <Toolbar sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: 2 }}>
        <Box sx={{ width: '144px' }} />

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="h5"
            component="h1"
            onClick={() => navigate('/home')}
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #00f5d4 0%, #00b4d8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              cursor: 'pointer',
              fontFamily: '"Poppins", sans-serif',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            BLANX
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {navItems.map(({ icon, label, href, badge, onClick }) => (
            <IconButton
              key={href}
              onClick={onClick}
              sx={{
                background: 'rgba(42, 47, 74, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(184, 197, 214, 0.2)',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.1) translateY(-2px)',
                  boxShadow: '0 0 16px rgba(0, 245, 212, 0.4)',
                  border: '1px solid rgba(0, 245, 212, 0.4)',
                },
                '&:active': {
                  transform: 'scale(0.9)',
                },
              }}
            >
              <Badge badgeContent={badge} color="error" max={99}>
                {icon}
              </Badge>
            </IconButton>
          ))}
          
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              background: 'rgba(42, 47, 74, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(184, 197, 214, 0.2)',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.1) translateY(-2px)',
                boxShadow: '0 0 16px rgba(0, 245, 212, 0.4)',
                border: '1px solid rgba(0, 245, 212, 0.4)',
              },
              '&:active': {
                transform: 'scale(0.9)',
              },
            }}
          >
            <Avatar
              src={user?.avatar}
              sx={{
                width: 24,
                height: 24,
                background: user?.avatar ? 'transparent' : 'linear-gradient(135deg, #00f5d4 0%, #00b4d8 100%)',
                color: '#0a0a0f',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {!user?.avatar && user?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 245, 212, 0.2)',
            borderRadius: '12px',
            mt: 1,
            minWidth: 180,
          }
        }}
      >
        <MenuItem onClick={handleProfile} sx={{ color: '#f5f5f5' }}>
          <PersonIcon sx={{ mr: 2, color: '#00f5d4' }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleSettings} sx={{ color: '#f5f5f5' }}>
          <SettingsIcon sx={{ mr: 2, color: '#00f5d4' }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: '#ff4d6d' }}>
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default TopNavbar;