import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
  Skeleton,
  Fade,
} from '@mui/material';
import {
  Favorite as LikeIcon,
  Chat as CommentIcon,
  PersonAdd as FollowIcon,
  Bookmark as SaveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const ActivityCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const ActivityView = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Empty activities - no demo data
    setTimeout(() => {
      setActivities([]);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'like':
        return <LikeIcon sx={{ color: '#ed4956' }} />;
      case 'comment':
        return <CommentIcon sx={{ color: '#0095f6' }} />;
      case 'follow':
        return <FollowIcon sx={{ color: '#00c851' }} />;
      case 'save':
        return <SaveIcon sx={{ color: '#ffc107' }} />;
      default:
        return <LikeIcon />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'like':
        return `liked your post`;
      case 'comment':
        return `commented on your post`;
      case 'follow':
        return `started following you`;
      case 'save':
        return `saved your post`;
      default:
        return 'interacted with your content';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Activity
        </Typography>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          {[1, 2, 3].map((i) => (
            <ActivityCard key={i} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Box>
              </CardContent>
            </ActivityCard>
          ))}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Activity
      </Typography>

      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Fade in={true} timeout={500}>
          {activities.length === 0 ? (
            <ActivityCard>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No activity yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  When people interact with your content, it will appear here
                </Typography>
              </CardContent>
            </ActivityCard>
          ) : (
            <List>
              {activities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={activity.user.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            component="span"
                            sx={{ fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => navigate(`/profile/${activity.user.username}`)}
                          >
                            {activity.user.username}
                          </Typography>
                          <Typography component="span" color="text.secondary">
                            {getActivityText(activity)}
                          </Typography>
                          {getActivityIcon(activity.type)}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {activity.timestamp}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < activities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Fade>
      </Box>
    </Container>
  );
};

export default ActivityView; 