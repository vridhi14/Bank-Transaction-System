const trasanctionModel = require("../models/transaction.model"); 
const ledgerModel = require("../models/ledger.model"); 
const emailService = require("../services/email.service"); 
const accountModel = require("../models/account.model"); 


/* 
- CREATE A NEW TRANSACTION ~ 
 10 step transfer flow ! 

1) validate request 
2) validate idempotency key 
3) check account status 
4) driver sender balance free ledger
5) create transaction ( pending )
6) create debit ledger entry
7) create credit ledger entry 
8) mark transaction ( completed ) 
9) commit mongodb session 
10) send email notification
 */

async function createTransaction(req , res){ 

    //1. TRANSACTION REQUEST ! 
    
    const { fromAccount , toAccount , amount , idempotencyKey} = req.body ; 
    if( !fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({message : "fromAccount , toAccont, amount and idempotency Key is required"})
    }

    //fromAccount and toAccount exists ? 
    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount , 
    }); 
    const toUserAccount = await accountModel.findOne({
        _id : toAccount , 
    }); 

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message : "Invalid fromAccount or toAccount"
        })
    }
    

}