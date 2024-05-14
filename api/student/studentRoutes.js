// api/student/studentRoutes.js
const express = require('express');
const router = express.Router();

// Student routes
router.get('/', (req, res) => {
    res.send('Student dashboard');
});

module.exports = router;
