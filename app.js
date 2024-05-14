const express = require('express');
const dashboardRoutes = require('./api/teacher/dashboard');
const loginRoutes = require('./api/auth/login');  // Adjusted to point to your refactored login route
const registerRoutes = require('./api/auth/register');
const studentRoutes = require('./api/student/dashboard');
const verifyToken = require('./api/auth/middleware/authMiddleware');  // Middleware path corrected if necessary

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Mount routes that don't require authentication
app.use('/api/auth/login', loginRoutes);  // Ensures that login does not require token authentication
app.use('/api/auth/register', registerRoutes);  // Assumes register does not require a token either

// Middleware to protect routes
// Place verifyToken here to ensure it does not impact login and registration routes
app.use('/api', verifyToken);  // This will apply the middleware to all subsequent paths under '/api'

// Mount routes that require authentication
app.use('/api/teacher', dashboardRoutes);  // Now protected by verifyToken
app.use('/api/student', studentRoutes);  // Now protected by verifyToken

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
