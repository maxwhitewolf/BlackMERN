import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Skeleton,
  Fade,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  BookmarkBorder as BookmarkIcon,
  GridOn as GridIcon,
  PersonAdd as FollowIcon,
  PersonRemove as UnfollowIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const ProfileContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(18, 18, 18, 0.9) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  overflow: 'hidden',
  border: '1px solid rgba(38, 38, 38, 0.8)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(0, 149, 246, 0.3)',
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(30, 30, 30, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  padding: '32px 24px',
  borderBottom: '1px solid rgba(38, 38, 38, 0.5)',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid rgba(0, 149, 246, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 149, 246, 0.3)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: '#0095f6',
    boxShadow: '0 12px 40px rgba(0, 149, 246, 0.5)',
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(30, 30, 30, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(38, 38, 38, 0.6)',
  borderRadius: 16,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(0, 149, 246, 0.3)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: '10px 24px',
  fontWeight: 700,
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&.follow': {
    background: 'linear-gradient(135deg, #0095f6 0%, #4db5ff 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #0081d6 0%, #3da3e6 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 149, 246, 0.4)',
    },
  },
  '&.unfollow': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      borderColor: '#ff3b30',
      color: '#ff3b30',
    },
  },
  '&.edit': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-2px)',
    },
  },
}));

const PostGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 24,
  padding: '24px',
}));

const PostCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(30, 30, 30, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(38, 38, 38, 0.6)',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(0, 149, 246, 0.3)',
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

const EmptyStateCard = styled(Card)(({ theme }) => ({
  padding: '48px 24px',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
}));

const ProfileView = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
    setLoading(true);
        setError('');

        // Get current user from localStorage
        const userData = localStorage.getItem('user');
        const currentUserData = userData ? JSON.parse(userData) : null;

        // Check if viewing own profile
        if (currentUserData && currentUserData.username === username) {
          setIsOwnProfile(true);
        } else {
          setIsOwnProfile(false);
        }

        // Fetch profile data
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/users/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Profile not found');
        }

        const data = await response.json();
        
        // Ensure we have the correct user data
        if (data.user) {
          setProfile(data.user);
          setPosts(data.posts.data || []);
          
          // Check if current user is following this profile
          if (currentUserData && currentUserData._id !== data.user._id) {
            // Check follow status by making a separate request
            try {
              const followResponse = await fetch(`/api/users/follow-status/${data.user._id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              if (followResponse.ok) {
                const followData = await followResponse.json();
                setIsFollowing(followData.isFollowing);
              }
            } catch (err) {
              console.error('Error checking follow status:', err);
              setIsFollowing(false);
            }
          } else {
            setIsFollowing(false); // Can't follow yourself
          }
        } else {
          throw new Error('Invalid profile data');
        }

      } catch (err) {
        setError(err.message);
        setProfile(null);
        setPosts([]);
      } finally {
    setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`/api/users/follow/${profile._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        // Update follower count
        setProfile(prev => ({
          ...prev,
          followerCount: isFollowing ? prev.followerCount - 1 : prev.followerCount + 1
        }));
      }
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ ml: 3, flex: 1 }}>
              <Skeleton variant="text" width={200} height={32} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={100} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" height={200} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Fade in={true} timeout={500}>
            <EmptyStateCard>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                Profile Not Found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                The user <strong>@{username}</strong> doesn't exist or hasn't created a profile yet.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/home')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Go to Home
              </Button>
            </EmptyStateCard>
          </Fade>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        {profile ? (
          <Fade in={true} timeout={500}>
            <ProfileContainer>
              <ProfileHeader>
                <Grid container spacing={4} alignItems="center">
                  {/* Profile Avatar */}
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar
                        src={profile.avatar}
                        sx={{
                          width: 120,
                          height: 120,
                          border: '4px solid rgba(255, 255, 255, 0.2)',
                          background: profile.avatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '3rem',
                        }}
                      >
                        {!profile.avatar && profile.username?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </Box>
                  </Grid>

                  {/* Profile Info */}
                  <Grid item xs={12} sm={8}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {profile.username}
                        </Typography>
                        {profile.isAdmin && (
                          <Chip
                            label="✓"
                            size="small"
                            sx={{
                              backgroundColor: '#0095f6',
                              color: 'white',
                              fontSize: '0.6rem',
                            }}
                          />
                        )}
                        
                        {!isOwnProfile ? (
                          <StyledButton
                            variant="outlined"
                            size="small"
                            onClick={handleFollow}
                            className={isFollowing ? 'unfollow' : 'follow'}
                            startIcon={isFollowing ? <UnfollowIcon /> : <FollowIcon />}
                            sx={{
                              borderColor: isFollowing ? '#dbdbdb' : '#0095f6',
                              color: isFollowing ? '#262626' : '#0095f6',
                              '&:hover': {
                                borderColor: isFollowing ? '#ff6b6b' : '#0081d6',
                                color: isFollowing ? '#ff6b6b' : '#0081d6',
                              },
                            }}
                          >
                            {isFollowing ? 'Following' : 'Follow'}
                          </StyledButton>
                        ) : (
                          <StyledButton
                            variant="outlined"
                            size="small"
                            onClick={handleEditProfile}
                            className="edit"
                            startIcon={<EditIcon />}
                            sx={{
                              borderColor: '#dbdbdb',
                              color: '#262626',
                              '&:hover': {
                                borderColor: '#0095f6',
                                color: '#0095f6',
                              },
                            }}
                          >
                            Edit Profile
                          </StyledButton>
                        )}
                        
                        <IconButton size="small">
                          <SettingsIcon />
                        </IconButton>
                      </Box>

                      {/* Stats */}
                      <StatsCard>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', py: 2 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {posts.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              posts
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {profile.followerCount?.toLocaleString() || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              followers
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {profile.followingCount?.toLocaleString() || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              following
                            </Typography>
                          </Box>
                        </Box>
                      </StatsCard>

                      {/* Bio */}
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                        {profile.fullName || profile.username}
                      </Typography>
                      {profile.biography && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {profile.biography}
                        </Typography>
              )}
                      {profile.website && (
                        <Typography
                          variant="body2"
                          color="primary.main"
                          sx={{ cursor: 'pointer', textDecoration: 'none' }}
                        >
                          {profile.website}
                        </Typography>
                      )}
                      {profile.location && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          📍 {profile.location}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </ProfileHeader>
            </ProfileContainer>
          </Fade>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No profile found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This user doesn't exist or has no profile
            </Typography>
          </Box>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 0,
                flex: 1,
              },
            }}
          >
            <Tab
              icon={<GridIcon />}
              label="POSTS"
              iconPosition="start"
            />
            <Tab
              icon={<BookmarkIcon />}
              label="SAVED"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Posts Grid */}
        <PostGrid>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} onClick={() => handlePostClick(post._id)}>
                <CardMedia
                  component="img"
                  image={post.image || ''}
                  alt="Post"
                  sx={{ 
                    aspectRatio: '1/1', 
                    objectFit: 'cover',
                    backgroundColor: post.image ? 'transparent' : 'rgba(255, 255, 255, 0.1)'
                  }}
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
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Box sx={{ mb: 3 }}>
                <IconButton
                  sx={{
                    width: 80,
                    height: 80,
                    border: '2px dashed',
                    borderColor: 'divider',
                    color: 'text.secondary',
                  }}
                >
                  <AddIcon sx={{ fontSize: 40 }} />
                </IconButton>
              </Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {isOwnProfile ? 'Share your first post!' : 'No posts yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {isOwnProfile 
                  ? 'Start sharing your moments with the world' 
                  : 'This user hasn\'t posted anything yet'
                }
              </Typography>
              {isOwnProfile && (
                <Button
                  variant="contained"
                  onClick={handleCreatePost}
                  startIcon={<AddIcon />}
                >
                  Create Post
                </Button>
              )}
            </Box>
          )}
        </PostGrid>
      </Box>
    </Container>
  );
};

export default ProfileView;
