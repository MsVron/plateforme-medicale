import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

const ThemeUpdater = () => {
  const theme = useTheme();

  useEffect(() => {
    // Update CSS custom properties based on current theme
    const root = document.documentElement;
    
    // Set primary colors
    root.style.setProperty('--primary-color', theme.palette.primary.main);
    root.style.setProperty('--primary-dark', theme.palette.primary.dark);
    root.style.setProperty('--secondary-color', theme.palette.secondary.main);
    
    // Set background colors
    root.style.setProperty('--background-default', theme.palette.background.default);
    root.style.setProperty('--background-paper', theme.palette.background.paper);
    
    // Set text colors
    root.style.setProperty('--text-primary', theme.palette.text.primary);
    root.style.setProperty('--text-secondary', theme.palette.text.secondary);
    
    // Set gradients for sidebar and login
    root.style.setProperty('--sidebar-gradient', 
      `linear-gradient(to bottom, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
    );
    root.style.setProperty('--login-gradient', 
      `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
    );
    
    // Set body background
    document.body.style.backgroundColor = theme.palette.background.default;
    
  }, [theme]);

  return null; // This component doesn't render anything
};

export default ThemeUpdater; 