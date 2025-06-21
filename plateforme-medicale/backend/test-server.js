const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Import and test admin routes
try {
    const adminRoutes = require('./routes/adminRoutes');
    app.use('/api/admin', adminRoutes);
    console.log('✅ Admin routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading admin routes:', error.message);
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
    console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`📍 Admin institutions: http://localhost:${PORT}/api/admin/institutions`);
});

// Test database connection
setTimeout(async () => {
    try {
        const db = require('./config/db');
        const [rows] = await db.execute('SELECT 1 as test');
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}, 1000); 