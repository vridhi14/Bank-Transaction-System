const express = require('express'); 
const authRouter = require('./routes/auth.routes')

const app = express(); 

//Middlewares: 
app.use(express.json());
app.use("/api/auth" , authRouter); 

module.exports = app ; 