const express = require('express');
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

const upload = multer({ dest: '/mnt/data' })


const port = process.env.PORT || 4100; // diff port for distinguishing reasons

app.post('/fs/write',upload.single('video_file'),(req,res)=>{
    console.log(JSON.stringify(req.headers));
    console.log(req.file, req.body.name)
    const file = req.file
    let filename = file.originalname
    let filepath = file.path
    res.redirect('/upload/upload?name='+filename+'&path='+filepath);
});

app.get('/fs/read', (req, res) => {
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


app.listen(port, () => {
    console.log(`stream service running on port ${port}`);
});