const {Router} = require('express'); 
const authMiddleware = require('../middlewares/auth.middleware');
const transactionRouter = Router("../middleware/auth,middleware"); 
const transactionController = require("../controllers/transaction.controller")


/*  POST / api / transaction 
    create a new transacton
  */
transactionRouter.post("/", authMiddleware.authMiddleware , transactionController.createTransaction); 

module.exports = transactionRouter ;