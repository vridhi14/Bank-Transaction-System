const express = require("express"); 
const authMiddleware = require("../middlewares/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router();

// -POST /api/accounts/ =>CREATE A NEW ACCOUNT , Protected route
router.post("/" , authMiddleware.authMiddleware , accountController.createAccountController );

// -GET /api/accounts/ =>GET ALL ACCOUNTS OF THE LOGGED-IN USER , Protected route
router.get("/" , authMiddleware.authMiddleware , accountController.getUserAccountController ); 



module.exports = router ;