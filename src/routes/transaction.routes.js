const {Router} = require('express'); 
const authMiddleware = require('')
const transactionRouter = Router("../middleware/auth,middleware"); 

/*  POST / api / transaction 
    create a new transacton
  */

transactionRouter.post("/", authMiddleware.authMiddleware )

module.exports = transactionRouter ;