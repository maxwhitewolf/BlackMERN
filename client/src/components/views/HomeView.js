import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Fade,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  Bookmark as SaveIcon,
  BookmarkBorder as UnsaveIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  PersonAdd as FollowIcon,
  PersonRemove as UnfollowIcon,
  Send as SendIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Box)(({ theme }) => ({
  marginBottom: 24,
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderColor: '#cbd5e1',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
    zIndex: -1,
    opacity: 0,
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px 20px',
  gap: 16,
  borderBottom: '1px solid #e2e8f0',
  position: 'relative',
  zIndex: 1,
}));

const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 20px',
  borderTop: '1px solid #e2e8f0',
  borderBottom: '1px solid #e2e8f0',
  position: 'relative',
  zIndex: 1,
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  position: 'relative',
}));

const PostFooter = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  position: 'relative',
  zIndex: 1,
}));

const CommentSection = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  borderTop: '1px solid #e2e8f0',
  position: 'relative',
  zIndex: 1,
  animation: 'fadeInUp 0.3s ease-out',
}));

const SuggestedUsersCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderColor: '#cbd5e1',
  },
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.2)',
    color: '#4facfe',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const HomeView = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const [commentTexts, setCommentTexts] = useState({});
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});

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
        const posts = postsData.posts || [];
        setPosts(posts);
        
        // Initialize liked and saved posts state
        const likedSet = new Set();
        const savedSet = new Set();
        
        posts.forEach(post => {
          if (post.liked) {
            likedSet.add(post._id);
          }
          if (post.isSaved) {
            savedSet.add(post._id);
          }
        });
        
        setLikedPosts(likedSet);
        setSavedPosts(savedSet);
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
          const posts = allPostsData.data || [];
          setPosts(posts);
          
          // Initialize liked and saved posts state
          const likedSet = new Set();
          const savedSet = new Set();
          
          posts.forEach(post => {
            if (post.liked) {
              likedSet.add(post._id);
            }
            if (post.isSaved) {
              savedSet.add(post._id);
            }
          });
          
          setLikedPosts(likedSet);
          setSavedPosts(savedSet);
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
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch('/api/users/random?size=5', {
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
        const users = await response.json();
        setSuggestedUsers(users);
        
        // Update followingUsers state based on isFollowing status
        const followingSet = new Set();
        users.forEach(user => {
          if (user.isFollowing) {
            followingSet.add(user._id);
          }
        });
        setFollowingUsers(followingSet);
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const isLiked = likedPosts.has(postId);
      
      console.log('Liking post:', postId, 'isLiked:', isLiked);
      
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

      console.log('Like response:', response.status);

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
        
        // Update the post's like count in the posts array
        setPosts(prev => prev.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              likeCount: isLiked ? (post.likeCount || 1) - 1 : (post.likeCount || 0) + 1
            };
          }
          return post;
        }));
      } else {
        const errorData = await response.json();
        console.error('Like error:', errorData);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const isSaved = savedPosts.has(postId);
      
      const response = await fetch(`/api/posts/save/${postId}`, {
        method: isSaved ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData._id
        }),
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

  const handleComment = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const commentText = commentTexts[postId];
      
      if (!commentText || !commentText.trim()) {
        alert('Please enter a comment');
        return;
      }

      console.log('Commenting on post:', postId, 'text:', commentText);

      const response = await fetch(`/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentText,
          userId: userData._id
        }),
      });

      console.log('Comment response:', response.status);

      if (response.ok) {
        // Clear comment text
        setCommentTexts(prev => ({
          ...prev,
          [postId]: ''
        }));
        
        // Update the post's comment count
        setPosts(prev => prev.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              commentCount: (post.commentCount || 0) + 1
            };
          }
          return post;
        }));
        
        // Refresh comments for this post
        fetchComments(postId);
      } else {
        const errorData = await response.json();
        console.error('Comment error:', errorData);
      }
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      if (response.ok) {
        const commentsData = await response.json();
        setComments(prev => ({
          ...prev,
          [postId]: commentsData
        }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    // Fetch comments if not already loaded
    if (!comments[postId]) {
      fetchComments(postId);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleShare = async (postId) => {
    try {
      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      alert('Post URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/post/${postId}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Post URL copied to clipboard!');
    }
  };

  const PostCard = ({ post }) => (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '100%',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderColor: '#cbd5e1',
            '& .post-image': {
              transform: 'scale(1.05)',
            },
          },
        }}
        onClick={() => navigate(`/post/${post._id}`)}
      >
        {/* Post Image - Top Section */}
        <Box
          className="post-image"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            maxHeight: '400px',
            '&:hover .image-overlay': {
              opacity: 1,
            },
          }}
        >
          <img
            src={post.image}
            alt={post.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '400px',
              objectFit: 'cover',
              display: 'block',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
              opacity: 0,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="image-overlay"
          >
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                borderRadius: '30px',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1,
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transform: 'translateY(0) scale(1.05)',
                }
              }}
            >
              View Post
            </Button>
          </Box>
        </Box>

        {/* Content Section - Bottom */}
        <Box sx={{ p: 3 }}>
          {/* Post Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={post.poster?.avatar}
              sx={{
                width: 40,
                height: 40,
                background: post.poster?.avatar ? 'transparent' : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                color: 'white',
                fontWeight: 600,
              }}
            >
              {!post.poster?.avatar && post.poster?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '1.1rem',
                  mb: 0.5,
                }}
              >
                {post.title || 'Untitled Post'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#64748b',
                  fontSize: '0.875rem',
                }}
              >
                by {post.poster?.username} • {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {/* Post Description */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#475569',
              lineHeight: 1.6,
              fontSize: '0.95rem',
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.content}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post._id);
                }}
                sx={{
                  color: likedPosts.has(post._id) ? '#ef4444' : '#64748b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    color: '#ef4444',
                  },
                }}
              >
                {likedPosts.has(post._id) ? <LikeIcon /> : <UnlikeIcon />}
              </IconButton>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                {post.likeCount || 0}
              </Typography>
              
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post/${post._id}`);
                }}
                sx={{
                  color: '#64748b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    color: '#2563eb',
                  },
                }}
              >
                <CommentIcon />
              </IconButton>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                {post.commentCount || 0}
              </Typography>
            </Box>
            
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleSave(post._id);
              }}
              sx={{
                color: savedPosts.has(post._id) ? '#f59e0b' : '#64748b',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: '#f59e0b',
                },
              }}
            >
              {savedPosts.has(post._id) ? <SaveIcon /> : <UnsaveIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Fade>
  );

  const SuggestedUsers = () => (
    <Box
      className="glass-card"
      sx={{
        height: 'fit-content',
        maxHeight: 'calc(100vh - 140px)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Suggested for You
        </Typography>
        <Box sx={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
          <List sx={{ p: 0 }}>
            {suggestedUsers.map((user, index) => (
              <ListItem 
                key={user._id} 
                sx={{ 
                  px: 0, 
                  py: 1,
                  animation: `slideInRight 0.6s ease-out ${index * 0.1}s`,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 40,
                      height: 40,
                      background: user.avatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    {!user.avatar && user.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'white',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        },
                      }}
                      onClick={() => handleUserClick(user.username)}
                    >
                      {user.username}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {user.followerCount || 0} followers
                    </Typography>
                  }
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleFollow(user._id)}
                  sx={{
                    borderColor: followingUsers.has(user._id) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                    color: followingUsers.has(user._id) ? 'rgba(255, 255, 255, 0.7)' : 'white',
                    background: followingUsers.has(user._id) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      borderColor: followingUsers.has(user._id) ? '#ff4757' : '#667eea',
                      color: followingUsers.has(user._id) ? '#ff4757' : '#667eea',
                      background: followingUsers.has(user._id) ? 'rgba(255, 71, 87, 0.1)' : 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  {followingUsers.has(user._id) ? 'Following' : 'Follow'}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        pt: 1,
        pb: 2,
        animation: 'fadeInUp 0.6s ease-out',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 15% 50%, rgba(101, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.05) 25%, rgba(0, 0, 0, 0) 50%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '180px 180px',
          opacity: 0.5,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          {/* Left side - Empty for balance */}
          <Box sx={{ width: '20%', display: { xs: 'none', md: 'block' } }} />

          {/* Center - Posts */}
          <Box sx={{ width: { xs: '100%', sm: '80%', md: '50%' }, maxWidth: 500 }}>
            <Box
                sx={{
                  p: 2,
                  mb: 2,
                  animation: 'slideInLeft 0.6s ease-out',
                  position: 'relative',
                  backgroundColor: 'rgba(30, 30, 30, 0.8)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(38, 38, 38, 0.6)',
                  borderRadius: 16,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ ml: 1, flex: 1 }}>
                    <Skeleton variant="text" width={120} />
                    <Skeleton variant="text" width={80} />
                  </Box>
                </Box>
              ) : posts.length > 0 ? (
                posts.map((post, index) => (
                  <Box 
                    key={post._id} 
                    sx={{ 
                      mb: index < posts.length - 1 ? 4 : 0,
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                      transform: 'translateZ(0)', // Force hardware acceleration
                    }}
                  >
                    <PostCard post={post} />
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    animation: 'bounceIn 0.6s ease-out',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(30, 30, 30, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(38, 38, 38, 0.6)',
                    borderRadius: 16,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      color: 'white',
                      fontWeight: 600,
                      background: 'var(--primary-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    No posts yet
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 3,
                    }}
                  >
                    Follow some users to see their posts here!
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/explore')}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '25px',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 10px 20px rgba(101, 126, 234, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)',
                        opacity: 0,
                        transition: 'var(--transition-normal)',
                      },
                      '&:hover': {
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 15px 25px rgba(102, 126, 234, 0.4)',
                        '&::before': {
                          opacity: 1,
                        }
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 5px 15px rgba(102, 126, 234, 0.2)',
                      }
                    }}
                  >
                    Explore Posts
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right side - Fixed Suggestions */}
          <Box sx={{ width: '20%', display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                position: 'fixed',
                top: 70,
                width: '18%',
                maxWidth: 280,
                animation: 'slideInRight 0.6s ease-out',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {suggestedUsers.length > 0 ? (
                <SuggestedUsers />
              ) : (
                <Box
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(30, 30, 30, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(38, 38, 38, 0.6)',
                    borderRadius: 16,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      color: 'white',
                      fontWeight: 600,
                      background: 'var(--primary-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    No suggestions
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Check back later for user suggestions!
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeView;