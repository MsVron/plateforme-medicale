import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // If the error is about "render is not a function", it's likely a context issue
    const isContextError = error.message.includes('render is not a function');
    return { 
      hasError: true, 
      error,
      isContextError 
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Report to error tracking service if needed
    // reportError(error, errorInfo);
  }

  handleRetry = () => {
    // Reset the error state to try again
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a context-related error
      if (this.state.isContextError) {
        console.log('Context error detected, silently recovering...');
        // For context errors, we'll just render nothing and let the parent component show loading state
        return null;
      }
      
      // For other errors, show a user-friendly message
      return (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center', 
          height: '200px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: '#fff0f5'
        }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Une erreur s'est produite lors du chargement de la carte. 
            Veuillez réessayer.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={this.handleRetry}
          >
            Réessayer
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 