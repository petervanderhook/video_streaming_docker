const express = require("express");

const app = express();
const users = {
  "tamim": "tamim",
  "daryush": "daryush",
  "peter": "peter"
};

const authenticate = (req, res, next) => {
  req.body = req.body || {};
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password || users[username] !== password) {
    return res.status(401).send("Unauthorized");
  }
  next();
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


app.post("/", (req, res) => {
  res.send("Welcome to the protected page!");
});

app.listen(3000, () => {
  console.log("Auth service listening on port 3000");
});
