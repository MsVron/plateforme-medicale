# 🎨 Role-Based Theming System Documentation

## Overview

The medical platform now features a dynamic role-based theming system that automatically applies different color schemes based on the user's role. Each role has its own carefully designed color palette while maintaining the same professional UI structure and user experience.

## 🌈 Color Schemes by Role

### Patient Theme (Default)
- **Primary Color**: `#4ca1af` (Medical Aqua/Teal)
- **Primary Dark**: `#2c3e50` (Dark Blue)
- **Secondary**: `#3a6e78` (Darker Aqua)
- **Background**: `#e9f2f3` (Soft Blue-Gray)
- **Use Case**: Patient portal, medical records viewing

### Doctor (Médecin) Theme
- **Primary Color**: `#2e7d32` (Medical Green)
- **Primary Dark**: `#1b5e20` (Dark Green)
- **Secondary**: `#388e3c` (Light Green)
- **Background**: `#e8f5e8` (Soft Green)
- **Use Case**: Doctor dashboard, patient management, prescriptions

### Hospital Theme
- **Primary Color**: `#d32f2f` (Medical Red/Emergency)
- **Primary Dark**: `#b71c1c` (Dark Red)
- **Secondary**: `#f44336` (Light Red)
- **Background**: `#ffebee` (Soft Red)
- **Use Case**: Hospital management, emergency services, patient admissions

### Pharmacy Theme
- **Primary Color**: `#7b1fa2` (Medical Purple)
- **Primary Dark**: `#4a148c` (Dark Purple)
- **Secondary**: `#9c27b0` (Light Purple)
- **Background**: `#f3e5f5` (Soft Purple)
- **Use Case**: Prescription management, medication dispensing

### Laboratory Theme
- **Primary Color**: `#f57c00` (Medical Orange/Amber)
- **Primary Dark**: `#e65100` (Dark Orange)
- **Secondary**: `#ff9800` (Light Orange)
- **Background**: `#fff3e0` (Soft Orange)
- **Use Case**: Lab test management, result reporting

### Admin Theme
- **Primary Color**: `#1976d2` (Professional Blue)
- **Primary Dark**: `#0d47a1` (Dark Blue)
- **Secondary**: `#2196f3` (Light Blue)
- **Background**: `#e3f2fd` (Soft Blue)
- **Use Case**: Administrative functions, user management

### Super Admin Theme
- **Primary Color**: `#424242` (Professional Gray)
- **Primary Dark**: `#212121` (Dark Gray)
- **Secondary**: `#616161` (Light Gray)
- **Background**: `#fafafa` (Very Light Gray)
- **Use Case**: System administration, advanced statistics

### Institution Theme
- **Primary Color**: `#5d4037` (Professional Brown)
- **Primary Dark**: `#3e2723` (Dark Brown)
- **Secondary**: `#795548` (Light Brown)
- **Background**: `#efebe9` (Soft Brown)
- **Use Case**: Institution management, multi-role access

## 🏗️ Architecture

### Core Files

#### 1. `src/styles/theme.js`
The main theme configuration file containing:
- **Base Theme Configuration**: Shared typography, shapes, and component styles
- **Role Color Palettes**: Color definitions for each role
- **Theme Creation Function**: `createRoleTheme(role)` - generates MUI theme for specific role
- **Theme Getter**: `getThemeForRole(userRole)` - public API for getting role-specific themes

```javascript
// Example usage
import { getThemeForRole } from './styles/theme';
const doctorTheme = getThemeForRole('medecin');
```

#### 2. `src/App.js`
Main application component with dynamic theming:
- **Theme State Management**: Tracks current theme based on user role
- **Event Listeners**: Responds to login/logout events
- **Automatic Updates**: Updates theme when user data changes

#### 3. `src/components/ThemeUpdater.js`
Utility component that:
- **Syncs CSS Variables**: Updates CSS custom properties with current theme colors
- **Body Styling**: Updates document body background
- **Real-time Updates**: Responds to theme changes instantly

### CSS Integration

#### CSS Custom Properties
The system uses CSS custom properties for dynamic styling:

```css
:root {
  --primary-color: #4ca1af;
  --primary-dark: #2c3e50;
  --secondary-color: #3a6e78;
  --background-default: #e9f2f3;
  --sidebar-gradient: linear-gradient(to bottom, #2c3e50, #4ca1af);
  --login-gradient: linear-gradient(to right, #2c3e50, #4ca1af);
}
```

#### Updated Stylesheets
- **`src/styles/Login.css`**: Uses CSS variables for login page theming
- **`src/styles/Sidebar.css`**: Uses CSS variables for sidebar gradients

## 🔧 Implementation Details

### Theme Switching Flow

1. **User Login**:
   ```javascript
   // In Login.container.js
   localStorage.setItem('user', JSON.stringify(userData));
   window.dispatchEvent(new Event('userDataChanged')); // Triggers theme update
   ```

2. **Theme Update**:
   ```javascript
   // In App.js
   const updateThemeForUser = () => {
     const user = JSON.parse(localStorage.getItem('user'));
     const roleTheme = getThemeForRole(user.role);
     setCurrentTheme(roleTheme);
   };
   ```

3. **CSS Synchronization**:
   ```javascript
   // In ThemeUpdater.js
   useEffect(() => {
     root.style.setProperty('--primary-color', theme.palette.primary.main);
     // ... other CSS variables
   }, [theme]);
   ```

### Event System
The system uses custom events for theme synchronization:
- **`userDataChanged`**: Fired on login/logout
- **`storage`**: Browser storage change events
- **Theme State**: React state management for MUI components

## 📱 Usage Examples

### Adding New Role Theme

1. **Add Color Palette** in `src/styles/theme.js`:
```javascript
const roleColors = {
  // ... existing roles
  new_role: {
    primary: '#your-primary-color',
    primaryDark: '#your-dark-color',
    secondary: '#your-secondary-color',
    background: '#your-background-color',
    gradientStart: '#gradient-start',
    gradientEnd: '#gradient-end',
  },
};
```

2. **Update Role Mapping** in routing/authentication logic to use the new role.

### Customizing Existing Theme

```javascript
// In src/styles/theme.js
const roleColors = {
  medecin: {
    primary: '#new-green-color', // Change doctor theme primary color
    // ... other properties
  },
};
```

### Using Theme in Components

```javascript
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText 
    }}>
      Content styled with current role theme
    </Box>
  );
};
```

## 🎯 Best Practices

### Color Selection Guidelines
- **Medical Roles**: Use colors associated with healthcare (green for doctors, red for emergency/hospitals, purple for pharmacy)
- **Administrative Roles**: Use professional colors (blue, gray, brown)
- **Accessibility**: Ensure sufficient contrast ratios (WCAG 2.1 AA compliance)
- **Consistency**: Maintain the same color intensity across roles

### Performance Considerations
- **Theme Caching**: Themes are created once and reused
- **CSS Variables**: Efficient updates without re-rendering components
- **Event Debouncing**: Prevents excessive theme updates

### Maintenance
- **Centralized Configuration**: All colors defined in one place
- **Fallback Handling**: Graceful degradation to default theme
- **Error Boundaries**: Theme errors don't crash the application

## 🔍 Troubleshooting

### Common Issues

#### Theme Not Updating
**Problem**: Theme doesn't change after login
**Solution**: Check if `userDataChanged` event is being fired:
```javascript
// Add debugging
window.addEventListener('userDataChanged', () => {
  console.log('Theme update triggered');
});
```

#### CSS Variables Not Applied
**Problem**: Login page or sidebar not showing role colors
**Solution**: Verify ThemeUpdater is included in App.js:
```javascript
<ThemeProvider theme={currentTheme}>
  <ThemeUpdater /> {/* Must be inside ThemeProvider */}
  <Router>
```

#### Role Not Recognized
**Problem**: New role defaults to patient theme
**Solution**: Add role to `roleColors` object in `theme.js`

### Debug Mode
Enable theme debugging by adding to localStorage:
```javascript
localStorage.setItem('debug-theme', 'true');
```

## 🚀 Future Enhancements

### Planned Features
- **Dark Mode Support**: Toggle between light/dark variants for each role
- **Custom Theme Builder**: Admin interface for customizing role colors
- **Theme Presets**: Multiple color options per role
- **Accessibility Themes**: High contrast variants
- **Animation Themes**: Role-specific transition styles

### Extension Points
- **Component Theming**: Role-specific component variants
- **Icon Theming**: Role-appropriate icon sets
- **Layout Theming**: Role-specific layout configurations

## 📊 Testing

### Manual Testing Checklist
- [ ] Login with each role type
- [ ] Verify theme changes immediately
- [ ] Check sidebar gradient updates
- [ ] Confirm login page colors change
- [ ] Test logout theme reset
- [ ] Verify fallback to default theme

### Automated Testing
```javascript
// Example test
describe('Theme System', () => {
  it('should apply doctor theme for medecin role', () => {
    const theme = getThemeForRole('medecin');
    expect(theme.palette.primary.main).toBe('#2e7d32');
  });
});
```

## 📞 Support

For questions or issues with the theming system:
1. Check this documentation first
2. Review the troubleshooting section
3. Examine the implementation in `src/styles/theme.js`
4. Test with debug mode enabled

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Compatibility**: React 18+, Material-UI 5+ 