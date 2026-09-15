const express = require("express"); 
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router();

// -POST /api/accounts/ =>CREATE A NEW ACCOUNT , Protexxted rout

router.post("/" , authMiddleware.authMiddleware , )




module.exports = router ;