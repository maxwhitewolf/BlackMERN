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
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Search as SearchIcon,
  Chat as ChatIcon,
  AddBox as AddBoxIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      width: 72,
    },
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: '4px 8px',
  borderRadius: 8,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.02)',
  },
  '&.active': {
    backgroundColor: theme.palette.action.selected,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: theme.palette.text.secondary,
  transition: 'color 0.2s ease-in-out',
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'color 0.2s ease-in-out',
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}));

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [messageCount, setMessageCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCounts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch unread activity count
        const activityResponse = await fetch('/api/activities/unread-count', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setActivityCount(activityData.count || 0);
        }

        // For now, set message count to 0 (you can implement message notifications later)
        setMessageCount(0);
      } catch (error) {
        console.error('Error fetching notification counts:', error);
        setActivityCount(0);
        setMessageCount(0);
      }
    };

    if (user) {
      fetchNotificationCounts();
    }
  }, [user]);

  const navigationItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/home' },
    { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
    { text: 'Search', icon: <SearchIcon />, path: '/search' },
    { text: 'Messages', icon: <ChatIcon />, path: '/messages', badge: messageCount },
    { text: 'Create', icon: <AddBoxIcon />, path: '/create' },
    { text: 'Activity', icon: <FavoriteIcon />, path: '/activity', badge: activityCount },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <StyledDrawer
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Logo/Brand */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #0095f6, #ff6b6b)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => navigate('/home')}
          >
            BlanX
          </Typography>
        </Box>

        <Divider />

        {/* Navigation Items */}
        <List sx={{ flex: 1, pt: 1 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <StyledListItemButton
                  className={isActive ? 'active' : ''}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    '&:hover': {
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <StyledListItemIcon>
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </StyledListItemIcon>
                  <StyledListItemText primary={item.text} />
                </StyledListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />

        {/* User Section */}
        <Box sx={{ p: 2 }}>
          <UserSection>
            <Avatar
              src={user.avatar}
              sx={{
                width: 32,
                height: 32,
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              onClick={() => navigate(`/profile/${user.username}`)}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                {user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                View Profile
              </Typography>
            </Box>
          </UserSection>

          {/* User Actions */}
          <List sx={{ pt: 1 }}>
            <ListItem disablePadding>
              <StyledListItemButton onClick={() => navigate(`/profile/${user.username}`)}>
                <StyledListItemIcon>
                  <PersonIcon />
                </StyledListItemIcon>
                <StyledListItemText primary="Profile" />
              </StyledListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <StyledListItemButton>
                <StyledListItemIcon>
                  <SettingsIcon />
                </StyledListItemIcon>
                <StyledListItemText primary="Settings" />
              </StyledListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <StyledListItemButton onClick={handleLogout}>
                <StyledListItemIcon>
                  <LogoutIcon />
                </StyledListItemIcon>
                <StyledListItemText primary="Logout" />
              </StyledListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default Navigation; 