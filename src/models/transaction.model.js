const mongoose = require("mongoose"); 

const transactionSchema = new mongoose.Schema({
    fromAccount : { 
        type:mongoose.Schema.Types.ObjectId , 
        ref : "account" , 
        required : [true , "Transaction must be associated with a from account"] , 
        index : true 
    },
    toAccount : { 
        type:mongoose.Schema.Types.ObjectId , 
        ref : "account" , 
        required : [true , "Transaction must be associated with a to account"] , 
        index : true 
    },
    status : {
        type : String, 
        enum : {
            values:["PENDING","COMPLETE","FAILED","REVERSED"],
            message : "Status cam be either PENDING , COMPLETED , FAILED OR REVERSED", 
        } , 
        default : "PENDING"
    } , 
    amount : {
        type : Number , 
        required : [true , "Amount is required for creating a transaction"] , 
        min : [0 , "Transaction amount can be negative"]
    }, 
    idempotencyKey:{
        type : String , 
        required : [true , "Idempotency Key is required for creating a transaction"] , 
        index : true , 
        required : true 
    }
} , {
    timeStamps : true
})

const transactionModel = mongoose.model("transaction" , transactionSchema); 
module.exports = transactionModel 