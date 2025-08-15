import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  Avatar,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Skeleton,
  Fade,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as FollowIcon,
  PersonRemove as UnfollowIcon,
  Article as PostIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const SearchContainer = styled(Box)(({ theme }) => ({
  padding: '24px 0',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 20,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
  },
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '1.1rem',
    padding: '12px 20px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(102, 126, 234, 0.4)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
      transform: 'translateY(-1px)',
    },
    '& input': {
      color: 'rgba(255, 255, 255, 0.9)',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.5)',
        opacity: 1,
      },
    },
  },
  '& .MuiInputAdornment-root': {
    color: 'rgba(255, 255, 255, 0.6)',
  },
}));

const UserCard = styled(Card)(({ theme }) => ({
  marginBottom: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: 16,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(77, 181, 255, 0.02) 100%)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    '&::before': {
      opacity: 1,
    },
  },
}));

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: 16,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(77, 181, 255, 0.02) 100%)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    '&::before': {
      opacity: 1,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: '8px 20px',
  fontWeight: 600,
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
}));

const SearchView = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [followingUsers, setFollowingUsers] = useState(new Set());

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Search for users
        const usersResponse = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Search for posts
        const postsResponse = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const users = usersResponse.ok ? await usersResponse.json() : [];
        const posts = postsResponse.ok ? await postsResponse.json() : [];

        setSearchResults({ users, posts });
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults({ users: [], posts: [] });
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults({ users: [], posts: [] });
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

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const UserListItem = ({ user }) => (
    <Fade in={true} timeout={300}>
      <UserCard onClick={() => handleUserClick(user.username)}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user.avatar}
                sx={{ 
                  width: 48, 
                  height: 48,
                  background: user.avatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {!user.avatar && user.username?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                  {user.isAdmin && (
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {user.fullName || user.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.followerCount || 0} followers
                </Typography>
              </Box>
            </Box>
            <StyledButton
              variant={followingUsers.has(user._id) ? "outlined" : "contained"}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleFollow(user._id);
              }}
              startIcon={followingUsers.has(user._id) ? <UnfollowIcon /> : <FollowIcon />}
              className={followingUsers.has(user._id) ? 'unfollow' : 'follow'}
            >
              {followingUsers.has(user._id) ? 'Following' : 'Follow'}
            </StyledButton>
          </Box>
        </CardContent>
      </UserCard>
    </Fade>
  );

  const PostListItem = ({ post }) => (
    <Fade in={true} timeout={300}>
      <PostCard onClick={() => handlePostClick(post._id)}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {post.poster?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {post.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {post.likeCount || 0} likes • {post.commentCount || 0} comments
              </Typography>
            </Box>
            <PostIcon sx={{ color: 'text.secondary' }} />
          </Box>
        </CardContent>
      </PostCard>
    </Fade>
  );

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <SearchContainer>
          <SearchInput
            fullWidth
            placeholder="Search users, posts, or topics..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </SearchContainer>

        {searchQuery.length > 0 ? (
          // Search Results
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Search Results for "{searchQuery}"
            </Typography>
            
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
              <Tab label={`Users (${searchResults.users.length})`} />
              <Tab label={`Posts (${searchResults.posts.length})`} />
            </Tabs>

            {loading ? (
              <Box>
                {[1, 2, 3].map((i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" height={80} />
                  </Box>
                ))}
              </Box>
            ) : activeTab === 0 ? (
              // Users Tab
              searchResults.users.length > 0 ? (
                searchResults.users.map((user) => (
                  <UserListItem key={user._id} user={user} />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No users found for "{searchQuery}"
                </Typography>
              )
            ) : (
              // Posts Tab
              searchResults.posts.length > 0 ? (
                searchResults.posts.map((post) => (
                  <PostListItem key={post._id} post={post} />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No posts found for "{searchQuery}"
                </Typography>
              )
            )}
          </Box>
        ) : (
          // Default View - Only Suggested Users
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
              Discover People
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500, mx: 'auto' }}>
              {suggestedUsers.map((user) => (
                <UserListItem key={user._id} user={user} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SearchView;
