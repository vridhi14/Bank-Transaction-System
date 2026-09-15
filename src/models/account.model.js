const mongoose = require ("mongoose");
const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"user",
        required : [ture , "Account must be associated with a user"], 
        index : true //B+ tree 
    }, 
    status : {
        type:"String" , 
        enum: {
            values:["ACTIVE","FROZEN","CLOSE"], 
            message : "Status can be either ACTIVE , FROZEN OR CLOSE ",
        }, 
        default : "ACTIVE" 
    },
    currency:{
        type:String , 
        required : [ture , "Currency is required for creating an account"], 
        default : "INR"
    }, 

} , {
    timestamps : true
})

//compound index = we can find user on the basis of user OR status also 
accountSchema.index({user:1,status:1})



const accountModel = mongoose.model("account" , accountSchema); 
module.exports = accountModel ; 