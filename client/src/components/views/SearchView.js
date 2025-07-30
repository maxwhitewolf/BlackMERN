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
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Skeleton,
  Fade,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  PersonAdd as FollowIcon,
  PersonRemove as UnfollowIcon,
  LocationOn as LocationIcon,
  Tag as TagIcon,
  Article as PostIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const SearchContainer = styled(Box)(({ theme }) => ({
  padding: '24px 0',
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 24,
    backgroundColor: theme.palette.background.surface,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const UserCard = styled(Card)(({ theme }) => ({
  marginBottom: 8,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
}));

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: 8,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
}));

const TrendingCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
}));

const SearchView = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [followingUsers, setFollowingUsers] = useState(new Set());

  useEffect(() => {
    fetchSuggestedUsers();
    fetchTrendingTopics();
  }, []);

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

  const fetchTrendingTopics = async () => {
    // Mock trending topics for now
    setTrendingTopics([
      { id: 1, topic: '#photography', posts: 1250 },
      { id: 2, topic: '#travel', posts: 890 },
      { id: 3, topic: '#food', posts: 756 },
      { id: 4, topic: '#fitness', posts: 634 },
      { id: 5, topic: '#art', posts: 521 },
    ]);
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
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                sx={{ width: 48, height: 48 }}
              />
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
            <Button
              variant={followingUsers.has(user._id) ? "outlined" : "contained"}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleFollow(user._id);
              }}
              startIcon={followingUsers.has(user._id) ? <UnfollowIcon /> : <FollowIcon />}
              sx={{
                minWidth: 100,
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
              src={post.poster?.avatar || `https://ui-avatars.com/api/?name=${post.poster?.username}&background=random`}
              sx={{ width: 40, height: 40 }}
            />
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

  const TrendingTopicCard = ({ topic }) => (
    <Fade in={true} timeout={300}>
      <TrendingCard>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TagIcon sx={{ color: 'primary.main' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {topic.topic}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {topic.posts.toLocaleString()} posts
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </TrendingCard>
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
          // Default View - Trending and Suggestions
          <Grid container spacing={3}>
            {/* Trending Topics */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingIcon />
                Trending Topics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {trendingTopics.map((topic) => (
                  <TrendingTopicCard key={topic.id} topic={topic} />
                ))}
              </Box>
            </Grid>

            {/* Suggested Users */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Suggested for You
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {suggestedUsers.map((user) => (
                  <UserListItem key={user._id} user={user} />
                ))}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default SearchView;
