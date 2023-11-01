const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const app = express();

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
    console.log(req.query)
    var range = req.headers.range 
    if(!range) {range = 'bytes=0-'}
    const videoPath = req.query.videopath; 
    const videoSize = fs.statSync(videoPath).size 
    const chunkSize = 1 * 1e6; 
    const start = Number(range.replace(/\D/g, "")) 
    const end = Math.min(start + chunkSize, videoSize - 1) 
    const contentLength = end - start + 1; 
    const headers = { 
        "Content-Range": `bytes ${start}-${end}/${videoSize}`, 
        "Accept-Ranges": "bytes", 
        "Content-Length": contentLength, 
        "Content-Type": "video/mp4"
    } 
    res.writeHead(206, headers) 
    const stream = fs.createReadStream(videoPath, { 
        start, 
        end 
    }) 
    stream.pipe(res) 
}) 

const port = process.env.PORT || 4000; // diff port for distinguishing reasons

app.listen(port, () => {
    console.log(`stream service running on port ${port}`);
});

//      const videoPlayer = document.getElementById('video-player')
//      videoPlayer.src = data.videoPath;