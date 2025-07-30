import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";


// Views
import LoginView from "./components/views/LoginView";
import SignupView from "./components/views/SignupView";
import HomeView from "./components/views/HomeView";
import ExploreView from "./components/views/ExploreView";
import SearchView from "./components/views/SearchView";
import ProfileView from "./components/views/ProfileView";
import MessengerView from "./components/views/MessengerView";
import CreatePostView from "./components/views/CreatePostView";
import PostView from "./components/views/PostView";
import ActivityView from "./components/views/ActivityView";
import EditProfileView from "./components/views/EditProfileView";

// Components
import Navigation from "./components/Navigation";
import PrivateRoute from "./components/PrivateRoute";

// Socket helper
import { initiateSocketConnection } from "./helpers/socketHelper";

// Create Instagram-like dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0095f6',
      light: '#4db5ff',
      dark: '#0066cc',
    },
    secondary: {
      main: '#8e8e93',
      light: '#a8a8a8',
      dark: '#666666',
    },
    background: {
      default: '#000000',
      paper: '#121212',
      surface: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#8e8e93',
    },
    divider: '#262626',
    action: {
      hover: '#262626',
      selected: '#262626',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: {
          backgroundColor: '#0095f6',
          '&:hover': {
            backgroundColor: '#0081d6',
          },
        },
        outlined: {
          borderColor: '#dbdbdb',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
          border: '1px solid #262626',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#262626',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#262626',
            },
            '&:hover fieldset': {
              borderColor: '#8e8e93',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0095f6',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
    } else {
      // Clear any invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
    
    // Initialize socket connection
  initiateSocketConnection();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ 
          minHeight: '100vh', 
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column'
        }}>
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              !isAuthenticated ? <LoginView /> : <Navigate to="/home" />
            } />
            <Route path="/signup" element={
              !isAuthenticated ? <SignupView /> : <Navigate to="/home" />
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box sx={{ flex: 1, ml: { xs: 0, md: '240px' } }}>
                    <HomeView />
                  </Box>
                </Box>
              </PrivateRoute>
            } />
            
            <Route path="/home" element={
              <PrivateRoute>
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box sx={{ flex: 1, ml: { xs: 0, md: '240px' } }}>
                    <HomeView />
                  </Box>
                </Box>
              </PrivateRoute>
            } />
            
            <Route path="/explore" element={
              <PrivateRoute>
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box sx={{ flex: 1, ml: { xs: 0, md: '240px' } }}>
                    <ExploreView />
                  </Box>
                </Box>
              </PrivateRoute>
            } />
            
            <Route path="/search" element={
              <PrivateRoute>
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box sx={{ flex: 1, ml: { xs: 0, md: '240px' } }}>
                    <SearchView />
                  </Box>
                </Box>
              </PrivateRoute>
            } />
            
            <Route path="/messages" element={
              <PrivateRoute>
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box sx={{ flex: 1, ml: { xs: 0, md: '240px' } }}>
                    <MessengerView />
                  </Box>
                </Box>
              </PrivateRoute>
            } />
            
            <Route path="/activity" element={
              <PrivateRoute>
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box sx={{ flex: 1, ml: { xs: 0, md: '240px' } }}>
                    <ActivityView />
                  </Box>
                </Box>
              </PrivateRoute>
            } />
            
            <Route path="/profile/:username" element={
              <PrivateRoute>
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box sx={{ flex: 1, ml: { xs: 0, md: '240px' } }}>
                    <ProfileView />
                  </Box>
                </Box>
              </PrivateRoute>
            } />
            
            <Route path="/create" element={
              <PrivateRoute>
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box sx={{ flex: 1, ml: { xs: 0, md: '240px' } }}>
                <CreatePostView />
                  </Box>
                </Box>
              </PrivateRoute>
            } />
            
            <Route path="/edit-profile" element={
              <PrivateRoute>
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box sx={{ flex: 1, ml: { xs: 0, md: '240px' } }}>
                    <EditProfileView />
                  </Box>
                </Box>
              </PrivateRoute>
            } />
            
            <Route path="/post/:postId" element={
              <PrivateRoute>
                <PostView />
              </PrivateRoute>
            } />
        </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
