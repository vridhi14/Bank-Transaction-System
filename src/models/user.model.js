const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs"); 
const userSchema = new mongoose.Schema({
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

//pre = convert password to hash 
userSchema.pre("save" , async function(next){
    //if there is no change in password do nothing
    if(!this.isModified(password)){
        return next(); 
    }

    //if there is change in password hash it up using bcrypt nd save that "hash" into password 
    const hash = await bcrypt.hash(this.password , 10); 
    this.password = hash ;

    return next()
});

//the hash that is saved in db , it will compare hash with the password 
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password); 

    //password correct = true 
    // else false 
}

const userModel = mongoose.model("user" , userSchema); 
module.exports = userModel ; 