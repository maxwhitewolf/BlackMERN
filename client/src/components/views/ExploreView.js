import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Skeleton,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const PostCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    '& .overlay': {
      opacity: 1,
    },
  },
}));

const PostOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
}));

const ExploreView = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/posts/explore', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      } else {
        // If no explore posts, try to get all posts
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
      console.error('Error fetching explore posts:', error);
      setError('Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={1}>
      {Array.from({ length: 12 }, (_, i) => (
        <Grid item xs={4} key={i}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Explore BlanX
        </Typography>
        
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try refreshing the page
            </Typography>
          </Box>
        ) : posts.length > 0 ? (
          <Grid container spacing={1}>
            {posts.map((post) => (
              <Grid item xs={4} key={post._id}>
                <Fade in={true} timeout={500}>
                  <PostCard onClick={() => handlePostClick(post._id)}>
                    <CardMedia
                      component="img"
                      image={post.image || `https://picsum.photos/300/300?random=${post._id}`}
                      alt={post.title || 'Post'}
                      sx={{ aspectRatio: '1/1', objectFit: 'cover' }}
                    />
                    <PostOverlay className="overlay">
                      <Box sx={{ textAlign: 'center', color: 'white' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ♥ {post.likeCount || 0}
                        </Typography>
                        <Typography variant="body2">
                          💬 {post.commentCount || 0}
                        </Typography>
                      </Box>
                    </PostOverlay>
                  </PostCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No posts to explore yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to create a post and share your moments!
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ExploreView;
