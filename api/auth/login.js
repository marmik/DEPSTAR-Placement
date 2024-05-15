// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const mysql = require("mysql");

// const router = express.Router();
// const secretKey = process.env.JWT_SECRET || "secretKey"; // Consider storing secret in environment variables

// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "db_QuizApp",
//     socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
// });

// router.use(express.json());

// router.post("/login", async (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).json({ message: "Username and password are required" });
//     }

//     try {
//         const query = "SELECT id, username, password, role FROM users WHERE username = ?";
//         const results = await queryDatabase(pool, query, [username]);

//         if (results.length === 0) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         const user = results[0];
//         const passwordIsValid = await bcrypt.compare(password, user.password);

//         if (!passwordIsValid) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: "1h" });
//         res.json({ message: "Login successful", token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// function queryDatabase(pool, sql, params) {
//     return new Promise((resolve, reject) => {
//         pool.query(sql, params, (error, results) => {
//             if (error) reject(error);
//             else resolve(results);
//         });
//     });
// }

// module.exports = router;
// Import required modules
const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const token ="";
// const crypto = require('crypto');

// Generate a random secret key
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log('Secret key:', secretKey);
const secretKey = "secretKey";

//Create connection pool for MySQL
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "db_QuizApp",
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

// Create express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());



app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check credentials against database
  pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
      if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Assuming there's only one user with the provided username and password
      const user = results[0];

      // Retrieve role from the database
      pool.query('SELECT role FROM users WHERE username = ?', [username], (error, roleResult) => {
          if (error) {
              console.error(error);
              return res.status(500).json({ message: 'Internal server error' });
          }

          const role = roleResult[0].role;

          let dashboard;
          if (role === "Admin") {
              dashboard = "admin";
          } else if (role === "faculty") {
              dashboard = "faculty";
          } else {
              dashboard = "student";
          }

          // Generate JWT token
           token = jwt.sign({ username: username, role: role, userID: userID }, secretKey, { expiresIn: '1h' });

          // Send the response once with appropriate data
          res.status(200).json({ dashboard: dashboard, token: token, role: role });
      });
  });
});



// Protected endpoint example
// app.get('/dashborad', verifyToken, (req, res) => {
//   res.status(200).json({ message: 'You have access to this protected endpoint' });
// });



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = token;