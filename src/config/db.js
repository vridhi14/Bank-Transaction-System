require("dotenv").config();
const mongoose = require("mongoose"); 

function connectToDb(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log("server is connected to DB"))
    .catch((err) =>{
        console.log("error connecting to db")
        process.exit(1); 
    }); 
}
module.exports = connectToDb