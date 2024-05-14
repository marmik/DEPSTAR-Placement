// api/admin/adminRoutes.js
const express = require('express');
const router = express.Router();

// Admin routes
router.get('/', (req, res) => {
    res.send('Admin dashboard');
});

module.exports = router;
