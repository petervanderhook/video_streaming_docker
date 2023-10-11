const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.redirect('/videos')
})
app.get("/videos", (req, res) => {
  res.sendFile('/app/public/streaming.html')
});

app.listen(4000, () => {
  console.log("Video service listening on port 4000");
});
