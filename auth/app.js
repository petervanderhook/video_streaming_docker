const express = require("express");
const mysql = require('mysql');
const app = express();

const con = mysql.createConnection({
  host: 'db',
  user: 'express',
  password: 'password',
  database: 'video_streaming'
});

app.use(function(err, req, res, next) {
  if(401 == err.status) {
      res.redirect('/home')
  }
});

const authenticate = (req, res, next) => {
  req.body = req.body || {};
  const username = req.body.username;
  const password = req.body.password;

  // Query the 'users' table in the 'video_streaming' database
  con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }
    
    // Check if a user with the provided username and password exists in the database
    if (results.length === 0) {
      return res.status(401).send("Unauthorized");
    }
    console.log("SUCCESSFUL LOG-IN!")
    next();
  });
};

app.use(function(req, res, next) {
    if (req.method === 'POST' || req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.sendStatus(200);
    } else {
      next();
    }
  });  

app.use(express.json());
app.use(authenticate);

app.get("/", (req, res) => {
  res.sendFile("/app/public/index/html")
});

app.post("/", (req, res) => {
  res.send("Welcome to the protected page!");
});

app.listen(3000, () => {
  console.log("Auth service listening on port 3000");
});
