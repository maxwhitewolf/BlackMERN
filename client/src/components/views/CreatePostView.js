import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  Avatar,
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
  height: 500,
  borderRadius: 20,
  overflow: 'hidden',
  border: '2px dashed rgba(0, 149, 246, 0.3)',
  background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(30, 30, 30, 0.6) 100%)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0, 149, 246, 0.1) 0%, rgba(77, 181, 255, 0.05) 100%)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    borderColor: '#0095f6',
    backgroundColor: 'rgba(0, 149, 246, 0.05)',
    transform: 'scale(1.02)',
    boxShadow: '0 8px 30px rgba(0, 149, 246, 0.2)',
    '&::before': {
      opacity: 1,
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(30, 30, 30, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(38, 38, 38, 0.8)',
  borderRadius: 24,
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(0, 149, 246, 0.3)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(38, 38, 38, 0.8)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(38, 38, 38, 0.8)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#0095f6',
        borderWidth: '2px',
      },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: '12px 32px',
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #0095f6 0%, #4db5ff 100%)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #0081d6 0%, #3da3e6 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 149, 246, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: 'rgba(108, 108, 108, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
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
    if (!caption.trim()) {
      alert('Please write a caption for your post');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Create FormData to send both text data and image file
      const formData = new FormData();
      formData.append('title', caption || 'Untitled Post');
      formData.append('content', caption);
      formData.append('location', location);
      formData.append('tags', JSON.stringify(tags.split(' ').filter(tag => tag.trim())));
      formData.append('userId', userData._id);
      
      // Add the image file if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
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

        <StyledCard sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={currentUser.avatar}
                sx={{
                  width: 50,
                  height: 50,
                  background: currentUser.avatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {!currentUser.avatar && currentUser.username?.charAt(0)?.toUpperCase()}
              </Avatar>
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
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          (Optional - placeholder will be used if no image selected)
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
              <StyledTextField
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
                <StyledTextField
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
                <StyledTextField
                  fullWidth
                  placeholder="Add tags (separated by spaces)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  variant="standard"
                  helperText="Example: #blanx #social #media"
                />
              </Box>

              {/* Submit Button */}
              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!caption.trim() || loading}
                startIcon={<SendIcon />}
                sx={{ mt: 2 }}
              >
                {loading ? 'Creating Post...' : selectedImage ? 'Share Post with Image' : 'Share Post (with placeholder image)'}
              </StyledButton>
            </form>
          </CardContent>
        </StyledCard>
      </Box>
    </Container>
  );
};

export default CreatePostView;
