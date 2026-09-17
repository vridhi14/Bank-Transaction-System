const {Router} = require('express'); 
const authMiddleware = require('../middlewares/auth.middleware');
const transactionController = require("../controllers/transaction.controller")

const transactionRoutes = Router(); 

/*  POST / api / transaction 
    create a new transacton
  */
transactionRoutes.post("/", authMiddleware.authMiddleware , transactionController.createTransaction); 

// POST/api/transaction/system/intial-funds
//create initial funds transaction
transactionRoutes.post("/system/initial-funds" , authMiddleware.authSystemUserMiddleware , transactionController.createInitialFundsTransaction)

module.exports = transactionRoutes ;