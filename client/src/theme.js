import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10a37f', // ChatGPT-like accent
      light: '#19b28c',
      dark: '#0d876a',
    },
    secondary: {
      main: '#7c4dff', // cursor-like purple accent
      light: '#9e7fff',
      dark: '#6a3de8',
    },
    background: {
      default: '#0d0f14',
      paper: 'rgba(255,255,255,0.06)',
      dark: 'rgba(0,0,0,0.25)',
      darker: 'rgba(0,0,0,0.35)',
    },
    text: {
      primary: 'rgba(255,255,255,0.95)',
      secondary: 'rgba(255,255,255,0.75)',
      disabled: 'rgba(255,255,255,0.45)',
      hint: 'rgba(255,255,255,0.38)',
    },
    divider: 'rgba(255,255,255,0.08)',
    action: {
      hover: 'rgba(255,255,255,0.08)',
      selected: 'rgba(255,255,255,0.12)',
      active: 'rgba(255,255,255,0.15)',
      focus: 'rgba(102,126,234,0.25)',
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h1: { fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.025em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
    subtitle1: { fontWeight: 500, letterSpacing: '0.01em' },
    subtitle2: { fontWeight: 500, letterSpacing: '0.01em' },
    body1: { letterSpacing: '0.01em' },
    body2: { letterSpacing: '0.01em' },
  },
  shadows: [
    'none',
    'var(--glass-shadow-sm)',
    'var(--glass-shadow)',
    'var(--glass-shadow-lg)',
    'var(--glass-shadow-xl)',
    ...Array(20).fill('var(--glass-shadow-xl)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          background: 'rgba(102,126,234,0.3)',
          color: 'white',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'saturate(120%) blur(14px)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'var(--transition-normal)',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'var(--glass-gradient)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          '&:hover': {
            boxShadow: 'var(--glass-shadow-lg)',
            borderColor: 'var(--glass-border-hover)',
            transform: 'translateY(-4px)',
          },
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(13,15,20,0.6)',
          boxShadow: 'var(--glass-shadow)',
          backdropFilter: 'var(--glass-blur)',
          borderBottom: '1px solid var(--glass-border)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'var(--transition-normal)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--glass-shadow)',
          },
        },
        contained: {
          boxShadow: 'var(--glass-shadow-sm)',
          '&:hover': {
            boxShadow: 'var(--glass-shadow)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'rgba(255,255,255,0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.04)',
          },
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'var(--transition-normal)',
          '&:hover': {
            transform: 'translateY(-2px)',
            backgroundColor: 'rgba(255,255,255,0.08)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: 'var(--glass-shadow-sm)',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backdropFilter: 'var(--glass-blur-sm)',
            background: 'var(--glass-bg-dark)',
            transition: 'var(--transition-normal)',
            '&:hover': {
              borderColor: 'var(--glass-border-hover)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px var(--glass-focus)',
              borderColor: 'rgba(102,126,234,0.8)',
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow-lg)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'var(--glass-gradient)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow-xl)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'var(--glass-blur-sm)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: 'var(--glass-blur-sm)',
          transition: 'var(--transition-normal)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          transition: 'var(--transition-normal)',
          '&:hover': {
            color: 'var(--primary-color)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          },
        },
      },
    },
  }
});

export default theme;
