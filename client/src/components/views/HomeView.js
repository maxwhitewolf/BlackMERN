import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  IconButton,
  Button,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Grid,
  Container,
  Skeleton,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  MoreVert as MoreIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  PersonAdd as FollowIcon,
  PersonRemove as UnfollowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
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

const CommentSection = styled(Box)(({ theme }) => ({
  padding: '12px 16px',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const SuggestedUsersCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  marginBottom: 16,
}));

const HomeView = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [followingUsers, setFollowingUsers] = useState(new Set());

  useEffect(() => {
    fetchHomePosts();
    fetchSuggestedUsers();
  }, []);

  const fetchHomePosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/posts/home', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData.posts || []);
      } else {
        // If no home feed, try to get all posts
        const allPostsResponse = await fetch('/api/posts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (allPostsResponse.ok) {
          const allPostsData = await allPostsResponse.json();
          setPosts(allPostsData.data || []);
        } else {
          setPosts([]);
        }
      }
    } catch (error) {
      console.error('Error fetching home posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/random?size=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const users = await response.json();
        setSuggestedUsers(users);
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const isLiked = likedPosts.has(postId);
      
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const isSaved = savedPosts.has(postId);
      
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSavedPosts(prev => {
          const newSet = new Set(prev);
          if (newSet.has(postId)) {
            newSet.delete(postId);
          } else {
            newSet.add(postId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const isFollowing = followingUsers.has(userId);
      
      const response = await fetch(`/api/users/${isFollowing ? 'unfollow' : 'follow'}/${userId}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          if (newSet.has(userId)) {
            newSet.delete(userId);
          } else {
            newSet.add(userId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Follow error:', error);
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
            src={post.poster?.avatar || `https://ui-avatars.com/api/?name=${post.poster?.username}&background=random`}
            sx={{ width: 32, height: 32, cursor: 'pointer' }}
            onClick={() => handleUserClick(post.poster?.username)}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ fontWeight: 600, cursor: 'pointer' }}
                onClick={() => handleUserClick(post.poster?.username)}
              >
                {post.poster?.username}
              </Typography>
              {post.poster?.isAdmin && (
                <Chip
                  label="✓"
                  size="small"
                  sx={{
                    backgroundColor: '#0095f6',
                    color: 'white',
                    fontSize: '0.6rem',
                    height: 16,
                  }}
                />
              )}
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
          image={post.image || `https://picsum.photos/600/600?random=${post._id}`}
          alt={post.title || 'Post'}
          sx={{
            height: 600,
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
              {likedPosts.has(post._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton
              onClick={() => navigate(`/post/${post._id}`)}
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <CommentIcon />
            </IconButton>
            <IconButton
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </ActionButtons>
          <IconButton
            onClick={() => handleSave(post._id)}
            sx={{
              color: savedPosts.has(post._id) ? 'primary.main' : 'text.primary',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {savedPosts.has(post._id) ? <BookmarkFilledIcon /> : <BookmarkIcon />}
          </IconButton>
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

        {/* Comment Input */}
        <CommentSection>
          <TextField
            fullWidth
            placeholder="Add a comment..."
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="text"
                    size="small"
                    sx={{ color: 'primary.main', fontWeight: 600 }}
                  >
                    Post
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </CommentSection>
      </StyledCard>
    </Fade>
  );

  const SuggestedUsers = () => (
    <SuggestedUsersCard>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Suggested for You
        </Typography>
        <List sx={{ p: 0 }}>
          {suggestedUsers.map((user) => (
            <ListItem key={user._id} sx={{ px: 0, py: 1 }}>
              <ListItemAvatar>
                <Avatar
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                  sx={{ width: 40, height: 40, cursor: 'pointer' }}
                  onClick={() => handleUserClick(user.username)}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleUserClick(user.username)}
                  >
                    {user.username}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {user.followerCount || 0} followers
                  </Typography>
                }
              />
              <Button
                variant={followingUsers.has(user._id) ? "outlined" : "contained"}
                size="small"
                onClick={() => handleFollow(user._id)}
                startIcon={followingUsers.has(user._id) ? <UnfollowIcon /> : <FollowIcon />}
                sx={{
                  minWidth: 80,
                  fontSize: '0.75rem',
                  borderColor: followingUsers.has(user._id) ? '#dbdbdb' : '#0095f6',
                  color: followingUsers.has(user._id) ? '#262626' : '#ffffff',
                  '&:hover': {
                    borderColor: followingUsers.has(user._id) ? '#ff6b6b' : '#0081d6',
                    color: followingUsers.has(user._id) ? '#ff6b6b' : '#ffffff',
                  },
                }}
              >
                {followingUsers.has(user._id) ? 'Following' : 'Follow'}
              </Button>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </SuggestedUsersCard>
  );

  const LoadingSkeleton = () => (
    <Box sx={{ mb: 2 }}>
      <Skeleton variant="rectangular" height={600} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Box sx={{ ml: 1, flex: 1 }}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={80} />
          </Box>
        </Box>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            {loading ? (
              <>
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No posts yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Follow some users to see their posts in your feed
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/explore')}
                >
                  Explore Posts
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <SuggestedUsers />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeView; 