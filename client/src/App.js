import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import theme from './theme';
import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import HomeView from './components/views/HomeView';
import ExploreView from './components/views/ExploreView';
import SearchView from './components/views/SearchView';
import MessengerView from './components/views/MessengerView';
import ActivityView from './components/views/ActivityView';
import ProfileView from './components/views/ProfileView';
import CreatePostView from './components/views/CreatePostView';
import EditProfileView from './components/views/EditProfileView';
import SavedPostsView from './components/views/SavedPostsView';
import PostView from './components/views/PostView';
import LoginView from './components/views/LoginView';
import SignupView from './components/views/SignupView';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(1500px 800px at 5% -10%, rgba(0, 245, 212, 0.15) 0%, rgba(0, 245, 212, 0) 70%),
          radial-gradient(1200px 600px at 110% 10%, rgba(255, 77, 109, 0.15) 0%, rgba(255, 77, 109, 0) 70%),
          radial-gradient(800px 800px at 50% 110%, rgba(0, 180, 216, 0.1) 0%, rgba(0, 180, 216, 0) 70%),
          #0a0a0f
        `,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <BrowserRouter>
          <TopNavbar />
          <BottomNavbar />
          <Box sx={{ pt: '64px', pb: '64px', minHeight: '100vh' }}>
            <Routes>
              <Route path="/login" element={<LoginView />} />
              <Route path="/signup" element={<SignupView />} />
              <Route path="/home" element={<PrivateRoute><HomeView /></PrivateRoute>} />
              <Route path="/explore" element={<PrivateRoute><ExploreView /></PrivateRoute>} />
              <Route path="/search" element={<PrivateRoute><SearchView /></PrivateRoute>} />
              <Route path="/messages" element={<PrivateRoute><MessengerView /></PrivateRoute>} />
              <Route path="/activity" element={<PrivateRoute><ActivityView /></PrivateRoute>} />
              <Route path="/profile/:username" element={<PrivateRoute><ProfileView /></PrivateRoute>} />
              <Route path="/create" element={<PrivateRoute><CreatePostView /></PrivateRoute>} />
              <Route path="/edit-profile" element={<PrivateRoute><EditProfileView /></PrivateRoute>} />
              <Route path="/saved" element={<PrivateRoute><SavedPostsView /></PrivateRoute>} />
              <Route path="/post/:postId" element={<PrivateRoute><PostView /></PrivateRoute>} />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
