const trasanctionModel = require("../models/transaction.model"); 
const ledgerModel = require("../models/ledger.model"); 
const emailService = require("../services/email.service"); 
const accountModel = require("../models/account.model"); 
const mongoose = require("mongoose"); 
const transactionModel = require("../models/transaction.model");

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

    const transaction = await transactionModel.create({
        fromAccount , 
        toAccount , 
        amount , 
        idempotencyKey , 
        status:"PENDING"
    } , {session})

    //6 , 7 = CREATE DEBIT AND CREDIT LEDGER ENTRY 
    const debitLedgerEntry = await ledgerModel.create({
        acount : fromAccount , 
        amount : amount , 
        transactoin : transaction._id , 
        type : "DEBIT"
    }, {startSession})

    const creditLedgerEntry = await ledgerModel.create({
        acount : toAccount , 
        amount : amount , 
        transactoin : transaction._id , 
        type : "CREDIT"
    }, {startSession})

    //8 MARK TRANSACTION COMPLETED 
    transaction.status = "COMPLETED" ;
    await transaction.save({session}); 
    
    //9 COMMIT MONGODB SESSION
    await session.commitTransaction(); 
    session.endSession(); 

    //10 SEND EMAIL NOTIFICATION 
    await emailService.sendTransactionEmail(req.user.email , req.user.name , amount , toAccount ); 

    return res.status(201).json({
        message : "Transaction completed successfully", 
        transaction : transaction 
    })

}

async function createInitialFundsTransaction(req,res){
    const {toAccount , amount , idempotencyKey} = req.body ; 
     if( !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({message : "toAccont, amount and idempotency Key is required"})
    }

    const toUserAccount = await accountModel.findOne({
        _id : toAccount , 
    }); 

    if(!toUserAccount){
        return res.status(400).json({
            message : "Invalid toAccount"
        })
    }

    //SYSTEM USER ! 
    const fromUserAccount = await accountModel.findOne({
        systemUser : true , 
        user : req.user._id 
    });
    if(!fromUserAccount){
        return res.status(400).json({
            message : "System user account not found"
        })
    }

    //Initiate transaction 
    const session = mongoose.startSession(); 
    session.startSession(); 

    const transaction = (await transactionModel.create({
        fromAccount : fromUserAccount._id , 
        toAccount , 
        amount , 
        idempotencyKey , 
        status : "PENDING" , 
    },{session}))[0]

    const debitLedgerEntry = await ledgerModel.create([{
        fromAccount : fromUserAccount._id , 
        amount : amount, 
        transaction : transaction._id ,   
        type : "DEBIT"
    }],{session})

    await(()=>{
        return new Promise((resolve)=> setTimeout(resolve , 100*1000))
    })()
    
    const creditLedgerEntry = await ledgerModel.create([{
        fromAccount : toAccount, 
        amount : amount,
        transaction : transaction._id ,  
        type : "CREDIT"
    }],{session})

    transaction.status = "COMPLETED"; 
    await transaction.save({session}); 

    await session.commitTransaction(); 
    session.endSession(); 

    return res.status(201).json({
        message : "Initial funds transaction completed successfully" , 
        transaction : transaction 
    });
}

module.exports = {
    createTransaction , createInitialFundsTransaction
}
    