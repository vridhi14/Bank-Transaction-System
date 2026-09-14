const mongoose = require ("mongoose");
const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"user",
        required : [ture , "Account must be associated with a user"]
    }, 
    status : {
        enum: {
            values:["ACTIVE","FROZEN","CLOSE"], 
            message : "Status can be either ACTIVE , FROZEN OR CLOSE "
        }
    },
    currency:{
        type:String , 
        required : [ture , "Currency is required for creating an account"], 
        default : "INR"
    }, 

} , {
    timestamps : true
})

const accountModel = mongoose.model("account" , accountSchema); 
module.exports = accountModel ; 