import { ReactElement, ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B00',
      light: '#FF8C33',
      dark: '#E66000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF8C00',
      light: '#FFB74D',
      dark: '#E65100',
    },
    error: {
      main: '#E81123',
    },
    warning: {
      main: '#FFB900',
    },
    success: {
      main: '#107C10',
    },
    info: {
      main: '#00B7C3',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#5F6368',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Noto Sans TC", "Roboto", sans-serif',
    h1: { fontWeight: 300, letterSpacing: '-0.5px' },
    h2: { fontWeight: 300, letterSpacing: '-0.25px' },
    h3: { fontWeight: 400 },
    h4: { fontWeight: 400 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '8px 20px',
          minHeight: 40,
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(255, 107, 0, 0.24)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 107, 0, 0.32)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
            backgroundColor: 'rgba(255, 107, 0, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #EDEDED',
          padding: '16px',
        },
        head: {
          fontWeight: 700,
          backgroundColor: '#FBFBFB',
          color: '#5F6368',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#FF6B00',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 107, 0, 0.08)',
            color: '#FF6B00',
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 0, 0.12)',
            },
            '& .MuiListItemIcon-root': {
              color: '#FF6B00',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: '#FF6B00',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E1DFDD',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#FF6B00',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#FF6B00',
          },
        },
      },
    },
  },
});

interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps): ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default AppProvider;
