require("dotenv").config()
const express = require('express')
const app = express()
app.use(express.json())
const bcrypt = require ('bcrypt')
const users = []

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) 
}


app.post ("/createUser", async (req,res) => {
    const user = req.body.name
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push ({user: user, password: hashedPassword})
    res.status(201).send(users)
    console.log(users)
    })

app.post("/login", async (req,res) => {
    const user = users.find( (c) => c.user == req.body.name)
    //check to see if the user exists in the list of registered users
    if (user == null) res.status(404).send ("User does not exist!")
    //if user does not exist, send a 400 response
    if (await bcrypt.compare(req.body.password, user.password)) {
    const accessToken = generateAccessToken ({user: req.body.name})
    res.json ({accessToken: accessToken})
    } 
    else {
    res.status(401).send("Password Incorrect!")
    }
})

app.get("/posts", validateToken, (req, res)=>{
    console.log("Token is valid")
    console.log(req.user.user)
    res.send(`${req.user.user} successfully accessed post`)
    })


function validateToken(req, res, next) {
    //get token from request header
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
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