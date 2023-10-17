const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/upload.html'));
});

app.post('/', function(req, res) {
  res.send('uploaded');
});

app.listen(port);
console.log('Server started at http://localhost:' + port);