const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

//To check whether the token is in cookies or headers . 
async function authMiddleware(req,res,next){
    const token = req.cookies || req.headers.authorization?.split("")[1];

    // If the token is neither in cookies nor in token , we'll return 
    if(!token){
        return res.status(401).json({
            message:"Unauthorized access , token is missing"
        })
    }

    // token found - veridy user 
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        //find user details in database 
        const user = await userModel.findById(decoded.userId); 

        //set the user in req.user
        req.user = user ; 

        return next(); 
    } catch (error) {
        return res.status(401).json({
            message:"Unauthorized access , token is invalid"
        })
    }
}

async function authSystemUserMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message : "Unauthorized access token is missing"
        })
    }
}

module.exports = {
    authMiddleware
}