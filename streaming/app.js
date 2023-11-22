const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const app = express();
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
const http = require('http');
app.use(cookieParser())

// mysql to store video names and their paths
// have to change to reflect user authentication
const db = mysql.createConnection({
    host: 'db',
    user: 'express',
    password: 'password',
    database: 'video_streaming'
})

// auth something something here, sample code idk hehe!
db.connect((err) => {
    if (err) {
        console.error ('cant connect to mysql', err);
        return;
    } 
    console.log('got into mysql');
})


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
    console.log(e)
    res.send('Unauthorized')
   } //end of jwt.verify()
}); 

// endpoint where the html file can be served videos dynamically
// i.e. depends on the name given, queried into MySQL, retrieves video and path
app.get('/getVideo', (req, res) => {
    const videoName = req.query.name
    console.log(videoName)
    const query = 'SELECT video_path FROM video_library WHERE video_title = ?';

    db.query(query, [videoName], (error, results) => {
        if (error) {
            console.error('cant fetch info');
        } else {
            console.log(results[0].video_path)
            var videoPath = results[0].video_path;
            const videoSize = fs.statSync(videoPath).size;
            console.log(videoPath, videoSize)
            res.redirect('/streaming/videoplayer?videopath='+videoPath)
        }
    })
})

app.get('/', (req, res)=>{
    res.sendFile(__dirname +'/stream.html')
});


app.get('/videoplayer', (req, res) => {
    const mp4Url = '/fs/read?videopath='+req.query.videoPath

    http.get(mp4Url, (stream) => {
        stream.pipe(res);
    });
}) 

const port = process.env.PORT || 4000; // diff port for distinguishing reasons

app.listen(port, () => {
    console.log(`stream service running on port ${port}`);
});

//      const videoPlayer = document.getElementById('video-player')
//      videoPlayer.src = data.videoPath;