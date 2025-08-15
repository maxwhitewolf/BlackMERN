import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Typography,
  IconButton,
  Tooltip,
  Badge,
  Chip,
  Button,
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Search as SearchIcon,
  Chat as ChatIcon,
  AddBox as AddBoxIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(38, 38, 38, 0.8)',
    boxSizing: 'border-box',
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
    [theme.breakpoints.down('md')]: {
      width: 80,
    },
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: '6px 12px',
  borderRadius: 16,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0, 149, 246, 0.1) 0%, rgba(77, 181, 255, 0.05) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateX(4px) scale(1.02)',
    boxShadow: '0 4px 20px rgba(0, 149, 246, 0.2)',
    '&::before': {
      opacity: 1,
    },
  },
  '&.active': {
    backgroundColor: 'rgba(0, 149, 246, 0.15)',
    background: 'linear-gradient(135deg, rgba(0, 149, 246, 0.2) 0%, rgba(77, 181, 255, 0.1) 100%)',
    border: '1px solid rgba(0, 149, 246, 0.3)',
    boxShadow: '0 4px 20px rgba(0, 149, 246, 0.3)',
    '& .MuiListItemIcon-root': {
      color: '#0095f6',
      transform: 'scale(1.1)',
    },
    '& .MuiListItemText-primary': {
      color: '#0095f6',
      fontWeight: 700,
    },
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 48,
  color: theme.palette.text.secondary,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  padding: '20px',
  borderBottom: '1px solid rgba(38, 38, 38, 0.8)',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(26, 26, 26, 0.6) 100%)',
  borderRadius: 16,
  margin: '12px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(38, 38, 38, 0.5)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(0, 149, 246, 0.3)',
  },
}));

const BrandLogo = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: 'linear-gradient(135deg, #0095f6 0%, #4db5ff 50%, #ff6b6b 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textShadow: '0 2px 10px rgba(0, 149, 246, 0.3)',
  '&:hover': {
    transform: 'scale(1.05) translateY(-2px)',
    filter: 'brightness(1.2)',
  },
}));

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageCount, setMessageCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const [messageResponse, activityResponse] = await Promise.all([
          fetch('/api/messages/unread-count', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/activities/unread-count', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (messageResponse.ok) {
          const messageData = await messageResponse.json();
          setMessageCount(messageData.count || 0);
        }

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setActivityCount(activityData.count || 0);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const navigationItems = [
    { path: '/home', icon: <HomeIcon />, label: 'Home' },
    { path: '/explore', icon: <ExploreIcon />, label: 'Explore' },
    { path: '/search', icon: <SearchIcon />, label: 'Search' },
    { path: '/messages', icon: <MessageIcon />, label: 'Messages', badge: messageCount },
    { path: '/activity', icon: <NotificationsIcon />, label: 'Activity', badge: activityCount },
    { path: '/saved', icon: <BookmarkIcon />, label: 'Saved' },
  ];

  return (
    <Box
      className="glass-card"
      sx={{
        width: 280,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInLeft 0.6s ease-out',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          onClick={() => navigate('/home')}
        >
          BlanX
        </Typography>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, p: 2 }}>
        <List sx={{ p: 0 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.path}
                sx={{
                  mb: 1,
                  borderRadius: '12px',
                  background: isActive ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                  border: isActive ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: isActive ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(8px)',
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'white' : 'rgba(255, 255, 255, 0.9)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
                {item.badge > 0 && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
                      color: 'white',
                      fontWeight: 600,
                      animation: 'pulse 2s infinite',
                    }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Create Post Button */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Create Post
        </Button>
      </Box>
    </Box>
  );
};

export default Navigation; 