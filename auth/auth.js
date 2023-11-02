require("dotenv").config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
const bcrypt = require ('bcrypt')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'db',
    user: 'express',
    password: 'password',
    database: 'video_streaming'
});
app.use(express.json())
app.use(cookieParser())


const db = mysql.createConnection({
    host: 'db',
    user: 'express',
    password: 'password',
    database: 'video_streaming'
})

db.connect((err) => {
    if (err) {
        console.error ('cant connect to mysql', err);
        return;
    } 
    console.log('got into mysql');
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) 
}

app.post ("/createUser", async (req,res) => {
    console.log(req.body)
    console.log(req.body.name)
    var user = req.body.name
    var hashedPassword = await bcrypt.hash(req.body.password, 10)
    const insertQuery = "INSERT INTO users (user, password) VALUES (?, ?)"
    con.query(insertQuery, [user, hashedPassword], function(err, result) {
        if (err) {
          console.error(err);
          res.status(500);
        }
    })
    
    res.status(201).redirect('/auth')
    })

app.get('/', (req, res)=>{
    res.sendFile(__dirname +'/public/login.html')
});

app.post("/login", (req,res) => {
    try{
    const user = req.body.name
    const pass = req.body.password
    const query = "SELECT ? FROM users WHERE user = ?"
    con.query(query, [pass, user], async (error, results) => {
        console.log(results)
        if (error) {
            console.error('cant fetch info');
        } 
        if (results.length == 0) {
            throw ""
        } else {
            const hashedPassword = results[0].pass

            if ( bcrypt.compare(pass, hashedPassword)) {
                var accessToken = generateAccessToken ({user: pass})
                res.cookie('accessToken', accessToken, { maxAge: 900*1000 })
                res.sendFile(__dirname +'/index.html')
            } else {
                res.status(401)
                throw ""
            }
        }
    })
    }
    catch (e){
        res.status(401)
        console.log(e)
        res.send('Unauthorized')
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