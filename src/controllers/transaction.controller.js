const trasanctionModel = require("../models/transaction.model"); 
const ledgerModel = require("../models/ledger.model"); 
const emailService = require("../services/email.service"); 
const accountModel = require("../models/account.model"); 
const mongoose = require("mongoose"); 

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

    // 2 VALIDATE IDEMPOTENCY KEY 
    //with the existing idempotencykey whether any other transaction exists or not!
    const isTransactionAlreadyExists = await transactionModel.findOnde({
        idempotencyKey : idempotencyKey 
    }); 
    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status == "COMPLETED"){
            return res.status(200).json({
                message : "transaction already processed" , 
                transaction : isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status == "PENDING"){
            return res.stauts(200).json({message:"transaction is still processing"})
        } 
        if(isTransactionAlreadyExists.status == "FAILED"){
            return res.stauts(500).json({message:"transaction processing failed , please retry"})
        } 
        if(isTransactionAlreadyExists.status == "REVERSED"){
            return res.stauts(500).json({message:"transaction was reversed, please retry"})
        } 
    }

    // 3 CHECK ACCOUNT STATUS - from or to user account is close or frozen ? 
    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
       return res.json(400).json({
        message : "both fromAccount and toAccount must be ACTIVE to process transaction" }); 
    }

    //4 DERIVE SENDER BALANCE FROM LEDGER ( sufficient balance is there or not) 
    const balance = await fromUserAccount.getBalance(); 
    if(balance < amount){
        res.stauts(400).json({message : `Insufficient Balance . Current balance is ${balance}. Requested amount is ${amount}`})
    }

    //5 CREATE TRANSACTION (PENDING)
    const session = await mongoose.startSession(); 
    session.startTransaction();

}
    