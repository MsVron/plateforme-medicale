import { createTheme } from '@mui/material/styles';

// Base theme structure that will be shared across all roles
const baseThemeConfig = {
  typography: {
    fontFamily: "'Segoe UI', sans-serif",
    h4: {
      fontWeight: 'bold',
    },
    h5: {
      fontWeight: 'bold',
    },
    h6: {
      fontWeight: 'bold',
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
          fontWeight: 'bold',
          borderRadius: 8,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
};

// Role-specific color palettes
const roleColors = {
  patient: {
    primary: '#4ca1af', // Original medical aqua/teal - keeping for patients
    primaryDark: '#2c3e50', // Original dark blue
    secondary: '#3a6e78',
    background: '#e9f2f3',
    gradientStart: '#2c3e50',
    gradientEnd: '#4ca1af',
  },
  medecin: {
    primary: '#2e7d32', // Medical green
    primaryDark: '#1b5e20', // Dark green
    secondary: '#388e3c',
    background: '#e8f5e8',
    gradientStart: '#1b5e20',
    gradientEnd: '#2e7d32',
  },
  hospital: {
    primary: '#d32f2f', // Medical red/emergency
    primaryDark: '#b71c1c', // Dark red
    secondary: '#f44336',
    background: '#ffebee',
    gradientStart: '#b71c1c',
    gradientEnd: '#d32f2f',
  },
  pharmacy: {
    primary: '#7b1fa2', // Medical purple
    primaryDark: '#4a148c', // Dark purple
    secondary: '#9c27b0',
    background: '#f3e5f5',
    gradientStart: '#4a148c',
    gradientEnd: '#7b1fa2',
  },
  laboratory: {
    primary: '#f57c00', // Medical orange/amber
    primaryDark: '#e65100', // Dark orange
    secondary: '#ff9800',
    background: '#fff3e0',
    gradientStart: '#e65100',
    gradientEnd: '#f57c00',
  },
  admin: {
    primary: '#1976d2', // Professional blue
    primaryDark: '#0d47a1', // Dark blue
    secondary: '#2196f3',
    background: '#e3f2fd',
    gradientStart: '#0d47a1',
    gradientEnd: '#1976d2',
  },
  super_admin: {
    primary: '#424242', // Professional gray
    primaryDark: '#212121', // Dark gray
    secondary: '#616161',
    background: '#fafafa',
    gradientStart: '#212121',
    gradientEnd: '#424242',
  },
  institution: {
    primary: '#5d4037', // Professional brown
    primaryDark: '#3e2723', // Dark brown
    secondary: '#795548',
    background: '#efebe9',
    gradientStart: '#3e2723',
    gradientEnd: '#5d4037',
  },
};

// Function to create theme for specific role
const createRoleTheme = (role) => {
  const colors = roleColors[role] || roleColors.patient; // Default to patient theme
  
  return createTheme({
    ...baseThemeConfig,
    palette: {
      mode: 'light',
      primary: {
        main: colors.primary,
        dark: colors.primaryDark,
      },
      secondary: {
        main: colors.secondary,
      },
      error: {
        main: '#e74c3c',
        dark: '#c0392b',
      },
      background: {
        default: colors.background,
        paper: '#ffffff',
      },
      text: {
        primary: colors.primaryDark,
        secondary: '#5d6d7e',
      },
    },
    components: {
      ...baseThemeConfig.components,
      MuiButton: {
        styleOverrides: {
          ...baseThemeConfig.components.MuiButton.styleOverrides,
          root: {
            ...baseThemeConfig.components.MuiButton.styleOverrides.root,
            boxShadow: `0 4px 8px rgba(${hexToRgb(colors.primaryDark)}, 0.1)`,
          },
          containedPrimary: {
            backgroundColor: colors.primary,
            '&:hover': {
              backgroundColor: colors.primaryDark,
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 12px rgba(${hexToRgb(colors.primaryDark)}, 0.2)`,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: `linear-gradient(to bottom, ${colors.gradientStart}, ${colors.gradientEnd})`,
            color: 'white',
          },
        },
      },
    },
  });
};

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
};

// Function to get theme based on user role
export const getThemeForRole = (userRole) => {
  return createRoleTheme(userRole);
};

// Default theme (patient theme for backward compatibility)
const medicalTheme = createRoleTheme('patient');

export default medicalTheme;