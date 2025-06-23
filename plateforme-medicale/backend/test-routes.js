const express = require('express');
const app = express();

// Test the route registration
try {
  console.log('Testing route registration...');
  
  // Import the routes
  const medecinRoutes = require('./routes/medecinRoutes');
  const medecinController = require('./controllers/medecinController');
  
  console.log('✓ Routes imported successfully');
  
  // Test if getCurrentMedecin function exists
  if (typeof medecinController.getCurrentMedecin === 'function') {
    console.log('✓ getCurrentMedecin function exists');
  } else {
    console.log('✗ getCurrentMedecin function missing');
    console.log('Available functions:', Object.keys(medecinController));
  }
  
  // Register routes
  app.use('/api', medecinRoutes);
  console.log('✓ Routes registered successfully');
  
  // List all registered routes
  console.log('\nRegistered routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(`${Object.keys(handler.route.methods)} /api${handler.route.path}`);
        }
      });
    }
  });
  
  console.log('\n✓ Route registration test completed successfully');
  
} catch (error) {
  console.error('✗ Error during route registration test:', error);
  console.error('Stack trace:', error.stack);
} 