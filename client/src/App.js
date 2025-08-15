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
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <BrowserRouter>
          <TopNavbar />
          <BottomNavbar />
          <Box sx={{ pt: '60px', pb: '60px', minHeight: '100vh' }}>
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
