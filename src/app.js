const express = require('express'); 
const cookieParser = require("cookie-parser");

const app = express(); 

//Middlewares: 
app.use(express.json());
app.use(cookieParser());

// Routes Required
const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/accounts.routes')

//use Routes
app.use("/api/auth" , authRouter); 
app.use("/api/acounts" , accountRouter); 

module.exports = app ; 