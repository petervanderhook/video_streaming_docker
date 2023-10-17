const express = require('express');
const mysql = require('mysql');

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
    const query = 'SELECT path FROM videos WHERE name = ?';

    db.query(query, [videoName], (error, results) => {
        if (error) {
            console.error('cant fetch info');
        } else {
            const videoPath = results[0].path;
            res.json({ videoPath })
        }
    })
})

app.get('/', (req, res)=>{
    res.sendFile(__dirname +'/stream.html')
});

const port = process.env.PORT || 4000; // diff port for distinguishing reasons

app.listen(port, () => {
    console.log(`stream service running on port ${port}`);
});