import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Skeleton,
  Fade,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  PhotoCamera as CameraIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const EditContainer = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  padding: '24px 16px',
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  marginBottom: 32,
}));

const AvatarSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
}));

const EditProfileView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    biography: '',
    website: '',
    location: '',
    avatar: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        const response = await fetch(`/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          setFormData({
            fullName: profileData.fullName || '',
            biography: profileData.biography || '',
            website: profileData.website || '',
            location: profileData.location || '',
            avatar: profileData.avatar || '',
          });
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);

      const response = await fetch(`/api/users/${user.userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate(`/profile/${user.username}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <EditContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={200} sx={{ ml: 2 }} />
        </Box>
        <Card>
          <CardContent>
            <ProfileSection>
              <Skeleton variant="circular" width={80} height={80} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" />
              </Box>
            </ProfileSection>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={48} />
          </CardContent>
        </Card>
      </EditContainer>
    );
  }

  return (
    <EditContainer>
      <Fade in={true} timeout={300}>
        <Box>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <BackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Edit Profile
            </Typography>
          </Box>

          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Avatar Section */}
                <ProfileSection>
                  <AvatarSection>
                    <Avatar
                      src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.fullName}&background=random`}
                      sx={{ width: 80, height: 80 }}
                    />
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="avatar-upload"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                      <Button
                        component="span"
                        variant="outlined"
                        size="small"
                        startIcon={<CameraIcon />}
                      >
                        Change Photo
                      </Button>
                    </label>
                  </AvatarSection>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Profile Photo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload a new profile picture
                    </Typography>
                  </Box>
                </ProfileSection>

                <Divider sx={{ mb: 3 }} />

                {/* Form Fields */}
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  sx={{ mb: 2 }}
                  placeholder="Enter your full name"
                />

                <TextField
                  fullWidth
                  label="Bio"
                  value={formData.biography}
                  onChange={handleInputChange('biography')}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                  placeholder="Tell us about yourself..."
                  helperText="Maximum 150 characters"
                  inputProps={{ maxLength: 150 }}
                />

                <TextField
                  fullWidth
                  label="Website"
                  value={formData.website}
                  onChange={handleInputChange('website')}
                  sx={{ mb: 2 }}
                  placeholder="https://yourwebsite.com"
                  helperText="Optional: Add your website URL"
                />

                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  sx={{ mb: 3 }}
                  placeholder="City, Country"
                  helperText="Optional: Add your location"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={saving}
                  startIcon={<SaveIcon />}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </EditContainer>
  );
};

export default EditProfileView; 