const express = require('express');
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")

const app = express();
app.use(express.json())
app.use(cookieParser())

const upload = multer({ dest: '/mnt/data' })

const port = process.env.PORT || 8080;

const con = mysql.createConnection({
  host: 'db',
  user: 'express',
  password: 'password',
  database: 'video_streaming'
});
con.connect((err) => {
  if (err) {console.error (err);
    return;}
    console.log('got into mysql');
});

app.use(async function(req, res, next) {
  try{
  console.log(req.cookies["accessToken"])
  //get token from request header
  var token = req.cookies["accessToken"]
  //const token = authHeader.split(" ")[1]
  //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
  if (token == "undefined"){
    res.sendStatus(400)
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  if (err) { 
      res.status(403)
      throw ""
      }
      else {
      req.user = user
      next() //proceed to the next action in the calling function
      }
  })
 }
 catch(e){
  res.status(401)
  res.send('Unauthorized')
 } //end of jwt.verify()
}); 

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/upload.html'));
});

app.post('/upload',upload.single('video_file'),(req,res)=>{
  console.log(JSON.stringify(req.headers));
  console.log(req.file, req.body.name)
  const file = req.file
  let filename = file.originalname
  let filepath = file.path
  // console.log(file);
  // console.log(file.originalname);
  const insertQuery = `INSERT INTO video_library (video_title, video_path) VALUES (?, ?)`;

  con.query(insertQuery, [filename, filepath], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading video to the database');
    } else {
      console.log('Video uploaded to the database');
      res.send(`uploaded '${filename}'.`);
    }
  });
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
