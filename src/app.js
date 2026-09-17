const express = require('express'); 
const cookieParser = require("cookie-parser");

const app = express(); 

//Middlewares: 
app.use(express.json());
app.use(cookieParser());

// Routes Required
const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/accounts.routes')
const transactionRoutes = require('./routes/transaction.routes')

//use Routes
app.get("/",(req,res)=>{
    res.send("Bank Transaction Sytem is running")
})
app.use("/api/auth" , authRouter); 
app.use("/api/acounts" , accountRouter); 
app.use("/api/transactions" , transactionRoutes); 
module.exports = app ; 