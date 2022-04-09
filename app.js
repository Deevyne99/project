const express = require('express')

const http = require('http')

const bcrypt = require('bcrypt')

const path = require('path')

const bodyParser = require('body-parser')
//const {check,validationResult} = require('express-validator')
//const { fail } = require('assert')

//const users = require('./banka/data').userDB
//let Account = require('./banka/data').CreateAcct
//const cashier = require('./banka/data').Cashiers

const app = express()


app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'/banka')))
app.use(express.json())

let Account = []
let users = []
let cashier = []
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/index.html'))
})
app.get('/user',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/user.html'))
})
app.get('/user/create',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/create.html'))
})
app.get('/user/transact',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/transact.html'))
})

app.get('/admin',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/admin.html'))
})
app.get('/admin/activate',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/activate.html'))
})

app.get('/admin/deactivate',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/deactivate.html'))
})

app.get('/admin/record',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/record.html'))
})

app.get('/javascript',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/file.js'))
})

app.get('/javascript',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/script.js'))
})


app.get('/css',(req,res)=>{
    res.sendFile(path.join(__dirname,'./banka/main.css'))
})

app.get('/register/banka/v1',(req,res)=>{
    res.json(users)
})


app.get('/user/create/banka/account/v1',(req,res)=>{
    res.send(Account)
})



app.post('/register/banka/v1',async (req,res)=>{
    try{
        let foundUser = users.find((data) => req.body.email === data.email)
        if (!foundUser){
            let token = "45erkjherht45495783"
            let hashPassword = await bcrypt.hash(req.body.password, 10)
            let newUser = {
                userId: Date.now(),
                firstName:req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashPassword,
                token:token
            }
            users.push(newUser)
            console.log("user list",users);
            res.status(200).json(newUser)
        } else{
            res.status.send('email already used')
        }
    }
    catch{
        res.send("Internal server Error")
    }
})
app.post('/login/banka/v1',async (req,res) => {
    
        let foundUser = users.find((data)=>req.body.email === data.email)
        if (req.body.email === "admin123@gmail.com"){
        if (foundUser){
            let submittedPass = req.body.password
            let storedPass = foundUser.password

            const passwordMatch = await bcrypt.compare(submittedPass, storedPass)
            if (passwordMatch){
                
                let token = "45erkjherht45495783"
                let firstName = foundUser.firstName
                let lastName = foundUser.lastName
                let Email = foundUser.email
                let userId = foundUser.userId
                let data = {firstName,lastName,Email,userId,token} 
                res.status(200).json({status:200,datum:data})
            }
            else{
                res.send("Invalid email or password")
            }    
        }}
        else if (foundUser){
            let submittedPass = req.body.password
            let storedPass = foundUser.password

            
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass)
            if (passwordMatch){
                let firstName = foundUser.firstName
                 let lastName = foundUser.lastName
                 let Email = foundUser.email
            let userId = foundUser.userId
                 let token = foundUser.token
             res.status(200).json({firstName,lastName,Email,userId,token})

               //res.sendFile(path.join(__dirname,'/banka/user.html'))
            }
            else{
                res.send("Invalid email or password")
            }
        }
        else {
            let fakePass = '$2b$$10$ifgfgfgfggfgfggggfgfga'
            await bcrypt.compare(req.body.password, fakePass)
            res.send('Invalid email or password')
        }
    
    
})

app.get('/register/banka/v1',(req,res)=>{
    res.send(users)
})


app.post('/user/create/banka/account/v1',(req,res)=>{
  //const newAccount = req.body
    let status = "draft"
     let newAccount = {
         AccountNumber:Date.now(),
         firstName:  req.body.firstName,
         lastName: req.body.lastName,
         email: req.body.email,
        OpeningBalance:req.body.OpeningBalance,
        UserID:req.body.UserID,
         phoneNumber:req.body.phoneNumber,
         Nationality:req.body.Nationality,
         stateOfResidence:req.body.stateOfResidence,
         NextOfKin:req.body.NextOfKin,
         phoneNumberNOK:req.body.phoneNumberNOK,
         dateCreated:req.body.dateCreated,
         Birth:req.body.Birth,
         Gender:req.body.Gender,
         accountType:req.body.accountType,
         status:status
         }
    
   
    Account.push(newAccount)
     console.log(Account);
     res.status(200).json({status:200,data:newAccount})

})

app.patch('/admin/banka/activate/account/v1',(req,res)=>{
    let foundUser =  Account.find((data) => req.body.accountNumber === data.AccountNumber)
    if (foundUser){
        let first = foundUser.firstName
        let second = foundUser.lastName
        let email = foundUser.email
        let accountname = first + '' + second
          const activate = {
            accountNumber:req.body.accountNumber,
            //accountName:accountname,
            //Date:Date.req.body,
            //email:email,
            status:req.body.status
                     }
          res.status(200).json({status:200,data:activate})
    }
    else{
        res.status(404).json("Invalid account Number")
    }

})



app.delete('/user/create/banka/account/v1/:accountNumber',(req,res)=>{
    let foundUser =  Account.find((data) => Number(req.params.accountNumber) === data.AccountNumber)
     if (foundUser){
        
        const newFoundUser = Account.filter((foundUser)=> foundUser.AccountNumber !== Number(req.params.accountNumber))
        return res.status(200).json({success:true,datum:"deleted successfully"})
    }
    else{
        res.send("invalid account")
    }

})

app.patch('/admin/banka/deactivate/account/v1',(req,res)=>{
    let foundUser =  Account.find((data) => req.body.accountNumber === data.AccountNumber)
    if (foundUser){
        let first = foundUser.firstName
        let second = foundUser.lastName
        let email = foundUser.email
        let accountname = first + '' + second
          const deactivate = {
            accountNumber:req.body.accountNumber,
            //accountName:accountname,
            //Date:Date.req.body,
            //email:email,
            status:req.body.status
                     }
          res.status(200).json({status:200,data:deactivate})
    }
    else{
        res.status(404).json("Invalid account Number")
    }
})


app.post('/create/cashier/v1',async(req,res)=>{
    let foundUser = users.find((data) => req.body.email === data.email)
    if(foundUser){
        let userId = foundUser.userId
       let isAdmin = true
        const newCashier ={
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            userId:userId,
            isAdmin:isAdmin
        }
        cashier.push(newCashier)
        res.status(200).json({status:200,data:newCashier})
    }
    else{
        res.status(404).json({status:404,message:"Invalid email"})
    }
})

app.post('/banka/credit/account/v1',(req,res)=>{
    let foundUser =  Account.find((data) => req.body.accountNumber === data.AccountNumber)
    if (foundUser){
    
    
    let first = foundUser.firstName
        let last = foundUser.lastName 
        let fullName = first + " " + last
    
    let found = parseFloat(foundUser.OpeningBalance)
        let Acct = parseFloat(req.body.Amount)
        let transactionId = Date.now()
            let Newbalance = found + Acct 
    const credit = {accountname: req.body.accountname,
        AccountNumber:req.body.accountNumber,
        FullName:fullName,
        Date:req.body.Date,
        Amount:req.body.Amount,
        cashier:req.body.cashier,
        NewBalance:Newbalance,
        transactionID:transactionId
}
                res.send({status:200,data:credit})
}
else{
    res.status(404).json({status:404,message:"invalid account number"})
}
})

app.post('/banka/debit/account/v1',(req,res)=>{
    let foundUser =  Account.find((data) => req.body.accountNumber === data.AccountNumber)
    if (foundUser){
        let first = foundUser.firstName
        let last = foundUser.lastName 
        let fullName = first + " " + last
    
    
    
    let found = parseFloat(foundUser.OpeningBalance)
        let Acct = parseFloat(req.body.Amount)
        let transactionId = Date.now()
        if(found < Acct){
            return res.status(404).json({status:404,message:"Insufficient Funds"})
        }
        let Newbalance = found - Acct 
        const debit = {accountname: req.body.accountname,
        AccountNumber:req.body.accountNumber,
        FullName:fullName,
        Date:req.body.Date,
        Amount:req.body.Amount,
        cashier:req.body.cashier,
        NewBalance:Newbalance,
        transactionID:transactionId
}
                res.send({status:200,data:debit})
}
else{
    res.status(404).json({status:404,message:"invalid account number"})
}
})


app.listen(5000,(req,res)=>console.log('server listening on PORT 5000'))