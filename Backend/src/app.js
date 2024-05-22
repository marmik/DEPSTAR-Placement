const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors()); // Enable CORS for all routes

// Importing routes
const loginRoute = require('./routes/login.js');
const adminRoute = require('./routes/admin.js');
const facultyRoute = require('./routes/faculty.js');

// Declaring routes
app.use("/api", loginRoute);
app.use("/api/admin", adminRoute);
app.use("/api/faculty", facultyRoute);

module.exports = app;
