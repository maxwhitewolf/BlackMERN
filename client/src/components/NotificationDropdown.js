import React, { useState, useEffect } from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
  Avatar,
  ListItemIcon,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  PersonAdd as PersonAddIcon,
  AlternateEmail as AtSignIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../helpers/authHelper';

const NotificationDropdown = ({ open, anchorEl, onClose, onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = isLoggedIn();

  useEffect(() => {
    if (open && user) {
      fetchNotifications();
    }
  }, [open, user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark notification as read
      const token = localStorage.getItem('token');
      await fetch('/api/notifications/mark-read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationIds: [notification._id]
        })
      });

      // Update unread count
      onNotificationRead();

      // Navigate to relevant content
      switch (notification.type) {
        case 'like':
        case 'comment':
          if (notification.post) {
            navigate(`/post/${notification.post._id}`);
          }
          break;
        case 'follow':
          if (notification.sender) {
            navigate(`/profile/${notification.sender.username}`);
          }
          break;
        case 'mention':
          if (notification.post) {
            navigate(`/post/${notification.post._id}`);
          }
          break;
        default:
          break;
      }

      onClose();
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FavoriteIcon fontSize="small" />;
      case 'comment':
        return <CommentIcon fontSize="small" />;
      case 'follow':
        return <PersonAddIcon fontSize="small" />;
      case 'mention':
        return <AtSignIcon fontSize="small" />;
      default:
        return <PersonIcon fontSize="small" />;
    }
  };

  const getNotificationMessage = (notification) => {
    const senderName = notification.sender?.username || 'Someone';
    
    switch (notification.type) {
      case 'like':
        return `${senderName} liked your post`;
      case 'comment':
        return `${senderName} commented on your post`;
      case 'follow':
        return `${senderName} started following you`;
      case 'mention':
        return `${senderName} mentioned you in a post`;
      default:
        return 'You have a new notification';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 350,
          maxHeight: 400,
          overflow: 'auto',
          background: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          Notifications
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <MenuItem
            key={notification._id}
            onClick={() => handleNotificationClick(notification)}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <ListItemIcon>
              <Avatar
                src={notification.sender?.avatar}
                sx={{ width: 32, height: 32, mr: 1 }}
              >
                {getNotificationIcon(notification.type)}
              </Avatar>
            </ListItemIcon>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: notification.read ? 'rgba(255, 255, 255, 0.7)' : 'white',
                  fontWeight: notification.read ? 400 : 600,
                }}
              >
                {getNotificationMessage(notification)}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                {formatTimeAgo(notification.createdAt)}
              </Typography>
            </Box>
            {!notification.read && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#667eea',
                  ml: 1,
                }}
              />
            )}
          </MenuItem>
        ))
      ) : (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            No notifications yet
          </Typography>
        </Box>
      )}
    </Menu>
  );
};

export default NotificationDropdown; 