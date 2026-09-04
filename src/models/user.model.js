const mongoose = require("mongoose"); 
const userSchema = mongoose.Schema({
    email : {
        type:String,
        required:[true, "Email is required for creating a user"],
        trim : true , 
        lowercase : true , 
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"] , 
        unique : [true , "email already exists"],
    } , 
    name : {
        type : String , 
        required :[ true , "name is required on creating a new account"] , 
    } , 
    password : {
        type: String , 
        required : [true , "password is required for creating an account"] , 
        minLength : [6 , "password is should be of min 6 characters"], 
        select : false , 
    }
} , {
    timeStamps : true 
})

userSchema.pre("save" , async function(next){
    
}); 