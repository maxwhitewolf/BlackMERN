import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f5d4', // Neon teal
      light: '#33f7db',
      dark: '#00c4a7',
      contrastText: '#0a0a0f',
    },
    secondary: {
      main: '#ff4d6d', // Neon pink
      light: '#ff7a8a',
      dark: '#e6334f',
      contrastText: '#f5f5f5',
    },
    background: {
      default: '#0a0a0f', // Dark gradient start
      paper: 'rgba(26, 26, 46, 0.8)', // Semi-transparent
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#a0a0a0',
    },
    divider: 'rgba(0, 245, 212, 0.2)',
    action: {
      hover: 'rgba(0, 245, 212, 0.08)',
      selected: 'rgba(0, 245, 212, 0.12)',
    },
    error: {
      main: '#ff4d6d',
      contrastText: '#f5f5f5',
    },
    warning: {
      main: '#ffb74d',
      contrastText: '#0a0a0f',
    },
    success: {
      main: '#00f5d4',
      contrastText: '#0a0a0f',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(26, 26, 46, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 245, 212, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              border: '1px solid rgba(0, 245, 212, 0.4)',
              boxShadow: '0 0 12px rgba(0, 245, 212, 0.2)',
            },
            '&.Mui-focused': {
              border: '1px solid #00f5d4',
              boxShadow: '0 0 16px rgba(0, 245, 212, 0.3)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.97)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00f5d4 0%, #00b4d8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #33f7db 0%, #33c1e6 100%)',
            boxShadow: '0 8px 25px rgba(0, 245, 212, 0.4)',
          },
        },
        outlined: {
          border: '1px solid rgba(0, 245, 212, 0.5)',
          color: '#00f5d4',
          '&:hover': {
            border: '1px solid #00f5d4',
            backgroundColor: 'rgba(0, 245, 212, 0.08)',
            boxShadow: '0 0 20px rgba(0, 245, 212, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 46, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          borderRadius: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(0, 245, 212, 0.1)',
            border: '1px solid rgba(0, 245, 212, 0.4)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    },
  },
});

export default theme;
