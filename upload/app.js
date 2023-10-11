const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/upload', function(req, res) {
  res.sendFile(path.join(__dirname, '/upload.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);