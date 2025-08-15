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
  backgroundColor: 'rgba(30, 30, 30, 0.8)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(38, 38, 38, 0.6)',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(0, 149, 246, 0.3)',
  },
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px 20px',
  gap: 16,
  borderBottom: `1px solid rgba(38, 38, 38, 0.5)`,
  position: 'relative',
  zIndex: 1,
}));

const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 20px',
  borderTop: `1px solid rgba(38, 38, 38, 0.5)`,
  borderBottom: `1px solid rgba(38, 38, 38, 0.5)`,
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
  borderTop: `1px solid rgba(38, 38, 38, 0.5)`,
  position: 'relative',
  zIndex: 1,
  animation: 'fadeInUp 0.3s ease-out',
}));

const SuggestedUsersCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(30, 30, 30, 0.8)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(38, 38, 38, 0.6)',
  borderRadius: 16,
  marginBottom: 24,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(0, 149, 246, 0.3)',
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
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !userData) {
        console.log('No token or user data found');
        setPosts([]);
        setLoading(false);
        return;
      }
      
      console.log('Fetching home posts for user:', userData._id);
      
      const response = await fetch('/api/posts/home', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Home posts response status:', response.status);

      if (response.ok) {
        const postsData = await response.json();
        const posts = postsData.posts || [];
        console.log('Fetched posts:', posts.length);
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
        
        console.log('Liked posts:', likedSet.size);
        console.log('Saved posts:', savedSet.size);
        
        setLikedPosts(likedSet);
        setSavedPosts(savedSet);
      } else {
        console.log('Home feed failed, trying all posts');
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
          console.log('Fetched all posts:', posts.length);
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
          console.log('All posts also failed');
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
      
      if (!token || !userData) {
        alert('Please log in to like posts');
        return;
      }
      
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
              likeCount: isLiked ? Math.max(0, (post.likeCount || 1) - 1) : (post.likeCount || 0) + 1
            };
          }
          return post;
        }));
      } else {
        const errorData = await response.json();
        console.error('Like error:', errorData);
        alert(errorData.error || 'Failed to like post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleSave = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !userData) {
        alert('Please log in to save posts');
        return;
      }
      
      const isSaved = savedPosts.has(postId);
      
      console.log('Saving post:', postId, 'isSaved:', isSaved);
      
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

      console.log('Save response:', response.status);

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
      } else {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        alert(errorData.error || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
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
      
      if (!token || !userData) {
        alert('Please log in to comment');
        return;
      }
      
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
        alert(errorData.error || 'Failed to comment');
      }
    } catch (error) {
      console.error('Error commenting:', error);
      alert('Failed to comment. Please try again.');
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
      
      // Try to use the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(postUrl);
        alert('Post URL copied to clipboard!');
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = postUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          alert('Post URL copied to clipboard!');
        } catch (err) {
          console.error('Fallback copy failed:', err);
          alert('Failed to copy URL. Please copy manually: ' + postUrl);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      const postUrl = `${window.location.origin}/post/${postId}`;
      alert('Failed to copy URL. Please copy manually: ' + postUrl);
    }
  };

  const PostCard = ({ post }) => (
    <Fade in={true} timeout={500}>
      <Box
        className="glass-card hover-lift"
        sx={{
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '100%',
          borderRadius: '16px',
          backgroundColor: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(38, 38, 38, 0.6)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            borderColor: 'rgba(0, 149, 246, 0.3)',
            '& .post-image': {
              transform: 'scale(1.05)',
            },
            '& .action-button': {
              transform: 'scale(1.1)',
            },
            '&::before': {
              opacity: 0.7,
            },
            '&::after': {
              opacity: 1
            },
          },
        }}
      >
        {/* Post Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
            zIndex: 2,
          }}
        >
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
                sx={{ 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  },
                }}
                onClick={() => handleUserClick(post.poster?.username)}
              >
                {post.poster?.username}
              </Typography>
              {post.poster?.isAdmin && (
                <Chip
                  label="✓"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '0.6rem',
                    height: 16,
                    animation: 'pulse 2s infinite',
                  }}
                />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {/* Post Image */}
        <Box
          className="post-image"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            transition: 'var(--transition-normal)',
            cursor: 'pointer',
            maxHeight: '600px',
            '&:hover .image-overlay': {
              opacity: 1,
            },
            '&:hover .view-post-button': {
              opacity: 1,
              transform: 'translateY(0)',
            }
          }}
          onClick={() => navigate(`/post/${post._id}`)}
        >
          <img
            src={post.image}
            alt={post.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '600px',
              objectFit: 'cover',
              display: 'block',
              transition: 'var(--transition-normal)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
              opacity: 0,
              transition: 'var(--transition-normal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="image-overlay"
          >
            <Button
              variant="contained"
              className="view-post-button"
              sx={{
                background: 'var(--primary-gradient)',
                borderRadius: '30px',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1,
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'var(--transition-normal)',
                '&:hover': {
                  background: 'var(--primary-gradient)',
                  boxShadow: 'var(--glass-shadow)',
                  transform: 'translateY(0) scale(1.05)',
                }
              }}
            >
              View Post
            </Button>
          </Box>
        </Box>

        {/* Post Actions */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2,
            background: 'var(--glass-gradient)',
            backdropFilter: 'var(--glass-blur-sm)',
            WebkitBackdropFilter: 'var(--glass-blur-sm)',
            borderTop: '1px solid var(--glass-border)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              className="action-button"
              onClick={() => handleLike(post._id)}
              sx={{
                color: likedPosts.has(post._id) ? '#ff4757' : 'rgba(255, 255, 255, 0.8)',
                transition: 'var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 0,
                  height: 0,
                  borderRadius: '50%',
                  background: likedPosts.has(post._id) ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 71, 87, 0.1)',
                  transform: 'translate(-50%, -50%)',
                  transition: 'var(--transition-fast)',
                  zIndex: -1,
                },
                '&:hover': {
                  transform: 'scale(1.2)',
                  color: likedPosts.has(post._id) ? '#ff3742' : '#ff4757',
                  '&::before': {
                    width: '150%',
                    height: '150%',
                  },
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                ...(likedPosts.has(post._id) && {
                  animation: 'pulse 0.4s ease-out',
                }),
              }}
            >
              {likedPosts.has(post._id) ? <LikeIcon /> : <UnlikeIcon />}
            </IconButton>
            <IconButton
              className="action-button"
              onClick={() => navigate(`/post/${post._id}`)}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                transition: 'var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 0,
                  height: 0,
                  borderRadius: '50%',
                  background: 'rgba(79, 172, 254, 0.1)',
                  transform: 'translate(-50%, -50%)',
                  transition: 'var(--transition-fast)',
                  zIndex: -1,
                },
                '&:hover': {
                  transform: 'scale(1.2)',
                  color: '#4facfe',
                  '&::before': {
                    width: '150%',
                    height: '150%',
                  },
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <CommentIcon />
            </IconButton>
            <IconButton
              className="action-button"
              onClick={() => handleShare(post._id)}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                transition: 'var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 0,
                  height: 0,
                  borderRadius: '50%',
                  background: 'rgba(67, 233, 123, 0.1)',
                  transform: 'translate(-50%, -50%)',
                  transition: 'var(--transition-fast)',
                  zIndex: -1,
                },
                '&:hover': {
                  transform: 'scale(1.2)',
                  color: '#43e97b',
                  '&::before': {
                    width: '150%',
                    height: '150%',
                  },
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
          <IconButton
            className="action-button"
            onClick={() => handleSave(post._id)}
            sx={{
              color: savedPosts.has(post._id) ? '#4facfe' : 'rgba(255, 255, 255, 0.8)',
              transition: 'var(--transition-normal)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 0,
                height: 0,
                borderRadius: '50%',
                background: savedPosts.has(post._id) ? 'rgba(0, 242, 254, 0.2)' : 'rgba(79, 172, 254, 0.1)',
                transform: 'translate(-50%, -50%)',
                transition: 'var(--transition-fast)',
                zIndex: -1,
              },
              '&:hover': {
                transform: 'scale(1.2)',
                color: savedPosts.has(post._id) ? '#00f2fe' : '#4facfe',
                '&::before': {
                  width: '150%',
                  height: '150%',
                },
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            {savedPosts.has(post._id) ? <SaveIcon /> : <UnsaveIcon />}
          </IconButton>
        </Box>

        {/* Post Footer */}
        <Box
          sx={{
            px: 2,
            pb: 2,
            position: 'relative',
            zIndex: 2,
            background: 'var(--glass-gradient)',
            backdropFilter: 'var(--glass-blur-sm)',
            WebkitBackdropFilter: 'var(--glass-blur-sm)',
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              pt: 1,
              color: 'white',
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: '100%',
                height: 1,
                background: 'var(--primary-gradient)',
                opacity: 0.5,
                borderRadius: 1,
              }
            }}
          >
            {post.likeCount || 0} likes
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1.5,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.6,
              fontSize: '0.95rem',
              position: 'relative',
              pl: 0.5,
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 2,
                borderRadius: 4,
                background: 'var(--primary-gradient)',
                opacity: 0.5,
              }
            }}
          >
            <span style={{ fontWeight: 600, color: 'white', marginRight: '6px' }}>{post.poster?.username}</span> 
            {post.content}
          </Typography>
          {post.commentCount > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ 
                cursor: 'pointer', 
                mb: 1.5,
                color: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'var(--transition-normal)',
                '&:hover': {
                  color: '#4facfe',
                  transform: 'translateX(4px)',
                },
              }}
              onClick={() => toggleComments(post._id)}
            >
              {showComments[post._id] ? 'Hide' : 'View all'} {post.commentCount} comments
              <Box 
                component="span" 
                sx={{ 
                  fontSize: '1rem', 
                  transition: 'var(--transition-normal)',
                  transform: showComments[post._id] ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ↓
              </Box>
            </Typography>
          )}
          
          {/* Comments Section */}
          {showComments[post._id] && comments[post._id] && (
            <Box 
              sx={{ 
                mt: 2,
                animation: 'slideInUp 0.3s ease-out',
                maxHeight: '300px',
                overflowY: 'auto',
                pr: 1,
                mr: -1,
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'var(--primary-gradient)',
                  borderRadius: '10px',
                },
              }}
            >
              {comments[post._id].map((comment, index) => (
                <Box 
                  key={comment._id} 
                  sx={{ 
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: '12px',
                    background: 'var(--glass-bg-dark)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'var(--glass-blur-sm)',
                    WebkitBackdropFilter: 'var(--glass-blur-sm)',
                    transition: 'var(--transition-normal)',
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 'var(--glass-shadow-sm)',
                      borderColor: 'var(--glass-border-hover)',
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5 }}>
                    <span 
                      style={{ 
                        fontWeight: 600, 
                        color: 'white', 
                        marginRight: '8px',
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      onClick={() => handleUserClick(comment.commenter?.username)}
                    >
                      {comment.commenter?.username}
                    </span> 
                    {comment.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Comment Input */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid var(--glass-border)',
            position: 'relative',
            zIndex: 2,
            background: 'var(--glass-gradient)',
            backdropFilter: 'var(--glass-blur-sm)',
            WebkitBackdropFilter: 'var(--glass-blur-sm)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            transition: 'var(--transition-normal)',
            '&:hover': {
              boxShadow: 'var(--glass-shadow-sm)',
            }
          }}
        >
          <TextField
            fullWidth
            placeholder="Add a comment..."
            variant="standard"
            value={commentTexts[post._id] || ''}
            onChange={(e) => setCommentTexts(prev => ({
              ...prev,
              [post._id]: e.target.value
            }))}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleComment(post._id);
              }
            }}
            sx={{
              '& .MuiInput-root': {
                color: 'white',
                '&:before': {
                  borderBottom: '1px solid var(--glass-border)',
                },
                '&:after': {
                  borderBottom: '2px solid var(--primary-color)',
                  background: 'var(--primary-gradient)',
                },
                '&:hover:before': {
                  borderBottom: '1px solid var(--glass-border-hover)',
                },
              },
              '& .MuiInput-input': {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.6)',
                  opacity: 1,
                },
                transition: 'var(--transition-normal)',
                padding: '8px 12px',
                borderRadius: '8px',
                '&:focus': {
                  background: 'rgba(255, 255, 255, 0.05)',
                }
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="text"
                    size="small"
                    sx={{ 
                      color: (commentTexts[post._id] || '').trim() ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.3)',
                      fontWeight: 600,
                      transition: 'var(--transition-normal)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--primary-gradient)',
                        opacity: 0,
                        transition: 'var(--transition-normal)',
                        borderRadius: '4px',
                        zIndex: -1,
                      },
                      '&:hover': {
                        color: (commentTexts[post._id] || '').trim() ? 'white' : 'rgba(255, 255, 255, 0.3)',
                        transform: (commentTexts[post._id] || '').trim() ? 'scale(1.05)' : 'none',
                        '&::before': {
                          opacity: (commentTexts[post._id] || '').trim() ? 0.8 : 0,
                        }
                      },
                    }}
                    onClick={() => handleComment(post._id)}
                    disabled={!(commentTexts[post._id] || '').trim()}
                  >
                    Post
                  </Button>
                </InputAdornment>
              ),
            }}
          />
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