const express = require('express');
const cors = require('cors')
const cookieparser = require('cookie-parser');

const app = express();
require('dotenv').config();


app.use(express.json())
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieparser());

// importing routes

const loginRoute = require('./routes/login.js');
const adminRoute = require('./routes/admin.js');
const facultyRoute = require('./routes/faculty.js');


// declaring routes
app.use("/api/login",loginRoute);
app.use("/api/admin",adminRoute);
app.use("/api/faculty",facultyRoute);



module.exports = app;