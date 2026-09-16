
/* 
- CREATE A NEW TRANSACTION ~ 
 10 step transfer flow ! 

1) validate request 
2) validate idempotency key 
3) check account status 
4) driver sender balance free ledger
5) create transaction ( pending )
6) create debit ledger entry
7) create credit ledger entry 
8) mark transaction ( completed ) 
9) commit mongodb session 
10) send email notification
 */

async function createTransaction(req , res){ 
    const { fromAccout , toAccount , amount , idempotencyKey} = req.body ; 
    
}