require("dotenv").config()
const express = require('express')
const app = express()
app.use(express.json())
const bcrypt = require ('bcrypt')
const mysql = require('mysql')
const users = []
const jwt = require('jsonwebtoken');
const con = mysql.createConnection({
    host: 'db',
    user: 'express',
    password: 'password',
    database: 'video_streaming'
});
app.use(express.urlencoded({ extended: true }));
function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, {expiresIn: "15m"}) 
}

function insertUser(username, password, callback) {
    const insertQuery = `INSERT INTO users (user, pass) VALUES (?, ?)`;
    con.query(insertQuery, [username, password], (error, results) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log(`User ${username} inserted successfully.`);
      }
        callback();
    });
}

con.connect();

const a = bcrypt.hashSync('piper', 10);
const b = bcrypt.hashSync('cross', 10);
const c = bcrypt.hashSync('hambone', 10);

insertUser('peter', a, () => {
    insertUser('chris', b, () => {
        insertUser('tristan', c, () => {
            console.log('All users inserted successfully.');
        });
    });
});
app.post ("/createUser", async (req,res) => {
    const user = req.body.name
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push ({user: user, password: hashedPassword})
    res.status(201).send(users)
    console.log(users)
    })

app.post("/login", async (req, res) => {
    try {
        const user = req.body.user;
        const pass = req.body.pass;
        const selectQuery = `SELECT pass FROM users WHERE user = ?`;
    
        const results = await new Promise((resolve, reject) => {
            con.query(selectQuery, [user], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    
        if (results.length === 0) {
            console.error(`No user found on login attempt for ${user}`);
            return res.status(404).send("User not found");
        }
    
        if (await bcrypt.compare(pass, results[0].pass)) {
            const accessToken = generateAccessToken({ user: user });
            res.set('Authorization', `Bearer ${accessToken}`);
            res.redirect(302, '/auth/home');
        } else {
            res.status(401).send("Password Incorrect!");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send(`Internal Server Error:\n${error}`);
    }
});
      
app.get("/home", validateToken, (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get("/posts", validateToken, (req, res)=>{
    console.log("Token is valid")
    console.log(req.user.user)
    res.send(`${req.user.user} successfully accessed post`)
})

app.use(validateToken);
function validateToken(req, res, next) {
    console.log(req.headers)
    const authHeader = req.headers['authorization'] || null;
    if (!authHeader) {
        return res.status(400).send("Token not present");
    }
    const token = authHeader.split(" ")[1];
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    jwt.verify(token, process.env.SECRET, (err, user) => {
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