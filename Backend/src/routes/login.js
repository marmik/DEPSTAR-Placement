// Import required modules
const express = require('express');
const mysql = require('mysql');
const vToken = require('./../middlewares/middleware.js');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const secretKey = 'yourSecretKey'; // Replace with your actual secret key
require('dotenv').config();


console.log(process.env.DB_HOST);
// Generate a random secret key
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log('Secret key:', secretKey);

// Create connection pool for MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME
});

// Create express app
const app = express();
const router = express.Router();

// app.use(cookieParser()); 
// Middleware to parse JSON bodies
router.use(express.json());



router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Query database to find user
    pool.query('SELECT * FROM users WHERE Username = ?', [username], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log(results);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare provided password with stored password
        if (password !== user.Password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const userId = user.userID;
        const role = user.Role;

        let dashboard;
        if (role === "Admin") {
            dashboard = "Admin";
        } else if (role === "Teacher") {
            dashboard = "Teacher";
        } else {
            dashboard = "Student";
        }

        // Generate JWT token
        const access_token = jwt.sign({ username: username, role: role, userID: userId }, secretKey, { expiresIn: '1h' });

        const loggedUser = username;

        const options = {
            httpOnly : true,
            secure : true
        }

        res.cookie("accessToken",access_token,options)
        .json({
            dashboard: dashboard, token: access_token , status : "user loogen in successfully"
        })

        // const refresh_token = jwt.sign({ userid: userId }, secretKey, { expiresIn: '1h' });

        // Send the response with appropriate data
        // res.json({ dashboard: dashboard, token: access_token });   // role same as dashboaed
    });
});

// Protected endpoint example
router.get('/dashboard', vToken, (req, res) => {
  res.status(200).json({ message: 'You have access to this protected endpoint' });
});

module.exports = router;





// Function to verify JWT token
// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'Token is missing' });
//   }

//   jwt.verify(token, secretKey, (error, authData) => {
//     if (error) {
//       console.error(error);
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     else{
//         res.send({message:"dashboasrd access",
//                     authData
//         })
//     }

//     req.username = decoded.username;
//     next();
//   });
// }

// Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
