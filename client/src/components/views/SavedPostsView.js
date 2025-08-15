import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Fade,
  IconButton,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  Bookmark as SaveIcon,
  BookmarkBorder as UnsaveIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  Send as SendIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Box)(({ theme }) => ({
  marginBottom: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
  },
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  gap: 12,
}));

const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}));

const PostFooter = styled(Box)(({ theme }) => ({
  padding: '0 16px 16px',
}));

const SavedPostsView = () => {
  const navigate = useNavigate();
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch('/api/posts/saved', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData._id
        }),
      });

      if (response.ok) {
        const posts = await response.json();
        setSavedPosts(posts);
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const isLiked = likedPosts.has(postId);
      
      const response = await fetch(`/api/posts/like/${postId}`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData._id
        }),
      });

      if (response.ok) {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (newSet.has(postId)) {
            newSet.delete(postId);
          } else {
            newSet.add(postId);
          }
          return newSet;
        });
        
        // Update the post's like count
        setSavedPosts(prev => prev.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              likeCount: isLiked ? (post.likeCount || 1) - 1 : (post.likeCount || 0) + 1
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnsave = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`/api/posts/save/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData._id
        }),
      });

      if (response.ok) {
        // Remove the post from the saved posts list
        setSavedPosts(prev => prev.filter(post => post._id !== postId));
      }
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const PostCard = ({ post }) => (
    <Fade in={true} timeout={500}>
      <StyledCard>
        {/* Post Header */}
        <PostHeader>
          <Avatar
            src={post.poster?.avatar}
            sx={{
              width: 40,
              height: 40,
              background: post.poster?.avatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            {!post.poster?.avatar && post.poster?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ fontWeight: 600, cursor: 'pointer' }}
                onClick={() => handleUserClick(post.poster?.username)}
              >
                {post.poster?.username}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {post.location && (
                <>
                  <LocationIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {post.location}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    •
                  </Typography>
                </>
              )}
              <TimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </PostHeader>

        {/* Post Image */}
        <CardMedia
          component="img"
          image={post.image || ''}
          alt={post.title || 'Post'}
          sx={{
            height: 400,
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
          onClick={() => navigate(`/post/${post._id}`)}
        />

        {/* Post Actions */}
        <PostActions>
          <ActionButtons>
            <IconButton
              onClick={() => handleLike(post._id)}
              sx={{
                color: likedPosts.has(post._id) ? 'error.main' : 'text.primary',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              {likedPosts.has(post._id) ? <LikeIcon /> : <UnlikeIcon />}
            </IconButton>
            <IconButton
              onClick={() => handleUnsave(post._id)}
              sx={{
                color: 'primary.main',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <SaveIcon />
            </IconButton>
          </ActionButtons>
        </PostActions>

        {/* Post Footer */}
        <PostFooter>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {post.likeCount || 0} likes
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <span style={{ fontWeight: 600 }}>{post.poster?.username}</span> {post.content}
          </Typography>
          {post.commentCount > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/post/${post._id}`)}
            >
              View all {post.commentCount} comments
            </Typography>
          )}
        </PostFooter>
      </StyledCard>
    </Fade>
  );

  const LoadingSkeleton = () => (
    <Box>
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Box sx={{ ml: 2, flex: 1 }}>
                <Skeleton variant="text" width={120} />
                <Skeleton variant="text" width={80} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Saved Posts
      </Typography>
      
      {loading ? (
        <LoadingSkeleton />
      ) : savedPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No saved posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Posts you save will appear here
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/home')}
            sx={{ borderRadius: 2 }}
          >
            Explore Posts
          </Button>
        </Box>
      ) : (
        <Box>
          {savedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default SavedPostsView; 