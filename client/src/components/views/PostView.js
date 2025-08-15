import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Skeleton,
  Fade,
  Fab,
} from '@mui/material';
import {
  Favorite as LikeIcon,
  FavoriteBorder as LikeBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Send as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  MoreVert as MoreIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const PostContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  padding: '24px 0',
}));

const PostCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '80vh',
}));

const PostMedia = styled(CardMedia)(({ theme }) => ({
  height: 'auto',
  maxHeight: '500px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
}));

const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}));

const PostStats = styled(Box)(({ theme }) => ({
  padding: '8px 16px',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const NavigationFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  zIndex: 1000,
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
}));

const PostView = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
  const fetchPost = async () => {
      try {
    setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch the specific post
        const response = await fetch(`/api/posts/${postId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Post not found');
        }

        const postData = await response.json();
        setPost(postData);
        setLikeCount(postData.likeCount || 0);
        setLiked(postData.isLiked || false);
        setSaved(postData.isSaved || false);

        // Fetch all posts for navigation
        const allPostsResponse = await fetch('/api/posts/explore', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (allPostsResponse.ok) {
          const allPostsData = await allPostsResponse.json();
          setAllPosts(allPostsData);
          
          // Find current post index
          const index = allPostsData.findIndex(p => p._id === postId);
          setCurrentIndex(index >= 0 ? index : 0);
        }

      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, navigate]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`/api/posts/like/${post._id}`, {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData._id
        }),
      });

      if (response.ok) {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`/api/posts/save/${post._id}`, {
        method: saved ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData._id
        }),
      });

      if (response.ok) {
        setSaved(!saved);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleNavigate = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(currentIndex + 1, allPosts.length - 1)
      : Math.max(currentIndex - 1, 0);
    
    if (newIndex !== currentIndex && allPosts[newIndex]) {
      navigate(`/post/${allPosts[newIndex]._id}`);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <PostContainer>
        <PostCard>
          <CardHeader
            avatar={<Skeleton variant="circular" width={40} height={40} />}
            title={<Skeleton variant="text" width={120} />}
            subheader={<Skeleton variant="text" width={80} />}
            action={<Skeleton variant="circular" width={24} height={24} />}
          />
          <PostMedia>
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </PostMedia>
          <PostActions>
            <ActionButtons>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="circular" width={24} height={24} />
            </ActionButtons>
            <Skeleton variant="circular" width={24} height={24} />
          </PostActions>
        </PostCard>
      </PostContainer>
    );
  }

  if (!post) {
    return (
      <PostContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="h6" color="text.secondary">
            Post not found
          </Typography>
        </Box>
      </PostContainer>
    );
  }

  return (
    <PostContainer>
      <Fade in={true} timeout={300}>
        <PostCard elevation={6}>
          {/* Header */}
          <CardHeader
            avatar={
              <Avatar
                src={post.poster?.avatar}
                sx={{
                  width: 50,
                  height: 50,
                  background: post.poster?.avatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {!post.poster?.avatar && post.poster?.username?.charAt(0)?.toUpperCase()}
              </Avatar>
            }
            title={
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${post.poster?.username}`)}
              >
                {post.poster?.username}
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            }
            action={
              <IconButton>
                <MoreIcon />
              </IconButton>
            }
          />

          {/* Media */}
          <PostMedia
            component="img"
            image={post.image || ''}
            alt={post.title}
          />

          {/* Actions */}
          <PostActions>
            <ActionButtons>
              <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
                {liked ? <LikeIcon /> : <LikeBorderIcon />}
              </IconButton>
              <IconButton>
                <CommentIcon />
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </ActionButtons>
            <IconButton onClick={handleSave} color={saved ? 'primary' : 'default'}>
              {saved ? <BookmarkFilledIcon /> : <BookmarkIcon />}
            </IconButton>
          </PostActions>

          {/* Stats */}
          <PostStats>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              {likeCount.toLocaleString()} likes
            </Typography>
          </PostStats>

          {/* Content */}
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, display: 'inline', mr: 1 }}
              >
                {post.poster?.username}
              </Typography>
              <Typography variant="body2" component="span">
                {post.content}
              </Typography>
            </Box>
            
            {post.location && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                📍 {post.location}
              </Typography>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {post.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </PostCard>
      </Fade>

      {/* Navigation FABs */}
      {currentIndex > 0 && (
        <NavigationFab
          size="small"
          onClick={() => handleNavigate('prev')}
          sx={{ left: { xs: 8, sm: 16, md: 'calc(50% - 320px)' }, top: '50%', transform: 'translateY(-50%)' }}
        >
          <PrevIcon />
        </NavigationFab>
      )}

      {currentIndex < allPosts.length - 1 && (
        <NavigationFab
          size="small"
          onClick={() => handleNavigate('next')}
          sx={{ right: { xs: 8, sm: 16, md: 'calc(50% - 320px)' }, top: '50%', transform: 'translateY(-50%)' }}
        >
          <NextIcon />
        </NavigationFab>
      )}

      {/* Close FAB */}
      <NavigationFab
        size="small"
        onClick={handleClose}
        sx={{ right: { xs: 8, sm: 16 }, top: 16, zIndex: 1200 }}
      >
        <CloseIcon />
      </NavigationFab>
    </PostContainer>
  );
};

export default PostView;
