import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  PhotoCamera as PhotoIcon,
  LocationOn as LocationIcon,
  Tag as TagIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const ImagePreview = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 400,
  borderRadius: 8,
  overflow: 'hidden',
  border: `2px dashed ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const CreatePostView = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    } else {
      // Redirect to login if no user data
      navigate('/login');
    }
  }, [navigate]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', caption);
      formData.append('content', caption);
      formData.append('image', selectedImage);
      formData.append('location', location);
      formData.append('tags', tags.split(' ').filter(tag => tag.trim()));

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Post created successfully!');
        setCaption('');
        setLocation('');
        setTags('');
        setSelectedImage(null);
        setImagePreview(null);
        navigate('/home');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Create New Post
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.username}&background=random`}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {currentUser.username}
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <Box sx={{ mb: 3 }}>
                <label htmlFor="image-upload">
                  <ImagePreview
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{
                      backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!imagePreview && (
                      <Box sx={{ textAlign: 'center' }}>
                        <PhotoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                          Click to upload or drag and drop
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          PNG, JPG up to 10MB
                        </Typography>
                      </Box>
                    )}
                  </ImagePreview>
                </label>
                <Input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  onChange={handleImageSelect}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Caption */}
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                sx={{ mb: 3 }}
              />

              {/* Location */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <TextField
                  fullWidth
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  variant="standard"
                />
              </Box>

              {/* Tags */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TagIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <TextField
                  fullWidth
                  placeholder="Add tags (separated by spaces)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  variant="standard"
                  helperText="Example: #blanx #social #media"
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!selectedImage || loading}
                startIcon={<SendIcon />}
                sx={{ mt: 2 }}
              >
                {loading ? 'Creating Post...' : 'Share Post'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CreatePostView;
