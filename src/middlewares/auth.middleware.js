const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req,res,next){
    const token = req.cookies || req.headers.authorization?.split("")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access , token is missing"
        })
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            message:"Unauthorized access , token is invalid"
        })
    }
}