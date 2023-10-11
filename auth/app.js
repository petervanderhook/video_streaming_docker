const express = require("express");
const app = express();
const users = {
  "tristan": "tristan",
  "chris": "daryush",
  "peter": "peter"
};

app.use(express.json());
app.use(express.urlencoded({extended:false}))

// Serve the login page at the root ("/") route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
// Handle form submission at the "/login" route
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (users[username] === password) {
    res.redirect('/success')
  } else {
    res.redirect('/fail')
  }
});
app.get("/fail", (req, res) => {
  res.sendFile(__dirname + "/fail.html")
})
app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/images/garylarson.jpg");
})

app.listen(3000, () => {
  console.log("Auth service listening on port 3000");
});
