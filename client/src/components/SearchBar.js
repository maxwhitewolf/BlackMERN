import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ posts: [], users: [], tags: [] });
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.trim().length < 2) {
        setSuggestions({ posts: [], users: [], tags: [] });
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/search/combined?q=${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : undefined,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSuggestions({
            posts: data.posts || [],
            users: data.users || [],
            tags: data.tags || []
          });
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (type, item) => {
    setShowSuggestions(false);
    setQuery('');
    
    switch (type) {
      case 'post':
        navigate(`/post/${item._id}`);
        break;
      case 'user':
        navigate(`/profile/${item.username}`);
        break;
      case 'tag':
        navigate(`/search?q=${encodeURIComponent(item.name)}&type=posts`);
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions({ posts: [], users: [], tags: [] });
    setShowSuggestions(false);
  };

  const totalSuggestions = suggestions.posts.length + suggestions.users.length + suggestions.tags.length;

  return (
    <Box ref={searchRef} sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          placeholder="Search posts, users, tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={20} />}
                {query && (
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            },
          }}
        />
      </form>

      {showSuggestions && totalSuggestions > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <List>
            {suggestions.posts.map((post) => (
              <ListItem
                key={post._id}
                onClick={() => handleSuggestionClick('post', post)}
                sx={{ py: 1, cursor: 'pointer' }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ArticleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={post.title}
                  secondary={`by ${post.poster.username}`}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}

            {suggestions.users.map((user) => (
              <ListItem
                key={user._id}
                onClick={() => handleSuggestionClick('user', user)}
                sx={{ py: 1, cursor: 'pointer' }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={user.fullName || `${user.followerCount} followers`}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}

            {suggestions.tags.map((tag) => (
              <ListItem
                key={tag.name}
                onClick={() => handleSuggestionClick('tag', tag)}
                sx={{ py: 1, cursor: 'pointer' }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <TagIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`#${tag.name}`}
                  secondary={`${tag.count} posts`}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar; 