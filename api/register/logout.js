const express = require('express');
const router = express.Router();

// User logout endpoint
router.post('/logout', (req, res) => {
  // Clear user session data or JWT token (if applicable)
  // In a JWT-based authentication system, there's no session to destroy,
  // so simply respond with a success message indicating successful logout
  
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
