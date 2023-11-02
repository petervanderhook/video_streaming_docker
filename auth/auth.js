require("dotenv").config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
const bcrypt = require ('bcrypt')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const users = []
app.use(express.json())
app.use(cookieParser())

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) 
}

app.post ("/createUser", async (req,res) => {
    console.log(req.body)
    console.log(req.body.name)
    var user = req.body.name
    var hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push ({user: user, password: hashedPassword})
    res.status(201).redirect('/auth/')
    console.log(users)
    })

app.get('/', (req, res)=>{
    res.sendFile(__dirname +'/public/login.html')
});

app.post("/login", async (req,res) => {
    console.log(users)
    const user = users.find( (c) => c.user == req.body.name)
    console.log(user)
    //check to see if the user exists in the list of registered users
    if (user == null) res.status(404).send ("User does not exist!")
    //if user does not exist, send a 400 response
    if (await bcrypt.compare(req.body.password, user.password)) {
    var accessToken = generateAccessToken ({user: req.body.password})
    res.cookie('accessToken', accessToken, { maxAge: 900*1000 })
    res.redirect('/upload')
    } 
    else {
    res.status(401).send("Password Incorrect!")
    }
})

app.get("/posts", validateToken, (req, res)=>{
    console.log("Token is valid")
    console.log(req.user.user)
    res.status(200)
    })

function validateToken(req, res, next) {
    console.log(req.headers)
    //get token from request header
    const token = req.cookies["accessToken"]
    //const token = authHeader.split(" ")[1]
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) res.sendStatus(400).send("Token not present")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) { 
        res.status(403).send("Token invalid")
        }
        else {
        req.user = user
        next() //proceed to the next action in the calling function
        }
    }) //end of jwt.verify()
} 

app.listen(3000, () => {
    console.log("Auth service listening on port 3000");
});