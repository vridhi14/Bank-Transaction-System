const express = require('express'); 
const cookieParser = require("cookie-parser");

const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/accounts.routes')


const app = express(); 


//Middlewares: 
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth" , authRouter); 

module.exports = app ; 