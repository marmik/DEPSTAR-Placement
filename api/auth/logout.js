// api/auth/logout.js
const express = require('express');
const router = express.Router();

// Logout endpoint
router.post('/', (req, res) => {
    // No action needed for logout since JWT tokens are stateless
    return res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
