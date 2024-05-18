const express = require('express');
const cors = require('cors')
const cookieparser = require('cookie-parser');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieparser());